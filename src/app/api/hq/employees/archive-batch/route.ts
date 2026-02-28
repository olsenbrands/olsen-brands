import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ids: string[] = body.ids ?? [];
  const reason: string = body.reason?.trim() || '';

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No employee IDs provided.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('employees')
    .update({
      archived_at: new Date().toISOString(),
      archived_reason: reason || null,
    })
    .in('id', ids)
    .is('archived_at', null); // only archive active employees

  if (error) {
    console.error('Batch archive error:', error);
    return NextResponse.json({ error: 'Failed to archive employees.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, archived: ids.length });
}
