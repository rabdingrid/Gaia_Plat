"""
Authentication service with Google OAuth and business logic.
Handles user authentication, authorization, and routing based on user type and status.
"""
from sqlalchemy.orm import Session
from typing import Optional, Dict
from models.recruiter_admin import RecruiterAdmin
from models.candidate import Candidate
from core.security import GoogleOAuth
from core.config import settings
from schemas.auth import AuthResponse, UserType, CandidateStatus, ErrorResponse


class AuthService:
    """Authentication service class."""
    
    def __init__(self, db: Session):
        """Initialize auth service with database session."""
        self.db = db
        self.google_oauth = GoogleOAuth()
    
    def _extract_domain(self, email: str) -> str:
        """
        Extract domain from email address.
        
        Args:
            email: Email address
            
        Returns:
            Domain name (e.g., 'griddynamics.com')
        """
        if '@' in email:
            return email.split('@')[1].lower()
        return ''
    
    def _is_company_domain(self, email: str) -> bool:
        """
        Check if email belongs to company domain.
        
        Args:
            email: Email address
            
        Returns:
            True if email domain matches company domain
        """
        domain = self._extract_domain(email)
        return domain == settings.COMPANY_DOMAIN.lower()
    
    def _get_recruiter_admin(self, email: str) -> Optional[RecruiterAdmin]:
        """
        Get recruiter admin by email.
        
        Args:
            email: Email address
            
        Returns:
            RecruiterAdmin object or None
        """
        return self.db.query(RecruiterAdmin).filter(
            RecruiterAdmin.email_id == email.lower()
        ).first()
    
    def _get_candidate_by_id(self, candidate_id: str) -> Optional[Candidate]:
        """
        Get candidate by candidate ID (UUID).
        
        Args:
            candidate_id: Candidate UUID
            
        Returns:
            Candidate object or None
        """
        return self.db.query(Candidate).filter(
            Candidate.candidate_id == candidate_id
        ).first()
    
    def _get_candidate_by_email(self, email: str) -> Optional[Candidate]:
        """
        Get candidate by email.
        
        Args:
            email: Email address
            
        Returns:
            Candidate object or None
        """
        return self.db.query(Candidate).filter(
            Candidate.email_id == email.lower()
        ).first()
    
    def authenticate_admin_recruiter(self, token: str) -> AuthResponse:
        """
        Authenticate admin/recruiter user.
        
        Flow:
        1. Verify Google token
        2. Check if domain is company domain
        3. Check if user exists in RECRUITER_ADMIN table
        
        Args:
            token: Google OAuth ID token
            
        Returns:
            AuthResponse with user type and status
        """
        # Verify Google token
        user_info = self.google_oauth.verify_google_token(token)
        if not user_info:
            return AuthResponse(
                success=False,
                message="Invalid Google token"
            )
        
        email = user_info.get('email', '').lower()
        
        # Check if domain matches company domain
        if not self._is_company_domain(email):
            return AuthResponse(
                success=False,
                message="Email domain does not match company domain"
            )
        
        # Check if user exists in RECRUITER_ADMIN table
        recruiter = self._get_recruiter_admin(email)
        if not recruiter:
            # Domain matches but not in recruiter table - treat as candidate
            return self._handle_candidate_authentication(email, user_info.get('name'))
        
        # User is admin/recruiter
        return AuthResponse(
            success=True,
            message="Authentication successful",
            user_type=UserType.ADMIN,
            email=email,
            name=user_info.get('name')
        )
    
    def authenticate_candidate(self, token: str, candidate_id: str) -> AuthResponse:
        """
        Authenticate candidate user.
        
        Flow:
        1. Verify Google token
        2. Check if candidate_id exists in CANDIDATE table
        3. Check if email matches
        4. Return status for frontend to handle routing
        
        Args:
            token: Google OAuth ID token
            candidate_id: Candidate UUID
            
        Returns:
            AuthResponse with status and candidate_id
        """
        # Verify Google token
        user_info = self.google_oauth.verify_google_token(token)
        if not user_info:
            return AuthResponse(
                success=False,
                message="Invalid Google token"
            )
        
        email = user_info.get('email', '').lower()
        
        # Check if candidate exists
        candidate = self._get_candidate_by_id(candidate_id)
        if not candidate:
            return AuthResponse(
                success=False,
                message="Candidate not found"
            )
        
        # Check if email matches
        if candidate.email_id.lower() != email:
            return AuthResponse(
                success=False,
                message="Email does not match candidate record"
            )
        
        # Handle status-based routing
        status = candidate.status.lower()
        
        # Check for 'ongoing' status - multiple login error
        if status == 'ongoing':
            return AuthResponse(
                success=False,
                message="Multiple login detected. Test is already in progress.",
                status=CandidateStatus.ONGOING
            )
        
        # Map status to enum
        status_enum = None
        if status == 'registered':
            status_enum = CandidateStatus.REGISTERED
        elif status == 'scheduled':
            status_enum = CandidateStatus.SCHEDULED
        elif status == 'done':
            status_enum = CandidateStatus.DONE
        else:
            return AuthResponse(
                success=False,
                message=f"Invalid candidate status: {status}"
            )
        
        return AuthResponse(
            success=True,
            message="Authentication successful",
            user_type=UserType.CANDIDATE,
            email=email,
            name=user_info.get('name'),
            status=status_enum,
            candidate_id=candidate_id
        )
    
    def _handle_candidate_authentication(self, email: str, name: Optional[str] = None) -> AuthResponse:
        """
        Handle candidate authentication for users with company domain but not in recruiter table.
        
        Args:
            email: Email address
            name: User name (optional)
            
        Returns:
            AuthResponse with status and candidate_id
        """
        # Check if candidate exists by email
        candidate = self._get_candidate_by_email(email)
        if not candidate:
            # User not found anywhere - access denied
            return AuthResponse(
                success=False,
                message="Access denied. User not found in database."
            )
        
        # Handle status-based routing
        status = candidate.status.lower()
        
        # Check for 'ongoing' status - multiple login error
        if status == 'ongoing':
            return AuthResponse(
                success=False,
                message="Multiple login detected. Test is already in progress.",
                status=CandidateStatus.ONGOING
            )
        
        # Map status to enum
        status_enum = None
        if status == 'registered':
            status_enum = CandidateStatus.REGISTERED
        elif status == 'scheduled':
            status_enum = CandidateStatus.SCHEDULED
        elif status == 'done':
            status_enum = CandidateStatus.DONE
        else:
            return AuthResponse(
                success=False,
                message=f"Invalid candidate status: {status}"
            )
        
        return AuthResponse(
            success=True,
            message="Authentication successful",
            user_type=UserType.CANDIDATE,
            email=email,
            name=name,
            status=status_enum,
            candidate_id=candidate.candidate_id
        )
    
    def authenticate_user(self, token: str, candidate_id: Optional[str] = None) -> AuthResponse:
        """
        Main authentication method that routes based on user type.
        
        Args:
            token: Google OAuth ID token
            candidate_id: Optional candidate UUID (for candidate login)
            
        Returns:
            AuthResponse with user type, status, and candidate_id
        """
        # Verify Google token first
        user_info = self.google_oauth.verify_google_token(token)
        if not user_info:
            return AuthResponse(
                success=False,
                message="Invalid Google token"
            )
        
        email = user_info.get('email', '').lower()
        
        # If candidate_id is provided, authenticate as candidate
        if candidate_id:
            return self.authenticate_candidate(token, candidate_id)
        
        # Check if domain matches company domain
        if self._is_company_domain(email):
            # Check if user is in recruiter table
            recruiter = self._get_recruiter_admin(email)
            if recruiter:
                # Admin/Recruiter login
                return AuthResponse(
                    success=True,
                    message="Authentication successful",
                    user_type=UserType.ADMIN,
                    email=email,
                    name=user_info.get('name')
                )
            else:
                # Domain matches but not in recruiter table - treat as candidate
                return self._handle_candidate_authentication(email, user_info.get('name'))
        else:
            # Not company domain - check if candidate exists
            candidate = self._get_candidate_by_email(email)
            if candidate:
                # Candidate exists - handle status-based routing
                status = candidate.status.lower()
                
                if status == 'ongoing':
                    return AuthResponse(
                        success=False,
                        message="Multiple login detected. Test is already in progress.",
                        status=CandidateStatus.ONGOING
                    )
                
                # Map status to enum
                status_enum = None
                if status == 'registered':
                    status_enum = CandidateStatus.REGISTERED
                elif status == 'scheduled':
                    status_enum = CandidateStatus.SCHEDULED
                elif status == 'done':
                    status_enum = CandidateStatus.DONE
                else:
                    return AuthResponse(
                        success=False,
                        message=f"Invalid candidate status: {status}"
                    )
                
                return AuthResponse(
                    success=True,
                    message="Authentication successful",
                    user_type=UserType.CANDIDATE,
                    email=email,
                    name=user_info.get('name'),
                    status=status_enum,
                    candidate_id=candidate.candidate_id
                )
        
        # User not found anywhere - access denied
        return AuthResponse(
            success=False,
            message="Access denied. User not found in database."
        )
