import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plant } from '@/components/garden/Plant';
import { SOCIAL_LINKS } from '@/lib/constants';
import Link from 'next/dist/client/link';

export default function ContactPage() {
    return (
        <div className="page-enter">
            <Section
                title="Get in Touch"
                subtitle="Let's collaborate on research or discuss opportunities"
                centered
            >
                <div className="max-w-4xl mx-auto">
                    {/* Main contact card */}
                    <Card variant="elevated" className="mb-12 bg-gradient-to-br from-white to-[#F4EBD0]/30">
                        <CardHeader>
                            <div className="text-center">
                                <div className="text-6xl mb-4">🌿</div>
                                <h3 className="text-2xl font-bold text-[#1A3A2A] mb-2">
                                    Let&apos;s Connect
                                </h3>
                                <p className="text-[#5C6B5C]">
                                    I&apos;m always open to discussing research collaborations,
                                    academic opportunities, or science outreach initiatives.
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap justify-center items-center gap-2">
                                {Object.values(SOCIAL_LINKS).map((item) => (
                                    <Link href={item.url} key={item.label} target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" className="w-full flex gap-1 items-center justify-center gap-2 font-light" >
                                            <item.icon />
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
