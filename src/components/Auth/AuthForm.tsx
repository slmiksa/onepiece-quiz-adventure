
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

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
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Clear error when mode changes
  useEffect(() => {
    setFormError(null);
    setConfirmationSent(false);
  }, [mode]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

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
      setFormError(error.message || 'حدث خطأ أثناء تسجيل دخول المسؤول');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setConfirmationSent(false);

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

        setConfirmationSent(true);
        toast({
          title: 'تم التسجيل بنجاح',
          description: 'تم إرسال بريد إلكتروني ترحيبي لك! يُرجى تأكيد بريدك الإلكتروني للمتابعة',
        });

        // Don't switch to sign in mode, let user see confirmation message
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setFormError('لم يتم تأكيد البريد الإلكتروني. يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد');
            return;
          }
          throw error;
        }

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحبًا بعودتك!',
        });

        navigate('/');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setFormError(error.message || 'حدث خطأ أثناء المصادقة');
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!formError) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>خطأ</AlertTitle>
        <AlertDescription>{formError}</AlertDescription>
      </Alert>
    );
  };

  const renderConfirmationMessage = () => {
    if (!confirmationSent) return null;
    
    return (
      <Alert className="mb-4 bg-green-50 border-green-500 text-green-800">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>تم إرسال رسالة التأكيد</AlertTitle>
        <AlertDescription>
          لقد أرسلنا بريدًا إلكترونيًا للتأكيد إلى {email}. يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد للمتابعة.
        </AlertDescription>
      </Alert>
    );
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setFormError('يرجى إدخال البريد الإلكتروني أولاً');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: 'تم إعادة الإرسال',
        description: 'تم إعادة إرسال رابط التأكيد إلى بريدك الإلكتروني',
      });
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      setFormError(error.message || 'حدث خطأ أثناء إعادة إرسال التأكيد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-filter backdrop-blur-lg rounded-lg p-6 w-full max-w-md mx-auto border border-gray-200 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="sign_in" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger 
            value="sign_in" 
            onClick={() => setMode(AuthMode.SIGN_IN)}
            className="text-op-navy"
          >
            تسجيل الدخول
          </TabsTrigger>
          <TabsTrigger 
            value="sign_up" 
            onClick={() => setMode(AuthMode.SIGN_UP)}
            className="text-op-navy"
          >
            حساب جديد
          </TabsTrigger>
          <TabsTrigger 
            value="admin" 
            onClick={() => setMode(AuthMode.ADMIN)}
            className="text-op-navy"
          >
            مسؤول
          </TabsTrigger>
        </TabsList>
        
        {renderErrorMessage()}
        {renderConfirmationMessage()}
        
        <TabsContent value="sign_in">
          <form onSubmit={handleUserSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-op-navy">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-op-navy">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-op-yellow text-op-navy hover:bg-op-straw"
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>

            {formError && formError.includes('تأكيد البريد') && (
              <Button 
                type="button" 
                variant="outline"
                className="w-full mt-2"
                onClick={handleResendConfirmation}
                disabled={loading}
              >
                إعادة إرسال رابط التأكيد
              </Button>
            )}
          </form>
        </TabsContent>
        
        <TabsContent value="sign_up">
          <form onSubmit={handleUserSubmit} className="space-y-4 rtl">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-op-navy">الاسم</Label>
              <Input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="أدخل اسمك الكامل"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-op-navy">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-signup" className="text-op-navy">البريد الإلكتروني</Label>
              <Input
                id="email-signup"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favorite-character" className="text-op-navy">الشخصية المحبوبة في انيمي ون بيس</Label>
              <Select 
                value={favoriteCharacter} 
                onValueChange={setFavoriteCharacter}
                required
              >
                <SelectTrigger className="bg-white/80 border-gray-200 text-op-navy">
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
              <Label htmlFor="password-signup" className="text-op-navy">كلمة المرور</Label>
              <Input
                id="password-signup"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
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
              <Label htmlFor="admin-email" className="text-op-navy">البريد الإلكتروني</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني للمسؤول"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-op-navy">كلمة المرور</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="أدخل كلمة المرور للمسؤول"
                required
                className="bg-white/80 border-gray-200 text-op-navy placeholder:text-gray-400"
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
