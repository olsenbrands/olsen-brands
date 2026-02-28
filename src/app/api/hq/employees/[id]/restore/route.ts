import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('employees')
    .update({
      archived_at: null,
      archived_reason: null,
    })
    .eq('id', id);

  if (error) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: 'Failed to restore employee.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
