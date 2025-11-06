"""
Authentication API routes for Google OAuth SSO.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from core.database import get_db
from services.auth_service import AuthService
from schemas.auth import (
    GoogleTokenRequest,
    CandidateLoginRequest,
    AuthResponse,
    GoogleAuthURLResponse,
    ErrorResponse,
    CandidateStatus
)
from core.security import GoogleOAuth
from core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
google_oauth = GoogleOAuth()


@router.get("/google/login", response_model=GoogleAuthURLResponse)
async def google_login(state: str = None):
    """
    Initiate Google OAuth login.
    Returns the Google OAuth authorization URL.
    
    Args:
        state: Optional state parameter for CSRF protection
        
    Returns:
        Google OAuth authorization URL
    """
    auth_url = google_oauth.get_google_auth_url(state=state)
    return GoogleAuthURLResponse(auth_url=auth_url, state=state)


@router.get("/google/callback")
async def google_callback(
    code: Optional[str] = Query(None, description="Authorization code from Google OAuth"),
    error: Optional[str] = Query(None, description="Error from Google OAuth"),
    state: Optional[str] = Query(None, description="State parameter for CSRF protection"),
    db: Session = Depends(get_db)
):
    """
    Google OAuth callback endpoint.
    Exchanges authorization code for token and authenticates user.
    
    Args:
        code: Authorization code from Google OAuth (required if no error)
        error: Error message from Google OAuth (if authentication failed)
        state: State parameter for CSRF protection
        db: Database session
        
    Returns:
        AuthResponse with redirect URL or error
    """
    # Handle OAuth errors from Google
    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google OAuth error: {error}"
        )
    
    # Check if code is provided
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing authorization code. Please try logging in again."
        )
    
    # Exchange code for token
    try:
        id_token_str = google_oauth.get_google_token_from_code(code)
    except ValueError as e:
        # Handle specific error messages from token exchange
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during token exchange: {str(e)}"
        )
    
    if not id_token_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange authorization code for token. No ID token received."
        )
    
    # Authenticate user
    auth_service = AuthService(db)
    response = auth_service.authenticate_user(token=id_token_str)
    
    if not response.success:
        # Special handling for ongoing status (multiple login)
        if response.status == CandidateStatus.ONGOING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=response.message
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=response.message
        )
    
    return response


@router.post("/admin/login", response_model=AuthResponse)
async def admin_login(
    request: GoogleTokenRequest,
    db: Session = Depends(get_db)
):
    """
    Admin/Recruiter login endpoint.
    
    Flow:
    1. Verify Google token
    2. Check if email domain is company domain (@griddynamics.com)
    3. Check if user exists in RECRUITER_ADMIN table
    4. Redirect to admin dashboard
    
    Args:
        request: Google OAuth token request
        db: Database session
        
    Returns:
        AuthResponse with redirect URL or error
    """
    auth_service = AuthService(db)
    response = auth_service.authenticate_admin_recruiter(request.token)
    
    if not response.success:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=response.message
        )
    
    return response


@router.post("/candidate/login", response_model=AuthResponse)
async def candidate_login(
    request: CandidateLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Candidate login endpoint with UUID.
    
    Flow:
    1. Verify Google token
    2. Check if candidate_id exists in CANDIDATE table
    3. Check if email matches
    4. Route based on status:
       - 'registered' -> scheduled page
       - 'scheduled' -> test landing page
       - 'done' -> thank you page
       - 'ongoing' -> error (multiple login)
    
    Args:
        request: Candidate login request with token and candidate_id
        db: Database session
        
    Returns:
        AuthResponse with redirect URL or error
    """
    auth_service = AuthService(db)
    response = auth_service.authenticate_candidate(
        token=request.token,
        candidate_id=request.candidate_id
    )
    
    if not response.success:
        # Special handling for ongoing status (multiple login)
        if response.status == CandidateStatus.ONGOING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=response.message
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=response.message
        )
    
    return response


@router.post("/login", response_model=AuthResponse)
async def general_login(
    request: GoogleTokenRequest,
    db: Session = Depends(get_db)
):
    """
    General login endpoint that handles both admin and candidate authentication.
    
    Flow:
    1. Verify Google token
    2. Check domain:
       - If @griddynamics.com:
         - Check RECRUITER_ADMIN table -> Admin dashboard
         - If not found, check CANDIDATE table -> Status-based routing
       - If not @griddynamics.com:
         - Check CANDIDATE table -> Status-based routing
    3. If user not found anywhere -> Access denied
    
    Args:
        request: Google OAuth token request
        db: Database session
        
    Returns:
        AuthResponse with redirect URL or error
    """
    auth_service = AuthService(db)
    response = auth_service.authenticate_user(token=request.token)
    
    if not response.success:
        # Special handling for ongoing status (multiple login)
        if response.status == CandidateStatus.ONGOING:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=response.message
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=response.message
        )
    
    return response

