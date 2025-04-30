from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import sqlite3
import json
import time
import requests
import hashlib
from datetime import datetime
import secrets
from functools import wraps
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.config['LASTFM_API_KEY'] = os.environ.get('LASTFM_API_KEY', 'your_lastfm_api_key')
app.config['LASTFM_USERNAME'] = os.environ.get('LASTFM_USERNAME', 'your_lastfm_username')
app.config['ADMIN_USERNAME'] = os.environ.get('ADMIN_USERNAME', 'admin')
app.config['ADMIN_PASSWORD'] = os.environ.get('ADMIN_PASSWORD', 'password')  # Store hashed in production

socketio = SocketIO(app, cors_allowed_origins="*")

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database setup
def init_db():
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()
    
    # Messages table for shoutbox
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Visitors table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT,
        user_agent TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        visit_count INTEGER DEFAULT 1
    )
    ''')
    
    # Status table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY,
        status TEXT DEFAULT 'offline',
        mood TEXT DEFAULT 'neutral',
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Photos table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        title TEXT,
        description TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Easter eggs table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS easter_eggs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        triggered_count INTEGER DEFAULT 0
    )
    ''')
    
    # Insert default status if not exists
    cursor.execute("INSERT OR IGNORE INTO status (id, status, mood) VALUES (1, 'offline', 'neutral')")
    
    # Insert some default easter eggs
    easter_eggs = [
        ('konami', 'Triggered by Konami code'),
        ('terminal', 'Found the terminal'),
        ('logo_click', 'Clicked the logo 10 times'),
        ('secret_button', 'Found the secret button'),
        ('all_pages', 'Visited all pages')
    ]
    for egg in easter_eggs:
        cursor.execute("INSERT OR IGNORE INTO easter_eggs (name, description) VALUES (?, ?)", egg)
    
    conn.commit()
    conn.close()

init_db()

# Helper functions
def get_db_connection():
    conn = sqlite3.connect('portfolio.db')
    conn.row_factory = sqlite3.Row
    return conn

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

def track_visitor():
    conn = get_db_connection()
    ip = request.remote_addr
    user_agent = request.user_agent.string
    
    visitor = conn.execute('SELECT * FROM visitors WHERE ip_address = ? AND user_agent = ?', 
                          (ip, user_agent)).fetchone()
    
    if visitor:
        conn.execute('UPDATE visitors SET last_visit = CURRENT_TIMESTAMP, visit_count = visit_count + 1 WHERE id = ?', 
                    (visitor['id'],))
    else:
        conn.execute('INSERT INTO visitors (ip_address, user_agent) VALUES (?, ?)', 
                    (ip, user_agent))
    
    conn.commit()
    conn.close()

def get_visitor_stats():
    conn = get_db_connection()
    total = conn.execute('SELECT COUNT(*) as count FROM visitors').fetchone()['count']
    active = conn.execute('''
        SELECT COUNT(*) as count FROM visitors 
        WHERE last_visit > datetime("now", "-15 minutes")
    ''').fetchone()['count']
    conn.close()
    return {'total': total, 'active': active}

def get_lastfm_data():
    try:
        api_key = app.config['LASTFM_API_KEY']
        username = app.config['LASTFM_USERNAME']

        # Step 1: Get recent track
        recent_url = f"http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={api_key}&format=json&limit=1"
        response = requests.get(recent_url, timeout=5)
        data = response.json()

        if 'recenttracks' in data and 'track' in data['recenttracks']:
            track = data['recenttracks']['track'][0]
            artist = track.get('artist', {}).get('#text', 'Unknown Artist')
            title = track.get('name', 'Unknown Track')
            album = track.get('album', {}).get('#text', 'Unknown Album')
            now_playing = track.get('@attr', {}).get('nowplaying') == 'true'

            # Default image
            image_url = '/static/img/default_album.png'

            # Step 2: Try getting image from track.getInfo
            track_info_url = (
                f"http://ws.audioscrobbler.com/2.0/"
                f"?method=track.getInfo&api_key={api_key}&artist={requests.utils.quote(artist)}"
                f"&track={requests.utils.quote(title)}&format=json"
            )
            track_info_resp = requests.get(track_info_url, timeout=5)
            track_info = track_info_resp.json()

            if 'track' in track_info and 'album' in track_info['track']:
                images = track_info['track']['album'].get('image', [])
                if images:
                    image_url = images[-1].get('#text', image_url)

            # Step 3: If image still missing, fallback to album.getInfo
            if not image_url or image_url == '':
                album_info_url = (
                    f"http://ws.audioscrobbler.com/2.0/"
                    f"?method=album.getinfo&api_key={api_key}&artist={requests.utils.quote(artist)}"
                    f"&album={requests.utils.quote(album)}&format=json"
                )
                album_info_resp = requests.get(album_info_url, timeout=5)
                album_info = album_info_resp.json()
                print(album_info)

                if 'album' in album_info:
                    images = album_info['album'].get('image', [])
                    if images:
                        for img in images:
                            if img.get('size') == 'large' and img.get('#text'):
                                image_url = img['#text']
                                break


            # Final fallback
            if not image_url:
                image_url = '/static/img/default_album.png'

            return {
                'artist': artist,
                'title': title,
                'album': album,
                'image': image_url,
                'now_playing': now_playing
            }

        # No track case
        return {
            'artist': 'Nothing playing',
            'title': 'No recent track',
            'album': '-',
            'image': '/static/img/default_album.png',
            'now_playing': False
        }

    except Exception as e:
        print(f"Error fetching Last.fm data: {e}")
        return {
            'artist': 'Error',
            'title': 'Could not fetch data',
            'album': '-',
            'image': '/static/img/default_album.png',
            'now_playing': False
        }




# Routes
@app.route('/')
def index():
    track_visitor()
    visitor_stats = get_visitor_stats()
    music_data = get_lastfm_data()
    
    conn = get_db_connection()
    status = conn.execute('SELECT * FROM status WHERE id = 1').fetchone()
    conn.close()
    
    return render_template('index.html', 
                          visitor_stats=visitor_stats,
                          music_data=music_data,
                          status=status)

@app.route('/terminal')
def terminal():
    track_visitor()
    
    # Record easter egg discovery
    conn = get_db_connection()
    conn.execute('UPDATE easter_eggs SET triggered_count = triggered_count + 1 WHERE name = "terminal"')
    conn.commit()
    conn.close()
    
    return render_template('terminal.html')

@app.route('/api/shoutbox', methods=['GET'])
def get_messages():
    conn = get_db_connection()
    messages = conn.execute('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').fetchall()
    conn.close()
    
    return jsonify([{
        'id': msg['id'],
        'username': msg['username'],
        'message': msg['message'],
        'timestamp': msg['timestamp']
    } for msg in messages])

@app.route('/api/shoutbox', methods=['POST'])
def post_message():
    data = request.json
    username = data.get('username', 'Anonymous').strip()
    message = data.get('message', '').strip()
    
    if not username or not message:
        return jsonify({'error': 'Username and message are required'}), 400
    
    if len(message) > 500:
        return jsonify({'error': 'Message too long (max 500 characters)'}), 400
    
    conn = get_db_connection()
    conn.execute('INSERT INTO messages (username, message) VALUES (?, ?)', (username, message))
    conn.commit()
    
    # Get the inserted message
    last_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    new_message = conn.execute('SELECT * FROM messages WHERE id = ?', (last_id,)).fetchone()
    conn.close()
    
    # Broadcast the new message to all connected clients
    socketio.emit('new_message', {
        'id': new_message['id'],
        'username': new_message['username'],
        'message': new_message['message'],
        'timestamp': new_message['timestamp']
    })
    
    return jsonify({'success': True})

@app.route('/api/visitors')
def visitors_api():
    return jsonify(get_visitor_stats())

@app.route('/api/lastfm')
def lastfm_api():
    data = get_lastfm_data()
    if data:
        return jsonify(data)
    return jsonify({'error': 'No track data available'}), 404

@app.route('/api/status')
def status_api():
    conn = get_db_connection()
    status = conn.execute('SELECT * FROM status WHERE id = 1').fetchone()
    conn.close()
    
    return jsonify({
        'status': status['status'],
        'mood': status['mood'],
        'last_updated': status['last_updated']
    })

@app.route('/api/easter_egg/<name>', methods=['POST'])
def trigger_easter_egg(name):
    conn = get_db_connection()
    egg = conn.execute('SELECT * FROM easter_eggs WHERE name = ?', (name,)).fetchone()
    
    if egg:
        conn.execute('UPDATE easter_eggs SET triggered_count = triggered_count + 1 WHERE name = ?', (name,))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'count': egg['triggered_count'] + 1})
    
    conn.close()
    return jsonify({'error': 'Easter egg not found'}), 404

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid credentials')
    
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))

@app.route('/admin')
@admin_required
def admin_dashboard():
    conn = get_db_connection()
    visitor_count = conn.execute('SELECT COUNT(*) as count FROM visitors').fetchone()['count']
    message_count = conn.execute('SELECT COUNT(*) as count FROM messages').fetchone()['count']
    photo_count = conn.execute('SELECT COUNT(*) as count FROM photos').fetchone()['count']
    status = conn.execute('SELECT * FROM status WHERE id = 1').fetchone()
    easter_eggs = conn.execute('SELECT * FROM easter_eggs ORDER BY triggered_count DESC').fetchall()
    conn.close()
    
    return render_template('admin_dashboard.html',
                          visitor_count=visitor_count,
                          message_count=message_count,
                          photo_count=photo_count,
                          status=status,
                          easter_eggs=easter_eggs)

@app.route('/admin/status', methods=['POST'])
@admin_required
def update_status():
    status = request.form.get('status')
    mood = request.form.get('mood')
    
    if status and mood:
        conn = get_db_connection()
        conn.execute('UPDATE status SET status = ?, mood = ?, last_updated = CURRENT_TIMESTAMP WHERE id = 1', 
                    (status, mood))
        conn.commit()
        conn.close()
        
        # Broadcast status update to all connected clients
        socketio.emit('status_update', {
            'status': status,
            'mood': mood,
            'last_updated': datetime.now().isoformat()
        })
        
        flash('Status updated successfully')
    else:
        flash('Status and mood are required')
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/photos')
@admin_required
def admin_photos():
    conn = get_db_connection()
    photos = conn.execute('SELECT * FROM photos ORDER BY upload_date DESC').fetchall()
    conn.close()
    
    return render_template('admin_photos.html', photos=photos)

@app.route('/admin/photos/upload', methods=['POST'])
@admin_required
def upload_photo():
    if 'photo' not in request.files:
        flash('No file part')
        return redirect(url_for('admin_photos'))
    
    file = request.files['photo']
    if file.filename == '':
        flash('No selected file')
        return redirect(url_for('admin_photos'))
    
    if file:
        filename = secure_filename(file.filename)
        timestamp = int(time.time())
        unique_filename = f"{timestamp}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        
        title = request.form.get('title', '')
        description = request.form.get('description', '')
        
        conn = get_db_connection()
        conn.execute('INSERT INTO photos (filename, title, description) VALUES (?, ?, ?)',
                    (unique_filename, title, description))
        conn.commit()
        conn.close()
        
        flash('Photo uploaded successfully')
    
    return redirect(url_for('admin_photos'))

@app.route('/admin/photos/delete/<int:photo_id>', methods=['POST'])
@admin_required
def delete_photo(photo_id):
    conn = get_db_connection()
    photo = conn.execute('SELECT * FROM photos WHERE id = ?', (photo_id,)).fetchone()
    
    if photo:
        # Delete file from filesystem
        try:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], photo['filename']))
        except Exception as e:
            print(f"Error deleting file: {e}")
        
        # Delete from database
        conn.execute('DELETE FROM photos WHERE id = ?', (photo_id,))
        conn.commit()
        flash('Photo deleted successfully')
    else:
        flash('Photo not found')
    
    conn.close()
    return redirect(url_for('admin_photos'))

@app.route('/gallery')
def gallery():
    track_visitor()
    
    conn = get_db_connection()
    photos = conn.execute('SELECT * FROM photos ORDER BY upload_date DESC').fetchall()
    conn.close()
    
    return render_template('gallery.html', photos=photos)

# Socket.IO events
@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    emit('visitor_update', get_visitor_stats(), broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    emit('visitor_update', get_visitor_stats(), broadcast=True)

@socketio.on('cursor_move')
def handle_cursor_move(data):
    data['sid'] = request.sid
    emit('cursor_update', data, broadcast=True, include_self=False)

@socketio.on('join_chat')
def handle_join_chat(data):
    username = data.get('username', 'Anonymous')
    join_room('chat_room')
    emit('chat_status', {'message': f"{username} has joined the chat"}, room='chat_room')

@socketio.on('leave_chat')
def handle_leave_chat(data):
    username = data.get('username', 'Anonymous')
    leave_room('chat_room')
    emit('chat_status', {'message': f"{username} has left the chat"}, room='chat_room')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
