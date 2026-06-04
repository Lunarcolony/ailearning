export default async function PaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Paper {id}</h1>
      <p className="text-zinc-400">Legal access status: Open access PDF available.</p>
      <ul className="list-disc pl-5 text-sm text-zinc-300">
        <li>Summary (1 minute)</li>
        <li>Strengths and limitations</li>
        <li>Citation journey entrypoint</li>
      </ul>
    </section>
  );
}
