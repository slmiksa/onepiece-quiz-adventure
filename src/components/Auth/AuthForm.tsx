
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum AuthMode {
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
  ADMIN = 'admin',
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === AuthMode.ADMIN) {
        // Special admin login with username/password
        if (adminUsername === 'admin' && adminPassword === 'admin') {
          // Admin login - using a special email for the admin account
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@onepiece-quiz.com', // This admin email must exist in your Supabase project
            password: 'admin',
          });

          if (error) throw error;

          toast({
            title: 'تم تسجيل دخول المسؤول بنجاح',
            description: 'مرحبًا بك في لوحة التحكم',
          });

          navigate('/admin');
          return;
        } else {
          throw new Error('بيانات المسؤول غير صحيحة');
        }
      } else if (mode === AuthMode.SIGN_UP) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (error) throw error;

        toast({
          title: 'تم التسجيل بنجاح',
          description: 'قد تحتاج إلى تأكيد بريدك الإلكتروني',
        });

        setMode(AuthMode.SIGN_IN);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحبًا بعودتك!',
        });

        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء المصادقة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 w-full max-w-md mx-auto border border-opacity-20 border-white shadow-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="sign_in" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="sign_in" 
            onClick={() => setMode(AuthMode.SIGN_IN)}
            className="text-white"
          >
            تسجيل الدخول
          </TabsTrigger>
          <TabsTrigger 
            value="sign_up" 
            onClick={() => setMode(AuthMode.SIGN_UP)}
            className="text-white"
          >
            حساب جديد
          </TabsTrigger>
          <TabsTrigger 
            value="admin" 
            onClick={() => setMode(AuthMode.ADMIN)}
            className="text-white"
          >
            مسؤول
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sign_in">
          <form onSubmit={handleSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-op-yellow text-op-navy hover:bg-op-straw"
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="sign_up">
          <form onSubmit={handleSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-signup" className="text-white">البريد الإلكتروني</Label>
              <Input
                id="email-signup"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-signup" className="text-white">كلمة المرور</Label>
              <Input
                id="password-signup"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-op-yellow text-op-navy hover:bg-op-straw"
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="admin">
          <form onSubmit={handleSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-white">اسم المستخدم</Label>
              <Input
                id="admin-username"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم للمسؤول"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-white">كلمة المرور</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="أدخل كلمة المرور للمسؤول"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-op-yellow text-op-navy hover:bg-op-straw"
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'دخول المسؤول'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AuthForm;
