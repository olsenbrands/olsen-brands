import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\\n/g, '').trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\\n/g, '').trim();
const HQ_PASSWORD = process.env.HQ_PASSWORD || '5421';

interface Blocker {
  id: string;
  type: string;
  description: string;
  resolved: boolean;
  created_at: string;
  created_by: string;
  resolved_at?: string;
  resolved_by?: string;
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blockerId: string }> }
) {
  if (!await isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, blockerId } = await params;
  const body = await request.json();

  // Get current task
  const task = await getTask(id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  // Find and update the blocker
  const blockers: Blocker[] = task.blockers || [];
  const blockerIndex = blockers.findIndex((b: Blocker) => b.id === blockerId);
  
  if (blockerIndex === -1) {
    return NextResponse.json({ error: 'Blocker not found' }, { status: 404 });
  }

  // Update blocker (typically resolving it)
  if (body.resolved !== undefined) {
    blockers[blockerIndex].resolved = body.resolved;
    if (body.resolved) {
      blockers[blockerIndex].resolved_at = new Date().toISOString();
      blockers[blockerIndex].resolved_by = body.resolved_by || 'unknown';
    }
  }

  const updated = await updateTaskBlockers(id, blockers);
  if (!updated) {
    return NextResponse.json({ error: 'Failed to update blocker' }, { status: 500 });
  }

  return NextResponse.json(blockers[blockerIndex]);
}
