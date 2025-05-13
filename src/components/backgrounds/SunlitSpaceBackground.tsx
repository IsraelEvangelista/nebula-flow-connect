
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
      star.classList.add(`animate-twinkle-${Math.floor(Math.random() * 3) + 1}`);
      
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
      
      {/* Improved Sun glow - no more square edges */}
      <div 
        className="absolute rounded-full opacity-25"
        style={{
          width: '100%',
          height: '100%',
          top: '-40%',
          right: '-30%',
          background: 'radial-gradient(circle, rgba(255,196,133,0.6) 0%, rgba(248,177,92,0.2) 20%, transparent 70%)',
          boxShadow: '0 0 100px rgba(255,196,133,0.3), 0 0 200px rgba(248,177,92,0.2)',
          animation: 'sunPulse 8s infinite alternate'
        }}
      />
      
      {/* Light rays - improved gradient */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at 90% 0%, rgba(255,196,133,0.3) 0%, transparent 70%)',
          animation: 'lightRays 15s infinite alternate'
        }}
      />
      
      {/* Additional ambient light */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'linear-gradient(135deg, rgba(255,180,120,0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default SunlitSpaceBackground;
