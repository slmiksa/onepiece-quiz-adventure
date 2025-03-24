
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js'; // Make sure AuthChangeEvent is imported
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sendWelcomeEmail } from '@/utils/supabaseHelpers';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: {
    username?: string;
    fullName?: string;
    favoriteCharacter?: string;
  } | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  signOut: async () => {},
  userProfile: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    username?: string;
    fullName?: string;
    favoriteCharacter?: string;
  } | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Update user profile data when session changes
        if (session?.user) {
          const metadata = session.user.user_metadata;
          setUserProfile({
            username: metadata?.username,
            fullName: metadata?.full_name,
            favoriteCharacter: metadata?.favorite_character,
          });
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
        
        // إرسال بريد ترحيبي للمستخدمين الجدد
        if (event === 'SIGNED_UP' && session?.user) {
          console.log('Sending welcome email to new user:', session.user.email);
          try {
            await sendWelcomeEmail(
              session.user.email || '', 
              session.user.user_metadata?.username || 'مستخدم جديد'
            );
            
            toast({
              title: "مرحبًا بك!",
              description: "تم إرسال بريد ترحيبي إلى عنوان بريدك الإلكتروني",
            });
          } catch (error) {
            console.error('Failed to send welcome email:', error);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Set initial user profile data if session exists
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserProfile({
          username: metadata?.username,
          fullName: metadata?.full_name,
          favoriteCharacter: metadata?.favorite_character,
        });
      }
      
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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated: !!user, 
      loading, 
      signOut,
      userProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
