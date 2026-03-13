import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
