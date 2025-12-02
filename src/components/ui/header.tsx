"use client";

import ThemeSwitcher from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Menu, Settings, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type HeaderProps = {
  backTo?: string;
};

const Header = ({ backTo }: HeaderProps) => {
  const [isClient, setIsClient] = useState(false);
  const [historyLength, setHistoryLength] = useState(0);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setHistoryLength(window.history.length);
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 dark:border-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <div className="flex items-center w-12">
            {pathname !== "/" && ((isClient && historyLength > 1) || backTo) && (
              <button
                onClick={() => (backTo ? router.push(backTo) : router.back())}
                className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </button>
            )}
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                TanhaApp
              </span>
            </Link>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                  aria-expanded={menuOpen}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {(() => {
                      const name = (user as any)?.username || "U";
                      const parts = name.split(/\s+/).filter(Boolean);
                      const initials = parts.length === 1 ? parts[0].slice(0,2) : (parts[0][0] + parts[1][0]);
                      return initials.toUpperCase();
                    })()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {(user as any)?.username ?? 'User'}
                  </span>
                  <Menu className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-modern-lg border border-white/20 dark:border-gray-700/50 py-2 animate-in">
                    <div className="px-4 py-3 border-b border-white/10 dark:border-gray-700/50">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {(user as any)?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(user as any)?.email || 'No email'}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={async () => { setMenuOpen(false); await logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/login')}
                className="btn-hover"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;