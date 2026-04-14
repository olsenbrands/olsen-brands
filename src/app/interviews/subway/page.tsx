'use client';

import { useState } from 'react';
import { getInterviewBranding } from '@/lib/interview-branding';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BUSINESSES = [
  'Subway — Kaysville',
  'Subway — Morgan',
  'Subway — Ogden',
  "Wedgie's — Clinton",
  'FiiZ — Clinton',
  'FiiZ — Kaysville East',
  'FiiZ — Kaysville West',
];

type FormData = {
  business: string;
  interview_date: string;
  name: string;
  phone: string;
  email: string;
  shirt_size: string;
  school: string;
  grade: string;
  age_group: string;
  age_notes: string;
  employment_type: string;
  why_subway: string;
  prior_experience: string;
  learned_from_experience: string;
  hobbies: string;
  available_days: string[];
  available_times: Record<string, string>;
  unavailable_days: string[];
  unavailable_reason: string;
  future_commitments: string;
  availability_notes: string;
  night_crew_preference: string;
  day_crew_preference: string;
  available_saturday_events: string;
  available_early_730: string;
  days_per_week: string;
  biggest_strength: string;
  biggest_struggle: string;
  struggle_reason: string;
  one_year_goal: string;
  can_lift_50lbs: string;
  can_stand_4_6hrs: string;
  not_busy_behavior: string;
  good_leader: string;
  coworker_pet_peeve: string;
  rule_following_score: string;
  rule_following_notes: string;
  favorite_subway_sandwich: string;
  offered_base_wage: string;
  offered_total_wage: string;
  wage_works_for_candidate: string;
  why_right_person: string;
  interviewer_notes: string;
  hired: boolean;
  star_rating: number;
};

const empty: FormData = {
  business: 'Subway — Kaysville',
  interview_date: new Date().toISOString().split('T')[0],
  name: '', phone: '', email: '', shirt_size: '', school: '', grade: '',
  age_group: '', age_notes: '', employment_type: '',
  why_subway: '', prior_experience: '', learned_from_experience: '', hobbies: '',
  available_days: [], available_times: {},
  unavailable_days: [], unavailable_reason: '', future_commitments: '', availability_notes: '',
  night_crew_preference: '', day_crew_preference: '',
  available_saturday_events: '', available_early_730: '', days_per_week: '',
  biggest_strength: '', biggest_struggle: '', struggle_reason: '', one_year_goal: '',
  can_lift_50lbs: '', can_stand_4_6hrs: '',
  not_busy_behavior: '', good_leader: '', coworker_pet_peeve: '',
  rule_following_score: '', rule_following_notes: '', favorite_subway_sandwich: '',
  offered_base_wage: '', offered_total_wage: '', wage_works_for_candidate: '', why_right_person: '',
  interviewer_notes: '', hired: false, star_rating: 0,
};

function generatePDF(form: FormData) {
  const branding = getInterviewBranding(form.business);
  // Dynamic import to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF();
    const name = form.name || 'Unknown';
    const date = form.interview_date || new Date().toISOString().split('T')[0];

    // Colors
    const charcoal: [number, number, number] = [26, 26, 26];
    const green: [number, number, number] = [58, 125, 68];
    const orange: [number, number, number] = [224, 123, 53];
    const white: [number, number, number] = [255, 255, 255];
    const light: [number, number, number] = [247, 247, 245];
    const muted: [number, number, number] = [136, 136, 128];
    const colors = { orange, green, charcoal };

    let y = 0;

    // Header bar
    doc.setFillColor(...charcoal);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(branding.interviewTitle, 14, 14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(name, 14, 22);
    doc.text(`${form.business || ''} · ${date}`, 196, 22, { align: 'right' });
    y = 42;

    const section = (title: string) => {
      doc.setFillColor(...light);
      doc.rect(10, y - 4, 190, 8, 'F');
      doc.setTextColor(...green);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), 14, y + 1);
      y += 10;
      doc.setTextColor(...charcoal);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    };

    const field = (label: string, value: string | undefined) => {
      if (!value) return;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...muted);
      doc.setFontSize(8);
      doc.text(label.toUpperCase(), 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...charcoal);
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(value, 182);
      lines.forEach((line: string) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(line, 14, y);
        y += 5;
      });
      y += 3;
    };

    // Candidate Info
    section('Candidate Information');
    field('Name', form.name);
    field('Phone', form.phone);
    field('Email', form.email);
    field('Shirt Size', form.shirt_size);
    field('School', form.school);
    field('Grade', form.grade);
    field('Age Group', form.age_group);
    field('Age Notes', form.age_notes);
    field('Employment Type', form.employment_type);

    // Interview Questions
    section('Interview Questions');
    field(branding.workQuestionShort, form.why_subway);
    field('Prior Work Experience', form.prior_experience);
    field('What Did You Learn?', form.learned_from_experience);
    field('Hobbies & Activities', form.hobbies);

    // Availability
    section('Availability');
    if (form.available_days.length > 0) {
      field('Available Days', form.available_days.join(', '));
      const timesStr = form.available_days
        .filter(d => form.available_times[d])
        .map(d => `${d}: ${form.available_times[d]}`)
        .join('  ·  ');
      if (timesStr) field('Available Times', timesStr);
    }
    if (form.unavailable_days.length > 0) {
      field('Not Available', form.unavailable_days.join(', '));
    }
    field('Reason Not Available', form.unavailable_reason);
    field('Future Commitments', form.future_commitments);
    field('Availability Notes', form.availability_notes);

    // Shift Preference
    section('Shift Preference');
    field('Night Crew Preference', form.night_crew_preference);
    field('Day Crew Preference', form.day_crew_preference);
    field('Available for Saturday Events', form.available_saturday_events);
    field('Available at 7:30 AM', form.available_early_730);
    field('Days Per Week Wanted', form.days_per_week);

    // Behavioral
    section('Personal & Behavioral');
    field('Biggest Strength', form.biggest_strength);
    field('Biggest Struggle', form.biggest_struggle);
    field('Struggle Reason', form.struggle_reason);
    field('Where in 1 Year?', form.one_year_goal);
    field('Can Lift 50 lbs?', form.can_lift_50lbs);
    field('Can Stand 4–6 Hours?', form.can_stand_4_6hrs);
    field('When Not Busy, What\'s Appropriate?', form.not_busy_behavior);
    field('What Makes a Good Leader?', form.good_leader);
    field('Biggest Co-worker Pet-peeve', form.coworker_pet_peeve);
    field('Rule Following Score (1–10)', form.rule_following_score);
    field('Rule Following Notes', form.rule_following_notes);
    field(branding.favoriteItemLabel, form.favorite_subway_sandwich);

    // Offer
    section('Offer');
    field('Why Right Person for the Job?', form.why_right_person);
    field('Base Wage Offered', form.offered_base_wage);
    field('Total Wage with Tips', form.offered_total_wage);
    field('Wage Works for Candidate?', form.wage_works_for_candidate);

    // Internal
    section('Internal Notes');

    // Draw stars as filled/half/empty circles — no unicode
    if (form.star_rating > 0) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...muted);
      doc.setFontSize(8);
      doc.text('OVERALL RATING', 14, y);
      y += 6;

      const starX = 14;
      const starR = 4;
      const gap = 11;
      const ratingLabel = form.star_rating <= 1 ? 'Poor' : form.star_rating <= 2 ? 'Fair' : form.star_rating <= 3 ? 'Good' : form.star_rating <= 4 ? 'Great' : 'Excellent';

      for (let i = 1; i <= 5; i++) {
        const cx = starX + (i - 1) * gap + starR;
        const fill = form.star_rating >= i ? 1 : form.star_rating >= i - 0.5 ? 0.5 : 0;
        if (fill === 1) {
          doc.setFillColor(...colors.orange);
          doc.circle(cx, y, starR, 'F');
        } else if (fill === 0.5) {
          // Half — filled left semicircle
          doc.setFillColor(226, 226, 220);
          doc.circle(cx, y, starR, 'F');
          doc.setFillColor(...colors.orange);
          doc.rect(cx - starR, y - starR, starR, starR * 2, 'F');
          doc.circle(cx, y, starR, 'S');
        } else {
          doc.setFillColor(226, 226, 220);
          doc.circle(cx, y, starR, 'F');
        }
      }
      doc.setTextColor(...charcoal);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`${form.star_rating}/5 — ${ratingLabel}`, starX + 5 * gap + 4, y + 1);
      y += starR * 2 + 6;
    }

    field('Interviewer Notes', form.interviewer_notes);
    field('Hired?', form.hired ? 'Yes - HIRED' : undefined);

    doc.save(`${branding.pdfFilePrefix}_Interview_${name.replace(/\s+/g, '_')}_${date}.pdf`);
  });
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-widest text-[#888880] mb-1">
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-[#e8e8e4] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#c0c0bc] focus:outline-none focus:ring-2 focus:ring-[#3a7d44] focus:border-transparent transition"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-white border border-[#e8e8e4] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] placeholder-[#c0c0bc] focus:outline-none focus:ring-2 focus:ring-[#3a7d44] focus:border-transparent transition resize-none"
    />
  );
}

function RadioGroup({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? '' : opt)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
            value === opt
              ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
              : 'bg-white border-[#e8e8e4] text-[#555550] hover:border-[#3a7d44]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden">
      <div className="bg-[#f7f7f5] border-b border-[#e8e8e4] px-5 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#888880]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SubwayInterviewPage() {
  const [form, setForm] = useState<FormData>(empty);
  const branding = getInterviewBranding(form.business);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedId, setSavedId] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const toggleDay = (day: string, type: 'available' | 'unavailable') => {
    const key = type === 'available' ? 'available_days' : 'unavailable_days';
    setForm(f => ({
      ...f,
      [key]: f[key].includes(day) ? f[key].filter(d => d !== day) : [...f[key], day],
    }));
  };

  const handleSave = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/interviews/subway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Save failed');
      setSavedId(json.id);
      setStatus('saved');
      generatePDF(form);
    } catch {
      setStatus('error');
    }
  };

  const handleNew = () => {
    setForm(empty);
    setStatus('idle');
    setSavedId(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      {/* Header */}
      <div className="bg-[#1a1a1a] px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#555550] mb-2">OlsenBrands · Internal Tool</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">{branding.brandName} Interview</h1>
          <p className="text-[#888880] text-sm">Fill in as much or as little as needed. Everything is optional.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Success banner */}
        {status === 'saved' && (
          <div className="bg-[#f0faf0] border border-[#b2dfb2] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2e7d32] text-sm">✓ Interview saved &amp; PDF downloading</p>
              {savedId && <p className="text-xs text-[#888880] mt-0.5">ID: {savedId}</p>}
            </div>
            <button onClick={handleNew} className="text-xs font-bold text-[#3a7d44] hover:underline">
              New Interview →
            </button>
          </div>
        )}
        {status === 'error' && (
          <div className="bg-[#fff5f5] border border-[#f5c6c6] rounded-xl p-4">
            <p className="font-bold text-[#c62828] text-sm">Something went wrong — try again.</p>
          </div>
        )}

        {/* ── Business Selector ── */}
        <Card title="Location">
          <Field label="Which location is this interview for?">
            <div className="flex flex-wrap gap-2">
              {BUSINESSES.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => set('business', b)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    form.business === b
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                      : 'bg-white border-[#e8e8e4] text-[#555550] hover:border-[#3a7d44]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </Field>
        </Card>

        {/* ── Candidate Info ── */}
        <Card title="Candidate Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Name">
                <Input value={form.name} onChange={v => set('name', v)} placeholder="Full name" />
              </Field>
            </div>
            <Field label="Phone">
              <Input value={form.phone} onChange={v => set('phone', v)} placeholder="801-555-0100" />
            </Field>
            <Field label="Email">
              <Input value={form.email} onChange={v => set('email', v)} placeholder="email@example.com" />
            </Field>
            <Field label="School">
              <Input value={form.school} onChange={v => set('school', v)} placeholder="School name" />
            </Field>
            <Field label="Grade">
              <Input value={form.grade} onChange={v => set('grade', v)} placeholder="e.g. 10th" />
            </Field>
            <Field label="Shirt Size">
              <select
                value={form.shirt_size}
                onChange={e => set('shirt_size', e.target.value)}
                className="w-full bg-white border border-[#e8e8e4] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#3a7d44] transition"
              >
                <option value="">— select —</option>
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Interview Date">
              <Input type="date" value={form.interview_date} onChange={v => set('interview_date', v)} />
            </Field>
          </div>
          <Field label="Age Group">
            <RadioGroup options={['15', '16/17', '18+']} value={form.age_group} onChange={v => set('age_group', v)} />
          </Field>
          <Field label="Age Notes">
            <Input value={form.age_notes} onChange={v => set('age_notes', v)} placeholder="e.g. Turning 16 next month, has work permit..." />
          </Field>
          <Field label="Employment Type">
            <RadioGroup options={['Part-Time', 'Full-Time']} value={form.employment_type} onChange={v => set('employment_type', v)} />
          </Field>
        </Card>

        {/* ── Interview Questions ── */}
        <Card title="Interview Questions">
          <Field label={branding.workQuestion}>
            <Textarea value={form.why_subway} onChange={v => set('why_subway', v)} rows={3} />
          </Field>
          <Field label="What is your prior work experience?">
            <Textarea value={form.prior_experience} onChange={v => set('prior_experience', v)} rows={3} />
          </Field>
          <Field label="What did you learn from that job that will help here?">
            <Textarea value={form.learned_from_experience} onChange={v => set('learned_from_experience', v)} rows={3} />
          </Field>
          <Field label="Hobbies, sports, or activities?">
            <Textarea value={form.hobbies} onChange={v => set('hobbies', v)} rows={2} />
          </Field>
        </Card>

        {/* ── Availability ── */}
        <Card title="Availability">
          <Field label="Days Completely Open &amp; Available">
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day, 'available')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    form.available_days.includes(day)
                      ? 'bg-[#3a7d44] border-[#3a7d44] text-white'
                      : 'bg-white border-[#e8e8e4] text-[#555550] hover:border-[#3a7d44]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </Field>

          {form.available_days.length > 0 && (
            <div className="space-y-2">
              <Label>Available Times (per day)</Label>
              {form.available_days.map(day => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-semibold text-[#1a1a1a]">{day.slice(0, 3)}</span>
                  <Input
                    value={form.available_times[day] || ''}
                    onChange={v => set('available_times', { ...form.available_times, [day]: v })}
                    placeholder="e.g. 3pm–10pm"
                  />
                </div>
              ))}
            </div>
          )}

          <Field label="Days NOT Available">
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day, 'unavailable')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                    form.unavailable_days.includes(day)
                      ? 'bg-[#c0392b] border-[#c0392b] text-white'
                      : 'bg-white border-[#e8e8e4] text-[#555550] hover:border-[#c0392b]'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </Field>

          {form.unavailable_days.length > 0 && (
            <Field label="Why not available those days?">
              <Input value={form.unavailable_reason} onChange={v => set('unavailable_reason', v)} />
            </Field>
          )}

          <Field label="Future commitments that could interfere with work?">
            <Textarea value={form.future_commitments} onChange={v => set('future_commitments', v)} rows={2} />
          </Field>
          <Field label="Availability Notes">
            <Textarea value={form.availability_notes} onChange={v => set('availability_notes', v)} rows={2} placeholder="e.g. Said Sundays are flexible, needs off during soccer season in fall..." />
          </Field>
        </Card>

        {/* ── Shift Preference ── */}
        <Card title="Shift Preference">
          <Field label="Night Crew — What would you prefer?">
            <RadioGroup
              options={['More hours, later nights (until 10 PM)', 'Fewer hours, off earlier (7–8 PM)']}
              value={form.night_crew_preference}
              onChange={v => set('night_crew_preference', v)}
            />
          </Field>
          <Field label="Full-Time Day Crew — Which shift do you prefer?">
            <RadioGroup
              options={['7 AM – 3 PM', '9 AM – 3 PM', '11 AM – 3 PM', '11 AM – 4 PM']}
              value={form.day_crew_preference}
              onChange={v => set('day_crew_preference', v)}
            />
          </Field>
          <Field label="Available occasionally for Saturday school events?">
            <RadioGroup options={['Yes', 'No']} value={form.available_saturday_events} onChange={v => set('available_saturday_events', v)} />
          </Field>
          <Field label="Available to occasionally fill in at 7:30 AM?">
            <RadioGroup options={['Yes', 'No']} value={form.available_early_730} onChange={v => set('available_early_730', v)} />
          </Field>
          <Field label="How many days per week do you want to work?">
            <Input value={form.days_per_week} onChange={v => set('days_per_week', v)} placeholder="e.g. 3–4" />
          </Field>
        </Card>

        {/* ── Personal / Behavioral ── */}
        <Card title="Personal &amp; Behavioral">
          <Field label={branding.strengthQuestion}>
            <Textarea value={form.biggest_strength} onChange={v => set('biggest_strength', v)} rows={2} />
          </Field>
          <Field label="What do you struggle with most?">
            <RadioGroup
              options={['Being punctual', 'Being patient', 'Being outgoing']}
              value={form.biggest_struggle}
              onChange={v => set('biggest_struggle', v)}
            />
          </Field>
          {form.biggest_struggle && (
            <Field label="Why?">
              <Input value={form.struggle_reason} onChange={v => set('struggle_reason', v)} />
            </Field>
          )}
          <Field label="Where do you see yourself in a year?">
            <Textarea value={form.one_year_goal} onChange={v => set('one_year_goal', v)} rows={2} />
          </Field>
          <Field label="Can you lift 50 lb boxes repeatedly each shift?">
            <RadioGroup options={['Yes', 'No']} value={form.can_lift_50lbs} onChange={v => set('can_lift_50lbs', v)} />
          </Field>
          <Field label="Can you stand and work on your feet for 4–6 hours?">
            <RadioGroup options={['Yes', 'No']} value={form.can_stand_4_6hrs} onChange={v => set('can_stand_4_6hrs', v)} />
          </Field>
          <Field label="When it's not busy, what's appropriate to do?">
            <Textarea value={form.not_busy_behavior} onChange={v => set('not_busy_behavior', v)} rows={2} />
          </Field>
          <Field label="What makes a good leader at work?">
            <Textarea value={form.good_leader} onChange={v => set('good_leader', v)} rows={2} />
          </Field>
          <Field label="Biggest co-worker pet-peeve?">
            <Input value={form.coworker_pet_peeve} onChange={v => set('coworker_pet_peeve', v)} />
          </Field>
          <Field label="Rate yourself on following rules (1–10)">
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('rule_following_score', form.rule_following_score === String(n) ? '' : String(n))}
                  className={`w-10 h-10 rounded-lg text-sm font-bold border transition ${
                    form.rule_following_score === String(n)
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                      : 'bg-white border-[#e8e8e4] text-[#555550] hover:border-[#3a7d44]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Notes on rule-following answer">
            <Input value={form.rule_following_notes} onChange={v => set('rule_following_notes', v)} placeholder="e.g. Said they always follow rules but struggled to give an example..." />
          </Field>
          <Field label={branding.favoriteItemQuestion}>
            <Input value={form.favorite_subway_sandwich} onChange={v => set('favorite_subway_sandwich', v)} placeholder={branding.favoriteItemPlaceholder} />
          </Field>
        </Card>

        {/* ── Offer ── */}
        <Card title="Offer">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Base Hourly Wage">
              <Input value={form.offered_base_wage} onChange={v => set('offered_base_wage', v)} placeholder="$12.50" />
            </Field>
            <Field label="Total with Tips">
              <Input value={form.offered_total_wage} onChange={v => set('offered_total_wage', v)} placeholder="$13.50" />
            </Field>
          </div>
          <Field label="Does this wage work for the candidate?">
            <RadioGroup options={['Yes', 'No']} value={form.wage_works_for_candidate} onChange={v => set('wage_works_for_candidate', v)} />
          </Field>
        </Card>

        {/* ── Why Right Person ── */}
        <Card title="Closing Question">
          <Field label="Why do you think you're the right person for the job?">
            <Textarea value={form.why_right_person} onChange={v => set('why_right_person', v)} rows={4} placeholder="Candidate's answer..." />
          </Field>
        </Card>

        {/* ── Internal Notes ── */}
        <Card title="Internal Notes">
          <Field label="Overall Rating">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} className="relative w-8 h-8 cursor-pointer flex-shrink-0">
                  {/* Empty star base */}
                  <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#d0d0cc]">★</span>
                  {/* Full star overlay */}
                  {form.star_rating >= star && (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35]">★</span>
                  )}
                  {/* Half star overlay */}
                  {form.star_rating >= star - 0.5 && form.star_rating < star && (
                    <span className="absolute inset-0 flex items-center justify-center text-3xl leading-none text-[#e07b35] overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
                  )}
                  {/* Left half click = half star */}
                  <button
                    type="button"
                    className="absolute left-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                    onClick={() => set('star_rating', form.star_rating === star - 0.5 ? 0 : star - 0.5)}
                    title={`${star - 0.5} stars`}
                  />
                  {/* Right half click = full star */}
                  <button
                    type="button"
                    className="absolute right-0 top-0 w-1/2 h-full z-10 focus:outline-none"
                    onClick={() => set('star_rating', form.star_rating === star ? 0 : star)}
                    title={`${star} stars`}
                  />
                </div>
              ))}
              {form.star_rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-[#888880]">
                  {form.star_rating}/5 — {form.star_rating <= 1 ? 'Poor' : form.star_rating <= 2 ? 'Fair' : form.star_rating <= 3 ? 'Good' : form.star_rating <= 4 ? 'Great' : 'Excellent'}
                </span>
              )}
            </div>
          </Field>
          <Field label="Interviewer Notes (private)">
            <Textarea value={form.interviewer_notes} onChange={v => set('interviewer_notes', v)} rows={4} placeholder="Your private notes about this candidate..." />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set('hired', !form.hired)}
              className={`w-10 h-6 rounded-full transition-colors relative ${form.hired ? 'bg-[#3a7d44]' : 'bg-[#d0d0cc]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.hired ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm font-semibold text-[#1a1a1a]">Hired</span>
          </label>
        </Card>

        {/* ── Save Button ── */}
        <div className="pt-2 pb-8">
          <button
            onClick={handleSave}
            disabled={status === 'saving'}
            className={`w-full py-4 rounded-xl text-white text-base font-extrabold tracking-wide transition ${
              status === 'saving'
                ? 'bg-[#888880] cursor-not-allowed'
                : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] active:scale-[0.99]'
            }`}
          >
            {status === 'saving' ? 'Saving…' : '💾  Save Interview + Download PDF'}
          </button>
          <p className="text-center text-xs text-[#888880] mt-2">Saves to database and downloads a PDF to your computer</p>
        </div>

      </div>
    </div>
  );
}
