import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthLogout() {
  const navigate = useNavigate();
  React.useEffect(() => {
    localStorage.clear();
    navigate('/home');
  }, [navigate]);

  return null;
}
export default AuthLogout;