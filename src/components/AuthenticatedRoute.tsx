
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated && !isAdmin) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, loading, isAdmin, toast]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  // If route requires admin access, check admin status
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // For regular authenticated routes
  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
