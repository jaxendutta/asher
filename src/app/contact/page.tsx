import { jersey_10 } from '@/lib/fonts';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SOCIAL_LINKS } from '@/lib/constants';
import Link from 'next/dist/client/link';
import Bunnies from '@/components/pets/Bunnies';

export default function ContactPage() {
    return (
        <>
            <div className="page-enter z-40">
                <Section
                    title="Let's Connect"
                    subtitle="Let's collaborate on research or discuss opportunities"
                    centered
                >
                    <div className="max-w-4xl mx-auto">
                        {/* Main contact card */}
                        <div className="flex flex-wrap w-full justify-between items-center gap-2">
                            {Object.values(SOCIAL_LINKS).map((item) => (
                                <Link href={item.url} key={item.label} target="_blank" rel="noopener noreferrer">
                                    <Button variant="primary" className="w-full flex items-center justify-center gap-2 font-light px-4 py-1">
                                        <item.icon />
                                        <span className={`${jersey_10.className} text-xl md:text-2xl tracking-wide`}>{item.label}</span>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>

            <Bunnies />
        </>
    );
}
