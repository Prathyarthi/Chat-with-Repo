import { NextResponse } from 'next/server';
import { getRepoContext } from '@/lib/github-loader';
import db from '@/db/prisma/index';

export async function POST(req: Request) {
  const { repoUrl, name } = await req.json();

  try {
    const chunks = await getRepoContext(repoUrl);

    const repo = await db.repository.create({
      data: {
        name,
        url: repoUrl,
        contexts: {
          create: chunks.map(chunk => ({
            content: chunk.pageContent,
            filePath: chunk.metadata.source || 'unknown'
          }))
        }
      }
    });

    return NextResponse.json({ success: true, repoId: repo.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load repo context' }, { status: 500 });
  }
}
