export function ChartCard({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 text-sm font-medium text-zinc-300">{title}</div>
        <div className="h-[320px]">{children}</div>
      </section>
    );
  }