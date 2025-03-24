
import React from 'react';

interface OnePieceBackgroundProps {
  children: React.ReactNode;
}

const OnePieceBackground: React.FC<OnePieceBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white w-full">
      {children}
    </div>
  );
};

export default OnePieceBackground;
