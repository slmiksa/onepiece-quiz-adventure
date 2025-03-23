
import React from 'react';
import Layout from '../components/Layout';
import CreateRoom from '../components/Rooms/CreateRoom';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';

const CreateRoomPage: React.FC = () => {
  return (
    <AuthenticatedRoute>
      <Layout>
        <div className="min-h-screen pt-24 pb-16 quiz-container">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-adventure text-white mb-4 drop-shadow-lg">
                إنشاء غرفة جديدة
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto drop-shadow">
                أنشئ غرفة جديدة للعب مع أصدقائك واختبر معرفتكم بعالم ون بيس
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              <CreateRoom />
            </div>
          </div>
        </div>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default CreateRoomPage;
