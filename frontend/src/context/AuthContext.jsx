import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

/**
 * AuthProvider sets up global authentication context using React Context API.
 *
 * - Persists token and email to localStorage.
 * - Exposes `token`, `email`, and `logout` methods to consumers.
 * - Loads saved credentials on initial render.
 * - Redirects to `/home` on logout.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Wrapped application components
 * @returns {JSX.Element} AuthContext provider with value for auth state and functions
 */
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('bigbrain_token');
    if (savedToken) setToken(savedToken);
    setTokenReady(true);

    const savedEmail = localStorage.getItem('bigbrain_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const setAndPersistToken = (newToken) => {
    localStorage.setItem('bigbrain_token', newToken);
    setToken(newToken);
  };

  const setAndPersistEmail = (newEmail) => {
    localStorage.setItem('bigbrain_email', newEmail);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    navigate('/home');
  };

  return (
    <AuthContext.Provider value={{ token, tokenReady, setToken: setAndPersistToken, email, setEmail:setAndPersistEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
