"""
Schemas module for request/response validation.
"""
from schemas.auth import (
    UserType,
    CandidateStatus,
    GoogleTokenRequest,
    CandidateLoginRequest,
    AuthResponse,
    GoogleAuthURLResponse,
    ErrorResponse
)

__all__ = [
    'UserType',
    'CandidateStatus',
    'GoogleTokenRequest',
    'CandidateLoginRequest',
    'AuthResponse',
    'GoogleAuthURLResponse',
    'ErrorResponse'
]


