
import React, { useEffect, useRef } from 'react';

interface SunlitSpaceBackgroundProps {
  starCount?: number;
}

const SunlitSpaceBackground: React.FC<SunlitSpaceBackgroundProps> = ({ starCount = 120 }) => {
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
      
      // Less visible stars because of sunlight
      star.style.opacity = `${0.4 + Math.random() * 0.6}`;
      
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
      className="sunlit-space-background absolute inset-0 z-0"
    >
      {/* Primary dark space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1425] to-[#0e0e1e]" />
      
      {/* Sun glow in the corner */}
      <div 
        className="absolute opacity-25"
        style={{
          width: '70%',
          height: '70%',
          top: '-15%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(255,196,133,0.8) 0%, rgba(248,177,92,0.3) 30%, transparent 70%)',
          boxShadow: '0 0 100px rgba(255,196,133,0.5), 0 0 200px rgba(248,177,92,0.3)',
          animation: 'sunPulse 8s infinite alternate'
        }}
      />
      
      {/* Light rays */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, rgba(255,196,133,0.4) 0%, transparent 50%)',
          animation: 'lightRays 15s infinite alternate'
        }}
      />
    </div>
  );
};

export default SunlitSpaceBackground;
