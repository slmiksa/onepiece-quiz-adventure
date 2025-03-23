
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type AuthenticatedRouteProps = {
  children: React.ReactNode;
};

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
