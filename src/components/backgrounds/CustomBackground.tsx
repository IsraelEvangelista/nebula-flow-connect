
import React from 'react';

interface CustomBackgroundProps {
  imageUrl: string;
}

const CustomBackground: React.FC<CustomBackgroundProps> = ({ imageUrl }) => {
  return (
    <div 
      className="custom-background absolute inset-0 z-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* Overlay to ensure text remains readable */}
      <div className="absolute inset-0 bg-black opacity-40" />
    </div>
  );
};

export default CustomBackground;
