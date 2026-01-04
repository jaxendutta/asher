import { Section } from '@/components/ui/Section';
import { EducationCard } from '@/components/sections/EducationCard';
import { education } from '@/data/education';
import Hamster from '@/components/pets/Hamster';

export default function EducationPage() {
  return (
    <div className="page-enter">
      <Section
        title="Education"
        subtitle="Academic journey in plant biology and molecular research"
        centered
      >
        <div className="max-w-4xl mx-auto flex flex-col">
          {education.map((edu, index) => (
            <div key={edu.id}>
              <EducationCard
                education={edu}
                isLast={index === education.length - 1}
              />
              {index < education.length - 1 && <Hamster />}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
