import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('jobconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('jobconnect_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const authData = res.data;

      const userData = {
        id: authData.id,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
        role: authData.role,
        jobSeekerId: authData.jobSeekerId,
        recruiterId: authData.recruiterId,
      };

      setToken(authData.token);
      setUser(userData);

      localStorage.setItem('jobconnect_token', authData.token);
      localStorage.setItem('jobconnect_user', JSON.stringify(userData));

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      const authData = res.data;

      const userData = {
        id: authData.id,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
        role: authData.role,
        jobSeekerId: authData.jobSeekerId,
        recruiterId: authData.recruiterId,
      };

      setToken(authData.token);
      setUser(userData);

      localStorage.setItem('jobconnect_token', authData.token);
      localStorage.setItem('jobconnect_user', JSON.stringify(userData));

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobconnect_token');
    localStorage.removeItem('jobconnect_user');
  };

  const updateUserData = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('jobconnect_user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    isRecruiter: user?.role === 'ROLE_RECRUITER',
    isJobSeeker: user?.role === 'ROLE_JOB_SEEKER',
    login,
    register,
    logout,
    updateUserData,
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

