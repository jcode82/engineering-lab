export interface CaseStudyDetailProps {
  title: string;
  date?: string | null;
  tags?: string[];
  status?: string | null;
  excerpt?: string | null;
}

export default function CaseStudyDetail({
  title,
  date,
  tags = [],
  status = "Resolved",
  excerpt,
}: CaseStudyDetailProps) {
  const statusStyles =
    status === "Resolved"
      ? "border-emerald-400/40 text-emerald-300/90"
      : "border-amber-400/50 text-amber-300/90";

  return (
    <header className="mb-10">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
        {title}
      </h1>
      <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
        {date && <span>{date}</span>}
        {date && <span>•</span>}
        <span className={`px-2 py-0.5 rounded-full border text-xs ${statusStyles}`}>
          {status}
        </span>
      </div>
      {excerpt && (
        <p className="text-base text-muted-foreground/90 mb-6 max-w-3xl">
          {excerpt}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] rounded-md border border-white/10 bg-white/5 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
