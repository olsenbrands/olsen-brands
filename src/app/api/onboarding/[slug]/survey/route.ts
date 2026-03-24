import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import OnboardingSurveyNotification from '@/emails/onboarding-survey-notification';
import OnboardingEmployeeConfirmation from '@/emails/onboarding-employee-confirmation';

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
    .select('id, name, logo_url')
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

  // Fire both emails in parallel if Resend is configured
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey && business) {
    const resend = new Resend(resendKey);

    // ── 1. Jordan's survey notification ───────────────────────────────────
    const surveyHtml = await render(OnboardingSurveyNotification({
      firstName: firstName || '',
      lastName: lastName || '',
      businessName: business.name,
      rating: rating ?? null,
      wasClear: wasClear ?? null,
      feedback: feedback?.trim() || '',
      feltPrepared: feltPrepared ?? null,
      feltWelcomed: feltWelcomed ?? null,
      heardFrom: heardFrom ?? null,
    }));

    const sendSurveyEmail = resend.emails.send({
      to: 'jordan@olsenbrands.com',
      from: 'OlsenBrands Onboarding <onboarding@olsenbrands.com>',
      subject: `Onboarding feedback — ${firstName} at ${business.name} (${rating}/5)`,
      html: surveyHtml,
    }).catch((e: unknown) => console.error('Resend survey email failed:', e));

    // ── 2. Employee confirmation email ─────────────────────────────────────
    let sendConfirmationEmail: Promise<unknown> = Promise.resolve();

    if (employeeId) {
      // Fetch employee email + signed PDF path + completed steps in parallel
      const [empResult, pdfResult, stepsResult] = await Promise.all([
        supabase.from('employees').select('email').eq('id', employeeId).single(),
        supabase
          .from('employee_documents')
          .select('pdf_url, document_types(step_type)')
          .eq('employee_id', employeeId)
          .not('pdf_url', 'is', null)
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
      if (policyDoc?.pdf_url) {
        const { data: signedData } = await supabase.storage
          .from('employee-documents')
          .createSignedUrl(policyDoc.pdf_url, 60 * 60 * 24 * 90); // 90 days
        pdfUrl = signedData?.signedUrl ?? null;
      }

      // Build completed steps list from business requirements
      const completedSteps = (stepsResult.data ?? [])
        .map((r) => r.document_types as unknown as { name: string; step_type: string } | null)
        .filter(Boolean) as { name: string; step_type: string }[];

      if (employeeEmail && completedSteps.length > 0) {
        // Record sent timestamp and fire the email
        await supabase
          .from('employees')
          .update({ confirmation_email_sent_at: new Date().toISOString() })
          .eq('id', employeeId);

        const confirmHtml = await render(OnboardingEmployeeConfirmation({
          firstName: firstName || '',
          businessName: business.name,
          logoUrl: (business as { logo_url?: string }).logo_url ?? null,
          completedSteps,
          pdfUrl,
        }));

        sendConfirmationEmail = resend.emails.send({
          to: employeeEmail,
          from: 'OlsenBrands Onboarding <onboarding@olsenbrands.com>',
          subject: `Welcome to ${business.name} — your onboarding is complete ✅`,
          html: confirmHtml,
        }).catch((e: unknown) => console.error('Resend confirmation email failed:', e));
      }
    }

    await Promise.all([sendSurveyEmail, sendConfirmationEmail]);
  }

  return NextResponse.json({ success: true });
}
