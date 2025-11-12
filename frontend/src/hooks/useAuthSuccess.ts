import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/user-context';
import { getTokenFromURL, saveTokenToStorage, fetchUserData, cleanTokenFromURL } from '../services/auth-service';

export function useAuthSuccess() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = getTokenFromURL();
      
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      saveTokenToStorage(token);
      
      try {
        const user = await fetchUserData(token);
        
        if (user) {
          setUser(user);
          cleanTokenFromURL();
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Error in auth success:', err);
        navigate('/login', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [setUser, navigate]);
}

