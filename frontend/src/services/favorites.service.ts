import { API_BASE_URL } from '../config/constants';

export async function addFavorite(cryptoId: string, token: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cryptoId })
    });

    if (!response.ok) {
      throw new Error(`Failed to add favorite: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.favoriteCryptos || [];
    }
    
    throw new Error('Invalid response from server');
  } catch (err) {
    console.error('Error adding favorite:', err);
    throw err;
  }
}

export async function removeFavorite(cryptoId: string, token: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/favorites/${cryptoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to remove favorite: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.favoriteCryptos || [];
    }
    
    throw new Error('Invalid response from server');
  } catch (err) {
    console.error('Error removing favorite:', err);
    throw err;
  }
}

