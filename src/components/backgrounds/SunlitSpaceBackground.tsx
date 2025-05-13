
import { useEffect, useRef } from 'react';

const SunlitSpaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full size
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Star generation
    const stars: { x: number, y: number, size: number, speed: number, opacity: number }[] = [];
    const sunRadius = Math.min(canvas.width, canvas.height) / 4;
    const sunX = canvas.width * 0.85;
    const sunY = canvas.height * 0.15;

    // Create a gradient for the background
    const createBackground = () => {
      const gradient = ctx.createRadialGradient(
        sunX, sunY, 0,
        sunX, sunY, canvas.width * 1.2
      );
      
      gradient.addColorStop(0, 'rgba(255, 183, 77, 0.7)');
      gradient.addColorStop(0.2, 'rgba(255, 125, 77, 0.5)');
      gradient.addColorStop(0.4, 'rgba(121, 40, 202, 0.3)');
      gradient.addColorStop(0.6, 'rgba(30, 30, 70, 0.8)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Create stars
    const createStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 1000);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.05 + 0.01,
          opacity: Math.random()
        });
      }
    };

    // Draw sun with smooth glow
    const drawSun = () => {
      // Large outer glow
      const outerGlow = ctx.createRadialGradient(
        sunX, sunY, 0,
        sunX, sunY, sunRadius * 3
      );
      
      outerGlow.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
      outerGlow.addColorStop(0.5, 'rgba(255, 150, 50, 0.1)');
      outerGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Main sun glow
      const sunGlow = ctx.createRadialGradient(
        sunX, sunY, 0,
        sunX, sunY, sunRadius
      );
      
      sunGlow.addColorStop(0, 'rgba(255, 255, 200, 1)');
      sunGlow.addColorStop(0.8, 'rgba(255, 180, 50, 0.8)');
      sunGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner bright core
      const sunCore = ctx.createRadialGradient(
        sunX, sunY, 0,
        sunX, sunY, sunRadius * 0.5
      );
      
      sunCore.addColorStop(0, 'rgba(255, 255, 255, 1)');
      sunCore.addColorStop(1, 'rgba(255, 200, 100, 0)');
      
      ctx.fillStyle = sunCore;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw stars
    const drawStars = () => {
      stars.forEach(star => {
        // Don't draw stars too close to the sun
        const distToSun = Math.sqrt(Math.pow(star.x - sunX, 2) + Math.pow(star.y - sunY, 2));
        if (distToSun < sunRadius * 1.5) return;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Update star positions
    const updateStars = () => {
      stars.forEach(star => {
        star.y += star.speed;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      createBackground();
      drawSun();
      drawStars();
      updateStars();
      
      requestAnimationFrame(animate);
    };

    createStars();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default SunlitSpaceBackground;
