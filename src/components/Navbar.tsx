
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-op-navy bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/d81711f8-c3d9-4fea-b0b8-64f9842485ba.png" 
            alt="One Piece Logo"
            className="h-10 md:h-12"
          />
          <span className="text-white text-lg md:text-xl font-adventure ml-2">
            عالم ون بيس
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="block lg:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'transform rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse rtl">
          <Link
            to="/"
            className="text-white hover:text-op-yellow transition-colors"
          >
            الرئيسية
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/manga"
                className="text-white hover:text-op-yellow transition-colors"
              >
                مانجا ون بيس
              </Link>
              <Link
                to="/quiz"
                className="text-white hover:text-op-yellow transition-colors"
              >
                اختبار المعرفة
              </Link>
              <Link
                to="/rooms"
                className="text-white hover:text-op-yellow transition-colors"
              >
                الغرف
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-op-yellow transition-colors"
              >
                الملف الشخصي
              </Link>
            </>
          )}
          <Link
            to="/leaderboard"
            className="text-white hover:text-op-yellow transition-colors"
          >
            المتصدرون
          </Link>
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Link
              to="/auth"
              className="bg-op-yellow text-op-navy px-4 py-2 rounded-md font-medium hover:bg-op-straw transition-colors"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-op-navy bg-opacity-95 backdrop-filter backdrop-blur-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 rtl">
              <Link
                to="/"
                className="text-white hover:text-op-yellow transition-colors py-2"
              >
                الرئيسية
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/manga"
                    className="text-white hover:text-op-yellow transition-colors py-2"
                  >
                    مانجا ون بيس
                  </Link>
                  <Link
                    to="/quiz"
                    className="text-white hover:text-op-yellow transition-colors py-2"
                  >
                    اختبار المعرفة
                  </Link>
                  <Link
                    to="/rooms"
                    className="text-white hover:text-op-yellow transition-colors py-2"
                  >
                    الغرف
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white hover:text-op-yellow transition-colors py-2"
                  >
                    الملف الشخصي
                  </Link>
                </>
              )}
              <Link
                to="/leaderboard"
                className="text-white hover:text-op-yellow transition-colors py-2"
              >
                المتصدرون
              </Link>
              
              {isAuthenticated ? (
                <div className="py-2">
                  <UserMenu />
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-op-yellow text-op-navy px-4 py-2 rounded-md font-medium hover:bg-op-straw transition-colors inline-block text-center"
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
