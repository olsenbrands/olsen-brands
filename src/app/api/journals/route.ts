import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const JOURNAL_DIR = path.join(process.env.HOME || '/Users/macminim4', 'clawd/journal');

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : 'Untitled';
}

function formatDate(filename: string): string {
  const date = new Date(filename.replace('.md', '') + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Denver',
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (file) {
    // Return single journal content
    const safeName = path.basename(file);
    if (!safeName.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    const filePath = path.join(JOURNAL_DIR, safeName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content, title: extractTitle(content) });
  }

  // Return list of all journals
  if (!fs.existsSync(JOURNAL_DIR)) {
    return NextResponse.json({ journals: [] });
  }

  const files = fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort()
    .reverse(); // newest first

  const journals = files.map((filename) => {
    const content = fs.readFileSync(path.join(JOURNAL_DIR, filename), 'utf-8');
    return {
      filename,
      date: filename.replace('.md', ''),
      displayDate: formatDate(filename),
      title: extractTitle(content),
      preview: content.replace(/^#.+\n/, '').trim().slice(0, 120) + '…',
    };
  });

  return NextResponse.json({ journals });
}
