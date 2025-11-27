"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export function CodeBlock({ language = "ts", code }: CodeBlockProps) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/50">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "transparent",
          fontSize: "0.9rem",
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
