
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen quiz-container flex items-center justify-center px-4">
      <motion.div 
        className="glass-card p-8 text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img 
          src="https://i.pinimg.com/originals/ee/d0/71/eed071ee6a27119ecebe634f6613324e.jpg"
          alt="Lost Pirate"
          className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-op-yellow"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        
        <motion.h1 
          className="text-4xl font-adventure text-op-navy mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-xl text-op-navy mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          يبدو أنك ضللت الطريق في بحر ون بيس الواسع!
        </motion.p>
        
        <motion.button
          className="btn-accent flex items-center justify-center mx-auto space-x-2 rtl:space-x-reverse"
          onClick={() => navigate("/")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={18} />
          <span>العودة للصفحة الرئيسية</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
