export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Citation Journey for Paper {id}</h1>
      <p className="text-zinc-400">Interactive timeline scaffold: foundational → breakthroughs → latest.</p>
    </section>
  );
}
