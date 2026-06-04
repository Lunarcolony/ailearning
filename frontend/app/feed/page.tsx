import { FeedCard } from '@/components/feed-card';

const mockItems = [
  { title: 'Foundational RL survey', reason: 'You frequently read reinforcement learning papers.' },
  { title: 'Interdisciplinary agent systems', reason: 'Adjacent topic exploration from your saved papers.' },
  { title: 'New reasoning benchmark', reason: 'Emerging paper with rapid citation growth.' },
];

export default function FeedPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Personalized Discovery Feed</h1>
      {mockItems.map((item) => (
        <FeedCard key={item.title} title={item.title} reason={item.reason} />
      ))}
    </section>
  );
}
