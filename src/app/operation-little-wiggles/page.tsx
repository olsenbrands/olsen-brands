'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Target,
  Lightbulb,
  Users,
  Folder,
  Activity,
  Clock,
  Zap,
  Bot
} from 'lucide-react';

// Team members
const team = [
  { id: 'jordan', name: 'Jordan', emoji: '👨‍💼', role: 'Project Lead', status: 'active' },
  { id: 'jimmy', name: 'Jimmy', emoji: '🏋️', role: 'Business Partner', status: 'active' },
  { id: 'ai', name: 'Future AI', emoji: '🤖', role: 'AI Assistant', status: 'pending' },
];

// Projects
const projects = [
  { name: 'VictoryPeptides.com', status: 'active', color: '#2bbede' },
  { name: 'VictoryBioLabs.com', status: 'planning', color: '#ff0000' },
  { name: 'VictoryHeadshots.com', status: 'planning', color: '#17272b' },
];

// Recent activity (placeholder - will be dynamic later)
const recentActivity: { id: number; type: string; title: string; time: string; actor: string }[] = [];

const mobileTabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'actions', label: 'Actions', icon: Target },
] as const;

type MobileTab = typeof mobileTabs[number]['id'];

// Quick actions
const quickActions = [
  {
    title: "Missions",
    description: "View & manage tasks",
    icon: Target,
    href: "/operation-little-wiggles/missions",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-500"
  },
  {
    title: "Brainstorm",
    description: "Ideas & research",
    icon: Lightbulb,
    href: "/operation-little-wiggles/brainstorm",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-500"
  },
];

// ─── Mobile Components ─────────────────────────────────

function StatStrip() {
  const stats = [
    { label: "Active Tasks", value: "8", color: "text-red-500" },
    { label: "Team", value: "3", color: "text-teal-500" },
    { label: "Projects", value: "3", color: "text-gray-700" },
    { label: "Status", value: "🟢", color: "text-green-500" },
  ];

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide md:hidden">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
        >
          <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
          <span className="text-xs text-gray-500">{stat.label}</span>
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
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white text-gray-500 border border-gray-200'
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

function MobileOverviewTab() {
  return (
    <div className="space-y-4 px-4">
      {/* Projects */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Folder size={18} className="text-teal-500" />
          Projects
        </h3>
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                <span className="text-sm font-medium text-gray-700">{project.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock size={18} className="text-teal-500" />
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2">
                <Zap size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.actor} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No activity yet — let&apos;s get started! 🐛
          </p>
        )}
      </div>
    </div>
  );
}

function MobileTeamTab() {
  return (
    <div className="space-y-3 px-4">
      {team.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{member.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {member.status === 'active' ? 'Active' : 'Pending'}
                </div>
              </div>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
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
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={action.href}
              className={`flex flex-col items-center justify-center text-center p-5 rounded-xl border transition-all ${action.color} hover:shadow-md`}
            >
              <Icon size={28} className={`${action.iconColor} mb-2`} />
              <h3 className="font-bold text-sm text-gray-800">{action.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Desktop Components ────────────────────────────────

function DesktopStatsGrid() {
  const statsCards = [
    {
      title: "Active Tasks",
      value: "8",
      change: "Tasks in backlog & in progress",
      icon: Target,
      color: "text-red-500"
    },
    {
      title: "Team Members",
      value: "3",
      change: "Jordan, Jimmy, Future AI",
      icon: Users,
      color: "text-teal-500"
    },
    {
      title: "Projects",
      value: "3",
      change: "VictoryPeptides, BioLabs, Headshots",
      icon: Folder,
      color: "text-gray-700"
    },
    {
      title: "Status",
      value: "Active",
      change: "All systems go",
      icon: Activity,
      color: "text-green-500"
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
          className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <stat.icon size={24} className={stat.color} />
            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
          <p className="text-xs text-gray-500">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────

export default function OLWDashboard() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('overview');

  return (
    <>
      {/* ═══ MOBILE LAYOUT ═══ */}
      <div className="md:hidden flex flex-col min-h-[calc(100vh-64px)]" style={{ background: '#f4fafb' }}>
        {/* Stat pills */}
        <StatStrip />
        
        {/* Tab selector */}
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
        
        {/* Tab content */}
        <div className="flex-1 py-3 overflow-auto">
          <AnimatePresence mode="wait">
            {mobileTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MobileOverviewTab />
              </motion.div>
            )}
            {mobileTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MobileTeamTab />
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
      <div className="hidden md:block p-6 space-y-6" style={{ background: '#f4fafb' }}>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>
          <DesktopStatsGrid />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Team Members */}
          <section className="xl:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Team</h2>
            <div className="space-y-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{member.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">{member.name}</h3>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          {member.status === 'active' ? 'Active' : 'Pending'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="xl:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="space-y-3">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="font-medium text-gray-700">{project.name}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="xl:col-span-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`block p-5 rounded-xl border transition-all ${action.color} hover:shadow-md`}
                  >
                    <action.icon size={24} className={`${action.iconColor} mb-3`} />
                    <h3 className="font-bold mb-1 text-gray-800">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
