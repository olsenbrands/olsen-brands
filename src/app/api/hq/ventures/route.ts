import { NextResponse } from 'next/server';
import venturesData from '@/data/ventures.json';

export async function GET() {
  return NextResponse.json(venturesData);
}
