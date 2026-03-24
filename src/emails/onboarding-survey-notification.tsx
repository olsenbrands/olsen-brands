import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OnboardingSurveyNotificationProps {
  firstName: string;
  lastName: string;
  businessName: string;
  rating: number | null;
  wasClear: boolean | null;
  feedback: string;
  feltPrepared: number | null;
  feltWelcomed: boolean | null;
  heardFrom: string | null;
}

const STARS = (n: number | null) => {
  if (!n) return '—';
  return '★'.repeat(n) + '☆'.repeat(5 - n);
};

const RATING_LABEL: Record<number, string> = {
  5: 'Amazing',
  4: 'Great',
  3: 'Okay',
  2: 'Poor',
  1: 'Terrible',
};

const PREPARED_LABEL: Record<number, string> = {
  1: 'Not at all',
  2: 'A little',
  3: 'Somewhat',
  4: 'Pretty ready',
  5: 'Totally ready',
};

export default function OnboardingSurveyNotification({
  firstName = 'Alex',
  lastName = 'Johnson',
  businessName = 'Wedgie\'s',
  rating = 5,
  wasClear = true,
  feedback = 'Everything was great!',
  feltPrepared = 4,
  feltWelcomed = true,
  heardFrom = 'Instagram',
}: OnboardingSurveyNotificationProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const ratingColor = !rating ? colors.muted : rating >= 4 ? colors.green : rating === 3 ? colors.orange : colors.red;

  return (
    <Html>
      <Head />
      <Preview>Onboarding feedback from {fullName} at {businessName} — {rating ? `${rating}/5` : 'no rating'}</Preview>
      <Body style={body}>

        {/* ── Header ── */}
        <Section style={header}>
          <Text style={headerEyebrow}>OlsenBrands HQ</Text>
          <Heading style={headerHeading}>Onboarding Feedback</Heading>
          <Text style={headerSub}>{businessName} · {now}</Text>
        </Section>

        <Container style={container}>

          {/* ── Employee + Rating ── */}
          <Section style={card}>
            <Row>
              <Column style={{ width: '60%' }}>
                <Text style={sectionLabel}>Employee</Text>
                <Heading style={employeeName}>{fullName}</Heading>
                <Text style={businessTag}>{businessName}</Text>
              </Column>
              <Column style={{ width: '40%', textAlign: 'right' as const }}>
                <Text style={starsDisplay}>{STARS(rating)}</Text>
                <Text style={{ ...ratingBadge, color: ratingColor }}>
                  {rating ? `${rating}/5 — ${RATING_LABEL[rating]}` : 'No rating'}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* ── Quick stats ── */}
          <Section style={statsRow}>
            <Row>
              <Column style={statCol}>
                <Section style={statBox}>
                  <Text style={statLabel}>Was it clear?</Text>
                  <Text style={statValue}>
                    {wasClear === true ? '✓ Yes' : wasClear === false ? '✗ No' : '—'}
                  </Text>
                  <Text style={{ ...statSub, color: wasClear === true ? colors.green : wasClear === false ? colors.red : colors.muted }}>
                    {wasClear === true ? 'Everything made sense' : wasClear === false ? 'Something confused them' : 'Not answered'}
                  </Text>
                </Section>
              </Column>
              <Column style={statCol}>
                <Section style={statBox}>
                  <Text style={statLabel}>Felt prepared?</Text>
                  <Text style={statValue}>{feltPrepared ? `${feltPrepared}/5` : '—'}</Text>
                  <Text style={statSub}>{feltPrepared ? PREPARED_LABEL[feltPrepared] : 'Not answered'}</Text>
                </Section>
              </Column>
              <Column style={statCol}>
                <Section style={statBox}>
                  <Text style={statLabel}>Felt welcomed?</Text>
                  <Text style={statValue}>{feltWelcomed === true ? '😊' : feltWelcomed === false ? '😐' : '—'}</Text>
                  <Text style={statSub}>
                    {feltWelcomed === true ? 'Yes!' : feltWelcomed === false ? 'Not really' : 'Not answered'}
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* ── Feedback quote ── */}
          {feedback ? (
            <Section style={card}>
              <Text style={sectionLabel}>Their Feedback</Text>
              <Section style={quoteBlock}>
                <Text style={quoteText}>"{feedback}"</Text>
              </Section>
            </Section>
          ) : null}

          {/* ── Heard from ── */}
          {heardFrom && (
            <Section style={heardCard}>
              <Text style={heardLabel}>Heard About Us From</Text>
              <Text style={heardValue}>{heardFrom}</Text>
            </Section>
          )}

          {/* ── Footer ── */}
          <Hr style={divider} />
          <Text style={footer}>
            OlsenBrands Onboarding · <a href="https://olsenbrands.com/hq" style={{ color: colors.green }}>View in HQ →</a>
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
  red: '#c0392b',
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
  padding: '36px 32px 32px',
  textAlign: 'center',
};

const headerEyebrow: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#666660',
  margin: '0 0 8px',
};

const headerHeading: React.CSSProperties = {
  color: colors.white,
  fontSize: '26px',
  fontWeight: '800',
  margin: '0 0 8px',
  letterSpacing: '-0.4px',
};

const headerSub: React.CSSProperties = {
  color: '#888880',
  fontSize: '13px',
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
  margin: '0 0 8px',
};

const employeeName: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '800',
  color: colors.textPrimary,
  margin: '0 0 4px',
  letterSpacing: '-0.3px',
};

const businessTag: React.CSSProperties = {
  fontSize: '13px',
  color: colors.muted,
  margin: 0,
};

const starsDisplay: React.CSSProperties = {
  fontSize: '22px',
  letterSpacing: '3px',
  color: colors.orange,
  margin: '0 0 4px',
  lineHeight: '1',
};

const ratingBadge: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
  margin: 0,
};

const statsRow: React.CSSProperties = {
  marginTop: '12px',
};

const statCol: React.CSSProperties = {
  paddingRight: '8px',
  width: '33%',
};

const statBox: React.CSSProperties = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  padding: '14px 12px',
  textAlign: 'center',
};

const statLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 6px',
};

const statValue: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '800',
  color: colors.textPrimary,
  margin: '0 0 4px',
  lineHeight: '1',
};

const statSub: React.CSSProperties = {
  fontSize: '11px',
  color: colors.muted,
  margin: 0,
  lineHeight: '1.3',
};

const quoteBlock: React.CSSProperties = {
  borderLeft: `3px solid ${colors.green}`,
  paddingLeft: '16px',
  marginTop: '4px',
};

const quoteText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#444440',
  fontStyle: 'italic',
  margin: 0,
};

const heardCard: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: '12px',
  padding: '18px 28px',
  marginTop: '12px',
  border: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
};

const heardLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 4px',
};

const heardValue: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: colors.textPrimary,
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
