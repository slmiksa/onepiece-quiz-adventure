
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type AuthenticatedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ 
  children,
  requireAdmin = false 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  // If route requires admin access, check admin status
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/auth" />;
  }

  // For regular authenticated routes
  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
