import { Section } from '@/components/ui/Section';
import { TimelineItem } from '@/components/sections/TimelineItem';
import { education } from '@/data/education';

export default function EducationPage() {
  return (
    <div className="page-enter">
      <Section
        title="Education"
        subtitle="Academic journey in plant biology and molecular research"
        centered
      >
        <div className="max-w-4xl mx-auto mt-12">
          {education.map((edu, index) => (
            <TimelineItem
              key={edu.id}
              education={edu}
              isLast={index === education.length - 1}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
