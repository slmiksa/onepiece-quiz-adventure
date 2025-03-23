
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-6 px-4 bg-op-navy text-white text-center">
        <div className="container mx-auto">
          <p className="text-sm opacity-80">One Piece Quiz Adventure © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
