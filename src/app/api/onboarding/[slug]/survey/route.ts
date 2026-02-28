import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function buildSurveyEmail({
  firstName,
  lastName,
  businessName,
  rating,
  wasClear,
  feedback,
}: {
  firstName: string;
  lastName: string;
  businessName: string;
  rating: number;
  wasClear: boolean | null;
  feedback: string;
}): { html: string; text: string } {
  const fullName = `${firstName} ${lastName}`.trim();
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const ratingLabel =
    rating === 5 ? 'Amazing' :
    rating === 4 ? 'Great' :
    rating === 3 ? 'Okay' :
    rating === 2 ? 'Poor' : 'Terrible';
  const clearText =
    wasClear === true ? 'Yes — everything was clear' :
    wasClear === false ? 'No — something was confusing' :
    'Not answered';
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

Rating: ${rating}/5 — ${ratingLabel}
Was everything clear? ${clearText}
Feedback: ${feedback || 'None provided'}

Date: ${now}

View in HQ: https://olsenbrands.com/hq`;

  return { html, text };
}

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

  // Send branded email via SendGrid
  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey && business) {
    const { html, text } = buildSurveyEmail({
      firstName: firstName || '',
      lastName: lastName || '',
      businessName: business.name,
      rating,
      wasClear: wasClear ?? null,
      feedback: feedback?.trim() || '',
    });

    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'jordan@olsenbrands.com' }] }],
        from: { email: 'onboarding@olsenbrands.com', name: 'OlsenBrands Onboarding' },
        subject: `Onboarding feedback — ${firstName} at ${business.name} (${rating}/5)`,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html },
        ],
      }),
    }).catch((e) => console.error('SendGrid send failed:', e));
  }

  return NextResponse.json({ success: true });
}
