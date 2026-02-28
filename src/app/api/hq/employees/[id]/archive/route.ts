import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason: string = body.reason?.trim() || '';

  const { error } = await supabase
    .from('employees')
    .update({
      archived_at: new Date().toISOString(),
      archived_reason: reason || null,
    })
    .eq('id', id)
    .is('archived_at', null); // only archive if not already archived

  if (error) {
    console.error('Archive error:', error);
    return NextResponse.json({ error: 'Failed to archive employee.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
