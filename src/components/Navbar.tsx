
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
