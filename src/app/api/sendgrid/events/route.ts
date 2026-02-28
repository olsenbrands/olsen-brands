import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// SendGrid Event Webhook
// Receives open events and stores them against the employee record.
// Custom arg `employee_id` is injected when sending the confirmation email.

interface SendGridEvent {
  event: string;
  employee_id?: string;
  timestamp?: number;
  email?: string;
  sg_message_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const events: SendGridEvent[] = await req.json();

    const openEvents = events.filter(
      (e) => e.event === 'open' && e.employee_id
    );

    if (openEvents.length === 0) {
      return NextResponse.json({ received: true });
    }

    // Update each employee's first open timestamp (don't overwrite if already set)
    await Promise.all(
      openEvents.map((e) =>
        supabase
          .from('employees')
          .update({ confirmation_email_opened_at: new Date(
            (e.timestamp ?? Date.now() / 1000) * 1000
          ).toISOString() })
          .eq('id', e.employee_id!)
          .is('confirmation_email_opened_at', null) // only set once — first open
      )
    );

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('SendGrid webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
