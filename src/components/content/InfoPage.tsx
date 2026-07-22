type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: {
    body: string;
    title: string;
  }[];
};

export function InfoPage({ description, eyebrow, sections, title }: InfoPageProps) {
  return (
    <main className="mx-auto w-full max-w-[72rem] flex-1 px-4 py-14 text-white sm:px-8 sm:py-24">
      <section className="rounded-[1.6rem] border border-white/10 bg-[#0b0d11]/78 p-6 shadow-2xl shadow-black/30 sm:rounded-[2rem] sm:p-10">
        <p className="text-xs font-semibold text-[var(--brand-blue-soft)]">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-7xl sm:leading-[0.96]">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
          {description}
        </p>
      </section>

      <section className="mt-8 grid gap-4">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7"
          >
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/58 sm:text-base">{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
