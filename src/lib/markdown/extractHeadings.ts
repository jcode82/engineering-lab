export interface Heading {
  id: string;
  text: string;
  level: number;
}

const headingRegex = /^(#{2,4})\s+(.*)$/gm;

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  if (!markdown) return headings;

  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const hashes = match[1];
    const text = match[2].trim();
    const level = hashes.length;

    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (text && id) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
