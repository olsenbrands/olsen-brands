'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  Lightbulb,
  Menu,
  X,
  Clock,
  Calendar,
  ArrowLeft
} from 'lucide-react';

const navItems = [
  { href: '/operation-little-wiggles', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/operation-little-wiggles/missions', label: 'Missions', icon: Target },
  { href: '/operation-little-wiggles/brainstorm', label: 'Brainstorm', icon: Lightbulb },
];

// Victory Peptides theme - light theme with teal/red accents
const victoryTheme = {
  '--olw-bg-primary': '#f4fafb',
  '--olw-bg-secondary': '#ffffff',
  '--olw-bg-tertiary': '#e8f4f6',
  '--olw-text-primary': '#17272b',
  '--olw-text-secondary': '#5c6a6d',
  '--olw-text-muted': '#8a9a9d',
  '--olw-accent': '#ff0000',
  '--olw-accent-hover': '#cc0000',
  '--olw-accent-teal': '#2bbede',
  '--olw-border': '#d1e3e6',
  '--olw-border-hover': '#b8d4d8',
} as React.CSSProperties;

export default function OLWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Denver',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
      timeZone: 'America/Denver',
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    return { time: timeString, date: dateString };
  };

  const { time, date } = getCurrentDateTime();

  return (
    <div 
      style={victoryTheme}
      className="min-h-screen flex"
      data-theme="victory"
    >
      <style jsx global>{`
        [data-theme="victory"] {
          background: var(--olw-bg-primary);
          color: var(--olw-text-primary);
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: isDesktop ? 0 : -280 }}
          animate={{ x: (isDesktop || sidebarOpen) ? 0 : -280 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed inset-y-0 left-0 z-50 w-70 bg-white border-r shadow-sm ${isDesktop ? 'relative' : ''}`}
          style={{ borderColor: 'var(--olw-border)' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--olw-border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--olw-text-primary)' }}>
                    <span>🐛</span>
                    <span>OPERATION</span>
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--olw-text-muted)' }}>
                    LITTLE WIGGLES
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <X size={20} style={{ color: 'var(--olw-text-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'text-white shadow-lg'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: isActive ? 'var(--olw-accent)' : undefined,
                          color: isActive ? 'white' : 'var(--olw-text-secondary)',
                        }}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--olw-border)' }}>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors hover:bg-gray-50"
                style={{ color: 'var(--olw-text-muted)' }}
              >
                <ArrowLeft size={16} />
                Back to OBM
              </Link>
              <p className="text-xs mt-3 px-4" style={{ color: 'var(--olw-text-muted)' }}>
                © 2026 Victory Project
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ background: 'var(--olw-bg-primary)' }}>
        {/* Top Bar */}
        <header 
          className="bg-white border-b p-4 shadow-sm"
          style={{ borderColor: 'var(--olw-border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <Menu size={20} style={{ color: 'var(--olw-text-secondary)' }} />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐛</span>
                <h1 className="text-xl font-bold hidden sm:block" style={{ color: 'var(--olw-text-primary)' }}>
                  OPERATION LITTLE WIGGLES
                </h1>
                <h1 className="text-lg font-bold sm:hidden" style={{ color: 'var(--olw-text-primary)' }}>
                  OLW
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2" style={{ color: 'var(--olw-text-secondary)' }}>
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--olw-text-primary)' }}>
                <Clock size={16} />
                <span className="font-mono">{time}</span>
                <span className="text-xs" style={{ color: 'var(--olw-text-muted)' }}>MT</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
        />
      )}
    </div>
  );
}
