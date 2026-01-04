import CatChat from '@/components/pets/CatChat';
import Ducks from '@/components/pets/Ducks';
import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <>
      <div className="justify-center items-center min-h-screen flex">
        <Hero />
      </div>
      <Ducks />
      <CatChat />
    </>
  );
}
