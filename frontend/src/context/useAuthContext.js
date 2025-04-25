import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Wrapper function for AutContext.jsx
export function useAuthContext() {
  return useContext(AuthContext);
}

