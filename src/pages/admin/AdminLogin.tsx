
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import OnePieceBackground from '@/components/OnePieceBackground';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple admin credentials check
      if (username === 'admin' && password === 'admin') {
        // Store admin status in localStorage
        localStorage.setItem('isAdmin', 'true');
        
        toast({
          title: 'تم تسجيل دخول المسؤول بنجاح',
          description: 'مرحبًا بك في لوحة التحكم',
        });
        
        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        throw new Error('بيانات المسؤول غير صحيحة');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'حدث خطأ أثناء تسجيل دخول المسؤول',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnePieceBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 w-full max-w-md mx-auto border border-opacity-20 border-white shadow-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">دخول المسؤول</h1>
            <p className="text-white text-opacity-80">الرجاء إدخال بيانات الدخول للوصول إلى لوحة التحكم</p>
          </div>
          
          <form onSubmit={handleAdminSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-white">اسم المستخدم</Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
        </motion.div>
      </div>
    </OnePieceBackground>
  );
};

export default AdminLogin;
