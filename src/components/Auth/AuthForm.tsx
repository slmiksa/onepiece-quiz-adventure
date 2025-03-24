
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

enum AuthMode {
  SIGN_IN = 'sign_in',
  SIGN_UP = 'sign_up',
  ADMIN = 'admin',
}

const onePieceCharacters = [
  { name: "لوفي", value: "luffy" },
  { name: "زورو", value: "zoro" },
  { name: "نامي", value: "nami" },
  { name: "سانجي", value: "sanji" },
  { name: "تشوبر", value: "chopper" },
  { name: "روبن", value: "robin" },
  { name: "فرانكي", value: "franky" },
  { name: "بروك", value: "brook" },
  { name: "جينبي", value: "jinbe" },
  { name: "آيس", value: "ace" },
  { name: "شانكس", value: "shanks" }
];

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [favoriteCharacter, setFavoriteCharacter] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (adminEmail === 's34009058@gmail.com' && adminPassword === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        
        toast({
          title: 'تم تسجيل دخول المسؤول بنجاح',
          description: 'مرحبًا بك في لوحة التحكم',
        });
        
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

  const handleUserSubmit = async (e: React.FormEvent) => {
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
              full_name: fullName,
              favorite_character: favoriteCharacter,
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
          <form onSubmit={handleUserSubmit} className="space-y-4 rtl">
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
          <form onSubmit={handleUserSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-white">الاسم</Label>
              <Input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                required
                className="bg-white bg-opacity-20 border-none text-white placeholder:text-gray-300"
              />
            </div>

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
              <Label htmlFor="favorite-character" className="text-white">الشخصية المحبوبة في انيمي ون بيس</Label>
              <Select 
                value={favoriteCharacter} 
                onValueChange={setFavoriteCharacter}
                required
              >
                <SelectTrigger className="bg-white bg-opacity-20 border-none text-white">
                  <SelectValue placeholder="اختر شخصيتك المفضلة" />
                </SelectTrigger>
                <SelectContent>
                  {onePieceCharacters.map((character) => (
                    <SelectItem key={character.value} value={character.value}>
                      {character.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <form onSubmit={handleAdminSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white">البريد الإلكتروني</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني للمسؤول"
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
