"use client";

import ThemeSwitcher from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LanguageSwitcher, { HeaderLanguageSwitcher } from '../LanguageSwitcher';

// آیکون‌ها را با dynamic import بارگیری کن
const ArrowRight = dynamic(() => import('lucide-react').then(mod => mod.ArrowRight), {
  ssr: false,
  loading: () => <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
});
const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu), {
  ssr: false,
  loading: () => <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
});
const Settings = dynamic(() => import('lucide-react').then(mod => mod.Settings), { ssr: false });
const User = dynamic(() => import('lucide-react').then(mod => mod.User), { ssr: false });
const LogOut = dynamic(() => import('lucide-react').then(mod => mod.LogOut), { ssr: false });
const ChevronDown = dynamic(() => import('lucide-react').then(mod => mod.ChevronDown), { ssr: false });
const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false });

type HeaderProps = {
  backTo?: string;
};

const Header = ({ backTo }: HeaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const links = [
    {
      href: "/cal",
      label: "ماشین حساب",
      color: "from-blue-500 to-blue-700",
      icon: "🧮",
      category: "ابزار",
      popular: true
    },
    {
      href: "/messenger",
      label: "انتقال متن",
      color: "from-teal-500 to-teal-700",
      icon: "💬",
      category: "ارتباطات"
    },
    {
      href: "/todo",
      label: "لیست کارها",
      color: "from-amber-500 to-orange-600",
      icon: "✅",
      category: "ارتباطات",
      popular: true
    },
    {
      href: "/notes",
      label: "یادداشت‌ها",
      color: "from-purple-500 to-indigo-600",
      icon: "📝",
      category: "ارتباطات"
    },
    {
      href: "/Prices-table",
      label: "قیمت لحظه‌ای طلا و ارز",
      color: "from-green-500 to-emerald-600",
      icon: "📊",
      category: "مالی",
      new: true
    },
  ];

  // فقط روی کلاینت mount شو
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // بررسی آیا می‌توانیم back کنیم
  useEffect(() => {
    if (!isMounted) return;

    // روش مطمئن‌تر برای بررسی قابلیت back
    const hasHistory = window.history.length > 1;

    // لیست صفحاتی که دکمه back نباید نشان داده شود
    const noBackPages = ['/', '/login', '/register'];
    const isNoBackPage = noBackPages.includes(pathname);

    // اگر backTo داریم یا می‌توانیم back کنیم و صفحه‌ای نیستیم که نباید back داشته باشد
    const shouldShowBack = !!(backTo || hasHistory) && !isNoBackPage;

    setCanGoBack(shouldShowBack);
  }, [pathname, backTo, isMounted]);

  // Handle click outside for desktop menu
  useEffect(() => {
    if (!menuOpen || !isMounted) return;

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
  }, [menuOpen, isMounted]);

  // Handle click outside for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen || !isMounted) return;

    function handleMobileClick(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    function handleMobileEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }

    document.addEventListener("mousedown", handleMobileClick);
    document.addEventListener("keydown", handleMobileEscape);

    return () => {
      document.removeEventListener("mousedown", handleMobileClick);
      document.removeEventListener("keydown", handleMobileEscape);
    };
  }, [mobileMenuOpen, isMounted]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!isMounted) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, isMounted]);

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
  };

  // اگر روی سرور هستیم، loading نمایش بده
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 flex items-center">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-40 h-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
            </div>
            <div className="flex-1 flex justify-end items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
              <div className="w-20 h-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded hidden lg:block" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Mobile menu component
  const MobileMenu = () => (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Menu panel */}
      <div
        ref={mobileMenuRef}
        className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl"
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white text-lg">T</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Tanha App</h2>
                {user && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(user as any)?.username || 'User'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 space-y-4">
              {/* Navigation links */}
              <nav className="space-y-1">
                {
                  links.map(l => (
                    <Link
                      href={l.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400">{l.icon}</span>
                      </div>
                      <span className="font-medium">{l.label}</span>
                    </Link>
                  ))
                }
                

                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">پروفایل</span>
                    </Link>


                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">تم</span>
              <ThemeSwitcher />
            </div>
            <div className="">
              <HeaderLanguageSwitcher />
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">خروج</span>
              </button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = '/login';
                }}
                className="w-full"
              >
                ورود / ثبت‌نام
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        dir='rtl'
        className="fixed conta top-0 left-0 w-full z-40 backdrop-blur from-slate-100 via-slate-200 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 "
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left section - 1/3 عرض */}
            <div className="flex-1 flex items-center justify-start min-w-0">
              <div className="flex items-center gap-3">
                {/* Mobile menu button - Hidden on desktop */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  aria-label="Open menu"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Back button - منطق بهبود یافته */}
                {canGoBack ? (
                  <button
                    onClick={handleBack}
                    aria-label="Back"
                    className="hidden  p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition lg:flex items-center justify-center min-w-11 min-h-11" // اندازه مینیموم برای accessibility
                    type="button"
                  >
                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </button>
                ) : (
                  <div className="w-11 h-11 lg:w-10 lg:h-10 flex items-center justify-center">
                    {/* فضای خالی برای حفظ تراز */}
                  </div>
                )}
              </div>
            </div>

            {/* Center section - 1/3 عرض */}
            <div className="flex-1 flex justify-center items-center min-w-0">
              <Link href="/" className="flex items-center justify-center select-none">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                  <div className="relative px-3 py-1.5 lg:px-4 lg:py-2 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                    <span className="font-bold text-lg lg:text-xl text-white tracking-tight whitespace-nowrap">
                      Tanha App
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right section - 1/3 عرض */}
            <div className="flex-1 flex justify-end items-center min-w-0">
              <div className="flex items-center gap-2">
                {/* Language switcher - Hidden on mobile */}
                <div className="hidden lg:block">
                  <LanguageSwitcher variant="dropdown" size="sm" showNames={false} />
                </div>

                {/* Theme switcher */}
                <div className="hidden sm:block">
                  <ThemeSwitcher />
                </div>

                {/* User menu / Login button */}
                {user ? (
                  <>
                    {/* دسکتاپ */}
                    <div className="relative hidden lg:block" ref={menuRef}>
                      <button
                        onClick={() => setMenuOpen((s) => !s)}
                        aria-haspopup
                        aria-expanded={menuOpen}
                        className="flex items-center gap-2 py-1.5 px-3 rounded-full transition hover:bg-blue-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow">
                          {(() => {
                            const name = (user as any)?.username || "U";
                            const parts = name.split(/\s+/).filter(Boolean);
                            const initials = parts.length === 1
                              ? parts[0].slice(0, 2)
                              : (parts[0][0] + parts[1][0]);
                            return initials.toUpperCase();
                          })()}
                        </div>
                        <span className="hidden md:inline text-gray-900 dark:text-gray-100 font-medium">
                          {(user as any)?.username || 'User'}
                        </span>
                        <ChevronDown className={`ml-1 text-blue-500 dark:text-gray-300 transition-transform ${menuOpen ? 'rotate-180' : ''}`} size={18} />
                      </button>

                      {menuOpen && (
                        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-800 py-2">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                            <p className="font-medium text-gray-900 dark:text-white">{(user as any)?.username}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{(user as any)?.email || 'کاربر'}</p>
                          </div>
                          <ul className="py-2 space-y-1">
                            <li>
                              <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-800 transition rounded-lg mx-2"
                                onClick={() => setMenuOpen(false)}
                              >
                                <User size={18} />
                                <span>پروفایل</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/settings"
                                className="flex items-center gap-2 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-800 transition rounded-lg mx-2"
                                onClick={() => setMenuOpen(false)}
                              >
                                <Settings size={18} />
                                <span>تنظیمات</span>
                              </Link>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                              <button
                                onClick={handleLogout}
                                className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition rounded-lg mx-2"
                              >
                                <LogOut size={18} />
                                <span>خروج</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* موبایل */}
                    <div className="lg:hidden flex items-center">
                      <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow">
                        {(() => {
                          const name = (user as any)?.username || "U";
                          const parts = name.split(/\s+/).filter(Boolean);
                          const initials = parts.length === 1
                            ? parts[0].slice(0, 1)
                            : parts[0][0];
                          return initials.toUpperCase();
                        })()}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* دسکتاپ */}
                    <div className="hidden lg:flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push('/register')}
                        size="sm"
                        className="px-3 py-1.5 text-sm"
                      >
                        ثبت‌نام
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => router.push('/login')}
                        size="sm"
                        className="px-3 py-1.5 text-sm"
                      >
                        ورود
                      </Button>
                    </div>

                    {/* موبایل */}

                  </>
                )}

                {/* Mobile theme switcher */}
                <div className="sm:hidden">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <MobileMenu />}
    </>
  );
};

export default Header;