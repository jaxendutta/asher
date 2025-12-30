import Link from 'next/link';
import { fleur_de_leah } from '@/lib/fonts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { skills, researchInterests } from '@/data/skills';
import { SITECONFIG } from '@/data/siteConfig';
import { FiLink } from 'react-icons/fi';
import { PiMicroscope } from 'react-icons/pi';

export default function AboutPage() {
  return (
    <div className="page-enter flex flex-col gap-6">
      {/* Hero Section */}
      <Card className="my-12 px-6 py-10 opacity-95 bg-gradient-to-br from-[#D9EAD3] to-[#F4EBD0]/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <p className="text-base uppercase">
              About Me
            </p>
            <p className={`${fleur_de_leah.className} text-6xl md:text-7xl font-bold text-[#2D5F3F] mb-4`}>
              {SITECONFIG.name}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Badge className="whitespace-nowrap">{SITECONFIG.role}</Badge>
              <Link href={`https://www.google.com/maps/search/${encodeURIComponent(SITECONFIG.org)}`} target="_blank" rel="noopener noreferrer">
                <Badge className="flex flex-row gap-1 whitespace-nowrap">
                  {SITECONFIG.org}
                  <FiLink className="inline rounded-full p-0.25" />
                </Badge>
              </Link>
              <Link href={SITECONFIG.supervisor.url} target="_blank" rel="noopener noreferrer">
                <Badge className="flex flex-row gap-1 whitespace-nowrap">
                  Supervisor: {SITECONFIG.supervisor.name}
                  <FiLink className="inline rounded-full p-0.25" />
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Research Interests */}
      <Card hoverable variant="bordered">
        <CardHeader>
          <span className="text-xl font-bold text-[#2D5F3F] flex items-center gap-2">
            <PiMicroscope /> Research Interests
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest) => (
              <Badge key={interest.id} variant="default">
                {interest.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {skills.map((skillCategory, index) => (
      <Card hoverable variant="bordered" key={index}>
        <CardHeader>
          <span className="text-xl font-bold text-[#2D5F3F] flex items-center gap-2">
            {skillCategory.icon && <skillCategory.icon />}
            {skillCategory.category}
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skillCategory.items.sort().map((skill) => (
              <Badge key={skill} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      ))}
    </div>
  );
}
