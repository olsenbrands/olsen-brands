import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface SubwayWelcomeProps {
  firstName: string;
  locationName: string;       // e.g. "Kaysville Walmart"
  hourlyBase: string;         // e.g. "$13.00"
  tipAmount: string;          // e.g. "$1.00"
  effectiveWage: string;      // e.g. "$14.00"
  posPin: string;             // e.g. "288"
  trainingUsername: string;   // e.g. "CameronSchultz4060"
  trainingPassword: string;   // e.g. "CameronS4060"
}

export default function SubwayWelcome({
  firstName = 'Cameron',
  locationName = 'Kaysville Walmart',
  hourlyBase = '$13.00',
  tipAmount = '$1.00',
  effectiveWage = '$14.00',
  posPin = '288',
  trainingUsername = 'CameronSchultz4060',
  trainingPassword = 'CameronS4060',
}: SubwayWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Subway at {locationName}, {firstName}!</Preview>
      <Body style={body}>

        {/* Header */}
        <Section style={header}>
          <Text style={headerEyebrow}>Subway · {locationName}</Text>
          <Heading style={headerHeading}>Welcome to the team, {firstName}! 🎉</Heading>
        </Section>

        <Container style={container}>

          {/* Intro */}
          <Section style={card}>
            <Text style={bodyText}>
              Welcome to Subway at {locationName}! Here's everything you need to get started.
            </Text>
          </Section>

          {/* Pay */}
          <Section style={card}>
            <Text style={sectionLabel}>Your Pay</Text>
            <Section style={payGrid}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={payCell}>
                      <Text style={payAmount}>{hourlyBase}</Text>
                      <Text style={payLabel}>Base Hourly Rate</Text>
                    </td>
                    <td style={{ ...payCell, textAlign: 'center' as const }}>
                      <Text style={{ ...payAmount, color: '#888880' }}>+</Text>
                    </td>
                    <td style={payCell}>
                      <Text style={payAmount}>{tipAmount}</Text>
                      <Text style={payLabel}>Guaranteed Tips / hr</Text>
                    </td>
                    <td style={{ ...payCell, textAlign: 'center' as const }}>
                      <Text style={{ ...payAmount, color: '#888880' }}>=</Text>
                    </td>
                    <td style={payCell}>
                      <Text style={{ ...payAmount, color: colors.green }}>{effectiveWage}+</Text>
                      <Text style={payLabel}>Effective Starting Wage</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Text style={noteText}>
              You'll likely earn more than {effectiveWage}/hr with tips as long as you provide good customer service.
            </Text>
            <Text style={noteText}>
              Your initial employment will be under a <strong>90-day probationary period</strong> while we evaluate your performance and ensure you work well at our location.
            </Text>
          </Section>

          {/* In-Restaurant Training */}
          <Section style={card}>
            <Text style={sectionLabel}>In-Restaurant Training</Text>
            <Text style={bodyText}>
              Your first day of in-restaurant training will be scheduled as soon as you complete your University of Subway training (see below). Once you've completed <strong>100% of your initial training</strong>, contact Jordan via text and he'll schedule your in-restaurant training.
            </Text>
            <Text style={bodyText}>
              You'll receive an invite to a group app called <strong>Band</strong> which will have your posted schedule.
            </Text>
            <Section style={pinBox}>
              <Text style={pinLabel}>Your POS Login</Text>
              <Text style={pinValue}>Username: <strong>{posPin}</strong> &nbsp;·&nbsp; Password: <strong>{posPin}</strong></Text>
            </Section>
          </Section>

          {/* Step 1 - University of Subway */}
          <Section style={stepCard}>
            <Text style={stepNumber}>#1</Text>
            <Text style={stepTitle}>University of Subway</Text>
            <Text style={bodyText}>
              University of Subway is an online app you'll use periodically throughout your time at Subway to train on various skills and subjects. Before your first day of in-restaurant training you need to complete the <strong>"Sandwich Artistry"</strong> curriculum — approximately 4 hours. <strong>You'll be paid for this time.</strong>
            </Text>
            <Text style={bodyText}>Here's what to do:</Text>
            <Text style={step}>1. Download the University of Subway app</Text>
            <Text style={stepSub}>
              <Link href="https://apps.apple.com/us/app/university-of-subway/id627892212" style={linkStyle}>Apple App Store (iPhone)</Link>
              {' · '}
              <Link href="https://play.google.com/store/apps/details?id=com.subway.universityofsubway" style={linkStyle}>Google Play (Android)</Link>
              {' · '}
              <Link href="https://www.universityofsubway.com" style={linkStyle}>Browser</Link>
            </Text>
            <Text style={step}>2. Log in with your credentials</Text>
            <Section style={credBox}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '24px' }}>
                      <Text style={credLabel}>Username</Text>
                      <Text style={credValue}>{trainingUsername}</Text>
                    </td>
                    <td>
                      <Text style={credLabel}>Password</Text>
                      <Text style={credValue}>{trainingPassword}</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
            <Text style={step}>3. Complete the <strong>"Sandwich Artistry"</strong> curriculum</Text>
            <Text style={noteText}>
              When you get to "in restaurant" sections — go ahead and complete them in the app so you reach 100%. We'll review this in person. It's fun and interactive — you'll learn a lot!
            </Text>
            <Text style={{ ...noteText, fontWeight: '700', color: colors.green }}>
              Please have it completed before your first day of in-restaurant training.
            </Text>
          </Section>

          {/* Step 2 - Food Handlers */}
          <Section style={stepCard}>
            <Text style={stepNumber}>#2</Text>
            <Text style={stepTitle}>Food Handlers Permit</Text>
            <Text style={bodyText}>
              If you don't already have a food handlers permit you can get one at{' '}
              <Link href="https://easyfoodhandlers.com" style={linkStyle}>easyfoodhandlers.com</Link>.
              Make sure to bring a printout of your certificate or your temporary certificate — we need a copy for the restaurant.
            </Text>
            <Text style={{ ...noteText, fontWeight: '700' }}>
              Please bring a copy on your first day of training.
            </Text>
          </Section>

          {/* Step 3 - Gusto */}
          <Section style={stepCard}>
            <Text style={stepNumber}>#3</Text>
            <Text style={stepTitle}>Gusto — Payroll Setup</Text>
            <Text style={bodyText}>
              You will receive an email from <strong>Gusto</strong>, our payroll company. Click the link in that email and follow the instructions to enter your W-4 information and Direct Deposit info.
            </Text>
            <Text style={{ ...noteText, color: '#c0392b', fontWeight: '700' }}>
              ⚠️ If you delay doing this you will not get paid on time. Please don't wait.
            </Text>
          </Section>

          {/* Sign-off */}
          <Section style={card}>
            <Text style={bodyText}>Let me know if you have any questions!</Text>
            <Text style={bodyText}>
              Thanks,<br />
              <strong>Jordan Olsen</strong><br />
              Subway · {locationName}
            </Text>
          </Section>

          <Hr style={divider} />
          <Text style={footer}>
            Subway · {locationName} · OlsenBrands
          </Text>

        </Container>
      </Body>
    </Html>
  );
}

// ─── Colors ─────────────────────────────────────────────────────────────────
const colors = {
  subway: '#009B48',   // Subway green
  yellow: '#FFC600',   // Subway yellow
  charcoal: '#1a1a1a',
  green: '#3a7d44',
  white: '#ffffff',
  offWhite: '#f7f7f5',
  border: '#e8e8e4',
  muted: '#888880',
};

// ─── Styles ─────────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: 0,
  padding: 0,
};

const header: React.CSSProperties = {
  background: `linear-gradient(135deg, ${colors.subway} 0%, #006b31 100%)`,
  padding: '36px 32px',
  textAlign: 'center',
};

const headerEyebrow: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.7)',
  margin: '0 0 8px',
};

const headerHeading: React.CSSProperties = {
  color: colors.white,
  fontSize: '26px',
  fontWeight: '800',
  margin: 0,
  letterSpacing: '-0.4px',
};

const container: React.CSSProperties = {
  maxWidth: '600px',
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

const stepCard: React.CSSProperties = {
  ...card,
  borderLeft: `4px solid ${colors.subway}`,
  borderRadius: '0 12px 12px 0',
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
  margin: '0 0 12px',
};

const noteText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.6',
  color: '#666660',
  margin: '0 0 8px',
};

const payGrid: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  border: `1px solid ${colors.border}`,
};

const payCell: React.CSSProperties = {
  textAlign: 'center',
  padding: '0 8px',
};

const payAmount: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '800',
  color: colors.charcoal,
  margin: '0 0 2px',
  letterSpacing: '-0.5px',
};

const payLabel: React.CSSProperties = {
  fontSize: '10px',
  color: colors.muted,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  margin: 0,
};

const pinBox: React.CSSProperties = {
  backgroundColor: colors.charcoal,
  borderRadius: '8px',
  padding: '14px 20px',
  marginTop: '12px',
};

const pinLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 4px',
};

const pinValue: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: colors.white,
  margin: 0,
};

const stepNumber: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '900',
  letterSpacing: '0.1em',
  color: colors.subway,
  margin: '0 0 2px',
  textTransform: 'uppercase',
};

const stepTitle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '800',
  color: colors.charcoal,
  margin: '0 0 12px',
  letterSpacing: '-0.3px',
};

const step: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: colors.charcoal,
  margin: '8px 0 2px',
};

const stepSub: React.CSSProperties = {
  fontSize: '13px',
  color: colors.muted,
  margin: '0 0 8px',
  paddingLeft: '12px',
};

const credBox: React.CSSProperties = {
  backgroundColor: colors.offWhite,
  border: `1px solid ${colors.border}`,
  borderRadius: '8px',
  padding: '12px 16px',
  margin: '8px 0 12px',
};

const credLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: colors.muted,
  margin: '0 0 4px',
};

const credValue: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: colors.charcoal,
  margin: 0,
  fontFamily: 'monospace',
};

const linkStyle: React.CSSProperties = {
  color: colors.subway,
  textDecoration: 'underline',
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
};
