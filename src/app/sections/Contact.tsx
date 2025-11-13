import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Contact</h2>
      </Reveal>
        <p className="text-base max-w-2xl mx-auto">
            {`Send me an email if you'd like to chat about something.`}{" "}
            <a href="mailto:jflifestyles@gmail.com">jflifestyles@gmail.com</a>
        </p>
    </SectionWrapper>
  );
}
