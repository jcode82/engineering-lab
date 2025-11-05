import SectionWrapper from "./SectionWrapper";

export default function Hero() {
  return (
    <SectionWrapper id="hero" center noBorder>
      {/* <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        Engineering <span className="text-primary-500">Lab</span>
      </h1> */}
      {/* <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
        Engineering Lab
      </h1> */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 
               bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent
               drop-shadow-[0_0_6px_rgba(37,99,235,0.25)]">
        Engineering <span className="text-primary-500">Lab</span>
      </h1>
      <h2 className="text-xl md:text-2xl font-medium text-gray-600 max-w-2xl mx-auto">
        Experiments in performance, systems, and creative technology
      </h2>
    </SectionWrapper>
  );
}
