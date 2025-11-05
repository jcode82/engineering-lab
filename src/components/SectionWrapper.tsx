import React from "react";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean; // optional alignment flag
  noBorder?: boolean; // optional border toggle
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  center = false,
  noBorder = false,
}: SectionWrapperProps) {
  const baseClasses = `
    py-24 md:py-32
    ${noBorder ? "" : "border-b border-gray-100"}
    ${center ? "text-center" : ""}
  `;

  return (
    <section id={id} className={`${baseClasses} ${className}`}>
      <div className="max-w-4xl mx-auto px-4">{children}</div>
    </section>
  );
}
