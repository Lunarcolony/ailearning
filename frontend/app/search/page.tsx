export default function SearchPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>
      <p className="text-zinc-400">Keyword and semantic search endpoint integration scaffold.</p>
      <input
        className="w-full rounded border border-zinc-700 bg-zinc-900 p-3"
        placeholder="Ask: Show me foundational papers about reinforcement learning"
      />
    </section>
  );
}
