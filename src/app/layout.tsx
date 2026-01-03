import './globals.css';
import { Header } from '@/components/layout/Header';
import { inter } from '@/lib/fonts';
import { Metadata } from 'next';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Asher Kim',
  description: 'Portfolio of Asher Kim, specializing in plant biology and molecular research.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    title: 'Asher Kim',
    description: 'Portfolio of Asher Kim, specializing in plant biology and molecular research.',
    url: 'https://asherk.vercel.app',
    siteName: 'Asher Kim',
    images: [
      {
        url: '/images/og.png',
        alt: 'Asher Kim',
      },
    ],
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
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="z-10 h-full max-w-7xl mx-auto pt-20 pb-10 px-3 md:px-6 lg:px-6 flex flex-1 justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
