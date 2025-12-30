import './globals.css';
import { Header } from '@/components/layout/Header';
import { inter } from '@/lib/fonts';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} style={{
      backgroundImage: "url('/images/tilesets/grass_tile.jpg')",
      backgroundRepeat: 'repeat',
      backgroundSize: '300px 180px'
    }}>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="z-10 h-full max-w-7xl mx-auto my-20 px-3 md:px-6 lg:px-6 flex flex-1 justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
