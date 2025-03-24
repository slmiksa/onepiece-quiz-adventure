
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, userProfile } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleSignupClick = () => {
    navigate('/auth?mode=sign_up');
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/5111/5111463.png" 
              alt="One Piece Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-adventure text-op-navy whitespace-nowrap">
              One Piece Quiz
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              الرئيسية
            </Link>
            <Link to="/manga" className={`nav-link ${isActive('/manga') ? 'active' : ''}`}>
              المانجا
            </Link>
            <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
              اختبار المعرفة
            </Link>

            {/* Auth Buttons - Desktop */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-op-navy">مرحباً {userProfile?.username || 'بك'}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-1 rtl:flex-row-reverse"
                >
                  <LogOut size={16} />
                  <span>تسجيل خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLoginClick}
                  className="flex items-center gap-1 rtl:flex-row-reverse"
                >
                  <LogIn size={16} />
                  <span>تسجيل دخول</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSignupClick}
                  className="flex items-center gap-1 rtl:flex-row-reverse"
                >
                  <UserPlus size={16} />
                  <span>حساب جديد</span>
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden btn-icon text-op-navy"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 items-center rtl">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              الرئيسية
            </Link>
            <Link to="/manga" className={`nav-link ${isActive('/manga') ? 'active' : ''}`}>
              المانجا
            </Link>
            <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}>
              اختبار المعرفة
            </Link>
            
            {/* Auth Buttons - Mobile */}
            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-2 w-full px-6 pt-2">
                <span className="text-op-navy">مرحباً {userProfile?.username || 'بك'}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-1 rtl:flex-row-reverse w-full"
                >
                  <LogOut size={16} />
                  <span>تسجيل خروج</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 w-full px-6 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLoginClick}
                  className="flex items-center gap-1 rtl:flex-row-reverse w-full"
                >
                  <LogIn size={16} />
                  <span>تسجيل دخول</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSignupClick}
                  className="flex items-center gap-1 rtl:flex-row-reverse w-full"
                >
                  <UserPlus size={16} />
                  <span>حساب جديد</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
