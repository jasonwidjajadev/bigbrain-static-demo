import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('bigbrain_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const setAndPersistToken = (newToken) => {
    localStorage.setItem('bigbrain_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('bigbrain_token');
    setToken(null);
    navigate('/home');
  };

  return (
    <AuthContext.Provider value={{ token, setToken: setAndPersistToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
