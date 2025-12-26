import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BloomOnHover } from '@/components/interactive/BloomOnHover';
import { Plant } from '@/components/garden/Plant';
import { HiMail } from 'react-icons/hi';
import { FaLinkedin } from 'react-icons/fa';
import { SOCIAL_LINKS } from '@/lib/constants';
import { it } from 'node:test';
import Link from 'next/dist/client/link';

export default function ContactPage() {
    return (
        <div className="page-enter min-h-screen">
            <Section
                title="Get in Touch"
                subtitle="Let's collaborate on research or discuss opportunities"
                centered
            >
                <div className="max-w-4xl mx-auto">
                    {/* Main contact card */}
                    <BloomOnHover>
                        <Card variant="elevated" className="mb-12 bg-gradient-to-br from-white to-[#F4EBD0]/30">
                            <CardHeader>
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🌿</div>
                                    <h3 className="text-2xl font-bold text-[#1A3A2A] mb-2">
                                        Let's Connect
                                    </h3>
                                    <p className="text-[#5C6B5C]">
                                        I'm always open to discussing research collaborations,
                                        academic opportunities, or science outreach initiatives.
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center gap-4">
                                    {Object.values(SOCIAL_LINKS).map((item) => (
                                        <Link href={item.url} key={item.id}>
                                            <a target="_blank" rel="noopener noreferrer" className="w-full max-w-md">
                                                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                                                    <item.icon className="w-5 h-5 mr-2" />
                                                    {item.label}
                                                </Button>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </BloomOnHover>

                    {/* Additional info cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <BloomOnHover delay={100}>
                            <Card variant="bordered" className="h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Plant type="flower" size="sm" animated={false} />
                                        <h4 className="text-xl font-bold text-[#2D5F3F]">
                                            Research Collaboration
                                        </h4>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#5C6B5C] mb-4">
                                        Interested in collaborating on plant biology research,
                                        protein localization studies, or molecular biology projects.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Plant Biology
                                        </span>
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Molecular Research
                                        </span>
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Data Analysis
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </BloomOnHover>

                        <BloomOnHover delay={200}>
                            <Card variant="bordered" className="h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Plant type="sprout" size="sm" animated={false} />
                                        <h4 className="text-xl font-bold text-[#2D5F3F]">
                                            Science Outreach
                                        </h4>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[#5C6B5C] mb-4">
                                        Available for science communication, educational workshops,
                                        and community outreach programs.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Workshops
                                        </span>
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Tutoring
                                        </span>
                                        <span className="px-3 py-1 bg-[#B8D4BE]/30 rounded-full text-xs text-[#2D5F3F]">
                                            Public Speaking
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </BloomOnHover>
                    </div>
                </div>
            </Section>
        </div>
    );
}
