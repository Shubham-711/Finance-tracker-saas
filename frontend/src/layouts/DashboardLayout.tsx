import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import {Sidebar} from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { initLenis, destroyLenis } from '@/utils/lenis';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  // Mouse spotlight effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      container.style.setProperty('--mouse-x', `${x}%`);
      container.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#06070A' }}
    >
      {/* Ambient background gradients */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--glow-primary) / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--glow-secondary) / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 0% 80%, hsl(var(--glow-cyan) / 0.04) 0%, transparent 50%)
          `,
        }}
      />

      {/* Mouse-following spotlight */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            ellipse 800px 600px at var(--mouse-x, 50%) var(--mouse-y, 50%),
            hsl(var(--glow-primary) / 0.04) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* Floating orbs - subtle */}
      <div 
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse"
        style={{
          background: 'hsl(var(--glow-primary) / 0.08)',
          filter: 'blur(150px)',
          animationDuration: '8s',
        }}
      />
      <div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none animate-pulse"
        style={{
          background: 'hsl(var(--glow-secondary) / 0.06)',
          filter: 'blur(120px)',
          animationDuration: '10s',
          animationDelay: '2s',
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={sidebarOpen ? "lg:pl-72 relative z-10" : "relative z-10 lg:pl-0"}>
       <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="p-4 lg:p-8 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
