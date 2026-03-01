import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\\n/g, '').trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\\n/g, '').trim();
const HQ_PASSWORD = process.env.HQ_PASSWORD || '5421';

interface Blocker {
  id: string;
  type: 'credential' | 'auth' | 'api_key' | 'waiting_jordan' | 'waiting_external' | 'other';
  description: string;
  resolved: boolean;
  created_at: string;
  created_by: string;
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  const botKey = request.headers.get('X-Bot-Key');
  if (botKey === HQ_PASSWORD) return true;
  
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('hq-auth');
  if (authCookie?.value === 'authenticated') return true;
  
  return false;
}

async function getTask(id: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/kanban_tasks?id=eq.${id}&select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    },
    cache: 'no-store',
  });
  
  if (!response.ok) return null;
  const tasks = await response.json();
  return tasks[0] || null;
}

async function updateTaskBlockers(id: string, blockers: Blocker[]) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/kanban_tasks?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ blockers }),
  });
  
  if (!response.ok) return null;
  const updated = await response.json();
  return updated[0] || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Validate required fields
  if (!body.type || !body.description || !body.created_by) {
    return NextResponse.json({ 
      error: 'Missing required fields: type, description, created_by' 
    }, { status: 400 });
  }

  const validTypes = ['credential', 'auth', 'api_key', 'waiting_jordan', 'waiting_external', 'other'];
  if (!validTypes.includes(body.type)) {
    return NextResponse.json({ error: 'Invalid blocker type' }, { status: 400 });
  }

  // Get current task
  const task = await getTask(id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Create new blocker
  const newBlocker: Blocker = {
    id: uuidv4(),
    type: body.type,
    description: body.description,
    resolved: false,
    created_at: new Date().toISOString(),
    created_by: body.created_by,
  };

  // Add to existing blockers
  const blockers = [...(task.blockers || []), newBlocker];
  
  const updated = await updateTaskBlockers(id, blockers);
  if (!updated) {
    return NextResponse.json({ error: 'Failed to add blocker' }, { status: 500 });
  }

  return NextResponse.json(newBlocker, { status: 201 });
}
