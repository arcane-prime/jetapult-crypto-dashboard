import { useEffect } from "react";
import { API_BASE_URL } from "../../config/constants";
import { useUser } from "../../context/user-context";
import { useNavigate } from "react-router-dom";

export default function AuthSuccessPage() {
    const { setUser } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        const handleAuthSuccess = async () => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                localStorage.setItem('token', token);
                try { 
                    const response = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        console.error('Auth failed:', response.status, response.statusText);
                        navigate('/login', { replace: true });
                        return;
                    }
                    
                    const data = await response.json();
                    console.log('Auth response:', data);
                    
                    if(data.success && data.user) {
                        setUser(data.user);
                        // Clean URL and navigate to dashboard
                        window.history.replaceState({}, '', '/dashboard');
                        navigate('/dashboard', { replace: true });
                    } else {
                        console.error('Invalid response format:', data);
                        navigate('/login', { replace: true });
                    }
                } catch(err) { 
                    console.error('Error in auth success', err);
                    navigate('/login', { replace: true });
                }
            } else {
                // No token found, redirect to login
                navigate('/login', { replace: true });
            }
        };
        handleAuthSuccess();
    }, [setUser, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-black">Authenticating...</h1>
            <p className="text-black">Please wait...</p>
        </div>
    );
}