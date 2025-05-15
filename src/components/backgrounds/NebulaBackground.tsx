
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
      
      // Random size (0.5px to 3px)
      const size = Math.random() * 2.5 + 0.5;
      
      // Add variation in brightness
      const brightness = Math.random() * 0.5 + 0.5; // 50% to 100% brightness
      
      // Random animation delay
      const delay = Math.random() * 5;
      
      // Set star style
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.opacity = `${brightness}`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationIterationCount = 'infinite'; // Ensure infinite animation
      
      // Create a small subset of extra bright stars
      if (Math.random() < 0.1) {
        star.style.boxShadow = `0 0 ${Math.random() * 3 + 2}px rgba(255, 255, 255, 0.8)`;
      }
      
      // Add animation
      const animationIndex = Math.floor(Math.random() * 3) + 1;
      star.classList.add(`twinkle-${animationIndex}`);
      
      // Add star to container
      container.appendChild(star);
    }

    // Handle window resize
    const handleResize = () => {
      if (container) {
        // Remove existing stars
        container.querySelectorAll('.star').forEach(star => star.remove());
        
        // Get new container dimensions
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        // Recreate stars with new dimensions
        for (let i = 0; i < starCount; i++) {
          const star = document.createElement('div');
          star.classList.add('star');
          
          const x = Math.random() * newWidth;
          const y = Math.random() * newHeight;
          const size = Math.random() * 2.5 + 0.5;
          const brightness = Math.random() * 0.5 + 0.5;
          const delay = Math.random() * 5;
          
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.left = `${x}px`;
          star.style.top = `${y}px`;
          star.style.opacity = `${brightness}`;
          star.style.animationDelay = `${delay}s`;
          star.style.animationIterationCount = 'infinite'; // Ensure infinite animation
          
          if (Math.random() < 0.1) {
            star.style.boxShadow = `0 0 ${Math.random() * 3 + 2}px rgba(255, 255, 255, 0.8)`;
          }
          
          const animationIndex = Math.floor(Math.random() * 3) + 1;
          star.classList.add(`twinkle-${animationIndex}`);
          
          container.appendChild(star);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount]);

  return (
    <div 
      ref={containerRef} 
      className="nebula-background absolute inset-0 z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(11, 10, 35, 0.8) 0%, rgb(27, 14, 59) 33%, rgb(37, 13, 76) 66%, rgba(17, 7, 36, 0.8) 100%)',
        boxShadow: 'inset 0 0 100px rgba(138, 101, 223, 0.3), inset 0 0 200px rgba(91, 157, 241, 0.2)'
      }}
    >
      {/* Nebula clouds - primeira camada */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>\')',
          backgroundSize: 'cover',
          mixBlendMode: 'soft-light',
          animation: 'nebulaPulse 15s infinite alternate'
        }}
      />
      
      {/* Segunda camada de nebulosa - mais colorida */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(138, 101, 223, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(91, 157, 241, 0.4) 0%, transparent 40%)',
          animation: 'nebulaMove 30s infinite alternate'
        }}
      />
      
      {/* Terceira camada - detalhes adicionais */}
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 45% 45%, rgba(255, 130, 220, 0.15) 0%, transparent 35%), radial-gradient(circle at 60% 60%, rgba(130, 180, 255, 0.15) 0%, transparent 35%)',
          animation: 'nebulaMove 25s infinite alternate-reverse'
        }}
      />
      
      {/* Camada extra para mais profundidade */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(91, 157, 241, 0.2) 0%, transparent 70%)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
};

export default NebulaBackground;
