import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  BarChart3,
  Menu,
  X,
  LogOut,
  Wallet,
  // Settings removed from imports
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -300, opacity: 0 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          'fixed left-0 top-0 h-full w-72 z-50',
          'backdrop-blur-2xl border-r',
          'flex flex-col',
          'lg:translate-x-0 lg:opacity-100',
        )}
        style={{
          background: 'rgba(6, 7, 10, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Sidebar glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--glow-primary) / 0.03) 0%, transparent 30%)',
          }}
        />

        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/5 relative">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center relative overflow-hidden">
              <Wallet className="w-5 h-5 text-white relative z-10" />
              <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">FinanceX</span>
          </motion.div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
{navItems.map((item) => {
  const isActive = location.pathname === item.path;
  return (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={() => window.innerWidth < 1024 && onToggle()}
      className="relative block"
    >
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          // 1. ADD 'relative' and 'overflow-hidden' HERE 👇
          'relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200',
          'text-muted-foreground hover:text-foreground',
          isActive 
            ? 'text-foreground' 
            : 'hover:bg-white/5'
        )}
        style={isActive ? {
          background: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
          border: '1px solid',
        } : {}}
      >
        <item.icon
          className={cn(
            'w-5 h-5 transition-colors',
            isActive && 'text-primary'
          )}
        />
        <span className={cn(
          'font-medium',
          isActive && 'gradient-text'
        )}>
          {item.label}
        </span>
        
      {/* Active indicator */}
{isActive && (
  <motion.div
    layoutId="activeTab"
    className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full gradient-bg"
    transition={{ duration: 0.3 }}
  />
)}
      </motion.div>
    </NavLink>
  );
})}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-1.5 border-t border-white/5">
          {/* Settings link removed */}
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};

export const SidebarTrigger = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 rounded-xl border backdrop-blur-xl "
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      <Menu className="w-5 h-5 text-white" />
    </motion.button>
  );
};