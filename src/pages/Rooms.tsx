
import React from 'react';
import Layout from '../components/Layout';
import RoomsList from '../components/Rooms/RoomsList';
import { motion } from 'framer-motion';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';

const Rooms: React.FC = () => {
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
                غرف اختبار ون بيس
              </h1>
              <p className="text-lg text-white max-w-2xl mx-auto drop-shadow">
                انضم إلى غرفة موجودة أو أنشئ غرفة جديدة للعب مع الأصدقاء
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <RoomsList />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default Rooms;
