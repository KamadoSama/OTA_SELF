import axios from 'axios';

export const authClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Note: Authorization header should be set dynamically in components 
// using the token from NextAuth session.

export interface AdminUser {
  id: string;
  email: string;
  subscriptionTier: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  email: string;
  id: string;
  access_token: string;
}

export const authService = {
  // Methods here can be added if needed for specific backend calls
  // but login/logout/me are now handled by NextAuth
};

