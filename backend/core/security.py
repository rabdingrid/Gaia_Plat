"""
Security utilities for Google OAuth and authentication.
"""
from google.oauth2 import id_token
from google.auth.transport import requests
from typing import Optional, Dict
from core.config import settings


class GoogleOAuth:
    """Google OAuth utility class."""
    
    @staticmethod
    def verify_google_token(token: str) -> Optional[Dict]:
        """
        Verify Google OAuth token and return user information.
        
        Args:
            token: Google OAuth ID token
            
        Returns:
            Dictionary containing user info (email, name, etc.) or None if invalid
        """
        try:
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return None
            
            return {
                'email': idinfo.get('email'),
                'name': idinfo.get('name'),
                'picture': idinfo.get('picture'),
                'sub': idinfo.get('sub')  # Google user ID
            }
        except ValueError:
            # Invalid token
            return None
    
    @staticmethod
    def get_google_auth_url(state: Optional[str] = None) -> str:
        """
        Generate Google OAuth authorization URL.
        
        Args:
            state: Optional state parameter for CSRF protection
            
        Returns:
            Google OAuth authorization URL
        """
        from google_auth_oauthlib.flow import Flow
        from google.oauth2.credentials import Credentials
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=settings.GOOGLE_SCOPES
        )
        flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
        
        # Don't use include_granted_scopes to prevent scope mismatch
        # This ensures we only get the scopes we request
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='false',
            state=state,
            prompt='consent'  # Force consent screen to ensure scopes match
        )
        
        return authorization_url
    
    @staticmethod
    def get_google_token_from_code(code: str) -> Optional[str]:
        """
        Exchange authorization code for access token.
        
        Args:
            code: Authorization code from Google OAuth callback
            
        Returns:
            ID token string or None if exchange fails
            
        Raises:
            Exception: Raises exception with detailed error message for debugging
        """
        import logging
        from google_auth_oauthlib.flow import Flow
        from google.auth.exceptions import GoogleAuthError
        
        logger = logging.getLogger(__name__)
        
        # Validate configuration
        if not settings.GOOGLE_CLIENT_ID:
            raise ValueError("GOOGLE_CLIENT_ID is not set in environment variables")
        if not settings.GOOGLE_CLIENT_SECRET:
            raise ValueError("GOOGLE_CLIENT_SECRET is not set in environment variables")
        if not settings.GOOGLE_REDIRECT_URI:
            raise ValueError("GOOGLE_REDIRECT_URI is not set in environment variables")
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=settings.GOOGLE_SCOPES
        )
        flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
        
        try:
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            # Check if ID token is available
            if not credentials.id_token:
                logger.error("ID token not found in credentials")
                raise ValueError("ID token not found in OAuth credentials")
            
            return credentials.id_token
            
        except GoogleAuthError as e:
            error_msg = str(e)
            logger.error(f"Google OAuth error: {error_msg}")
            
            # Provide more specific error messages
            if "scope" in error_msg.lower() and "changed" in error_msg.lower():
                raise ValueError(
                    "Scope mismatch error. This usually happens when:\n"
                    "1. You're using Google OAuth Playground (which adds extra scopes)\n"
                    "2. Additional scopes were granted during authorization\n"
                    "3. The authorization code was generated with different scopes\n\n"
                    "Solution: Use the OAuth flow directly from your application, "
                    "not from Google OAuth Playground. Start fresh by visiting: "
                    f"{settings.BACKEND_URL}/api/v1/auth/google/login"
                )
            elif "invalid_grant" in error_msg.lower():
                raise ValueError(
                    "Invalid authorization code. The code may have expired, "
                    "been used already, or the redirect URI doesn't match. "
                    f"Expected redirect URI: {settings.GOOGLE_REDIRECT_URI}"
                )
            elif "invalid_client" in error_msg.lower():
                raise ValueError(
                    "Invalid client credentials. Please check GOOGLE_CLIENT_ID "
                    "and GOOGLE_CLIENT_SECRET in your .env file."
                )
            elif "redirect_uri_mismatch" in error_msg.lower():
                raise ValueError(
                    f"Redirect URI mismatch. The redirect URI in your request "
                    f"({settings.GOOGLE_REDIRECT_URI}) doesn't match the one "
                    "configured in Google Cloud Console. Please add this exact "
                    f"URI to your OAuth 2.0 Client ID settings: {settings.GOOGLE_REDIRECT_URI}"
                )
            else:
                raise ValueError(f"Google OAuth error: {error_msg}")
                
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Unexpected error during token exchange: {error_msg}")
            raise ValueError(f"Failed to exchange authorization code: {error_msg}")


