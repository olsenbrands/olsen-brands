import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
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
    // Single entry — file param is "YYYY-MM-DD.md" or just "YYYY-MM-DD"
    const date = file.replace('.md', '');
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('journal_entries')
      .select('content, title')
      .eq('date', date)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ content: data.content, title: data.title });
  }

  // List all entries, newest first
  const { data, error } = await supabase
    .from('journal_entries')
    .select('date, title, content')
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const journals = (data || []).map((row) => ({
    filename: `${row.date}.md`,
    date: row.date,
    displayDate: formatDate(row.date),
    title: row.title,
    preview: row.content.replace(/^#.+\n/, '').trim().slice(0, 120) + '…',
  }));

  return NextResponse.json({ journals });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { date, title, content } = body;

  if (!date || !title || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { error } = await supabase
    .from('journal_entries')
    .upsert({ date, title, content, updated_at: new Date().toISOString() }, { onConflict: 'date' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
