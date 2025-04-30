#!/bin/bash

# Stop on errors
set -e

# Configuration
APP_DIR="/var/www/portfolio"
VENV_DIR="$APP_DIR/venv"
GIT_REPO="https://github.com/yourusername/portfolio.git"

# Update from Git
if [ -d "$APP_DIR" ]; then
    echo "Updating existing repository..."
    cd "$APP_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone "$GIT_REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# Create or update virtual environment
if [ -d "$VENV_DIR" ]; then
    echo "Updating virtual environment..."
else
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment and install dependencies
source "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install -r requirements.txt

# Set up environment variables
if [ ! -f "$APP_DIR/.env" ]; then
    echo "Creating .env file..."
    cat > "$APP_DIR/.env" << EOF
SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(16))")
FLASK_ENV=production
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_USERNAME=your_lastfm_username
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
EOF
    echo "Please update the .env file with your actual API keys and credentials."
fi

# Set up systemd service
if [ ! -f "/etc/systemd/system/portfolio.service" ]; then
    echo "Creating systemd service..."
    cat > /etc/systemd/system/portfolio.service << EOF
[Unit]
Description=Portfolio Flask Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR
Environment="PATH=$VENV_DIR/bin"
EnvironmentFile=$APP_DIR/.env
ExecStart=$VENV_DIR/bin/gunicorn --worker-class eventlet -w 1 --bind 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd
    systemctl daemon-reload
fi

# Set permissions
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 777 "$APP_DIR/static/uploads"

# Restart service
systemctl restart portfolio.service
systemctl enable portfolio.service

# Set up Nginx if not already configured
if [ ! -f "/etc/nginx/sites-available/portfolio" ]; then
    echo "Setting up Nginx configuration..."
    cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/portfolio
    ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
fi

echo "Deployment completed successfully!"
