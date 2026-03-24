import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface CompletedStep {
  name: string;
  step_type: string;
}

interface OnboardingEmployeeConfirmationProps {
  firstName: string;
  businessName: string;
  logoUrl?: string | null;
  completedSteps: CompletedStep[];
  pdfUrl?: string | null;
}

const STEP_ICONS: Record<string, string> = {
  signature: '📋',
  file_upload: '📎',
  informational: '💳',
  app_download: '📱',
  survey: '⭐',
};

export default function OnboardingEmployeeConfirmation({
  firstName = 'Alex',
  businessName = 'Wedgie\'s',
  logoUrl = null,
  completedSteps = [],
  pdfUrl = null,
}: OnboardingEmployeeConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>You're in, {firstName}! Your {businessName} onboarding is complete ✅</Preview>
      <Body style={body}>

        {/* ── Header ── */}
        <Section style={header}>
          <Row>
            <Column style={{ textAlign: 'center' as const }}>
              {logoUrl ? (
                <Img
                  src={`https://olsenbrands.com${logoUrl}`}
                  alt={businessName}
                  width="64"
                  height="64"
                  style={logoStyle}
                />
              ) : (
                <Text style={logoEmoji}>🎉</Text>
              )}
              <Heading style={headerHeading}>You're officially in.</Heading>
              <Text style={headerSub}>Welcome to {businessName}, {firstName}.</Text>
            </Column>
          </Row>
        </Section>

        <Container style={container}>

          {/* ── Intro ── */}
          <Section style={card}>
            <Text style={bodyText}>
              You've completed your onboarding paperwork — everything is saved and on file. Here's a summary of what you just knocked out.
            </Text>
          </Section>

          {/* ── Completed steps ── */}
          <Section style={card}>
            <Text style={sectionLabel}>What You Completed</Text>
            {completedSteps.map((step, i) => (
              <Row
                key={i}
                style={{
                  ...stepRow,
                  borderTop: i === 0 ? 'none' : `1px solid ${colors.border}`,
                }}
              >
                <Column style={{ width: '36px' }}>
                  <Text style={stepIcon}>{STEP_ICONS[step.step_type] ?? '✅'}</Text>
                </Column>
                <Column>
                  <Text style={stepName}>{step.name}</Text>
                </Column>
                <Column style={{ width: '60px', textAlign: 'right' as const }}>
                  <Text style={doneBadge}>Done</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* ── PDF download ── */}
          {pdfUrl && (
            <Section style={pdfCard}>
              <Row>
                <Column>
                  <Text style={pdfLabel}>Your Signed Policy</Text>
                  <Text style={pdfTitle}>Employee Policy Acknowledgment</Text>
                  <Text style={pdfSub}>Your signed copy is available for 90 days.</Text>
                </Column>
                <Column style={{ width: '120px', textAlign: 'right' as const, verticalAlign: 'middle' }}>
                  <Link href={pdfUrl} style={pdfButton}>
                    Download PDF →
                  </Link>
                </Column>
              </Row>
            </Section>
          )}

          {/* ── Next steps ── */}
          <Section style={nextStepsCard}>
            <Text style={sectionLabel}>Before Your First Shift</Text>
            {[
              { icon: '💰', text: 'Make sure your Toast banking info is set up so you get paid on time' },
              { icon: '📲', text: 'Download the Band app and watch for a team invite from your manager' },
              { icon: '📅', text: 'Download MyToast to view your schedule' },
              { icon: '💬', text: 'Questions? Text Jordan at 801-458-1589' },
            ].map((item, i) => (
              <Row key={i} style={nextRow}>
                <Column style={{ width: '32px' }}>
                  <Text style={nextIcon}>{item.icon}</Text>
                </Column>
                <Column>
                  <Text style={nextText}>{item.text}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* ── Footer ── */}
          <Hr style={divider} />
          <Text style={footer}>
            {businessName} · OlsenBrands · <Link href="https://olsenbrands.com" style={{ color: colors.green }}>olsenbrands.com</Link>
          </Text>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const colors = {
  charcoal: '#1a1a1a',
  green: '#3a7d44',
  orange: '#e07b35',
  white: '#ffffff',
  offWhite: '#f7f7f5',
  border: '#e8e8e4',
  textPrimary: '#1a1a1a',
  muted: '#888880',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const header: React.CSSProperties = {
  backgroundColor: colors.charcoal,
  padding: '40px 32px 36px',
  textAlign: 'center',
};

const logoEmoji: React.CSSProperties = {
  fontSize: '48px',
  margin: '0 0 12px',
  lineHeight: '1',
};

const logoStyle: React.CSSProperties = {
  borderRadius: '14px',
  marginBottom: '16px',
  display: 'block',
  margin: '0 auto 16px',
};

const headerHeading: React.CSSProperties = {
  color: colors.white,
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 8px',
  letterSpacing: '-0.5px',
};

const headerSub: React.CSSProperties = {
  color: '#999990',
  fontSize: '15px',
  margin: 0,
};

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '0 16px 40px',
};

const card: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: '12px',
  padding: '24px 28px',
  marginTop: '16px',
  border: `1px solid ${colors.border}`,
};

const sectionLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 12px',
};

const bodyText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#444440',
  margin: 0,
};

const stepRow: React.CSSProperties = {
  paddingTop: '12px',
  paddingBottom: '12px',
};

const stepIcon: React.CSSProperties = {
  fontSize: '20px',
  margin: 0,
  lineHeight: '1.4',
};

const stepName: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: colors.textPrimary,
  margin: 0,
  lineHeight: '1.4',
};

const doneBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#f0faf0',
  border: '1px solid #b2dfb2',
  borderRadius: '4px',
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#2e7d32',
  margin: 0,
};

const pdfCard: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: '12px',
  padding: '20px 28px',
  marginTop: '12px',
  border: `1px solid ${colors.border}`,
};

const pdfLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 4px',
};

const pdfTitle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: '700',
  color: colors.textPrimary,
  margin: '0 0 2px',
};

const pdfSub: React.CSSProperties = {
  fontSize: '12px',
  color: colors.muted,
  margin: 0,
};

const pdfButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: colors.green,
  color: colors.white,
  fontSize: '13px',
  fontWeight: '700',
  padding: '10px 18px',
  borderRadius: '8px',
  textDecoration: 'none',
};

const nextStepsCard: React.CSSProperties = {
  backgroundColor: '#fffdf5',
  border: `1px solid #f0e6c8`,
  borderRadius: '12px',
  padding: '24px 28px',
  marginTop: '12px',
};

const nextRow: React.CSSProperties = {
  marginBottom: '10px',
};

const nextIcon: React.CSSProperties = {
  fontSize: '18px',
  margin: '0',
  lineHeight: '1.5',
};

const nextText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#444440',
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: colors.border,
  margin: '24px 0 16px',
};

const footer: React.CSSProperties = {
  fontSize: '11px',
  color: colors.muted,
  textAlign: 'center',
  margin: 0,
  lineHeight: '1.5',
};
