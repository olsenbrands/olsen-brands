'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Bot,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Play,
  Settings,
  Archive,
  Target
} from 'lucide-react';

export const metadata = {
  title: "OBM HQ | Olsen Brands Management",
  robots: "noindex, nofollow",
};

const statsCards = [
  {
    title: "Active Ventures",
    value: "6",
    change: "+2 this month",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-400"
  },
  {
    title: "Team Members",
    value: "24",
    change: "+3 new hires",
    trend: "up", 
    icon: Users,
    color: "text-blue-400"
  },
  {
    title: "Monthly Revenue",
    value: "$847K",
    change: "+12.5% vs last month",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400"
  },
  {
    title: "System Health",
    value: "98.7%",
    change: "All systems operational",
    trend: "stable",
    icon: Activity,
    color: "text-green-400"
  }
];

const aiAssistants = [
  {
    name: "Steve",
    emoji: "🦞",
    status: "active",
    lastActivity: "2 min ago",
    currentTask: "Analyzing venue metrics for FiiZ expansion",
    tasksCompleted: 47,
    uptime: "99.2%"
  },
  {
    name: "Erica",
    emoji: "🤖",
    status: "active", 
    lastActivity: "5 min ago",
    currentTask: "Processing Clinton Comeback applications",
    tasksCompleted: 23,
    uptime: "97.8%"
  }
];

const recentActivity = [
  {
    id: 1,
    type: "deploy",
    title: "Clinton Comeback site deployed",
    description: "New features for application tracking went live",
    timestamp: "12 minutes ago",
    icon: CheckCircle,
    iconColor: "text-green-400"
  },
  {
    id: 2,
    type: "task",
    title: "Steve completed market analysis",
    description: "Detailed report on Utah fast-casual trends",
    timestamp: "34 minutes ago", 
    icon: Bot,
    iconColor: "text-blue-400"
  },
  {
    id: 3,
    type: "system",
    title: "Security scan completed",
    description: "All systems passed quarterly security audit",
    timestamp: "1 hour ago",
    icon: CheckCircle,
    iconColor: "text-green-400"
  },
  {
    id: 4,
    type: "alert",
    title: "FiiZ Draper location metrics spike",
    description: "300% increase in app downloads in the area",
    timestamp: "2 hours ago",
    icon: AlertCircle,
    iconColor: "text-yellow-400"
  },
  {
    id: 5,
    type: "task",
    title: "Erica processed 47 applications",
    description: "Clinton Comeback hiring pipeline updated",
    timestamp: "3 hours ago",
    icon: Bot,
    iconColor: "text-purple-400"
  }
];

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

export default function HQPage() {
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
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <activity.icon size={20} className={activity.iconColor} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--text-primary)]">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={12} />
                      <span className="text-xs text-[var(--text-muted)]">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistants */}
        <section>
          <h2 className="text-xl font-bold mb-4">AI Assistants</h2>
          <div className="space-y-4">
            {aiAssistants.map((assistant, index) => (
              <motion.div
                key={assistant.name}
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
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
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
                    {assistant.currentTask}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {assistant.tasksCompleted} tasks completed today
                  </span>
                  <div className="flex items-center gap-1 text-green-400">
                    <Activity size={12} />
                    <span>Active</span>
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