import { jersey_10 } from '@/lib/fonts';
import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Dog from '@/components/pets/Dog';
import { skills, researchInterests } from '@/data/skills';
import { PiMicroscope } from 'react-icons/pi';

export default function SpecializationsPage() {
  return (
    <div className="page-enter relative">
      <div className="absolute inset-0 z-40 p-10 pointer-events-none">
        <div className="pointer-events-auto h-full">
          <Dog />
        </div>
      </div>
      <Section
        title="Specializations"
        subtitle="Dive into my research frontiers and technical arsenal"
        centered
        className="max-w-5xl flex flex-col gap-6 md:gap-8 mb-16"
      >
        {/* Research Interests */}
        <Card hoverable variant="bordered" className="p-1 md:p-2">
          <CardHeader>
            <span className={`text-2xl md:text-3xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_10.className}`}>
              <PiMicroscope className="text-xl" /> Research Interests
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {researchInterests.map((interest, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Research Interests and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Skills */}
          {skills.map((skillCategory, index) => (
            <Card hoverable variant="bordered" key={index} className="p-1 md:p-2">
              <CardHeader>
                <span className={`text-2xl md:text-3xl font-bold text-[#2D5F3F] flex items-center gap-2 ${jersey_10.className}`}>
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
