import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
import { outreachExperience } from '@/data/outreach';

export default function OutreachPage() {
  return (
    <div className="page-enter">
      <Section
        title="Teaching & Outreach"
        subtitle="Sharing the joy of science with students and communities"
        centered
      >
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl p-8 border-2 border-[#B8D4BE]">
            <span className="text-xl font-bold text-[#1A3A2A] mb-2 block">
              🌻 Science Communication
            </span>
            <p className="text-sm text-[#2C3E2C] leading-relaxed">
              Beyond research, I'm deeply committed to science education and community outreach.
              From facilitating chemistry experiments for high school students to educating museum
              visitors about environmental issues, I believe in making science accessible and
              engaging for all ages.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.values(outreachExperience).map((experience, index) => (
            <ResearchCard research={experience} key={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}
