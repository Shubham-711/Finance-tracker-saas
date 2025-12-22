import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowAlways?: boolean;
  shimmer?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className = '',
  hover = true,
  glow = false,
  glowAlways = false,
  shimmer = false,
  onClick,
}: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'backdrop-blur-xl border',
        'transition-all duration-300',
        hover && 'cursor-pointer',
        glow && 'glow-border',
        glowAlways && 'glow-border-always',
        shimmer && 'shimmer',
        className
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Gradient overlay on hover */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--glow-primary) / 0.05) 0%, transparent 70%)',
          }}
        />
      )}
      
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--glow-primary) / 0.03) 0%, transparent 50%, hsl(var(--glow-secondary) / 0.02) 100%)',
        }}
      />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Enhanced gradient card variant
export const GradientCard = ({
  children,
  className = '',
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}) => {
  const gradients = {
    default: 'from-glow-primary/10 via-transparent to-glow-secondary/5',
    primary: 'from-glow-primary/20 via-glow-primary/5 to-transparent',
    success: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    warning: 'from-amber-500/20 via-amber-500/5 to-transparent',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'backdrop-blur-xl border border-white/5',
        'bg-gradient-to-br',
        gradients[variant],
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
