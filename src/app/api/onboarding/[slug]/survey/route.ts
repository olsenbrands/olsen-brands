import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { employeeId, firstName, lastName, rating, wasClear, feedback } = body;

  // Validate
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Please select a rating.' }, { status: 400 });
  }

  // Get business
  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('slug', slug)
    .single();

  // Store survey in DB
  const { error } = await supabase.from('onboarding_surveys').insert({
    employee_id: employeeId || null,
    business_id: business?.id || null,
    employee_name: firstName && lastName ? `${firstName} ${lastName}` : null,
    business_slug: slug,
    rating,
    was_clear: wasClear ?? null,
    feedback: feedback?.trim() || null,
  });

  if (error) {
    console.error('Survey insert error:', error);
    return NextResponse.json({ error: 'Failed to save survey.' }, { status: 500 });
  }

  // Send email if RESEND_API_KEY is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && business) {
    const stars = '⭐'.repeat(rating);
    const clearText = wasClear === true ? 'Yes' : wasClear === false ? 'No' : 'Not answered';
    const emailBody = `
New onboarding feedback from ${firstName} ${lastName || ''} at ${business.name}

Rating: ${stars} (${rating}/5)
Was everything clear? ${clearText}
Feedback: ${feedback?.trim() || 'None provided'}
    `.trim();

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Onboarding <onboarding@olsenbrands.com>',
        to: ['jordan@olsenbrands.com'],
        subject: `Onboarding feedback — ${firstName} at ${business.name} (${rating}/5 ⭐)`,
        text: emailBody,
      }),
    }).catch((e) => console.error('Email send failed:', e));
  }

  return NextResponse.json({ success: true });
}
