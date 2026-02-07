import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// This endpoint only works when running locally on the Mac Mini
// When running on Vercel, the sync must be triggered via Clawdbot
export async function POST() {
  // Check if we're running locally (not on Vercel)
  const isLocal = !process.env.VERCEL;
  
  if (!isLocal) {
    return NextResponse.json({
      success: false,
      error: 'Sync can only be triggered locally. Use Clawdbot to trigger sync remotely.',
      hint: 'Ask Steve to run the sync script via Telegram'
    }, { status: 400 });
  }

  try {
    const scriptPath = `${process.env.HOME}/clawd/scripts/sync-cron-to-supabase.sh`;
    const { stdout, stderr } = await execAsync(`bash ${scriptPath}`);
    
    return NextResponse.json({
      success: true,
      output: stdout,
      errors: stderr || null,
    });
  } catch (err: unknown) {
    const error = err as Error & { stdout?: string; stderr?: string };
    console.error('Sync script error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
    }, { status: 500 });
  }
}
