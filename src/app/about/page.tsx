import Link from 'next/link';
import { fleur_de_leah } from '@/lib/fonts';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BloomOnHover } from '@/components/interactive/BloomOnHover';
import { Plant } from '@/components/garden/Plant';
import { skills, researchInterests } from '@/data/skills';
import { SITECONFIG } from '@/data/siteConfig';
import { FiLink } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="page-enter min-h-screen">
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 space-y-6">
            <p className="text-base text-[#5C6B5C] uppercase">
              About Me
            </p>
            <span className={`${fleur_de_leah.className} text-6xl md:text-7xl font-bold text-[#1A3A2A]`}>
              {SITECONFIG.name}
            </span>
            <p className="text-xl text-[#5C6B5C]">
              {SITECONFIG.role} at {SITECONFIG.org}
            </p>
            <div className="flex justify-center gap-2 text-sm">
              <Badge variant="info">{SITECONFIG.role}</Badge>
              <Link href={`https://www.google.com/maps/search/${encodeURIComponent(SITECONFIG.org)}`} target="_blank" rel="noopener noreferrer">
                <Badge variant="warning" className="flex flex-row gap-1">
                  {SITECONFIG.org}
                  <FiLink className="inline rounded-full p-0.25" />
                </Badge>
              </Link>
              <Link href={SITECONFIG.supervisor.url} target="_blank" rel="noopener noreferrer">
                <Badge variant="default" className="flex flex-row gap-1">
                  Under {SITECONFIG.supervisor.name}
                  <FiLink className="inline rounded-full p-0.25" />
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Research Interests */}
      <Section
        title="Research Interests"
        subtitle="Areas of focus in plant biology and molecular research"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {researchInterests.map((interest, index) => (
            <BloomOnHover key={interest.id} delay={index * 150}>
              <Card variant="bordered" className="h-full">
                <CardHeader>
                  <div className="text-4xl mb-3">
                    {interest.icon === 'plant' && '🌿'}
                    {interest.icon === 'bacteria' && '🦠'}
                    {interest.icon === 'cell' && '🔬'}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3A2A] mb-2">
                    {interest.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-[#5C6B5C]">{interest.description}</p>
                </CardContent>
              </Card>
            </BloomOnHover>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills & Expertise">
        <div className="space-y-8">
          {skills.map((skillCategory, index) => (
            <BloomOnHover key={skillCategory.category} delay={index * 100}>
              <Card variant="bordered">
                <CardHeader>
                  <h3 className="text-xl font-bold text-[#2D5F3F] flex items-center gap-2">
                    <Plant type="leaf" size="sm" animated={false} />
                    {skillCategory.category}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BloomOnHover>
          ))}
        </div>
      </Section>
    </div>
  );
}
