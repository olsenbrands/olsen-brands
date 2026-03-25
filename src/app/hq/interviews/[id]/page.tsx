import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InterviewActions from './InterviewActions';

export const revalidate = 0;

function Row({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex gap-4 py-2 border-b border-[var(--border)] last:border-0">
      <span className="w-48 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] pt-0.5">{label}</span>
      <span className="text-sm text-[var(--text-primary)] flex-1">{String(value)}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden mb-4">
      <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border)] px-5 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[var(--text-muted)]">Not rated</span>;
  const label = rating <= 1 ? 'Poor' : rating <= 2 ? 'Fair' : rating <= 3 ? 'Good' : rating <= 4 ? 'Great' : 'Excellent';
  return (
    <span className="flex items-center gap-2">
      <span className="text-lg text-[#e07b35]">{'●'.repeat(Math.floor(rating))}{rating % 1 >= 0.5 ? '◐' : ''}{'○'.repeat(5 - Math.ceil(rating))}</span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{rating}/5 — {label}</span>
    </span>
  );
}

export default async function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: interview, error } = await supabase
    .from('subway_interviews')
    .select('*, hourly_base, tip_amount, pos_pin, training_username, training_password, welcome_sent_at')
    .eq('id', id)
    .single();

  if (error || !interview) notFound();

  const availDays = (interview.available_days as string[] | null) || [];
  const unavailDays = (interview.unavailable_days as string[] | null) || [];
  const availTimes = (interview.available_times as Record<string, string> | null) || {};

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Back */}
      <Link href="/hq/interviews" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-5 transition-colors">
        <ArrowLeft size={16} /> Back to Interviews
      </Link>

      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">{interview.business || 'Unknown Location'}</p>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
              {interview.name || 'Unknown Candidate'}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
              {interview.phone && <span>📞 {interview.phone}</span>}
              {interview.email && <span>✉️ {interview.email}</span>}
              {interview.age_group && <span>👤 {interview.age_group}</span>}
              {interview.interview_date && (
                <span>📅 {new Date(interview.interview_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StarDisplay rating={interview.star_rating} />
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              interview.status === 'hired' ? 'bg-green-100 text-green-800' :
              interview.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {interview.status === 'hired' ? '✅ Hired' : interview.status === 'rejected' ? '❌ No Hire' : '🔵 New'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <InterviewActions interview={interview} />

      {/* Candidate Info */}
      <Section title="Candidate Information">
        <Row label="School" value={interview.school} />
        <Row label="Grade" value={interview.grade} />
        <Row label="Shirt Size" value={interview.shirt_size} />
        <Row label="Employment Type" value={interview.employment_type} />
        <Row label="Age Notes" value={interview.age_notes} />
      </Section>

      {/* Interview Questions */}
      <Section title="Interview Questions">
        <Row label="Why Subway?" value={interview.why_subway} />
        <Row label="Prior Experience" value={interview.prior_experience} />
        <Row label="What Did You Learn?" value={interview.learned_from_experience} />
        <Row label="Hobbies" value={interview.hobbies} />
        <Row label="Why Right Person?" value={interview.why_right_person} />
      </Section>

      {/* Availability */}
      <Section title="Availability">
        {availDays.length > 0 && (
          <div className="py-2 border-b border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {availDays.map(day => (
                <span key={day} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                  {day}{availTimes[day] ? ` · ${availTimes[day]}` : ''}
                </span>
              ))}
            </div>
          </div>
        )}
        {unavailDays.length > 0 && (
          <div className="py-2 border-b border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Not Available</p>
            <div className="flex flex-wrap gap-2">
              {unavailDays.map(day => (
                <span key={day} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">{day}</span>
              ))}
            </div>
          </div>
        )}
        <Row label="Unavailable Reason" value={interview.unavailable_reason} />
        <Row label="Future Commitments" value={interview.future_commitments} />
        <Row label="Availability Notes" value={interview.availability_notes} />
      </Section>

      {/* Shift Preference */}
      <Section title="Shift Preference">
        <Row label="Night Crew" value={interview.night_crew_preference} />
        <Row label="Day Crew" value={interview.day_crew_preference} />
        <Row label="Saturday Events" value={interview.available_saturday_events} />
        <Row label="Available 7:30 AM" value={interview.available_early_730} />
        <Row label="Days Per Week" value={interview.days_per_week} />
      </Section>

      {/* Behavioral */}
      <Section title="Personal &amp; Behavioral">
        <Row label="Biggest Strength" value={interview.biggest_strength} />
        <Row label="Biggest Struggle" value={interview.biggest_struggle} />
        <Row label="Struggle Reason" value={interview.struggle_reason} />
        <Row label="1-Year Goal" value={interview.one_year_goal} />
        <Row label="Can Lift 50 lbs" value={interview.can_lift_50lbs} />
        <Row label="Can Stand 4–6 hrs" value={interview.can_stand_4_6hrs} />
        <Row label="Not Busy Behavior" value={interview.not_busy_behavior} />
        <Row label="Good Leader" value={interview.good_leader} />
        <Row label="Pet Peeve" value={interview.coworker_pet_peeve} />
        <Row label="Rule Following Score" value={interview.rule_following_score ? `${interview.rule_following_score}/10` : null} />
        <Row label="Rule Following Notes" value={interview.rule_following_notes} />
        <Row label="Fav Sandwich" value={interview.favorite_subway_sandwich} />
      </Section>

      {/* Offer */}
      <Section title="Offer">
        <Row label="Base Wage" value={interview.offered_base_wage} />
        <Row label="Total with Tips" value={interview.offered_total_wage} />
        <Row label="Wage Accepted" value={interview.wage_works_for_candidate} />
      </Section>

      {/* Internal */}
      <Section title="Internal Notes">
        <Row label="Interviewer Notes" value={interview.interviewer_notes} />
        {interview.rejection_notes && <Row label="Rejection Notes" value={interview.rejection_notes} />}
        <Row label="Hired" value={interview.hired ? 'Yes' : null} />
      </Section>

    </div>
  );
}
