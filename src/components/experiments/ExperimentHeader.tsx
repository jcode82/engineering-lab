interface ExperimentHeaderProps {
  title?: string;
  date?: string;
  tags?: string[];
}

export function ExperimentHeader({ title, date, tags = [] }: ExperimentHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-4">
      {title && (
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
      )}

      {date && (
        <p className="text-sm text-[var(--muted)]">
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-[var(--surface)] px-2 py-1 text-xs text-[var(--muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
