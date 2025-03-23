import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isUserAdmin } from '@/utils/supabaseHelpers';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { Bell, Book, BrainCircuit, Home, Image, MessageCircle, Settings, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      // First check localStorage for admin status
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      
      // If not admin from localStorage, check Supabase if user is authenticated
      if (!adminStatus && isAuthenticated && user) {
        try {
          const supabaseAdminStatus = await isUserAdmin();
          setIsAdmin(supabaseAdminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(adminStatus);
      }
      
      setAdminCheckLoading(false);
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  if (loading || adminCheckLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If not admin, redirect to admin login page
  if (!isAdmin) {
    toast({
      title: "غير مصرح",
      description: "يجب تسجيل الدخول كمسؤول للوصول إلى لوحة التحكم",
      variant: "destructive",
    });
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar variant="inset" side="right">
          <SidebarHeader>
            <div className="flex items-center p-2">
              <img src="https://cdn-icons-png.flaticon.com/512/5111/5111463.png" className="w-10 h-10 mr-2" alt="اختبار ون بيس" />
              <div className="flex flex-col">
                <span className="font-bold text-base">لوحة التحكم</span>
                <span className="text-xs text-muted-foreground">مغامرة اختبار ون بيس</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="space-y-2 rtl">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                  <Link to="/admin">
                    <Home className="ml-2" />
                    <span>الرئيسية</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/users')}>
                  <Link to="/admin/users">
                    <Users className="ml-2" />
                    <span>المستخدمين</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/manga')}>
                  <Link to="/admin/manga">
                    <Book className="ml-2" />
                    <span>المانجا</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/questions')}>
                  <Link to="/admin/questions">
                    <BrainCircuit className="ml-2" />
                    <span>الأسئلة</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/avatars')}>
                  <Link to="/admin/avatars">
                    <Image className="ml-2" />
                    <span>الأفاتارات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/announcements')}>
                  <Link to="/admin/announcements">
                    <Bell className="ml-2" />
                    <span>الإعلانات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.includes('/admin/settings')}>
                  <Link to="/admin/settings">
                    <Settings className="ml-2" />
                    <span>الإعدادات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 mt-auto border-t border-border rtl">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  localStorage.removeItem('isAdmin');
                  navigate('/');
                }}
              >
                العودة للموقع
              </Button>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-gradient-to-b from-sky-50 to-blue-100 rtl">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
