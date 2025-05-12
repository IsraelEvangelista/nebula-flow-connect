
import React, { useEffect, useRef } from 'react';

interface NebulaBackgroundProps {
  starCount?: number;
}

const NebulaBackground: React.FC<NebulaBackgroundProps> = ({ starCount = 150 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Clear existing stars
    container.querySelectorAll('.star').forEach(star => star.remove());
    
    // Create new stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Random position
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      
      // Random size (0.5px to 2px)
      const size = Math.random() * 1.5 + 0.5;
      
      // Set star style
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      
      // Add animation
      const animationClass = `animate-twinkle-${Math.floor(Math.random() * 3) + 1}`;
      star.classList.add(animationClass);
      
      // Add star to container
      container.appendChild(star);
    }
  }, [starCount]);

  return (
    <div 
      ref={containerRef} 
      className="nebula-background absolute inset-0 z-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(11, 10, 35, 0.8) 0%, rgb(27, 14, 59) 33%, rgb(37, 13, 76) 66%, rgba(17, 7, 36, 0.8) 100%)',
        boxShadow: 'inset 0 0 100px rgba(138, 101, 223, 0.3), inset 0 0 200px rgba(91, 157, 241, 0.2)'
      }}
    >
      {/* Nebula clouds */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>\')',
          backgroundSize: 'cover',
          mixBlendMode: 'soft-light',
          animation: 'nebulaPulse 15s infinite alternate'
        }}
      />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(138, 101, 223, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(91, 157, 241, 0.4) 0%, transparent 40%)',
          animation: 'nebulaMove 30s infinite alternate'
        }}
      />
    </div>
  );
};

export default NebulaBackground;
