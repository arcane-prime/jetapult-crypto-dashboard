import { useState, useEffect } from 'react';
import { useUser } from '../context/user-context';
import { getTokenFromStorage } from '../services/auth.service';
import { addFavorite, removeFavorite } from '../services/favorites.service';

export function useFavorites() {
  const { user, setUser } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sync favorites from user context
  useEffect(() => {
    if (user?.favoriteCryptos) {
      setFavorites(user.favoriteCryptos);
    }
  }, [user]);

  const toggleFavorite = async (cryptoId: string) => {
    const token = getTokenFromStorage();
    if (!token) {
      console.warn('User not logged in, cannot favorite');
      return;
    }

    const isFavorite = favorites.includes(cryptoId);
    
    try {
      const updatedFavorites = isFavorite
        ? await removeFavorite(cryptoId, token)
        : await addFavorite(cryptoId, token);

      setFavorites(updatedFavorites);
      
      // Update user context
      if (user) {
        setUser({ ...user, favoriteCryptos: updatedFavorites });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite: (cryptoId: string) => favorites.includes(cryptoId)
  };
}

