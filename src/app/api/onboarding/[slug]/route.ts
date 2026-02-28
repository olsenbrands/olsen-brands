import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Fetch business by slug
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id, name, slug, type, location, welcome_copy')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  // Fetch required document types for this business
  const { data: requirements, error: reqError } = await supabase
    .from('business_document_requirements')
    .select(`
      id,
      required,
      document_types (
        id,
        name,
        slug,
        description,
        requires_signature,
        requires_file_upload,
        requires_form_fill,
        current_version,
        content
      )
    `)
    .eq('business_id', business.id)
    .eq('required', true);

  if (reqError) {
    console.error('Error fetching requirements:', reqError);
    return NextResponse.json({ error: 'Failed to load requirements' }, { status: 500 });
  }

  const documentTypes = (requirements || [])
    .map((r) => r.document_types)
    .filter(Boolean);

  return NextResponse.json({ business, documentTypes });
}
