import { Inter, Fleur_De_Leah, Newsreader } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
export const fleur_de_leah = Fleur_De_Leah({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});
export const newsreader = Newsreader({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
});
