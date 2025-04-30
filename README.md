# Dynamic Portfolio Website

A fully dynamic, pure HTML/CSS/vanilla JavaScript site built as a Flask application. This portfolio showcases coding, automation, DevOps, and networking expertise with various interactive features.

## Features

- **Responsive Design**: Works flawlessly on desktop, tablet, and mobile
- **Real-time Shoutbox**: Global chat system with WebSocket technology
- **Live Visitor Tracking**: Shows unique vs. on-site visitor counts
- **Cursor Farm**: Real-time cursor tracking with animated cat GIFs
- **Terminal Emulator**: Full-screen terminal with custom commands
- **Music Player**: Displays currently playing music via Last.fm API
- **Easter Eggs**: Multiple hidden features throughout the site
- **Admin Panel**: Secure admin interface for site management
- **Photo Gallery**: Dynamic photo management system

## Technical Stack

- **Backend**: Flask with Python
- **Frontend**: Pure HTML, CSS, and vanilla JavaScript (no frameworks)
- **Real-time**: Flask-SocketIO for WebSockets
- **Database**: SQLite for data storage
- **Deployment**: NGINX + Gunicorn, Docker support

## Installation

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Setup

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   \`\`\`

2. Create and activate a virtual environment:
   \`\`\`
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

4. Set up environment variables:
   \`\`\`
   export FLASK_APP=app.py
   export FLASK_ENV=development
   export LASTFM_API_KEY=your_lastfm_api_key
   export LASTFM_USERNAME=your_lastfm_username
   export ADMIN_USERNAME=admin
   export ADMIN_PASSWORD=your_password
   \`\`\`

5. Run the application:
   \`\`\`
   python app.py
   \`\`\`

6. Access the site at http://localhost:5000

## Deployment

### Using Docker

1. Build the Docker image:
   \`\`\`
   docker build -t portfolio .
   \`\`\`

2. Run the container:
   \`\`\`
   docker run -p 8000:8000 -e LASTFM_API_KEY=your_key -e LASTFM_USERNAME=your_username portfolio
   \`\`\`

### Using NGINX and Gunicorn

1. Set up NGINX configuration:
   \`\`\`
   sudo cp nginx.conf /etc/nginx/sites-available/portfolio
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   \`\`\`

2. Run with Gunicorn:
   \`\`\`
   gunicorn --worker-class eventlet -w 1 --bind 127.0.0.1:8000 app:app
   \`\`\`

3. For production deployment, use the provided `deploy.sh` script:
   \`\`\`
   sudo ./deploy.sh
   \`\`\`

## Project Structure

- `app.py`: Main Flask application
- `config.py`: Configuration settings
- `static/`: Static assets (CSS, JS, images)
- `templates/`: HTML templates
- `requirements.txt`: Python dependencies
- `nginx.conf`: NGINX configuration
- `Dockerfile`: Docker configuration
- `deploy.sh`: Deployment script

## Customization

1. Update personal information in `templates/index.html`
2. Modify styles in `static/css/style.css`
3. Add your own photos through the admin panel
4. Configure Last.fm integration with your username

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Last.fm API for music integration
- Socket.IO for real-time features
- Flask and its extensions
\`\`\`

```gitignore file=".gitignore" type="code"
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
ENV/

# Flask
instance/
.webassets-cache

# Database
*.db
*.sqlite
*.sqlite3

# Environment variables
.env
.flaskenv

# Logs
logs/
*.log

# Uploads
static/uploads/*
!static/uploads/.gitkeep

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
