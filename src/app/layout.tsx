import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { CatCursor } from '@/components/cat/CatCursor';
import { CatCompanion } from '@/components/cat/CatCompanion';
import { inter } from '@/lib/fonts';

const metadata: Metadata = {
  title: 'Asher Kim - Plant Biology Researcher',
  description: 'Biology student at the University of Waterloo specializing in plant biology, protein localization, and molecular mechanisms.',
  keywords: ['plant biology', 'research', 'University of Waterloo', 'protein localization', 'molecular biology'],
  authors: [{ name: 'Asher Kim' }],
  openGraph: {
    title: 'Asher Kim - Plant Biology Researcher',
    description: 'Biology student at the University of Waterloo specializing in plant biology research',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {/* Custom cat cursor */}
        <CatCursor />

        {/* Cat companion */}
        <CatCompanion position="right" />

        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="h-full flex flex-1 justify-center items-center">
          {children}
        </main>

        {/* Garden background effect */}
        <div className="garden-background" />
      </body>
    </html>
  );
}
