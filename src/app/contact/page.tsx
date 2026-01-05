import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
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
                                    <Button variant="primary" className="w-full flex gap-1 items-center justify-center gap-2 font-light" >
                                        <item.icon />
                                        {item.label}
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
