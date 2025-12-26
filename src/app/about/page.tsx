import { Section } from '@/components/ui/Section';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BloomOnHover } from '@/components/interactive/BloomOnHover';
import { Plant } from '@/components/garden/Plant';
import { skills, researchInterests } from '@/data/skills';

export default function AboutPage() {
  return (
    <div className="page-enter min-h-screen">
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6B8E23] to-[#2D5F3F] flex items-center justify-center text-6xl shadow-xl">
              🌱
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A2A] mb-4">
              Asher Kim
            </h1>
            <p className="text-xl text-[#5C6B5C] mb-6">
              Honours Biology Student
            </p>
            <div className="flex justify-center gap-2 text-sm">
              <Badge variant="info">University of Waterloo</Badge>
              <Badge variant="success">GPA: 93%</Badge>
              <Badge variant="default">Class of 2025</Badge>
            </div>
          </div>

          <div className="prose prose-lg max-w-3xl mx-auto text-left">
            <p className="text-[#2C3E2C] leading-relaxed">
              I&apos;m a highly motivated Honours Biology student with a strong academic record and 
              hands-on research experience in plant biology, focusing on subcellular protein 
              localization. My passion lies in understanding the molecular mechanisms that 
              govern plant responses to environmental stress and beneficial interactions with microorganisms.
            </p>
          </div>
        </div>
      </Section>

      {/* Research Interests */}
      <Section
        title="Research Interests"
        subtitle="Areas of focus in plant biology and molecular research"
        className="bg-white/50"
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

      {/* Professional Summary */}
      <Section className="bg-gradient-to-b from-transparent to-[#F4EBD0]/30">
        <div className="max-w-4xl mx-auto">
          <BloomOnHover>
            <Card variant="elevated" className="bg-white">
              <CardHeader>
                <h3 className="text-2xl font-bold text-[#1A3A2A] mb-2">
                  Professional Summary
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-[#2C3E2C] leading-relaxed mb-4">
                  I bring proven ability to conduct laboratory work, analyze data using 
                  statistical software, and communicate scientific concepts effectively through 
                  tutoring and outreach activities. My research experience spans from wetland 
                  ecology to molecular biology, demonstrating versatility and dedication to 
                  advancing our understanding of plant systems.
                </p>
                <p className="text-[#2C3E2C] leading-relaxed">
                  Beyond research, I&apos;m passionate about science education and outreach, having 
                  mentored students, facilitated laboratory experiments, and engaged with 
                  diverse audiences about environmental issues and scientific discovery.
                </p>
              </CardContent>
            </Card>
          </BloomOnHover>
        </div>
      </Section>
    </div>
  );
}
