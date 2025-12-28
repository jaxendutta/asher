import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
import { BloomOnHover } from '@/components/interactive/BloomOnHover';
import { researchExperience } from '@/data/research';

export default function ResearchPage() {
  return (
    <div className="page-enter min-h-screen">
      <Section
        title="Research"
        subtitle="Exploring plant biology through hands-on research and fieldwork"
        centered
      >
        <div className="space-y-6">
          {researchExperience.map((research, index) => (
            <BloomOnHover key={research.id} delay={index * 100}>
              <ResearchCard research={research} />
            </BloomOnHover>
          ))}
        </div>
      </Section>
    </div>
  );
}