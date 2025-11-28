"use client";

import ThemeSwitcher from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Menu, Settings, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HeaderProps = { backTo?: string };

const Header = ({ backTo }: HeaderProps) => {
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-1/3">
            {isClient && pathname !== "/" && (
              <Button variant="secondary" size="sm" onClick={() => (backTo ? router.push(backTo) : router.back())}>
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            )}
          </div>

          <div className="flex items-center justify-center w-1/3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-zinc-900 dark:text-white group-hover:text-gradient transition-colors">
                TanhaApp
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-3 w-1/3">
            <ThemeSwitcher />
            
            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                    {((user as any)?.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-zinc-900 dark:text-white">{(user as any)?.username ?? 'User'}</span>
                  <Menu className="w-4 h-4 text-zinc-500" />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 glass-effect rounded-2xl soft-shadow py-2"
                    >
                      <div className="px-4 py-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{(user as any)?.username}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{(user as any)?.email || 'No email'}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50">
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <button onClick={async () => { setMenuOpen(false); await logout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button size="sm" onClick={() => router.push('/login')}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;