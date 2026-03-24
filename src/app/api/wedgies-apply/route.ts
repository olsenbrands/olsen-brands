import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import WedgiesApplicationNotification from '@/emails/wedgies-application-notification';
import WedgiesApplicationConfirmation from '@/emails/wedgies-application-confirmation';

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
      const resendKey = process.env.RESEND_API_KEY?.trim();
      console.log('[wedgies-apply] RESEND_API_KEY present:', !!resendKey, '| length:', resendKey?.length ?? 0);
      if (!resendKey) throw new Error('RESEND_API_KEY is not set in environment');
      const resend = new Resend(resendKey);

      console.log('[wedgies-apply] Sending notification email to jordan@olsenbrands.com + wedgiesclinton@gmail.com');
      await sendNotificationEmail(resend, {
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
      await sendConfirmationEmail(resend, { firstName, email });
      console.log('[wedgies-apply] Confirmation email sent successfully');
    } catch (emailErr: any) {
      console.error('[wedgies-apply] Email send FAILED:', emailErr?.message || emailErr);
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

async function sendNotificationEmail(resend: Resend, data: NotificationData) {
  const html = await render(WedgiesApplicationNotification({
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email,
    ageRange: data.ageRange,
    whyWorkHere: data.whyWorkHere,
    workExperience: data.workExperience,
    availability: data.availability,
  }));

  await resend.emails.send({
    to: ['jordan@olsenbrands.com', 'wedgiesclinton@gmail.com'],
    from: "Wedgie's Hiring <onboarding@olsenbrands.com>",
    subject: `New Application: ${data.firstName} ${data.lastName} — Wedgie's`,
    html,
    ...(data.resumeAttachment
      ? {
          attachments: [
            {
              content: data.resumeAttachment.content,
              filename: data.resumeAttachment.filename,
              contentType: data.resumeAttachment.type,
            },
          ],
        }
      : {}),
  });
}

// ─── Confirmation email to the applicant ────────────────────────

async function sendConfirmationEmail(resend: Resend, { firstName, email }: { firstName: string; email: string }) {
  const html = await render(WedgiesApplicationConfirmation({ firstName }));

  await resend.emails.send({
    to: email,
    from: "Wedgie's <onboarding@olsenbrands.com>",
    subject: "We got your application! — Wedgie's",
    html,
  });
}
