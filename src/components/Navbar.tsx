'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, User, LayoutDashboard, LogOut, Car, ChevronDown, Users, Calendar, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAdminDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (status === 'loading') {
    return <div className="h-16 bg-background/50 backdrop-blur-md border-b border-white/10" />;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Smart Park
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {isAdmin && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none"
                    >
                      Admin
                      <ChevronDown className={`h-4 w-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute top-full right-0 mt-4 w-48 rounded-xl border border-border bg-card shadow-2xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                        <Link href="/admin/users" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors font-medium">
                          <Users className="h-4 w-4 text-blue-500" /> Users
                        </Link>
                        <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors font-medium">
                          <Calendar className="h-4 w-4 text-green-500" /> Bookings
                        </Link>
                        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors font-medium">
                          <Settings className="h-4 w-4 text-purple-500" /> Settings
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="h-6 w-px bg-border" />

                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end hidden lg:flex">
                    <span className="text-sm font-medium leading-none">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{session.user.role}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <User className="h-4 w-4" />
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {mounted && (
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent transition-colors">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl absolute w-full left-0 animate-slide-up shadow-2xl">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 border-b border-border/40 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{session.user.role}</p>
                  </div>
                </div>
                
                <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md">
                  <LayoutDashboard className="h-5 w-5" /> Dashboard
                </Link>
                
                {isAdmin && (
                  <div className="pl-6 border-l-2 border-border ml-3 my-3 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin Tools</p>
                    <Link href="/admin/users" className="flex items-center gap-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"><Users className="h-4 w-4 text-blue-500" /> Users</Link>
                    <Link href="/admin/bookings" className="flex items-center gap-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"><Calendar className="h-4 w-4 text-green-500" /> Bookings</Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"><Settings className="h-4 w-4 text-purple-500" /> Settings</Link>
                  </div>
                )}
                
                <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 w-full text-left px-3 py-2.5 mt-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-md">
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link href="/auth/signin" className="flex items-center justify-center px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}