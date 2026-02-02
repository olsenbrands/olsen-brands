'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Activity,
  Bot,
  CheckCircle,
  Clock,
  GitCommit,
  ExternalLink,
  Settings,
  Archive,
  Target,
  MapPin,
  Loader2
} from 'lucide-react';

// Types
interface Venture {
  id: string;
  name: string;
  type: string;
  brand: string;
  location: string;
  ownership: string;
  realEstate: string;
  status: string;
  flagship?: boolean;
  notes?: string;
}

interface VenturesData {
  ventures: Venture[];
  summary: {
    totalVentures: number;
    ownedRealEstate: number;
    leasedRealEstate: number;
    restaurants: number;
    education: number;
  };
}

interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: string;
  telegram: string;
  capabilities: string[];
  description: string;
  uptime: string;
  lastActivity: string;
}

interface AgentsData {
  agents: Agent[];
  lastUpdated: string;
}

interface ActivityItem {
  id: string;
  type: 'commit' | 'deploy' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  url?: string;
  author?: string;
}

interface ActivityData {
  activities: ActivityItem[];
  lastUpdated: string;
}

const quickActions = [
  {
    title: "View Vault",
    description: "Browse documents and memory files",
    icon: Archive,
    href: "/hq/vault",
    color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
  },
  {
    title: "Check Missions",
    description: "Review active projects and tasks",
    icon: Target,
    href: "/hq/missions", 
    color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
  },
  {
    title: "Launch Analytics",
    description: "Open external analytics dashboard",
    icon: ExternalLink,
    href: "https://analytics.olsenbrands.com",
    external: true,
    color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20"
  },
  {
    title: "System Settings",
    description: "Configure bot parameters",
    icon: Settings,
    href: "/hq/settings",
    color: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20"
  }
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'commit':
      return GitCommit;
    case 'deploy':
      return CheckCircle;
    case 'task':
      return Bot;
    default:
      return Activity;
  }
}

function getActivityIconColor(type: string) {
  switch (type) {
    case 'commit':
      return 'text-blue-400';
    case 'deploy':
      return 'text-green-400';
    case 'task':
      return 'text-purple-400';
    default:
      return 'text-gray-400';
  }
}

export default function HQPage() {
  const [ventures, setVentures] = useState<VenturesData | null>(null);
  const [agents, setAgents] = useState<AgentsData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [venturesRes, agentsRes, activityRes] = await Promise.all([
          fetch('/api/hq/ventures'),
          fetch('/api/hq/agents'),
          fetch('/api/hq/activity')
        ]);

        if (venturesRes.ok) setVentures(await venturesRes.json());
        if (agentsRes.ok) setAgents(await agentsRes.json());
        if (activityRes.ok) setActivity(await activityRes.json());
      } catch (error) {
        console.error('Failed to fetch HQ data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statsCards = [
    {
      title: "Active Ventures",
      value: ventures?.summary.totalVentures.toString() ?? "—",
      change: `${ventures?.summary.restaurants ?? 0} restaurants, ${ventures?.summary.education ?? 0} education`,
      icon: Building2,
      color: "text-green-400"
    },
    {
      title: "Owned Real Estate",
      value: ventures?.summary.ownedRealEstate.toString() ?? "—",
      change: `${ventures?.summary.leasedRealEstate ?? 0} leased properties`,
      icon: MapPin,
      color: "text-blue-400"
    },
    {
      title: "AI Assistants",
      value: agents?.agents.filter(a => a.status === 'active').length.toString() ?? "—",
      change: "All systems operational",
      icon: Bot,
      color: "text-purple-400"
    },
    {
      title: "System Health",
      value: "98.7%",
      change: "All gateways online",
      icon: Activity,
      color: "text-green-400"
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading HQ data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={24} className={stat.color} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                {stat.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)]">{stat.change}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section className="xl:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            {activity && activity.activities.length > 0 ? (
              <div className="space-y-4">
                {activity.activities.map((item, index) => {
                  const IconComponent = getActivityIcon(item.type);
                  const iconColor = getActivityIconColor(item.type);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <IconComponent size={20} className={iconColor} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[var(--text-primary)]">
                          {item.url ? (
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={12} />
                          <span className="text-xs text-[var(--text-muted)]">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-center py-8">
                No recent activity found
              </p>
            )}
          </div>
        </section>

        {/* AI Assistants */}
        <section>
          <h2 className="text-xl font-bold mb-4">AI Assistants</h2>
          <div className="space-y-4">
            {agents?.agents.map((assistant, index) => (
              <motion.div
                key={assistant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{assistant.emoji}</span>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">
                        {assistant.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          assistant.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-xs text-[var(--text-muted)]">
                          {assistant.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-[var(--text-secondary)]">
                      {assistant.uptime}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      uptime
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-[var(--text-secondary)]">
                    {assistant.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {assistant.telegram}
                  </span>
                  <div className={`flex items-center gap-1 ${
                    assistant.status === 'active' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    <Activity size={12} />
                    <span className="capitalize">{assistant.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.href}
              target={action.external ? "_blank" : "_self"}
              rel={action.external ? "noopener noreferrer" : ""}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`block p-6 rounded-xl border transition-all ${action.color}`}
            >
              <action.icon size={24} className="mb-4" />
              <h3 className="font-bold text-[var(--text-primary)] mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {action.description}
              </p>
              {action.external && (
                <ExternalLink size={16} className="mt-2 text-[var(--text-muted)]" />
              )}
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
