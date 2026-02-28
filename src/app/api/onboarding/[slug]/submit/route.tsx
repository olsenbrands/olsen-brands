import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { renderToBuffer, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Strip markdown formatting for plain-text PDF rendering
function stripMarkdown(text: string, effectiveDate: string): string {
  return text
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, effectiveDate)  // fill in date
    .replace(/\*\*(.+?)\*\*/g, '$1')                    // **bold** → plain
    .replace(/\*(.+?)\*/g, '$1')                        // *italic* → plain
    .replace(/^#{1,6}\s+/gm, '')                        // ## headings → plain
    .replace(/^---+$/gm, '─────────────────────────')   // --- → divider line
    .replace(/^\s*[-•]\s+/gm, '  • ');                  // - bullet → • bullet
}

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 24,
    borderBottom: '1px solid #cccccc',
    paddingBottom: 16,
  },
  businessName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 8,
  },
  metaBlock: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 20,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 100,
    fontSize: 9,
    color: '#555555',
  },
  metaValue: {
    fontSize: 9,
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginTop: 16,
    color: '#1a1a1a',
  },
  policyText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#333333',
    whiteSpace: 'pre-wrap',
  },
  signatureSection: {
    marginTop: 24,
    borderTop: '1px solid #cccccc',
    paddingTop: 16,
  },
  signatureImage: {
    width: 200,
    height: 80,
    marginTop: 8,
    marginBottom: 4,
    border: '1px solid #cccccc',
    backgroundColor: '#ffffff',
  },
  signatureLine: {
    width: 200,
    borderBottom: '1px solid #333333',
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#777777',
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 7,
    color: '#aaaaaa',
    textAlign: 'center',
  },
});

type PolicyPDFProps = {
  businessName: string;
  documentName: string;
  version: string;
  employeeName: string;
  employeeEmail: string;
  signedAt: string;
  ipAddress: string;
  policyContent: string;
  signatureDataUrl: string;
};

function PolicyPDF({
  businessName,
  documentName,
  version,
  employeeName,
  employeeEmail,
  signedAt,
  ipAddress,
  policyContent,
  signatureDataUrl,
}: PolicyPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <Text style={styles.documentTitle}>
            {documentName} — Version {version}
          </Text>
        </View>

        {/* Meta info */}
        <View style={styles.metaBlock}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Employee Name:</Text>
            <Text style={styles.metaValue}>{employeeName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Email:</Text>
            <Text style={styles.metaValue}>{employeeEmail}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Signed At:</Text>
            <Text style={styles.metaValue}>{signedAt}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>IP Address:</Text>
            <Text style={styles.metaValue}>{ipAddress}</Text>
          </View>
        </View>

        {/* Policy content */}
        <Text style={styles.sectionTitle}>Policy Document</Text>
        <Text style={styles.policyText}>{policyContent}</Text>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Employee Signature</Text>
          <Image style={styles.signatureImage} src={signatureDataUrl} />
          <Text style={styles.signatureLabel}>
            Signed by {employeeName} on {signedAt}
          </Text>
          <Text style={styles.policyText}>
            By signing above, the employee acknowledges that they have read, understood,
            and agree to abide by the policies outlined in this document.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is a legally binding electronic document. Document version {version} — {documentName} — {businessName}.
          Signed: {signedAt} | IP: {ipAddress}
        </Text>
      </Page>
    </Document>
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  let body: {
    firstName: string;
    lastName: string;
    email: string;
    documentTypeId: string;
    signatureDataUrl: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName, lastName, email, documentTypeId, signatureDataUrl } = body;

  if (!firstName || !lastName || !email || !documentTypeId || !signatureDataUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // 1. Fetch business
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  // 2. Fetch document type
  const { data: docType, error: docError } = await supabase
    .from('document_types')
    .select('id, name, current_version, content')
    .eq('id', documentTypeId)
    .eq('active', true)
    .single();

  if (docError || !docType) {
    return NextResponse.json({ error: 'Document type not found' }, { status: 404 });
  }

  // 3. Upsert employee
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .upsert(
      { first_name: firstName, last_name: lastName, email },
      { onConflict: 'email', ignoreDuplicates: false }
    )
    .select('id')
    .single();

  if (empError || !employee) {
    console.error('Employee upsert error:', empError);
    return NextResponse.json({ error: 'Failed to save employee record' }, { status: 500 });
  }

  const employeeId = employee.id;

  // 4. Upsert employee_businesses
  await supabase
    .from('employee_businesses')
    .upsert(
      {
        employee_id: employeeId,
        business_id: business.id,
        hire_date: new Date().toISOString().split('T')[0],
        active: true,
      },
      { onConflict: 'employee_id,business_id', ignoreDuplicates: true }
    );

  // 5. Create employee_documents record (pending) to get an ID
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

  // 6. Upload signature PNG to Supabase Storage
  const signatureBase64 = signatureDataUrl.replace(/^data:image\/png;base64,/, '');
  const signatureBuffer = Buffer.from(signatureBase64, 'base64');

  const signaturePath = `${employeeId}/signatures/${documentId}.png`;

  const { error: sigUploadError } = await supabase.storage
    .from('employee-documents')
    .upload(signaturePath, signatureBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (sigUploadError) {
    console.error('Signature upload error:', sigUploadError);
    return NextResponse.json({ error: 'Failed to upload signature' }, { status: 500 });
  }

  // 7. Generate PDF server-side
  const now = new Date();
  const signedAt = now.toLocaleString('en-US', {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  const effectiveDate = now.toLocaleDateString('en-US', {
    timeZone: 'America/Denver',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cleanedContent = stripMarkdown(docType.content || '', effectiveDate);

  const pdfBuffer = await renderToBuffer(
    <PolicyPDF
      businessName={business.name}
      documentName={docType.name}
      version={docType.current_version}
      employeeName={`${firstName} ${lastName}`}
      employeeEmail={email}
      signedAt={signedAt}
      ipAddress={ipAddress}
      policyContent={cleanedContent}
      signatureDataUrl={signatureDataUrl}
    />
  );

  // 8. Upload PDF to Supabase Storage
  const pdfPath = `${employeeId}/pdfs/${documentId}.pdf`;

  const { error: pdfUploadError } = await supabase.storage
    .from('employee-documents')
    .upload(pdfPath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (pdfUploadError) {
    console.error('PDF upload error:', pdfUploadError);
    return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
  }

  // 9. Generate a signed URL for the PDF (valid 1 hour)
  const { data: signedUrlData } = await supabase.storage
    .from('employee-documents')
    .createSignedUrl(pdfPath, 3600);

  // 10. Update employee_documents record to complete
  await supabase
    .from('employee_documents')
    .update({
      status: 'complete',
      signature_url: signaturePath,
      pdf_url: pdfPath,
      signed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId);

  return NextResponse.json({
    success: true,
    employeeId,
    documentId,
    pdfDownloadUrl: signedUrlData?.signedUrl || null,
  });
}
