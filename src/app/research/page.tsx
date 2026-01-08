import Birds, { BirdBranch } from '@/components/pets/Birds';
import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
import { researchExperience } from '@/data/research';

export default function ResearchPage() {
  const researchEntries = Object.entries(researchExperience);

  return (
    <div className="page-enter">
      <Birds birdCount={6}>
        <Section
          title="Research Experience"
          subtitle="Exploring research interests through hands-on research and fieldwork"
          centered
        >
          <div className="space-y-6">
            {/* Branches before first card */}
            <div className="flex justify-center gap-4 mb-6">
              <BirdBranch id="branch-start-1" size="s" className="t"/>
              <BirdBranch id="branch-start-2" size="s" className="mt-20" />
              <BirdBranch id="branch-start-3" size="m" />
            </div>

            {researchEntries.map(([id, research], index) => (
              <div key={id}>
                {/* The research card */}
                <ResearchCard research={research} />

                {/* 3 branches after each card */}
                <div className="flex justify-center gap-4 mt-12 mb-4">
                  <BirdBranch id={`branch-${id}-1`} size={index % 2 === 0 ? "s" : "m"} />
                  <BirdBranch id={`branch-${id}-2`} size={index % 2 === 0 ? "m" : "s"} />
                  <BirdBranch id={`branch-${id}-3`} size={index % 2 === 0 ? "s" : "m"} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Birds>
    </div>
  );
}
