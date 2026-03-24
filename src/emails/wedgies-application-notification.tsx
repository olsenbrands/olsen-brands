import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WorkExperience {
  location: string;
  startDate: string;
  endDate: string;
  duties: string;
}

interface Availability {
  [day: string]: { start: string; end: string };
}

interface WedgiesApplicationNotificationProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ageRange: string;
  whyWorkHere: string;
  workExperience: WorkExperience[];
  availability: Availability;
  appliedAt?: string;
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function fmt12(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function WedgiesApplicationNotification({
  firstName = 'Jane',
  lastName = 'Smith',
  phone = '801-555-0100',
  email = 'jane@example.com',
  ageRange = '19+',
  whyWorkHere = 'I love salads and great teams!',
  workExperience = [],
  availability = {},
  appliedAt,
}: WedgiesApplicationNotificationProps) {
  const fullName = `${firstName} ${lastName}`;
  const submittedDate =
    appliedAt
      ? new Date(appliedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const sortedAvail = DAY_ORDER.filter((d) => availability[d]);
  const filteredWork = workExperience.filter((w) => w.location);

  return (
    <Html>
      <Head />
      <Preview>New application from {fullName} — Wedgie's Clinton</Preview>
      <Body style={body}>

        {/* ── Hero ── */}
        <Section style={hero}>
          <Img
            src="https://www.olsenbrands.com/logos/wedgies.jpg"
            alt="Wedgie's"
            width="72"
            height="72"
            style={logoStyle}
          />
          <Heading style={heroHeading}>New Job Application</Heading>
          <Text style={heroSub}>Wedgie's · Clinton, UT · {submittedDate}</Text>
        </Section>

        <Container style={container}>

          {/* ── Applicant card ── */}
          <Section style={card}>
            <Text style={sectionLabel}>Applicant</Text>
            <Heading style={applicantName}>{fullName}</Heading>
            <Hr style={dividerThin} />
            <Row style={{ marginTop: '12px' }}>
              <Column style={metaCol}>
                <Text style={metaLabel}>Phone</Text>
                <Text style={metaValue}>{phone}</Text>
              </Column>
              <Column style={metaCol}>
                <Text style={metaLabel}>Email</Text>
                <Text style={metaValue}>{email}</Text>
              </Column>
              <Column style={metaCol}>
                <Text style={metaLabel}>Age Range</Text>
                <Text style={metaValue}>{ageRange}</Text>
              </Column>
            </Row>
          </Section>

          {/* ── Why Wedgie's ── */}
          {whyWorkHere && (
            <Section style={card}>
              <Text style={sectionLabel}>Why They Want to Work Here</Text>
              <Section style={quoteBlock}>
                <Text style={quoteText}>"{whyWorkHere}"</Text>
              </Section>
            </Section>
          )}

          {/* ── Work Experience ── */}
          {filteredWork.length > 0 && (
            <Section style={card}>
              <Text style={sectionLabel}>Work Experience</Text>
              {filteredWork.map((w, i) => (
                <Section key={i} style={i > 0 ? { ...jobRow, borderTop: `1px solid ${colors.border}` } : jobRow}>
                  <Row>
                    <Column style={{ width: '60%' }}>
                      <Text style={jobTitle}>{w.location}</Text>
                      <Text style={jobDates}>
                        {w.startDate || '?'} → {w.endDate || 'Present'}
                      </Text>
                    </Column>
                  </Row>
                  {w.duties && <Text style={jobDuties}>{w.duties}</Text>}
                </Section>
              ))}
            </Section>
          )}

          {/* ── Availability ── */}
          {sortedAvail.length > 0 && (
            <Section style={card}>
              <Text style={sectionLabel}>Availability</Text>
              <Row style={{ marginTop: '8px' }}>
                {sortedAvail.map((day) => (
                  <Column key={day} style={availCol}>
                    <Section style={availChip}>
                      <Text style={availDay}>{day.slice(0, 3).toUpperCase()}</Text>
                      <Text style={availHours}>
                        {fmt12(availability[day].start)}–{fmt12(availability[day].end)}
                      </Text>
                    </Section>
                  </Column>
                ))}
              </Row>
            </Section>
          )}

          {/* ── Footer ── */}
          <Hr style={divider} />
          <Text style={footer}>
            Submitted via olsenbrands.com/now-hiring-wedgies · Wedgie's 2212 W 1800 N Ste. B, Clinton, UT
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
  textMuted: '#888880',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const hero: React.CSSProperties = {
  backgroundColor: colors.charcoal,
  padding: '40px 32px 36px',
  textAlign: 'center',
};

const logoStyle: React.CSSProperties = {
  borderRadius: '14px',
  marginBottom: '16px',
};

const heroHeading: React.CSSProperties = {
  color: colors.white,
  fontSize: '28px',
  fontWeight: '800',
  margin: '0 0 8px',
  letterSpacing: '-0.5px',
};

const heroSub: React.CSSProperties = {
  color: '#999990',
  fontSize: '14px',
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
  color: colors.textMuted,
  margin: '0 0 8px',
};

const applicantName: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '800',
  color: colors.textPrimary,
  margin: '0 0 4px',
  letterSpacing: '-0.3px',
};

const dividerThin: React.CSSProperties = {
  borderColor: colors.border,
  margin: '16px 0 0',
};

const divider: React.CSSProperties = {
  borderColor: colors.border,
  margin: '24px 0 16px',
};

const metaCol: React.CSSProperties = {
  width: '33%',
  paddingRight: '8px',
};

const metaLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: colors.textMuted,
  margin: '0 0 2px',
};

const metaValue: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: colors.textPrimary,
  margin: 0,
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

const jobRow: React.CSSProperties = {
  paddingTop: '12px',
  paddingBottom: '12px',
};

const jobTitle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: '700',
  color: colors.textPrimary,
  margin: '0 0 2px',
};

const jobDates: React.CSSProperties = {
  fontSize: '12px',
  color: colors.textMuted,
  margin: 0,
};

const jobDuties: React.CSSProperties = {
  fontSize: '13px',
  color: '#555550',
  lineHeight: '1.5',
  margin: '6px 0 0',
};

const availCol: React.CSSProperties = {
  paddingRight: '6px',
  paddingBottom: '6px',
};

const availChip: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '10px 8px',
  textAlign: 'center',
};

const availDay: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0.08em',
  color: colors.green,
  margin: '0 0 2px',
};

const availHours: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  color: colors.textPrimary,
  margin: 0,
  lineHeight: '1.3',
};

const footer: React.CSSProperties = {
  fontSize: '11px',
  color: colors.textMuted,
  textAlign: 'center',
  margin: 0,
  lineHeight: '1.5',
};
