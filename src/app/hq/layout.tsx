'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Command, 
  BarChart3, 
  Archive, 
  Target, 
  Radio,
  Menu,
  X,
  Clock,
  Calendar,
  ArrowLeft
} from 'lucide-react';

const navItems = [
  { href: '/hq', label: 'Dashboard', icon: Command },
  { href: '/hq/vault', label: 'Vault', icon: Archive },
  { href: '/hq/missions', label: 'Missions', icon: Target },
  { href: '/hq/intel', label: 'Intel', icon: Radio },
];

export default function HQLayout({
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: isDesktop ? 0 : -280 }}
          animate={{ x: (isDesktop || sidebarOpen) ? 0 : -280 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed inset-y-0 left-0 z-50 w-70 bg-[var(--bg-secondary)] border-r border-[var(--border)] ${isDesktop ? 'relative' : ''}`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-[var(--text-primary)]">
                    OBM COMMAND
                  </h1>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    CENTER
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <X size={20} />
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
                            ? 'bg-[var(--accent)] text-white shadow-lg'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
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
            <div className="p-4 border-t border-[var(--border)]">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to site
              </Link>
              <p className="text-xs text-[var(--text-muted)] mt-3 px-4">© 2025 Olsen Brands</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[var(--bg-secondary)] border-b border-[var(--border)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-3">
                <Command size={24} className="text-[var(--accent)]" />
                <h1 className="text-xl font-bold hidden sm:block">
                  OBM COMMAND CENTER
                </h1>
                <h1 className="text-lg font-bold sm:hidden">
                  OBM HQ
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Clock size={16} />
                <span className="font-mono">{time}</span>
                <span className="text-xs text-[var(--text-muted)]">MT</span>
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
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}
    </div>
  );
}