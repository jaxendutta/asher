'use client';

// ============================================================================
// Header Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiMenu, HiX } from 'react-icons/hi';
import { fleur_de_leah } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { SITECONFIG } from '@/data/siteConfig';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
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
          <div className="items-center">
            <div className="relative group space-y-1">
              <Button className="group px-6 py-2 text-sm font-medium text-[#2D5F3F] bg-white/60 backdrop-blur-lg hover:bg-white/100 transition-colors flex items-center gap-2">
                {NAV_ITEMS.find((item) => item.href === pathname)?.label || 'Menu'}
                <HiX className="w-4 h-4 rotate-45" />
              </Button>

              <div className="absolute right-0 w-48 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
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
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
