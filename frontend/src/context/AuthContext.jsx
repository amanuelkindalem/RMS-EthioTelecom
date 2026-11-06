import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../api/mockData';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('rms_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Default to HQ Admin
  });

  const [availableUsers] = useState(INITIAL_USERS);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rms_current_user', JSON.stringify(currentUser));
      // In demo mode or Supabase mode, attach a mock bearer token if not set
      if (!localStorage.getItem('rms_jwt_token')) {
        setAuthToken(`mock-token-${currentUser.id}`);
      }
    }
  }, [currentUser]);

  const switchRole = (role) => {
    const matched = availableUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setAuthToken(`mock-token-${matched.id}`);
    }
  };

  const loginAsUser = (user, token) => {
    setCurrentUser(user);
    if (token) setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('rms_current_user');
    setAuthToken('');
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        role: currentUser?.role || 'HQ_ADMIN',
        switchRole,
        loginAsUser,
        logout,
        availableUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

