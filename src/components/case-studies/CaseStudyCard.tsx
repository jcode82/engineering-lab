import Link from "next/link";

interface CaseStudyCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date?: string | null;
  tags?: string[];
  status?: string | null;
}

export default function CaseStudyCard({
  slug,
  title,
  excerpt,
  date,
  tags = [],
  status = "Resolved",
}: CaseStudyCardProps) {
  const statusStyles =
    status === "Resolved"
      ? "border-emerald-400/40 text-emerald-300/90"
      : "border-amber-400/50 text-amber-300/90";

  return (
    <Link
      href={`/case-studies/${slug}`}
      className="group relative flex flex-col p-5 rounded-2xl border border-[var(--border)]/70
                 hover:border-primary-400/60 hover:bg-white/5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-white">
          {title}
        </h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles}`}
        >
          {status}
        </span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
        {excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground/80">
        <span>{date}</span>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
