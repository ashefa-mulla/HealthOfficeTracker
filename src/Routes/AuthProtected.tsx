import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface AuthProtectedProps {
  children: React.ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {
  const { jwt, user } = useAuthStore();
  const authUser = localStorage.getItem('authUser');

  // If user is authenticated either in memory store or in localStorage
  if (!jwt && !user && !authUser) {
    return <Navigate to="/login" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtected;
