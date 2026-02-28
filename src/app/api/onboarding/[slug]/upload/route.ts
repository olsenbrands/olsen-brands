import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const employeeId = formData.get('employeeId') as string;
  const documentTypeId = formData.get('documentTypeId') as string;
  const file = formData.get('file') as File | null;

  if (!employeeId || !documentTypeId || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'File must be a photo (JPG, PNG, HEIC) or PDF.' },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 10MB.' }, { status: 400 });
  }

  // Verify business exists
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  // Fetch document type
  const { data: docType, error: docError } = await supabase
    .from('document_types')
    .select('id, name, current_version')
    .eq('id', documentTypeId)
    .eq('active', true)
    .single();

  if (docError || !docType) {
    return NextResponse.json({ error: 'Document type not found' }, { status: 404 });
  }

  // Create employee_documents record
  const { data: empDoc, error: docInsertError } = await supabase
    .from('employee_documents')
    .insert({
      employee_id: employeeId,
      business_id: business.id,
      document_type_id: documentTypeId,
      version: docType.current_version,
      status: 'pending',
      ip_address: ipAddress,
    })
    .select('id')
    .single();

  if (docInsertError || !empDoc) {
    console.error('Document record error:', docInsertError);
    return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 });
  }

  const documentId = empDoc.id;

  // Determine file extension
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'application/pdf': 'pdf',
  };
  const ext = extMap[file.type] || 'bin';
  const filePath = `${employeeId}/uploads/${documentId}-permit.${ext}`;

  // Upload file to Supabase Storage
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from('employee-documents')
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error('File upload error:', uploadError);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }

  // Update record to complete
  await supabase
    .from('employee_documents')
    .update({
      status: 'complete',
      file_url: filePath,
      signed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  return NextResponse.json({ success: true, documentId });
}
