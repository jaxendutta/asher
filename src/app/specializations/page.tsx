import { jersey_25 } from '@/lib/fonts';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Dog from '@/components/pets/Dog';
import { skills, researchInterests } from '@/data/skills';
import { PiMicroscope } from 'react-icons/pi';

export default function AboutPage() {
  return (
    <div className="page-enter">
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] z-40">
        <Dog />
      </div>

      <Section
        title="Specializations"
        subtitle="Dive into my research frontiers and technical arsenal"
        centered
        className="max-w-5xl py-0"
      >
        {/* Research Interests and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Research Interests */}
          <Card hoverable variant="bordered" className="p-1 md:p-2">
            <CardHeader>
              <span className={`text-xl md:text-2xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_25.className}`}>
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
            <Card hoverable variant="bordered" key={index} className="p-1 md:p-2">
              <CardHeader>
                <span className={`text-xl md:text-2xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_25.className}`}>
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

      </Section>

    </div>
  );
}
