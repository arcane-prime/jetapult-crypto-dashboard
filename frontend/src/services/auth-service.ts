import { API_BASE_URL } from '../config/constants';
import type { User } from '../types/user';

export async function fetchUserData(token: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.user) {
      return data.user;
    }
    
    return null;
  } catch (err) {
    console.error('Error fetching user data:', err);
    throw err;
  }
}

export function getTokenFromStorage(): string | null {
  return localStorage.getItem('token');
}

export function saveTokenToStorage(token: string): void {
  localStorage.setItem('token', token);
}

export function removeTokenFromStorage(): void {
  localStorage.removeItem('token');
}

export function getTokenFromURL(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

export function cleanTokenFromURL(): void {
  window.history.replaceState({}, '', '/dashboard');
}

