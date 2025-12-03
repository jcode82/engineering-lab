import Hero from "@/components/Hero";
import Experiments from "./sections/Experiments";
// import ArticleTest from "./sections/ArticleTest";
import About from "./sections/About";
// import Projects from "./sections/Projects";
import Notes from "./sections/Notes";
import CaseStudiesSection from "./sections/CaseStudies";
import Contact from "./sections/Contact";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function Page() {
  return (
    <ParallaxBackground>
      <Hero />
      <Experiments />
      {/* <ArticleTest /> */}
      {/* <Projects /> */}
      <Notes />
      <CaseStudiesSection />
      <About />
      <Contact />
    </ParallaxBackground>
  );
}
