import './styles.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800 p-4">
          <nav className="mx-auto flex max-w-6xl gap-4 text-sm">
            <Link href="/feed">Feed</Link>
            <Link href="/search">Search</Link>
            <Link href="/library">Library</Link>
            <Link href="/settings">Settings</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
