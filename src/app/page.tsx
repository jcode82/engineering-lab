import Hero from "@/components/Hero";
// import Experiments from "./sections/Experiments";
// import ArticleTest from "./sections/ArticleTest";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Notes from "./sections/Notes";
import Contact from "./sections/Contact";

export default function Page() {
  return (
    <main>
      <Hero />
      {/* <Experiments /> */}
      {/* <ArticleTest /> */}
      <Projects />
      <Notes />
      <About />
      <Contact />
    </main>
  );
}
