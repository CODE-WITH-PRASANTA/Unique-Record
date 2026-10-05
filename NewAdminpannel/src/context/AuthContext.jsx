import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Cross-Tab Synchronization via 'storage' event
  useEffect(() => {
    const handleStorageChange = (e) => {
      // If token changed or logout signal was fired in another tab
      if (e.key === 'admin_token' || e.key === 'admin_logout_signal') {
        const currentToken = localStorage.getItem('admin_token');
        if (!currentToken) {
          // Another tab logged out -> Log out this tab too!
          setToken(null);
          setUser(null);
        } else {
          // Another tab logged in -> Update this tab's auth state
          setToken(currentToken);
          try {
            const stored = localStorage.getItem('admin_user');
            setUser(stored ? JSON.parse(stored) : null);
          } catch {
            setUser(null);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    setLoading(false);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login handler
  const login = async (identifier, password) => {
    try {
      const res = await API.post('/auth/login', {
        userId: identifier,
        password,
      });

      if (res.data?.success && res.data?.token) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        localStorage.setItem('admin_token', receivedToken);
        localStorage.setItem('admin_user', JSON.stringify(receivedUser));
        localStorage.removeItem('admin_logout_signal');

        setToken(receivedToken);
        setUser(receivedUser);

        return { success: true, message: res.data.message || 'Login successful' };
      } else {
        return {
          success: false,
          message: res.data?.message || 'Login failed. Please check your credentials.',
        };
      }
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Invalid User ID or Password. Please try again.',
      };
    }
  };

  // Logout handler (Broadcasts logout to all tabs)
  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.setItem('admin_logout_signal', Date.now().toString());

    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
