import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { render } from '@react-email/components';
import SubwayWelcome from '@/emails/subway-welcome';

const LOCATION_NAMES: Record<string, string> = {
  'Subway — Kaysville': 'Kaysville Walmart',
  'Subway — Morgan':    'Morgan',
  'Subway — Ogden':     'Ogden',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, hourlyBase, tipAmount, posPin, trainingUsername, trainingPassword } = body;

    // Fetch name + business + email from DB
    const { data: interview } = await supabase
      .from('subway_interviews')
      .select('name, business, email')
      .eq('id', id)
      .single();

    const firstName = interview?.name?.split(' ')[0] || 'there';
    const locationName = LOCATION_NAMES[interview?.business || ''] || interview?.business || 'your location';

    const baseNum = parseFloat((hourlyBase || '').replace(/[^0-9.]/g, ''));
    const tipNum = parseFloat((tipAmount || '').replace(/[^0-9.]/g, ''));
    const effectiveWage = !isNaN(baseNum) && !isNaN(tipNum) ? `$${(baseNum + tipNum).toFixed(2)}` : '—';

    const html = await render(SubwayWelcome({
      firstName,
      locationName,
      hourlyBase: hourlyBase || '—',
      tipAmount: tipAmount || '—',
      effectiveWage,
      posPin: posPin || '—',
      trainingUsername: trainingUsername || '—',
      trainingPassword: trainingPassword || '—',
    }));

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('[preview]', err);
    return NextResponse.json({ error: 'Failed to render preview' }, { status: 500 });
  }
}
