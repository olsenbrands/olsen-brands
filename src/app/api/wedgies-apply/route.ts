import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import sgMail from '@sendgrid/mail';

// API key is set per-request to ensure env var is available at runtime

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const ageRange = formData.get('age_range') as string;
    const whyWorkHere = formData.get('why_work_here') as string;
    const workExperience = JSON.parse(formData.get('work_experience') as string || '[]');
    const availability = JSON.parse(formData.get('availability') as string || '{}');
    const resumeFile = formData.get('resume') as File | null;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !ageRange) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let resumeUrl: string | null = null;
    let resumeFilename: string | null = null;
    let resumeAttachment: { content: string; filename: string; type: string } | null = null;

    // Upload resume if provided
    if (resumeFile && resumeFile.size > 0) {
      const timestamp = Date.now();
      const safeName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${timestamp}-${lastName}-${firstName}/${safeName}`;

      const buffer = Buffer.from(await resumeFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from('wedgies-resumes')
        .upload(storagePath, buffer, {
          contentType: resumeFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Resume upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
      }

      resumeUrl = storagePath;
      resumeFilename = resumeFile.name;

      // Prepare attachment for email
      resumeAttachment = {
        content: buffer.toString('base64'),
        filename: resumeFile.name,
        type: resumeFile.type,
      };
    }

    // Insert application
    const { data, error } = await supabase
      .from('wedgies_applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        age_range: ageRange,
        why_work_here: whyWorkHere || null,
        work_experience: workExperience,
        availability,
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    // Send emails (non-blocking — don't fail the submission if email fails)
    try {
      const sgKey = process.env.SENDGRID_API_KEY?.trim();
      console.log('[wedgies-apply] SENDGRID_API_KEY present:', !!sgKey, '| length:', sgKey?.length ?? 0);
      if (!sgKey) throw new Error('SENDGRID_API_KEY is not set in environment');
      sgMail.setApiKey(sgKey);
      console.log('[wedgies-apply] Sending notification email to jordan@olsenbrands.com + wedgiesclinton@gmail.com');
      await sendNotificationEmail({
        firstName,
        lastName,
        phone,
        email,
        ageRange,
        whyWorkHere,
        workExperience,
        availability,
        resumeAttachment,
      });
      console.log('[wedgies-apply] Notification email sent successfully');

      console.log('[wedgies-apply] Sending confirmation email to', email);
      await sendConfirmationEmail({ firstName, email });
      console.log('[wedgies-apply] Confirmation email sent successfully');
    } catch (emailErr: any) {
      console.error('[wedgies-apply] Email send FAILED:', emailErr?.message || emailErr);
      if (emailErr?.response?.body) {
        console.error('[wedgies-apply] SendGrid error body:', JSON.stringify(emailErr.response.body));
      }
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Notification email to Jordan + Wedgies ────────────────────────

interface NotificationData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ageRange: string;
  whyWorkHere: string;
  workExperience: Array<{ location: string; startDate: string; endDate: string; duties: string }>;
  availability: Record<string, { start: string; end: string }>;
  resumeAttachment: { content: string; filename: string; type: string } | null;
}

async function sendNotificationEmail(data: NotificationData) {
  const workRows = data.workExperience
    .filter((w) => w.location)
    .map(
      (w) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e5e5;font-size:14px;">${w.location}</td>
          <td style="padding:8px 12px;border:1px solid #e5e5e5;font-size:14px;">${w.startDate || '—'} to ${w.endDate || 'Present'}</td>
          <td style="padding:8px 12px;border:1px solid #e5e5e5;font-size:14px;">${w.duties || '—'}</td>
        </tr>`
    )
    .join('');

  const availDays = Object.entries(data.availability)
    .map(([day, times]) => `<li style="margin-bottom:4px;"><strong>${day}:</strong> ${times.start} – ${times.end}</li>`)
    .join('');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#c9533c;padding:20px 24px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:white;font-size:22px;">🥗 New Job Application — Wedgie's</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        
        <h2 style="margin:0 0 16px;font-size:18px;color:#333;">Applicant Info</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:8px 12px;background:#f0f0f0;font-weight:600;font-size:13px;width:140px;border:1px solid #e5e5e5;">Name</td>
            <td style="padding:8px 12px;font-size:14px;border:1px solid #e5e5e5;">${data.firstName} ${data.lastName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f0f0f0;font-weight:600;font-size:13px;border:1px solid #e5e5e5;">Phone</td>
            <td style="padding:8px 12px;font-size:14px;border:1px solid #e5e5e5;"><a href="tel:${data.phone}" style="color:#c9533c;">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f0f0f0;font-weight:600;font-size:13px;border:1px solid #e5e5e5;">Email</td>
            <td style="padding:8px 12px;font-size:14px;border:1px solid #e5e5e5;"><a href="mailto:${data.email}" style="color:#c9533c;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f0f0f0;font-weight:600;font-size:13px;border:1px solid #e5e5e5;">Age Range</td>
            <td style="padding:8px 12px;font-size:14px;border:1px solid #e5e5e5;">${data.ageRange}</td>
          </tr>
        </table>

        ${data.whyWorkHere ? `
        <h2 style="margin:0 0 8px;font-size:16px;color:#333;">Why They Want to Work at Wedgie's</h2>
        <div style="background:white;border:1px solid #e5e5e5;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;line-height:1.5;color:#555;">${data.whyWorkHere}</p>
        </div>` : ''}

        ${workRows ? `
        <h2 style="margin:0 0 8px;font-size:16px;color:#333;">Work Experience</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr style="background:#c9533c;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:white;text-transform:uppercase;">Location</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:white;text-transform:uppercase;">Dates</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:white;text-transform:uppercase;">Duties</th>
          </tr>
          ${workRows}
        </table>` : ''}

        ${availDays ? `
        <h2 style="margin:0 0 8px;font-size:16px;color:#333;">Availability</h2>
        <div style="background:white;border:1px solid #e5e5e5;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
          <ul style="margin:0;padding-left:18px;font-size:14px;color:#555;">${availDays}</ul>
        </div>` : ''}

        ${data.resumeAttachment ? '<p style="font-size:13px;color:#888;">📎 Resume attached to this email.</p>' : '<p style="font-size:13px;color:#888;">No resume uploaded.</p>'}
        
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="font-size:12px;color:#aaa;margin:0;">This application was submitted via olsenbrands.com/now-hiring-wedgies</p>
      </div>
    </div>
  `;

  const msg: sgMail.MailDataRequired = {
    to: 'jordan@olsenbrands.com',
    cc: 'wedgiesclinton@gmail.com',
    from: { email: 'jordan@olsenbrands.com', name: "Wedgie's Hiring" },
    subject: `New Application: ${data.firstName} ${data.lastName} — Wedgie's`,
    html,
    ...(data.resumeAttachment
      ? {
          attachments: [
            {
              content: data.resumeAttachment.content,
              filename: data.resumeAttachment.filename,
              type: data.resumeAttachment.type,
              disposition: 'attachment' as const,
            },
          ],
        }
      : {}),
  };

  await sgMail.send(msg);
}

// ─── Confirmation email to the applicant ────────────────────────

async function sendConfirmationEmail({ firstName, email }: { firstName: string; email: string }) {
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#c9533c;padding:20px 24px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:white;font-size:22px;">🥗 Thanks for Applying!</h1>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;">
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hi ${firstName},</p>
        
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
          Thanks for applying to Wedgie's! We've received your application and we really appreciate you taking the time.
        </p>
        
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
          We'll hold on to your application and review it when we're hiring next. If your experience and availability are a good fit, we'll reach out to you directly.
        </p>

        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
          In the meantime, feel free to stop by the store if you have any questions!
        </p>

        <div style="background:white;border:1px solid #e5e5e5;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:600;">Wedgie's</p>
          <p style="margin:0;font-size:13px;color:#888;">2212 W 1800 N Ste. B, Clinton, UT</p>
          <p style="margin:4px 0 0;font-size:13px;color:#888;">Mon – Sat · 10:00 AM – 8:30 PM</p>
        </div>

        <p style="font-size:15px;line-height:1.6;margin:16px 0 0;">
          — The Wedgie's Team
        </p>
        
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
        <p style="font-size:11px;color:#aaa;margin:0;">
          You received this email because you applied for a position at Wedgie's via olsenbrands.com.
        </p>
      </div>
    </div>
  `;

  const msg: sgMail.MailDataRequired = {
    to: email,
    from: { email: 'jordan@olsenbrands.com', name: "Wedgie's" },
    subject: "We got your application! — Wedgie's",
    html,
  };

  await sgMail.send(msg);
}
