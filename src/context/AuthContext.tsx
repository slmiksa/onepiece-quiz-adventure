
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sendWelcomeEmail } from '@/utils/supabaseHelpers';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // إرسال بريد ترحيبي للمستخدمين الجدد
        if (event === 'SIGNED_IN' && session?.user) {
          // التحقق مما إذا كان المستخدم جديد (يمكن استخدام حقل البيانات الوصفية أو وقت الإنشاء)
          if (new Date(session.user.created_at).getTime() > Date.now() - 60000) { // تم إنشاؤه في آخر دقيقة
            console.log('Sending welcome email to new user:', session.user.email);
            try {
              await sendWelcomeEmail(
                session.user.email || '', 
                session.user.user_metadata?.username || 'مستخدم جديد'
              );
            } catch (error) {
              console.error('Failed to send welcome email:', error);
            }
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح من حسابك",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء محاولة تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated: !!user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
