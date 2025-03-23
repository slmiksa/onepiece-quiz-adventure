
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IntroAnimation: React.FC = () => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };
  
  const waveVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: "easeOut",
        delay: 1.5
      }
    }
  };
  
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-op-ocean to-op-navy flex items-center justify-center">
      {!isAnimationComplete ? (
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="mb-8"
            variants={logoVariants}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/9/90/One_Piece_anime_logo.svg/1200px-One_Piece_anime_logo.svg.png" 
              alt="One Piece Logo" 
              className="h-48 md:h-64 mx-auto"
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-adventure text-white mb-6"
            variants={itemVariants}
          >
            مغامرة ون بيس
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-op-straw mb-8"
            variants={itemVariants}
          >
            اختبر معرفتك في عالم ون بيس
          </motion.p>
          
          <motion.div
            variants={waveVariants}
            className="absolute bottom-0 left-0 w-full"
          >
            <svg 
              className="w-full h-auto" 
              viewBox="0 0 1440 320" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillOpacity="0.5" 
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
                fill="#FFC800"
              />
              <path 
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" 
                fill="#FFF1BD"
              />
            </svg>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-adventure text-white mb-8 tracking-wide">
              ون بيس كويز
            </h1>
            
            <p className="text-xl md:text-2xl text-op-straw mb-12 max-w-3xl mx-auto">
              انطلق في رحلة مليئة بالمغامرات واختبر معرفتك العميقة بعالم ون بيس المثير
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 md:rtl:space-x-reverse rtl">
              <button 
                onClick={() => navigate('/manga')}
                className="btn-primary min-w-[200px] group flex items-center justify-center"
              >
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">استكشف المانجا</span>
              </button>
              
              <button 
                onClick={() => navigate('/quiz')}
                className="btn-accent min-w-[200px] group flex items-center justify-center"
              >
                <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">ابدأ الاختبار</span>
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <img 
                src="https://www.pngmart.com/files/22/One-Piece-Characters-PNG-HD.png" 
                alt="One Piece Characters" 
                className="w-full max-h-[350px] object-contain object-bottom"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IntroAnimation;
