import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
import { BloomOnHover } from '@/components/interactive/BloomOnHover';
import { outreachExperience } from '@/data/outreach';

export default function OutreachPage() {
  return (
    <div className="page-enter min-h-screen">
      <Section
        title="Outreach & Teaching"
        subtitle="Sharing the joy of science with students and communities"
        centered
      >
        <div className="max-w-4xl mx-auto mb-12">
          <BloomOnHover>
            <div className="bg-gradient-to-r from-[#F4EBD0]/50 to-[#B8D4BE]/30 rounded-3xl p-8 border-2 border-[#B8D4BE]">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="text-4xl">🌻</div>
                <h3 className="text-2xl font-bold text-[#1A3A2A]">
                  Science Communication
                </h3>
              </div>
              <p className="text-[#2C3E2C] leading-relaxed">
                Beyond research, I'm deeply committed to science education and community outreach.
                From facilitating chemistry experiments for high school students to educating museum
                visitors about environmental issues, I believe in making science accessible and
                engaging for all ages.
              </p>
            </div>
          </BloomOnHover>
        </div>

        <div className="space-y-6">
          {outreachExperience.map((experience, index) => (
            <BloomOnHover key={experience.id} delay={index * 100}>
              <ResearchCard research={experience} />
            </BloomOnHover>
          ))}
        </div>

        <div className="mt-16 text-center">
          <BloomOnHover delay={400}>
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-[#B8D4BE]">
              <p className="text-[#5C6B5C] mb-2">
                Interested in collaboration or have outreach opportunities?
              </p>
              <a
                href="/contact"
                className="text-[#2D5F3F] font-semibold hover:underline"
              >
                Let's connect →
              </a>
            </div>
          </BloomOnHover>
        </div>
      </Section>
    </div>
  );
}
