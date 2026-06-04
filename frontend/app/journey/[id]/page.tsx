export default function JourneyPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Citation Journey for Paper {params.id}</h1>
      <p className="text-zinc-400">Interactive timeline scaffold: foundational → breakthroughs → latest.</p>
    </section>
  );
}
