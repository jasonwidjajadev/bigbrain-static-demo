import { useEffect, useRef } from 'react';
import { useAuthContext } from "../../context/useAuthContext";
import { apiCall } from '../../util/apiCall';

function AuthLogout() {
  const {token, logout } = useAuthContext();
  const hasLoggedOut = useRef(false);

  //TODO need to end all existing quiz
  useEffect(() => {
    if (!token  || hasLoggedOut.current ) return;
    const doLogout = async () => {
      try {
        await apiCall('/admin/auth/logout', 'POST', null, token);
      } catch (err) {
        console.error('Logout failed:', err.message);
      } finally {
        hasLoggedOut.current = true;
        logout();
      }
    };
    doLogout();
  }, [token, logout]);

  useEffect(() => {
    if (token === null) {
      console.log("✅ token has been cleared");
    }
  }, [token]);
  return null;
}

export default AuthLogout;
