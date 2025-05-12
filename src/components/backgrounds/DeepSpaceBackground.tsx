
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
      className="deep-space-background absolute inset-0 z-0 bg-gradient-to-b from-nebula-dark to-[#090b1a]"
    />
  );
};

export default DeepSpaceBackground;
