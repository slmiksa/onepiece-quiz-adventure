
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

enum AuthMode {
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === AuthMode.SIGN_UP) {
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

        // يمكنك تحويل المستخدم إلى صفحة أخرى أو تغيير الوضع إلى تسجيل الدخول
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
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {mode === AuthMode.SIGN_IN ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 rtl">
        {mode === AuthMode.SIGN_UP && (
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
        )}

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
          {loading ? 'جاري التحميل...' : (mode === AuthMode.SIGN_IN ? 'تسجيل الدخول' : 'إنشاء حساب')}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setMode(mode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN)}
          className="text-op-straw hover:underline"
          type="button"
        >
          {mode === AuthMode.SIGN_IN
            ? 'ليس لديك حساب؟ سجل الآن'
            : 'لديك حساب بالفعل؟ سجل دخولك'}
        </button>
      </div>
    </motion.div>
  );
};

export default AuthForm;
