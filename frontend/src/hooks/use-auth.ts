import { useEffect, useState } from 'react';
import { useUser } from '../context/user-context';
import { fetchUserData, getTokenFromStorage, getTokenFromURL, saveTokenToStorage, cleanTokenFromURL } from '../services/auth.service';

export function useAuth() {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for token in URL first (from OAuth callback)
      const urlToken = getTokenFromURL();
      if (urlToken) {
        saveTokenToStorage(urlToken);
        cleanTokenFromURL();
      }

      // Fetch user data if we have a token but no user in context
      const token = getTokenFromStorage();
      if (token && !user) {
        setIsLoading(true);
        try {
          const userData = await fetchUserData(token);
          if (userData) {
            setUser(userData);
          }
        } catch (err) {
          console.error('Error initializing auth:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, [user, setUser]);

  return { user, isLoading };
}

