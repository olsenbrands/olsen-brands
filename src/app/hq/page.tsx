'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
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
  Loader2,
  Zap
} from 'lucide-react';
import CronsPanel from './components/CronsPanel';

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

const mobileTabs = [
  { id: 'activity', label: 'Activity', icon: Zap },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'actions', label: 'Actions', icon: Target },
] as const;

type MobileTab = typeof mobileTabs[number]['id'];

const quickActions = [
  {
    title: "Vault",
    description: "Documents & files",
    icon: Archive,
    href: "/hq/vault",
    color: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400"
  },
  {
    title: "Missions",
    description: "Projects & tasks",
    icon: Target,
    href: "/hq/missions", 
    color: "bg-green-500/10 border-green-500/20",
    iconColor: "text-green-400"
  },
  {
    title: "Analytics",
    description: "External dashboard",
    icon: ExternalLink,
    href: "https://analytics.olsenbrands.com",
    external: true,
    color: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400"
  },
  {
    title: "Settings",
    description: "Configure system",
    icon: Settings,
    href: "/hq/settings",
    color: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-400"
  }
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'commit': return GitCommit;
    case 'deploy': return CheckCircle;
    case 'task': return Bot;
    default: return Activity;
  }
}

function getActivityIconColor(type: string) {
  switch (type) {
    case 'commit': return 'text-blue-400';
    case 'deploy': return 'text-green-400';
    case 'task': return 'text-purple-400';
    default: return 'text-gray-400';
  }
}

// ─── Mobile Components ─────────────────────────────────

function StatStrip({ ventures, agents }: { ventures: VenturesData | null; agents: AgentsData | null }) {
  const stats = [
    { label: "Ventures", value: ventures?.summary.totalVentures ?? "—", color: "text-green-400" },
    { label: "Properties", value: ventures?.summary.ownedRealEstate ?? "—", color: "text-blue-400" },
    { label: "AI Agents", value: agents?.agents.filter(a => a.status === 'active').length ?? "—", color: "text-purple-400" },
    { label: "Health", value: "98.7%", color: "text-green-400" },
  ];

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide md:hidden">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-shrink-0 flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-4 py-2"
        >
          <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
          <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

function MobileTabBar({ activeTab, onTabChange }: { activeTab: MobileTab; onTabChange: (tab: MobileTab) => void }) {
  return (
    <div className="flex gap-1 px-4 py-2 md:hidden">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]'
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function MobileActivityTab({ activity }: { activity: ActivityData | null }) {
  if (!activity || activity.activities.length === 0) {
    return <p className="text-[var(--text-muted)] text-center py-8">No recent activity</p>;
  }

  return (
    <div className="space-y-1 px-4">
      {activity.activities.map((item, index) => {
        const IconComponent = getActivityIcon(item.type);
        const iconColor = getActivityIconColor(item.type);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
          >
            <IconComponent size={16} className={`${iconColor} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium leading-tight hover:underline line-clamp-2">
                  {item.title}
                </a>
              ) : (
                <p className="text-sm font-medium leading-tight line-clamp-2">{item.title}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--text-muted)]">{item.description}</span>
                <span className="text-xs text-[var(--text-muted)]">• {item.timestamp}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function MobileAgentsTab({ agents }: { agents: AgentsData | null }) {
  if (!agents) return null;

  return (
    <div className="space-y-3 px-4">
      {agents.agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{agent.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{agent.name}</h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  agent.status === 'active' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                  {agent.status === 'active' ? 'Online' : 'Offline'}
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{agent.role}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-3">{agent.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <span key={cap} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                {cap}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MobileActionsTab() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.a
            key={action.title}
            href={action.href}
            target={action.external ? "_blank" : "_self"}
            rel={action.external ? "noopener noreferrer" : ""}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`flex flex-col items-center justify-center text-center p-5 rounded-xl border transition-all ${action.color}`}
          >
            <Icon size={28} className={`${action.iconColor} mb-2`} />
            <h3 className="font-bold text-sm">{action.title}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">{action.description}</p>
          </motion.a>
        );
      })}
    </div>
  );
}

// ─── Desktop Components ────────────────────────────────

function DesktopStatsGrid({ ventures, agents }: { ventures: VenturesData | null; agents: AgentsData | null }) {
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">{stat.title}</h3>
          <p className="text-xs text-[var(--text-muted)]">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────

export default function HQPage() {
  const [ventures, setVentures] = useState<VenturesData | null>(null);
  const [agents, setAgents] = useState<AgentsData | null>(null);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>('activity');

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
    <>
      {/* ═══ MOBILE LAYOUT ═══ */}
      <div className="md:hidden flex flex-col min-h-[calc(100vh-64px)]">
        {/* Stat pills */}
        <StatStrip ventures={ventures} agents={agents} />
        
        {/* Tab selector */}
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
        
        {/* Tab content */}
        <div className="flex-1 py-3 overflow-auto">
          <AnimatePresence mode="wait">
            {mobileTab === 'activity' && (
              <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MobileActivityTab activity={activity} />
              </motion.div>
            )}
            {mobileTab === 'agents' && (
              <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MobileAgentsTab agents={agents} />
              </motion.div>
            )}
            {mobileTab === 'actions' && (
              <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MobileActionsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden md:block p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <DesktopStatsGrid ventures={ventures} agents={agents} />
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
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {item.title}
                              </a>
                            ) : item.title}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={12} />
                            <span className="text-xs text-[var(--text-muted)]">{item.timestamp}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[var(--text-muted)] text-center py-8">No recent activity found</p>
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
                        <h3 className="font-bold">{assistant.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${assistant.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className="text-xs text-[var(--text-muted)]">{assistant.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-[var(--text-secondary)]">{assistant.uptime}</div>
                      <div className="text-xs text-[var(--text-muted)]">uptime</div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{assistant.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">{assistant.capabilities.join(' • ')}</span>
                    <div className={`flex items-center gap-1 ${assistant.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                      <Activity size={12} />
                      <span className="capitalize">{assistant.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Scheduled Jobs */}
        <section>
          <h2 className="text-xl font-bold mb-4">Scheduled Jobs</h2>
          <CronsPanel />
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                <action.icon size={24} className={`${action.iconColor} mb-4`} />
                <h3 className="font-bold mb-2">{action.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
