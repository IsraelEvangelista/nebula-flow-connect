
import React, { useEffect, useRef } from 'react';

interface StarBackgroundProps {
  starCount?: number;
}

const StarBackground: React.FC<StarBackgroundProps> = ({ starCount = 100 }) => {
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
      
      // Add animation
      const animationIndex = Math.floor(Math.random() * 3) + 1;
      star.classList.add(`twinkle-${animationIndex}`);
      
      // Add star to container
      container.appendChild(star);
    }
  }, [starCount]);

  return <div ref={containerRef} className="space-background absolute inset-0 z-0" />;
};

export default StarBackground;
