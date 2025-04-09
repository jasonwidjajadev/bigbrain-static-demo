import React from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';

function AuthLogout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('bigbrain_token');
        const response = await fetch(`http://localhost:${config.BACKEND_PORT}/admin/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.status !== 200) {
          console.error('Logout error:', data.error);
        }
      } catch (err) {
        console.error('Network error during logout:', err.message);
      } finally {
        localStorage.clear();
        navigate('/home');
      }
    };

    logout();
  }, [navigate]);

  return null;
}

export default AuthLogout;
