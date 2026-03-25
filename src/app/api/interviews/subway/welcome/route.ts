import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import SubwayWelcome from '@/emails/subway-welcome';

// Location name map
const LOCATION_NAMES: Record<string, string> = {
  'Subway — Kaysville': 'Kaysville Walmart',
  'Subway — Morgan':    'Morgan',
  'Subway — Ogden':     'Ogden',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, testOverrideTo } = body;
    const isTest = !!testOverrideTo;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Fetch the interview
    const { data: interview, error: fetchErr } = await supabase
      .from('subway_interviews')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const recipientEmail = testOverrideTo || interview.email;
    if (!recipientEmail) {
      return NextResponse.json({ error: 'No email address on file for this candidate' }, { status: 400 });
    }

    const firstName = interview.name?.split(' ')[0] || 'there';
    const locationName = LOCATION_NAMES[interview.business || ''] || interview.business || 'your location';
    const hourlyBase = interview.hourly_base || '—';
    const tipAmount = interview.tip_amount || '—';

    // Calculate effective wage if both are set
    const baseNum = parseFloat((interview.hourly_base || '').replace(/[^0-9.]/g, ''));
    const tipNum = parseFloat((interview.tip_amount || '').replace(/[^0-9.]/g, ''));
    const effectiveWage = !isNaN(baseNum) && !isNaN(tipNum)
      ? `$${(baseNum + tipNum).toFixed(2)}`
      : '—';

    const html = await render(SubwayWelcome({
      firstName,
      locationName,
      hourlyBase,
      tipAmount,
      effectiveWage,
      posPin: interview.pos_pin || '—',
      trainingUsername: interview.training_username || '—',
      trainingPassword: interview.training_password || '—',
    }));

    const resend = new Resend(process.env.RESEND_API_KEY?.trim());
    const { error: sendErr } = await resend.emails.send({
      to: recipientEmail,
      from: 'Jordan Olsen <onboarding@olsenbrands.com>',
      subject: isTest
        ? `[TEST] Welcome to Subway at ${locationName}! 🎉`
        : `Welcome to Subway at ${locationName}! 🎉`,
      html,
    });

    if (sendErr) {
      console.error('[welcome] Resend error:', sendErr);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Only stamp sent time for real sends, not tests
    if (!isTest) {
      await supabase
        .from('subway_interviews')
        .update({ welcome_sent_at: new Date().toISOString() })
        .eq('id', id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[welcome] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
