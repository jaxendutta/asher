// ============================================================================
// Footer Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { HiMail } from 'react-icons/hi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      mail: <HiMail className="w-5 h-5" />,
      linkedin: <FaLinkedin className="w-5 h-5" />,
      github: <FaGithub className="w-5 h-5" />,
    };
    return icons[iconName] || null;
  };

  return (
    <footer className="bg-[#2D5F3F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Asher Kim</h3>
            <p className="text-[#B8D4BE] text-sm">
              Biology student at the University of Waterloo specializing in plant
              biology and protein localization research.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/research"
                  className="text-[#B8D4BE] hover:text-white transition-colors"
                >
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="text-[#B8D4BE] hover:text-white transition-colors"
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#B8D4BE] hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B8D4BE] hover:text-white transition-colors"
                  aria-label={link.label}
                >
                  {getIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-[#4A6741] text-center text-sm text-[#B8D4BE]">
          <p>
            © {currentYear} Asher Kim. Built with care in the research garden 🌿
          </p>
        </div>
      </div>
    </footer>
  );
}
