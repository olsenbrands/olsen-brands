import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function buildSurveyEmail({
  firstName,
  lastName,
  businessName,
  rating,
  wasClear,
  feedback,
  feltPrepared,
  feltWelcomed,
  heardFrom,
}: {
  firstName: string;
  lastName: string;
  businessName: string;
  rating: number | null;
  wasClear: boolean | null;
  feedback: string;
  feltPrepared: number | null;
  feltWelcomed: boolean | null;
  heardFrom: string | null;
}): { html: string; text: string } {
  const fullName = `${firstName} ${lastName}`.trim();
  const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '—';
  const ratingLabel =
    !rating ? 'Not answered' :
    rating === 5 ? 'Amazing' :
    rating === 4 ? 'Great' :
    rating === 3 ? 'Okay' :
    rating === 2 ? 'Poor' : 'Terrible';
  const clearText =
    wasClear === true ? 'Yes — everything was clear' :
    wasClear === false ? 'No — something was confusing' :
    'Not answered';
  const preparedLabels: Record<number, string> = { 1: 'Not at all', 2: 'A little', 3: 'Somewhat', 4: 'Pretty ready', 5: 'Totally ready' };
  const preparedText = feltPrepared ? `${feltPrepared}/5 — ${preparedLabels[feltPrepared]}` : 'Not answered';
  const welcomedText = feltWelcomed === true ? 'Yes, absolutely' : feltWelcomed === false ? 'Not really' : 'Not answered';
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const accentRed = '#c9533c';
  const darkBg = '#1a1a1a';
  const borderColor = '#e5e5e5';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Onboarding Feedback — ${fullName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${darkBg};padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888888;">OlsenBrands</p>
                    <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">New Onboarding Feedback</h1>
                    <p style="margin:6px 0 0;font-size:14px;color:#aaaaaa;">${businessName} &nbsp;·&nbsp; ${now}</p>
                  </td>
                  <td align="right" valign="top">
                    <div style="background:${accentRed};border-radius:50%;width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;font-size:22px;line-height:44px;text-align:center;">📋</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Employee banner -->
          <tr>
            <td style="background:#fafafa;border-bottom:1px solid ${borderColor};padding:20px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">Employee</p>
                    <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111111;">${fullName}</p>
                  </td>
                  <td align="right">
                    <div style="background:${accentRed};border-radius:6px;padding:6px 14px;display:inline-block;">
                      <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;white-space:nowrap;">Onboarding Complete</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Rating -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">Overall Rating</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size:32px;letter-spacing:2px;color:${accentRed};">${stars}</span>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <span style="font-size:16px;font-weight:700;color:#111111;">${rating} / 5</span>
                          <span style="font-size:13px;color:#888888;margin-left:6px;">${ratingLabel}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="border-top:1px solid ${borderColor};padding-bottom:24px;"></td></tr>

                <!-- Was it clear -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">Was Everything Clear?</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:${wasClear === true ? '#f0faf0' : wasClear === false ? '#fff5f5' : '#f5f5f5'};border:1px solid ${wasClear === true ? '#b2dfb2' : wasClear === false ? '#f5c6c6' : '#e0e0e0'};border-radius:6px;padding:10px 16px;">
                          <p style="margin:0;font-size:14px;font-weight:600;color:${wasClear === true ? '#2e7d32' : wasClear === false ? '#c62828' : '#666666'};">
                            ${wasClear === true ? '✓' : wasClear === false ? '✗' : '—'}&nbsp; ${clearText}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="border-top:1px solid ${borderColor};padding-bottom:24px;"></td></tr>

                <!-- Quick stats row -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%" style="padding-right:8px;">
                          <div style="background:#fafafa;border:1px solid ${borderColor};border-radius:6px;padding:12px;text-align:center;">
                            <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#999999;">Felt Prepared</p>
                            <p style="margin:6px 0 0;font-size:15px;font-weight:700;color:#111111;">${feltPrepared ? `${feltPrepared}/5` : '—'}</p>
                            <p style="margin:2px 0 0;font-size:11px;color:#888888;">${preparedText}</p>
                          </div>
                        </td>
                        <td width="33%" style="padding-right:8px;">
                          <div style="background:#fafafa;border:1px solid ${borderColor};border-radius:6px;padding:12px;text-align:center;">
                            <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#999999;">Felt Welcomed</p>
                            <p style="margin:6px 0 0;font-size:20px;">${feltWelcomed === true ? '😊' : feltWelcomed === false ? '😐' : '—'}</p>
                            <p style="margin:2px 0 0;font-size:11px;color:#888888;">${welcomedText}</p>
                          </div>
                        </td>
                        <td width="33%">
                          <div style="background:#fafafa;border:1px solid ${borderColor};border-radius:6px;padding:12px;text-align:center;">
                            <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#999999;">Heard From</p>
                            <p style="margin:6px 0 0;font-size:13px;font-weight:600;color:#111111;">${heardFrom ?? '—'}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="border-top:1px solid ${borderColor};padding-bottom:24px;"></td></tr>

                <!-- Feedback -->
                <tr>
                  <td>
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">Their Feedback</p>
                    ${feedback
                      ? `<div style="background:#fafafa;border-left:3px solid ${accentRed};border-radius:0 6px 6px 0;padding:14px 18px;">
                          <p style="margin:0;font-size:15px;line-height:1.6;color:#333333;font-style:italic;">"${feedback}"</p>
                        </div>`
                      : `<p style="margin:0;font-size:14px;color:#aaaaaa;font-style:italic;">No written feedback provided.</p>`
                    }
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid ${borderColor};padding:20px 32px;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;">
                Sent by OlsenBrands Onboarding &nbsp;·&nbsp; <a href="https://olsenbrands.com/hq" style="color:${accentRed};text-decoration:none;">View in HQ →</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `New onboarding feedback from ${fullName} at ${businessName}

Rating: ${rating ? `${rating}/5 — ${ratingLabel}` : 'Not answered'}
Felt prepared: ${preparedText}
Was everything clear? ${clearText}
Felt welcomed? ${welcomedText}
Heard from: ${heardFrom ?? 'Not answered'}
Feedback: ${feedback || 'None provided'}

Date: ${now}

View in HQ: https://olsenbrands.com/hq`;

  return { html, text };
}

function buildEmployeeConfirmationEmail({
  firstName,
  businessName,
  completedSteps,
  pdfUrl,
}: {
  firstName: string;
  businessName: string;
  completedSteps: { name: string; step_type: string }[];
  pdfUrl: string | null;
}): { html: string; text: string } {
  const accentRed = '#c9533c';
  const darkBg = '#1a1a1a';
  const borderColor = '#e5e5e5';

  const stepIconMap: Record<string, string> = {
    signature: '📋',
    file_upload: '📎',
    informational: '💳',
    app_download: '📱',
    survey: '⭐',
  };

  const stepsHtml = completedSteps.map(s => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="font-size:18px;padding-right:12px;vertical-align:middle;">${stepIconMap[s.step_type] ?? '✅'}</td>
          <td style="font-size:14px;color:#333333;vertical-align:middle;">${s.name}</td>
          <td align="right" style="padding-left:16px;vertical-align:middle;">
            <span style="background:#f0faf0;border:1px solid #b2dfb2;border-radius:4px;padding:3px 10px;font-size:11px;font-weight:600;color:#2e7d32;">Done</span>
          </td>
        </tr></table>
      </td>
    </tr>`).join('');

  const stepsText = completedSteps.map(s => `  ✓ ${s.name}`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Welcome to ${businessName}</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:${darkBg};padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888888;">${businessName}</p>
              <h1 style="margin:6px 0 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">You're officially in. 🎉</h1>
              <p style="margin:8px 0 0;font-size:15px;color:#aaaaaa;">Welcome to the team, ${firstName}.</p>
            </td>
            <td align="right" valign="top">
              <div style="background:${accentRed};border-radius:50%;width:48px;height:48px;text-align:center;line-height:48px;font-size:24px;">🦞</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#444444;">
            You've completed your onboarding paperwork — everything is saved and on file. Here's a summary of what you just knocked out.
          </p>
        </td></tr>

        <!-- Steps completed -->
        <tr><td style="padding:8px 32px 24px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">What You Completed</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${stepsHtml}
          </table>
        </td></tr>

        ${pdfUrl ? `
        <!-- PDF Download -->
        <tr><td style="padding:0 32px 28px;">
          <div style="background:#fafafa;border:1px solid ${borderColor};border-radius:8px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td>
                <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">Your Signed Policy</p>
                <p style="margin:6px 0 4px;font-size:15px;font-weight:600;color:#111111;">Employee Policy Acknowledgment</p>
                <p style="margin:0;font-size:13px;color:#888888;">Your signed copy is available for 90 days.</p>
              </td>
              <td align="right" valign="middle" style="padding-left:16px;">
                <a href="${pdfUrl}" style="display:inline-block;background:${accentRed};color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 20px;border-radius:6px;white-space:nowrap;">Download PDF →</a>
              </td>
            </tr></table>
          </div>
        </td></tr>` : ''}

        <!-- Next steps -->
        <tr><td style="padding:0 32px 28px;">
          <div style="background:#fffdf5;border:1px solid #f0e6c8;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#333333;">A few things before your first shift:</p>
            <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;color:#555555;">
              <li>Make sure your Toast banking info is set up so you get paid on time</li>
              <li>Download the Band app and watch for a team invite from your manager</li>
              <li>Download MyToast to view your schedule</li>
              <li>Questions? Text Jordan at <a href="sms:8014581589" style="color:${accentRed};text-decoration:none;font-weight:600;">801-458-1589</a></li>
            </ul>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#fafafa;border-top:1px solid ${borderColor};padding:20px 32px;">
          <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;">
            ${businessName} &nbsp;·&nbsp; OlsenBrands &nbsp;·&nbsp; <a href="https://olsenbrands.com" style="color:${accentRed};text-decoration:none;">olsenbrands.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Welcome to the team, ${firstName}!

You've completed your ${businessName} onboarding. Here's what you finished:

${stepsText}

${pdfUrl ? `Your signed Employee Policy PDF (valid 90 days):\n${pdfUrl}\n` : ''}
Before your first shift:
- Make sure your Toast banking info is set up
- Download Band and watch for your team invite
- Download MyToast to view your schedule
- Questions? Text Jordan at 801-458-1589

— ${businessName} / OlsenBrands`;

  return { html, text };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { employeeId, firstName, lastName, rating, wasClear, feedback, feltPrepared, feltWelcomed, heardFrom } = body;

  // All survey fields are optional — validate types only if provided
  if (rating !== null && rating !== undefined && (rating < 1 || rating > 5)) {
    return NextResponse.json({ error: 'Invalid rating value.' }, { status: 400 });
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
    rating: rating ?? null,
    was_clear: wasClear ?? null,
    feedback: feedback?.trim() || null,
    felt_prepared: feltPrepared ?? null,
    felt_welcomed: feltWelcomed ?? null,
    heard_from: heardFrom ?? null,
  });

  if (error) {
    console.error('Survey insert error:', error);
    return NextResponse.json({ error: 'Failed to save survey.' }, { status: 500 });
  }

  // Fire both emails in parallel if SendGrid is configured
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey && business) {
    // ── 1. Jordan's survey notification ───────────────────────────────────
    const surveyEmail = buildSurveyEmail({
      firstName: firstName || '',
      lastName: lastName || '',
      businessName: business.name,
      rating: rating ?? null,
      wasClear: wasClear ?? null,
      feedback: feedback?.trim() || '',
      feltPrepared: feltPrepared ?? null,
      feltWelcomed: feltWelcomed ?? null,
      heardFrom: heardFrom ?? null,
    });

    const sendSurveyEmail = fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sendgridKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'jordan@olsenbrands.com' }] }],
        from: { email: 'onboarding@olsenbrands.com', name: 'OlsenBrands Onboarding' },
        subject: `Onboarding feedback — ${firstName} at ${business.name} (${rating}/5)`,
        content: [
          { type: 'text/plain', value: surveyEmail.text },
          { type: 'text/html', value: surveyEmail.html },
        ],
      }),
    }).catch((e) => console.error('SendGrid survey email failed:', e));

    // ── 2. Employee confirmation email ─────────────────────────────────────
    let sendConfirmationEmail: Promise<unknown> = Promise.resolve();

    if (employeeId) {
      // Fetch employee email + signed PDF path + completed steps in parallel
      const [empResult, pdfResult, stepsResult] = await Promise.all([
        supabase.from('employees').select('email').eq('id', employeeId).single(),
        supabase
          .from('employee_documents')
          .select('file_path, document_types(step_type)')
          .eq('employee_id', employeeId)
          .not('file_path', 'is', null)
          .order('created_at', { ascending: true }),
        supabase
          .from('business_document_requirements')
          .select('display_order, document_types(name, step_type)')
          .eq('business_id', business.id)
          .order('display_order', { ascending: true }),
      ]);

      const employeeEmail = empResult.data?.email;

      // Generate 90-day signed URL for the policy PDF
      let pdfUrl: string | null = null;
      const policyDoc = pdfResult.data?.find(
        (d) => (d.document_types as unknown as { step_type: string } | null)?.step_type === 'signature'
      );
      if (policyDoc?.file_path) {
        const { data: signedData } = await supabase.storage
          .from('employee-documents')
          .createSignedUrl(policyDoc.file_path, 60 * 60 * 24 * 90); // 90 days
        pdfUrl = signedData?.signedUrl ?? null;
      }

      // Build completed steps list from business requirements
      const completedSteps = (stepsResult.data ?? [])
        .map((r) => r.document_types as unknown as { name: string; step_type: string } | null)
        .filter(Boolean) as { name: string; step_type: string }[];

      if (employeeEmail && completedSteps.length > 0) {
        const confirmEmail = buildEmployeeConfirmationEmail({
          firstName: firstName || '',
          businessName: business.name,
          completedSteps,
          pdfUrl,
        });

        sendConfirmationEmail = fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${sendgridKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: employeeEmail }] }],
            from: { email: 'onboarding@olsenbrands.com', name: 'OlsenBrands Onboarding' },
            subject: `Welcome to ${business.name} — your onboarding is complete ✅`,
            content: [
              { type: 'text/plain', value: confirmEmail.text },
              { type: 'text/html', value: confirmEmail.html },
            ],
          }),
        }).catch((e) => console.error('SendGrid confirmation email failed:', e));
      }
    }

    await Promise.all([sendSurveyEmail, sendConfirmationEmail]);
  }

  return NextResponse.json({ success: true });
}
