export default function CollectionPage({ params }: { params: { id: string } }) {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Collection {params.id}</h1>
      <p className="text-zinc-400">Shareable project workspace scaffold.</p>
    </section>
  );
}
