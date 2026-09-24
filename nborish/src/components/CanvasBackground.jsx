import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CanvasBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let w, h;
    let columns = [];
    let particles = [];
    const fontSize = 16;
    
    const isLight = theme === 'light';

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      
      if (isLight) {
        // Initialize subtle neural network particles for light mode
        particles = [];
        // Increased density
        const numParticles = Math.min(Math.floor(w * h / 6000), 200);
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 3 + 1.5 // Bigger nodes
          });
        }
      } else {
        // Initialize code rain for dark mode
        const numColumns = Math.floor(w / fontSize) + 1;
        columns = [];
        for (let i = 0; i < numColumns; i++) {
          columns[i] = Math.random() * -100;
        }
      }
    };

    const drawLightMode = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Removed the square grid lines as requested

      // Draw neural particles (increased visibility, bigger, denser)
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(3, 105, 161, 0.6)'; // slightly more visible
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nodes within a distance
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Stronger line opacity
            ctx.strokeStyle = `rgba(109, 40, 217, ${0.3 * (1 - dist / 130)})`;
            ctx.stroke();
          }
        }
      }
    };

    const drawDarkMode = () => {
      ctx.fillStyle = 'rgba(2, 4, 10, 0.15)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < columns.length; i++) {
        const charSet = "0101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%#_";
        const text = charSet[Math.floor(Math.random() * charSet.length)];
        
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        if (Math.random() > 0.95) {
          ctx.fillStyle = '#FFFFFF';
        } else {
          ctx.fillStyle = '#06B6D4'; 
        }

        ctx.fillText(text, x, y);

        if (y > h && Math.random() > 0.975) {
          columns[i] = 0;
        }
        columns[i]++;
      }
    };

    const draw = () => {
      if (isLight) drawLightMode();
      else drawDarkMode();
    };

    init();

    let lastTime = 0;
    const fps = isLight ? 60 : 30; // Smooth 60fps for network, 30fps for code rain
    const interval = 1000 / fps;
    
    const loop = (time) => {
      animationFrameId = requestAnimationFrame(loop);
      const deltaTime = time - lastTime;
      if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);
        draw();
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -3,
          backgroundColor: isLight ? '#FAFAFA' : '#02040A',
          pointerEvents: 'none'
        }}
      />
      
      {/* Light Mode subtle gradient blobs */}
      {isLight && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -2,
            background: `
              radial-gradient(circle at 15% 20%, rgba(3, 105, 161, 0.08), transparent 40%),
              radial-gradient(circle at 85% 80%, rgba(109, 40, 217, 0.08), transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.06), transparent 50%)
            `,
            pointerEvents: 'none'
          }}
        />
      )}

      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          pointerEvents: 'none',
          opacity: isLight ? 1 : 0.6
        }}
      />
      
      {/* Dark Mode vignette */}
      {!isLight && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 4, 10, 0.8) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
