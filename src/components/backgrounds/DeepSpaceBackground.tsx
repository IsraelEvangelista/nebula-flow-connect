
import React, { useEffect, useRef } from 'react';

interface DeepSpaceBackgroundProps {
  starCount?: number;
}

const DeepSpaceBackground: React.FC<DeepSpaceBackgroundProps> = ({ starCount = 150 }) => {
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
      
      // Random animation delay
      const delay = Math.random() * 4;
      
      // Set star style
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationIterationCount = 'infinite'; // Ensure infinite animation
      
      // Add animation
      const animationIndex = Math.floor(Math.random() * 3) + 1;
      star.classList.add(`twinkle-${animationIndex}`);
      
      // Add star to container
      container.appendChild(star);
    }
    
    // Handle window resize to ensure stars are recreated
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
          const size = Math.random() * 1.5 + 0.5;
          const delay = Math.random() * 4;
          
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.left = `${x}px`;
          star.style.top = `${y}px`;
          star.style.animationDelay = `${delay}s`;
          star.style.animationIterationCount = 'infinite'; // Ensure infinite animation
          
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
      className="deep-space-background absolute inset-0 z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0B0B15 0%, #0F0F1A 50%, #131326 100%)',
      }}
    >
      {/* Deep space dust effects */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(16, 16, 40, 0.6) 0%, transparent 60%)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(20, 20, 50, 0.5) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default DeepSpaceBackground;
