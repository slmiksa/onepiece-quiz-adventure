
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

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
            className="text-center mb-12"
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
          
          <div className="flex justify-center">
            <AuthForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
