export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="animate-fade-in px-6 pb-4 pt-10">
      <div className="rounded-2xl bg-cream/85 px-5 py-4 shadow-sm backdrop-blur-sm dark:bg-ink/70">
        <h1 className="font-heading text-2xl text-ink dark:text-cream">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-ink/70 dark:text-cream/70">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
