import { Section } from '@/components/ui/Section';
import { PublicationCard } from '@/components/sections/PublicationCard';
import { publications } from '@/data/publications';

export default function PublicationsPage() {
  return (
    <div className="page-enter min-h-screen">
      <Section
        title="Publications & Written Work"
        subtitle="Research contributions and academic writing"
        centered
      >
        {publications.length > 0 ? (
          <div className="space-y-6">
            {publications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-[#5C6B5C] text-lg">
              Publications will bloom here as research progresses...
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
