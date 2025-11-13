import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <SectionWrapper id="about">
      <Reveal>
        <h2 className="text-h2 heading-spacing">About</h2>
      </Reveal>
      <p className="text-base max-w-2xl mx-auto">
        Building systems that merge creativity and engineering — from AI agents to performance-driven interfaces.
      </p>
    </SectionWrapper>
  );
}
