
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
      
      // Add animation with infinite duration
      const animationIndex = Math.floor(Math.random() * 3) + 1;
      star.classList.add(`animate-twinkle-${animationIndex}`);
      
      // Add star to container
      container.appendChild(star);
    }

    // Handle resize to prevent stars from stopping on window resize
    const handleResize = () => {
      // Recreate stars when window is resized
      if (container) {
        const stars = container.querySelectorAll('.star');
        if (stars.length < starCount) {
          // Only recreate if stars are missing
          stars.forEach(star => star.remove());
          
          // Call the effect again
          const newContainerWidth = container.clientWidth;
          const newContainerHeight = container.clientHeight;
          
          for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const x = Math.random() * newContainerWidth;
            const y = Math.random() * newContainerHeight;
            const size = Math.random() * 1.5 + 0.5;
            const delay = Math.random() * 4;
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            star.style.animationDelay = `${delay}s`;
            
            const animationIndex = Math.floor(Math.random() * 3) + 1;
            star.classList.add(`animate-twinkle-${animationIndex}`);
            
            container.appendChild(star);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount]);

  return <div ref={containerRef} className="space-background absolute inset-0 z-0" />;
};

export default StarBackground;
