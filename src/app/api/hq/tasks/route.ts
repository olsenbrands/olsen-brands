import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\\n/g, '').trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\\n/g, '').trim();
const HQ_PASSWORD = process.env.HQ_PASSWORD || '5421';

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Check X-Bot-Key header
  const botKey = request.headers.get('X-Bot-Key');
  if (botKey === HQ_PASSWORD) return true;
  
  // Check hq-auth cookie (cookie stores 'authenticated' when logged in)
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('hq-auth');
  if (authCookie?.value === 'authenticated') return true;
  
  return false;
}

export async function GET(request: NextRequest) {
  if (!await isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const assignee = searchParams.get('assignee');
  const priority = searchParams.get('priority');

  let url = `${SUPABASE_URL}/rest/v1/kanban_tasks?select=*&order=sort_order.asc,created_at.desc`;
  
  if (status) url += `&status=eq.${status}`;
  if (assignee) url += `&assignee=eq.${assignee}`;
  if (priority) url += `&priority=eq.${priority}`;

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const tasks = await response.json();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  if (!await isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Validate required fields
  if (!body.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const task = {
    title: body.title,
    description: body.description || null,
    status: body.status || 'backlog',
    priority: body.priority || 'medium',
    assignee: body.assignee || 'unassigned',
    category: body.category || 'other',
    due_date: body.due_date || null,
    estimated_hours: body.estimated_hours || null,
    tags: body.tags || [],
    blockers: body.blockers || [],
    notes: body.notes || null,
    sort_order: body.sort_order || 0,
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/kanban_tasks`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const created = await response.json();
  return NextResponse.json(created[0], { status: 201 });
}
