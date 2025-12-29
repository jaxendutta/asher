import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
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
            <ResearchCard research={research} key={index} />
          ))}
        </div>
      </Section>
    </div>
  );
}