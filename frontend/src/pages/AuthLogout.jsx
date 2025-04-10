import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import { apiCall } from '../util/apiCall';

function AuthLogout() {
  const navigate = useNavigate();
  const { token, logout } = useAuthContext();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await apiCall('/admin/auth/logout', 'POST', null, token);
      } catch (err) {
        console.error('Logout failed:', err.message);
      } finally {
        logout();
      }
    };
    doLogout();
  }, [token, logout, navigate]);
  return null;
}

export default AuthLogout;
