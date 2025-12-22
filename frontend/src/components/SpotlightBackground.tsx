import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightBackgroundProps {
  children: ReactNode;
  className?: string;
  showOrbs?: boolean;
  showGrid?: boolean;
}

export const SpotlightBackground = ({
  children,
  className,
  showOrbs = true,
  showGrid = false,
}: SpotlightBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn('relative min-h-screen overflow-hidden', className)}
      style={{ backgroundColor: '#06070A' }}
    >
      {/* Ambient gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--glow-primary) / 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--glow-secondary) / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 0% 80%, hsl(var(--glow-cyan) / 0.06) 0%, transparent 50%),
            linear-gradient(180deg, #06070A 0%, #0A0D18 100%)
          `,
        }}
      />

      {/* Mouse spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(
            ellipse 600px 400px at var(--mouse-x, 50%) var(--mouse-y, 50%),
            hsl(var(--glow-primary) / 0.06) 0%,
            transparent 60%
          )`,
        }}
      />

      {/* Floating orbs */}
      {showOrbs && (
        <>
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: 'hsl(var(--glow-primary) / 0.15)',
              filter: 'blur(120px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 30, -40, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'hsl(var(--glow-secondary) / 0.12)',
              filter: 'blur(100px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, 20, -30, 0],
              y: [0, -20, 40, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background: 'hsl(var(--glow-cyan) / 0.08)',
              filter: 'blur(80px)',
            }}
          />
        </>
      )}

      {/* Grid pattern */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Cinematic hero background for auth pages
export const CinematicBackground = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#06070A' }}>
      {/* Large gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--glow-primary) / 0.2) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--glow-secondary) / 0.15) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--glow-cyan) / 0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating light particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
            background: `hsl(var(--glow-${i % 2 === 0 ? 'primary' : 'secondary'}) / 0.5)`,
            filter: 'blur(2px)',
            boxShadow: `0 0 20px hsl(var(--glow-${i % 2 === 0 ? 'primary' : 'secondary'}) / 0.5)`,
          }}
        />
      ))}

      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(6, 7, 10, 0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};
