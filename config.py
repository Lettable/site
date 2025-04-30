import os
import secrets

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_hex(16))
    
    # Upload configuration
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
    
    # API keys
    LASTFM_API_KEY = os.environ.get('LASTFM_API_KEY', 'your_lastfm_api_key')
    LASTFM_USERNAME = os.environ.get('LASTFM_USERNAME', 'your_lastfm_username')
    
    # Admin credentials
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'password')  # Store hashed in production

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    
    # In production, ensure these are set in environment variables
    SECRET_KEY = os.environ.get('SECRET_KEY')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
