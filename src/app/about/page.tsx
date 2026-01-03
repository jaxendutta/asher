import Link from 'next/link';
import { fleur_de_leah, jersey_25, press_start_2p } from '@/lib/fonts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Dog from '@/components/pets/Dog';
import { skills, researchInterests } from '@/data/skills';
import { SITECONFIG } from '@/data/siteConfig';
import { PiMicroscope } from 'react-icons/pi';
import { FiLink } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="w-full h-full">
      <div className="absolute inset-0 w-full h-full z-30">
        <Dog />
      </div>

      <div className="page-enter flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Hero Section */}
        <Card className="my-4 md:my-12 px-6 py-10 opacity-95 bg-gradient-to-br from-[#D9EAD3] to-[#F4EBD0]/70">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-5">
              <p className={`text-xs uppercase ${press_start_2p.className} text-[#2D5F3F] tracking-widest`}>
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
                  <Badge className="flex flex-row gap-1 whitespace-nowrap pl-1">
                    <span className="bg-white/40 rounded-full px-2">Supervisor</span>
                    {SITECONFIG.supervisor.name}
                    <FiLink className="inline rounded-full p-0.25" />
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Research Interests and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Research Interests */}
          <Card hoverable variant="bordered">
            <CardHeader>
              <span className={`text-2xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_25.className}`}>
                <PiMicroscope className="text-xl" /> Research Interests
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {researchInterests.map((interest) => (
                  <Badge key={interest.id} variant="default" className="text-xs">
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
                <span className={`text-2xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_25.className}`}>
                  {skillCategory.icon && <skillCategory.icon className="text-xl" />}
                  {skillCategory.category}
                </span>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.items.sort().map((skill) => (
                    <Badge key={skill} variant="default" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
