import Hero from "@/components/Hero";
import Experiments from "./sections/Experiments";

export default function Page() {
  return (
    <main>
      <Hero />
      <Experiments />

      /** TODO:Color palette that should be removed once Tailwind is updated and confirmed!! */
      <section className="grid grid-cols-5 gap-4 p-8">
        <div className="bg-primary-500 text-white p-4">Primary</div>
        <div className="bg-accent-500 text-white p-4">Accent</div>
        <div className="bg-highlight text-white p-4">Highlight</div>
        <div className="bg-primary-900 text-white p-4">Dark</div>
        <div className="bg-accent-100 text-gray-900 p-4">Light</div>
      </section>
    </main>
  );
}
