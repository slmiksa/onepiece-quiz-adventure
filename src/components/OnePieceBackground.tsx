
import React from 'react';

interface OnePieceBackgroundProps {
  children: React.ReactNode;
}

const OnePieceBackground: React.FC<OnePieceBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white relative">
      {children}
    </div>
  );
};

export default OnePieceBackground;
