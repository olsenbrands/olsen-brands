import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WedgiesApplicationConfirmationProps {
  firstName: string;
}

export default function WedgiesApplicationConfirmation({
  firstName = 'there',
}: WedgiesApplicationConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We got your application, {firstName}! — Wedgie's Clinton</Preview>
      <Body style={body}>

        {/* ── Hero with food image ── */}
        <Section style={hero}>
          <Img
            src="https://www.olsenbrands.com/logos/wedgies.jpg"
            alt="Wedgie's"
            width="72"
            height="72"
            style={logoStyle}
          />
          <Heading style={heroHeading}>We got it! 🥗</Heading>
          <Text style={heroSub}>Your application is in. We'll be in touch.</Text>
        </Section>

        {/* ── Food hero image ── */}
        <Img
          src="https://www.olsenbrands.com/wedgies/wedgie-cba-hero.png"
          alt="Wedgie's signature salad"
          width="100%"
          style={heroImage}
        />

        <Container style={container}>

          {/* ── Message ── */}
          <Section style={card}>
            <Heading style={greeting}>Hey {firstName},</Heading>
            <Text style={bodyText}>
              Thanks for applying to Wedgie's! We've received your application and we're pumped you're interested in joining the team.
            </Text>
            <Text style={bodyText}>
              We'll hold on to your info and reach out if your availability and experience are a great fit. Keep an eye on your phone — we'll text or call when we're ready.
            </Text>
          </Section>

          {/* ── Divider with salad icon ── */}
          <Section style={{ textAlign: 'center', margin: '8px 0' }}>
            <Text style={dividerEmoji}>🥗 · 🥗 · 🥗</Text>
          </Section>

          {/* ── Location card ── */}
          <Section style={locationCard}>
            <Text style={locationLabel}>Come Find Us</Text>
            <Text style={locationName}>Wedgie's · Clinton, UT</Text>
            <Text style={locationAddress}>2212 W 1800 N Ste. B, Clinton, UT 84015</Text>
            <Hr style={dividerThin} />
            <Text style={hoursText}>Mon – Sat &nbsp;·&nbsp; 10:00 AM – 8:30 PM</Text>
          </Section>

          {/* ── Tagline ── */}
          <Section style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text style={tagline}>
              <span style={{ color: colors.green }}>Greens,</span>{' '}
              <span style={{ color: colors.orange }}>Proteins,</span>{' '}
              <span style={{ color: colors.charcoal }}>&amp; Ice Cream.</span>
            </Text>
          </Section>

          {/* ── Footer ── */}
          <Hr style={divider} />
          <Text style={footer}>
            You received this because you applied at olsenbrands.com/now-hiring-wedgies
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
  padding: '40px 32px 32px',
  textAlign: 'center',
};

const logoStyle: React.CSSProperties = {
  borderRadius: '14px',
  marginBottom: '16px',
};

const heroHeading: React.CSSProperties = {
  color: colors.white,
  fontSize: '30px',
  fontWeight: '800',
  margin: '0 0 8px',
  letterSpacing: '-0.5px',
};

const heroSub: React.CSSProperties = {
  color: '#999990',
  fontSize: '15px',
  margin: 0,
};

const heroImage: React.CSSProperties = {
  display: 'block',
  width: '100%',
  maxHeight: '280px',
  objectFit: 'cover',
  objectPosition: 'center',
};

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '0 16px 40px',
};

const card: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: '12px',
  padding: '28px 28px 20px',
  marginTop: '20px',
  border: `1px solid ${colors.border}`,
};

const greeting: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '800',
  color: colors.textPrimary,
  margin: '0 0 16px',
  letterSpacing: '-0.3px',
};

const bodyText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#444440',
  margin: '0 0 14px',
};

const dividerEmoji: React.CSSProperties = {
  fontSize: '16px',
  color: colors.textMuted,
  letterSpacing: '6px',
  margin: '4px 0',
};

const locationCard: React.CSSProperties = {
  backgroundColor: colors.charcoal,
  borderRadius: '12px',
  padding: '24px 28px',
  marginTop: '0',
};

const locationLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colors.green,
  margin: '0 0 6px',
};

const locationName: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '800',
  color: colors.white,
  margin: '0 0 4px',
  letterSpacing: '-0.3px',
};

const locationAddress: React.CSSProperties = {
  fontSize: '13px',
  color: '#aaaaaa',
  margin: 0,
};

const dividerThin: React.CSSProperties = {
  borderColor: '#333330',
  margin: '14px 0',
};

const hoursText: React.CSSProperties = {
  fontSize: '13px',
  color: '#aaaaaa',
  margin: 0,
};

const tagline: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '800',
  letterSpacing: '-0.2px',
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: colors.border,
  margin: '24px 0 16px',
};

const footer: React.CSSProperties = {
  fontSize: '11px',
  color: colors.textMuted,
  textAlign: 'center',
  margin: 0,
  lineHeight: '1.5',
};
