"""
Core configuration settings for the application.
Loads environment variables and provides configuration constants.
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    PORT: int = int(os.getenv('PORT'))
    HOST: str = os.getenv('HOST')
    DEBUG: bool = os.getenv('DEBUG').lower() == 'true'
    
    # Database Configuration
    DATABASE_URL: str = os.getenv('DATABASE_URL')
    
    # Backend URL Configuration (for OAuth redirect)
    # Use this to configure the backend URL for local or develop environment
    # Examples: http://localhost:5000 or https://api-dev.yourdomain.com
    BACKEND_URL: str = os.getenv('BACKEND_URL')
    
    # Google OAuth Configuration
    GOOGLE_CLIENT_ID: str = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET: str = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_REDIRECT_URI: str = os.getenv('GOOGLE_REDIRECT_URI')
    
    # Company Domain
    COMPANY_DOMAIN: str = os.getenv('COMPANY_DOMAIN')
    
    # Google OAuth Scopes
    GOOGLE_SCOPES: list = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
    ]


settings = Settings()


