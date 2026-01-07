import { Section } from '@/components/ui/Section';
import { PresentationCard } from '@/components/sections/PresentationCard';
import { presentations } from '@/data/presentations';
import Gachapon from '@/components/pets/Gachapon';
import Bear from '@/components/pets/Bear';
// import ClawMachine from '@/components/pets/ClawMachine';

export default function PresentationsPage() {
  return (
    <>
      <Gachapon />
      {/* <ClawMachine /> <--- Needs tonnes of debugging so temporarily disabled */}

      <div className="page-enter">
        <Section
          title="Presentations"
          subtitle="Sharing research findings and scientific insights"
          centered
        >
          <div className="space-y-6">
            {Object.entries(presentations).map(([id, talk]) => (
              <PresentationCard key={id} talk={talk} />
            ))}
          </div>
        </Section>

        <Bear />
      </div>
    </>
  );
}
