import { useEffect, useRef } from 'react';
import { useAuthContext } from "@/context/useAuthContext";
import { apiCall } from '@/util/apiCall';

/**
 * AuthLogout component logs the user out by:
 *
 * - Sending a POST request to `/admin/auth/logout` using the stored token.
 * - Clearing the token and auth context via `logout()`.
 * - Ensuring the logout API call is not made more than once using `useRef`.
 * - Immediately returns `null` (no visible UI) as this component is used for side-effect only.
 *
 * Typically used when routing to a logout endpoint like `/auth/logout`.
 *
 * @component
 * @returns {null} No UI is rendered.
 */
function AuthLogout() {
  const {token, logout } = useAuthContext();
  const hasLoggedOut = useRef(false);

  /**
   * Runs once on mount. If token exists and logout hasn't already occurred:
   * - Calls the logout API.
   * - Clears the token from context.
   */
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

  /**
   * Logs a message when token is fully cleared from context.
   */
  useEffect(() => {
    if (token === null) {
      console.log("✅ token has been cleared");
    }
  }, [token]);
  return null;
}

export default AuthLogout;
