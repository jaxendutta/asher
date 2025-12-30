'use client';

// ============================================================================
// Header Component
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { SITECONFIG } from '@/data/siteConfig';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed inset-0 top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Name */}
          <Link href="/">
            <Button className="group px-6 py-2 text-sm font-medium text-[#2D5F3F] bg-white/60 backdrop-blur-lg hover:bg-white/100 transition-colors flex items-center gap-2">
              <HiHome className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
              {SITECONFIG.name}
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center" ref={menuRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group pl-6 my-2 text-sm font-medium text-[#2D5F3F] bg-white/60 backdrop-blur-lg hover:bg-white/100 transition-colors flex items-center gap-2"
            >
              {NAV_ITEMS.find((item) => item.href === pathname)?.label || 'Menu'}
              <HiX className={`w-4 h-4 transition-transform ${isMenuOpen ? '' : 'rotate-45'}`} />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-2 w-48 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg transition-all duration-200 py-1 z-50">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block px-6 py-3 m-1 text-sm rounded-3xl font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/50 text-[#1A3A2A]'
                          : 'text-[#5C6B5C] hover:bg-white/40'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
