import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const allowed = [
    'business', 'status', 'hired', 'rejection_notes',
    'star_rating', 'interviewer_notes',
    'name', 'phone', 'email', 'shirt_size', 'school', 'grade',
    'age_group', 'age_notes', 'employment_type', 'interview_date',
    'why_subway', 'prior_experience', 'learned_from_experience', 'hobbies',
    'available_days', 'available_times', 'unavailable_days', 'unavailable_reason',
    'future_commitments', 'availability_notes',
    'night_crew_preference', 'day_crew_preference', 'available_saturday_events',
    'available_early_730', 'days_per_week',
    'biggest_strength', 'biggest_struggle', 'struggle_reason', 'one_year_goal',
    'can_lift_50lbs', 'can_stand_4_6hrs', 'not_busy_behavior', 'good_leader',
    'coworker_pet_peeve', 'rule_following_score', 'rule_following_notes',
    'favorite_subway_sandwich', 'why_right_person',
    'offered_base_wage', 'offered_total_wage', 'wage_works_for_candidate',
  ];

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const { data, error } = await supabase
    .from('subway_interviews')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from('subway_interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
