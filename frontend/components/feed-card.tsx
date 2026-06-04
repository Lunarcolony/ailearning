export function FeedCard({ title, reason }: { title: string; reason: string }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">Why recommended: {reason}</p>
      <div className="mt-4 flex gap-2 text-xs">
        <button className="rounded bg-zinc-700 px-2 py-1">Save</button>
        <button className="rounded bg-zinc-700 px-2 py-1">More like this</button>
        <button className="rounded bg-zinc-700 px-2 py-1">Hide</button>
      </div>
    </article>
  );
}
