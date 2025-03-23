
import React from 'react';

interface OnePieceBackgroundProps {
  children: React.ReactNode;
}

const OnePieceBackground: React.FC<OnePieceBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 91, 187, 0.1), rgba(0, 58, 112, 0.8)), 
                          url('https://wallpapercave.com/wp/wp9495635.jpg')`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent pointer-events-none"></div>
      {children}
    </div>
  );
};

export default OnePieceBackground;
