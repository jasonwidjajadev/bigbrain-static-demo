import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmailContext] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("bigbrain_token");
    const savedEmail = localStorage.getItem("bigbrain_email");
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedEmail) {
      setEmailContext(savedEmail);
    }
  }, []);

  const setAndPersistToken = (newToken) => {
    localStorage.setItem("bigbrain_token", newToken);
    setToken(newToken);
  };

  const setAndPersistEmail = (newEmail) => {
    localStorage.setItem("bigbrain_email", newEmail);
    setEmailContext(newEmail);
  };

  const logout = () => {
    localStorage.removeItem("bigbrain_token");
    localStorage.removeItem("bigbrain_email");
    setToken(null);
    setEmailContext(null);
    navigate("/home");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        setToken: setAndPersistToken,
        setEmailContext: setAndPersistEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
