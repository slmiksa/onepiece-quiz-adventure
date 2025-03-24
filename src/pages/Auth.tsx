
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-adventure text-op-navy mb-4 drop-shadow-lg">
              اختبار ون بيس
            </h1>
            <p className="text-lg text-op-navy max-w-2xl mx-auto drop-shadow">
              انضم إلى مجتمعنا من محبي ون بيس وتحدى أصدقائك في اختبارات عن عالم ون بيس!
            </p>
          </motion.div>
          
          <motion.div
            className="max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                عند إنشاء حساب جديد، يُرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد لتفعيل حسابك قبل تسجيل الدخول.
              </AlertDescription>
            </Alert>
          </motion.div>
          
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
