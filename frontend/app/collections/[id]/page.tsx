export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Collection {id}</h1>
      <p className="text-zinc-400">Shareable project workspace scaffold.</p>
    </section>
  );
}
