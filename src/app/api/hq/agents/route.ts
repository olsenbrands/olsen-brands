import { NextResponse } from 'next/server';
import agentsData from '@/data/agents.json';

export async function GET() {
  // Add computed fields
  const enrichedAgents = agentsData.agents.map(agent => ({
    ...agent,
    uptime: "99%+", // TODO: Pull from real monitoring
    lastActivity: "Recently active"
  }));

  return NextResponse.json({
    agents: enrichedAgents,
    lastUpdated: agentsData.lastUpdated
  });
}
