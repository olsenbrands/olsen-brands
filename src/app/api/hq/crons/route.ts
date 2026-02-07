import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: jobs, error } = await supabase
      .from('cron_jobs')
      .select('*')
      .order('bot_name', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching cron jobs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by bot
    const byBot: Record<string, typeof jobs> = {};
    for (const job of jobs || []) {
      const botName = job.bot_name || 'Unknown';
      if (!byBot[botName]) byBot[botName] = [];
      byBot[botName].push(job);
    }

    // Get last sync time
    const lastSyncedAt = jobs?.length ? jobs[0].synced_at : null;

    return NextResponse.json({
      jobs: jobs || [],
      byBot,
      totalCount: jobs?.length || 0,
      lastSyncedAt,
      bots: Object.keys(byBot),
    });
  } catch (err) {
    console.error('Cron fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
