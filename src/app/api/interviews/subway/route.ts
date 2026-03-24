import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Strip undefined values — all fields optional
    const record: Record<string, unknown> = {};
    const fields = [
      'interview_date', 'name', 'phone', 'email', 'shirt_size', 'school', 'grade',
      'age_group', 'employment_type', 'why_subway', 'prior_experience',
      'learned_from_experience', 'hobbies', 'available_days', 'available_times',
      'unavailable_days', 'unavailable_reason', 'future_commitments',
      'night_crew_preference', 'day_crew_preference', 'available_saturday_events',
      'available_early_730', 'days_per_week', 'biggest_strength', 'biggest_struggle',
      'struggle_reason', 'one_year_goal', 'can_lift_50lbs', 'can_stand_4_6hrs',
      'not_busy_behavior', 'good_leader', 'coworker_pet_peeve', 'rule_following_score',
      'favorite_subway_sandwich', 'offered_base_wage', 'offered_total_wage',
      'wage_works_for_candidate', 'interviewer_notes', 'hired', 'star_rating',
    ];

    for (const field of fields) {
      if (body[field] !== undefined && body[field] !== '') {
        record[field] = body[field];
      }
    }

    // Default interview_date to today if not set
    if (!record.interview_date) {
      record.interview_date = new Date().toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('subway_interviews')
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error('[subway-interview] Insert error:', error);
      return NextResponse.json({ error: 'Failed to save interview' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id, data });
  } catch (err) {
    console.error('[subway-interview] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('subway_interviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ interviews: data });
}
