import { API_BASE_URL } from '../utils/config';
import type { 
  GoogleAuthURLResponse, 
  AuthResponse, 
  GoogleTokenRequest, 
  CandidateLoginRequest 
} from '../types';

/**
 * Get Google OAuth authorization URL
 */
export const getGoogleAuthURL = async (state?: string): Promise<GoogleAuthURLResponse> => {
  const url = new URL(`${API_BASE_URL}/auth/google/login`);
  if (state) {
    url.searchParams.append('state', state);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to get auth URL' }));
    throw new Error(error.detail || 'Failed to get auth URL');
  }
  
  return response.json();
};

/**
 * General login endpoint - handles both admin and candidate
 */
export const generalLogin = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token } as GoogleTokenRequest),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(error.detail || 'Authentication failed');
  }
  
  return response.json();
};

/**
 * Admin/Recruiter login endpoint
 */
export const adminLogin = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token } as GoogleTokenRequest),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Admin authentication failed' }));
    throw new Error(error.detail || 'Admin authentication failed');
  }
  
  return response.json();
};

/**
 * Candidate login endpoint with UUID
 */
export const candidateLogin = async (token: string, candidateId: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/candidate/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, candidate_id: candidateId } as CandidateLoginRequest),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Candidate authentication failed' }));
    throw new Error(error.detail || 'Candidate authentication failed');
  }
  
  return response.json();
};


