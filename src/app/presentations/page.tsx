import { Section } from '@/components/ui/Section';
import { PresentationCard } from '@/components/sections/PresentationCard';
import { talks } from '@/data/talks';

export default function TalksPage() {
  return (
    <div className="page-enter">
      <Section
        title="Presentations & Talks"
        subtitle="Sharing research findings and scientific insights"
        centered
      >
        {Object.values(talks).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(talks).map(([id, talk]) => (
              <PresentationCard key={id} talk={talk} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎤</div>
            <p className="text-[#5C6B5C] text-lg mb-2">
              Upcoming presentations will be listed here
            </p>
            <p className="text-sm text-[#8C9B8C]">
              Check back for conference talks, seminars, and poster presentations
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
