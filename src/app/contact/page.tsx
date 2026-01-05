import { jersey_10 } from '@/lib/fonts';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SOCIAL_LINKS } from '@/data/siteConfig';
import Link from 'next/dist/client/link';
import Bunnies from '@/components/pets/Bunnies';

export default function ContactPage() {
    return (
        <>
            <div className="page-enter z-40 pt-30 pb-10">
                <div className={`flex flex-col gap-3 mb-8 text-center bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl pt-8 p-4 border-2 border-[#B8D4BE]`}>
                    <span className={`${jersey_10.className} text-5xl md:text-6xl text-[#1A3A2A] tracking-wide leading-[0.75]`}>
                        Let's Connect!
                    </span>

                    <div className="flex flex-wrap w-full items-center justify-center gap-2">
                        {Object.values(SOCIAL_LINKS).map((item) => (
                            <Link href={item.url} key={item.label} target="_blank" rel="noopener noreferrer">
                                <Button variant="primary" className="w-full flex gap-2 px-4 py-1">
                                    <item.icon />
                                    <span className={`${jersey_10.className} text-lg md:text-2xl tracking-wide`}>{item.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Bunnies />
        </>
    );
}
