'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/repos', {
      method: 'POST',
      body: JSON.stringify({ repoUrl: url, name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setLoading(false);

    if (data.repoId) {
      router.push(`/repo/${data.repoId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Chat with GitHub Repo</h1>

      <Input
        placeholder="Enter GitHub repo URL"
        value={url}
        onChange={(e: any) => setUrl(e.target.value)}
      />

      <Input
        placeholder="Repository Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button type="submit" disabled={loading || !url || !name}>
        {loading ? 'Loading...' : 'Load Repo'}
      </Button>
    </form>
  );
}
