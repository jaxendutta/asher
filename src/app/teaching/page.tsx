import Monkey, { MonkeyBar } from '@/components/pets/Monkey';
import { Section } from '@/components/ui/Section';
import { ResearchCard } from '@/components/sections/ResearchCard';
import { outreachExperience } from '@/data/outreach';
import { jersey_25 } from '@/lib/fonts';

export default function TeachingPage() {
  const outreachEntries = Object.entries(outreachExperience);

  return (
    <div className="page-enter">
      <Monkey>
        <Section
          title="Teaching & Outreach"
          subtitle="Sharing the joy of science with students and communities"
          centered
        >
          <div className="flex flex-row justify-between max-w-6xl mx-auto mb-16 px-8">
            <MonkeyBar id="bar-start-1" />
            <MonkeyBar id="bar-start-2" className="mt-6" />
            <MonkeyBar id="bar-start-3" className="mt-12" />
            <MonkeyBar id="bar-start-4" className="mt-18" />
          </div>
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-[#F4EBD0]/70 to-[#B8D4BE]/60 rounded-3xl p-8 border-2 border-[#B8D4BE]">
              <span className={`text-2xl text-[#1A3A2A] mb-2 block ${jersey_25.className}`}>
                🌻 Science Communication
              </span>
              <p className="text-sm text-[#2C3E2C]">
                Beyond research, I'm deeply committed to science education and community outreach.
                From facilitating chemistry experiments for high school students to educating museum
                visitors about environmental issues, I believe in making science accessible and
                engaging for all ages.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Bars before first card */}
            <div className="flex flex-row-reverse justify-between max-w-6xl mx-auto mb-16 px-8">
              <MonkeyBar id="bar-1" />
              <MonkeyBar id="bar-2" className="mt-6" />
              <MonkeyBar id="bar-3" className="mt-12" />
            </div>

            {outreachEntries.map(([id, experience], index) => (
              <div key={id}>
                <ResearchCard research={experience} />

                {/* 5 bars after each card */}
                <div className={`flex justify-between max-w-6xl mx-auto mt-12 mb-14 px-8 ${index % 2 === 0 ? `flex-row` : `flex-row-reverse`}`}>
                  <MonkeyBar id={`bar-${id}-1`} />
                  <MonkeyBar id={`bar-${id}-2`} className="mt-6" />
                  <MonkeyBar id={`bar-${id}-3`} className="mt-12" />
                </div>
              </div>
            ))}
          </div>
        </Section >
      </Monkey >
    </div >
  );
}
