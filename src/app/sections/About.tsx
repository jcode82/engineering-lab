import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <SectionWrapper id="about">
      <Reveal>
        <h2 className="text-h2 heading-spacing">About</h2>
      </Reveal>
      <p className="text-base max-w-2xl mx-auto">
        Full-stack engineer with a passion for building internal tools, microservices, 
        and AI-enhanced systems that help real teams move faster. For the past seven years, 
        I’ve worked across PHP, Node, React, PostgreSQL, MongoDB, and AWS to build products 
        that support operations, marketing, recruiting, and data analytics.
        <br /><br />
        
        I enjoy 0 to 1 product development, solving ambiguous problems, and collaborating 
        directly with cross-functional teams to translate messy workflows into clean, scalable 
        software. My work includes infrastructure redesigns, microservice architecture, and 
        LLM-powered automations using OpenAI models, Gemini, Claude, and GitHub Copilot.
        <br /><br />
        
        Recently, I’ve been exploring AI agent orchestration through personal platforms like 
        <strong> Engineering-Lab</strong> and <strong>TimeBookt</strong>, where I experiment with 
        multi-agent flows, metadata pipelines, MDX content engines, and AI-assisted scheduling features. 
        I’m also expanding my Python experience through automation and personal tooling.
        <br /><br />
        
        My goal is simple: build tools that make people more effective, enhance organizational 
        intelligence, and unlock new ways of working with AI at the center.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 opacity-80 text-sm">
        {[
          "AI Engineering",
          "Full-Stack Development",
          "System Architecture",
          "Performance Optimization",
          "DevOps",
          "AI-Assisted Workflows",
        ].map((skill) => (
          <span
            key={skill}
            className="px-4 py-1.5 rounded-full border border-[var(--border)]/60 bg-[var(--surface)]/80"
          >
            {skill}
          </span>
        ))}
      </div>

    </SectionWrapper>
  );
}
