import React, { useEffect, useRef } from 'react';

const BackgroundContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createLight = () => {
      const light = document.createElement('div');
      light.className = 'neon-light';
      
      // Random position within the container
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Random size between 100px and 300px
      const size = Math.random() * 200 + 100;
      
      // Random moody neon colors
      const colors = [
        'rgba(255, 0, 255, 0.15)',  // Neon pink
        'rgba(0, 255, 255, 0.15)',  // Neon cyan
        'rgba(255, 0, 128, 0.15)',  // Neon magenta
        'rgba(128, 0, 255, 0.15)',  // Neon purple
        'rgba(0, 128, 255, 0.15)',  // Neon blue
        'rgba(255, 128, 0, 0.15)',  // Neon orange
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      light.style.left = `${x}%`;
      light.style.top = `${y}%`;
      light.style.width = `${size}px`;
      light.style.height = `${size}px`;
      light.style.backgroundColor = color;
      
      // Random animation duration between 3s and 6s
      const duration = Math.random() * 3 + 3;
      light.style.animation = `pulse ${duration}s infinite`;
      
      container.appendChild(light);
      
      // Remove the light after animation completes
      setTimeout(() => {
        light.remove();
      }, duration * 1000);
    };

    // Create initial lights
    for (let i = 0; i < 5; i++) {
      createLight();
    }

    // Create new lights periodically
    const interval = setInterval(createLight, 2000);

    return () => {
      clearInterval(interval);
      // Clean up any remaining lights
      const lights = container.getElementsByClassName('neon-light');
      while (lights.length > 0) {
        lights[0].remove();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
      }}
    >
      <style>
        {`
          .neon-light {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }

          @keyframes pulse {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            50% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
          }
        `}
      </style>
      {children}
    </div>
  );
};

export default BackgroundContainer; 