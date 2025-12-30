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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="z-10 h-full max-w-7xl mx-auto  my-20 px-3 md:px-6 lg:px-6 flex flex-1 justify-center items-center">
          {children}
        </main>

        {/* Grass Tile Overlay */}
        <div className="fixed inset-0 pointer-events-none bg-[url('/images/tilesets/grass_tile.jpg')] bg-repeat bg-[length:300px_180px] brightness-100 z--10" style={{
          top: 'calc(-1 * env(safe-area-inset-top))',
          bottom: 'calc(-1 * env(safe-area-inset-bottom))',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }} />
      </body>
    </html>
  );
}
