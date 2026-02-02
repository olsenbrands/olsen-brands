'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock,
  Flag,
  AlertCircle,
  CheckCircle,
  Circle,
  TrendingUp,
  ChefHat,
  Building,
  Code,
  Briefcase
} from 'lucide-react';

const priorities = {
  high: { color: 'border-red-500 bg-red-500/10', textColor: 'text-red-400', label: 'High' },
  medium: { color: 'border-yellow-500 bg-yellow-500/10', textColor: 'text-yellow-400', label: 'Medium' },
  low: { color: 'border-green-500 bg-green-500/10', textColor: 'text-green-400', label: 'Low' }
};

const assignees = {
  steve: { name: 'Steve', emoji: '🦞', color: 'bg-blue-500' },
  erica: { name: 'Erica', emoji: '🤖', color: 'bg-purple-500' },
  jordan: { name: 'Jordan', emoji: '👨‍💼', color: 'bg-orange-500' }
};

const categories = {
  restaurant: { icon: ChefHat, color: 'text-orange-400' },
  tech: { icon: Code, color: 'text-blue-400' },
  business: { icon: Briefcase, color: 'text-green-400' },
  expansion: { icon: Building, color: 'text-purple-400' }
};

const missions = {
  backlog: [
    {
      id: 'mb-1',
      title: 'FiiZ Park City Location Analysis',
      description: 'Evaluate market opportunity and site options for Park City expansion',
      assignee: 'steve',
      priority: 'high',
      category: 'expansion',
      dueDate: '2025-02-15',
      estimatedHours: 12,
      tags: ['market-research', 'fiiz', 'expansion']
    },
    {
      id: 'mb-2', 
      title: 'Shift Check Mobile App Design',
      description: 'Create UI/UX designs for employee mobile application',
      assignee: 'erica',
      priority: 'medium',
      category: 'tech',
      dueDate: '2025-02-20',
      estimatedHours: 24,
      tags: ['design', 'mobile', 'shift-check']
    },
    {
      id: 'mb-3',
      title: 'Clinton Comeback Hiring Pipeline',
      description: 'Process and screen Q1 applications for management positions',
      assignee: 'erica',
      priority: 'medium',
      category: 'business',
      dueDate: '2025-02-10',
      estimatedHours: 16,
      tags: ['hiring', 'clinton-comeback', 'management']
    },
    {
      id: 'mb-4',
      title: "Wedgie's Menu Optimization",
      description: 'Analyze customer data to optimize menu offerings and pricing',
      assignee: 'steve',
      priority: 'low',
      category: 'restaurant',
      dueDate: '2025-03-01',
      estimatedHours: 8,
      tags: ['analysis', 'menu', 'wedgies']
    }
  ],
  inProgress: [
    {
      id: 'mi-1',
      title: 'Jimmy Partnership Due Diligence',
      description: 'Complete financial and operational analysis for partnership decision',
      assignee: 'steve',
      priority: 'high',
      category: 'business',
      dueDate: '2025-02-08',
      estimatedHours: 20,
      progress: 75,
      tags: ['partnership', 'analysis', 'jimmy'],
      startedDate: '2025-01-25'
    },
    {
      id: 'mi-2',
      title: 'HQ Command Center Development',
      description: 'Build comprehensive admin dashboard for Olsen Brands management',
      assignee: 'steve',
      priority: 'high',
      category: 'tech',
      dueDate: '2025-02-05',
      estimatedHours: 32,
      progress: 60,
      tags: ['development', 'dashboard', 'hq'],
      startedDate: '2025-01-30'
    },
    {
      id: 'mi-3',
      title: 'Subway Franchise Performance Review',
      description: 'Quarterly analysis of all Subway locations and recommendations',
      assignee: 'jordan',
      priority: 'medium',
      category: 'restaurant',
      dueDate: '2025-02-12',
      estimatedHours: 12,
      progress: 40,
      tags: ['review', 'performance', 'subway'],
      startedDate: '2025-01-28'
    }
  ],
  complete: [
    {
      id: 'mc-1',
      title: 'On Chord Website Redesign',
      description: 'Complete overhaul of brand website with modern design system',
      assignee: 'steve',
      priority: 'medium',
      category: 'tech',
      completedDate: '2025-01-30',
      tags: ['website', 'design', 'on-chord']
    },
    {
      id: 'mc-2',
      title: 'Q4 Financial Reports Compilation',
      description: 'Aggregate and analyze Q4 performance across all ventures',
      assignee: 'jordan',
      priority: 'high',
      category: 'business',
      completedDate: '2025-01-28',
      tags: ['finance', 'reporting', 'q4']
    },
    {
      id: 'mc-3',
      title: 'FiiZ Loyalty Program Launch',
      description: 'Implement and deploy customer loyalty system across all locations',
      assignee: 'erica',
      priority: 'high',
      category: 'tech',
      completedDate: '2025-01-25',
      tags: ['loyalty', 'fiiz', 'customer-retention']
    },
    {
      id: 'mc-4',
      title: 'Security Audit - All Systems',
      description: 'Quarterly security review and vulnerability assessment',
      assignee: 'steve',
      priority: 'high',
      category: 'tech',
      completedDate: '2025-01-22',
      tags: ['security', 'audit', 'systems']
    }
  ]
};

const columns = [
  { 
    id: 'backlog', 
    title: 'Backlog', 
    missions: missions.backlog,
    icon: Circle,
    color: 'text-gray-400'
  },
  { 
    id: 'inProgress', 
    title: 'In Progress', 
    missions: missions.inProgress,
    icon: Clock,
    color: 'text-blue-400'
  },
  { 
    id: 'complete', 
    title: 'Complete', 
    missions: missions.complete,
    icon: CheckCircle,
    color: 'text-green-400'
  }
];

interface MissionCardProps {
  mission: any;
  columnId: string;
  index: number;
}

function MissionCard({ mission, columnId, index }: MissionCardProps) {
  const priority = priorities[mission.priority as keyof typeof priorities];
  const assignee = assignees[mission.assignee as keyof typeof assignees];
  const category = categories[mission.category as keyof typeof categories];
  const CategoryIcon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 hover:border-[var(--border-hover)] transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CategoryIcon size={16} className={category.color} />
          <span className={`text-xs px-2 py-1 rounded ${priority.color} ${priority.textColor} font-medium`}>
            {priority.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{assignee.emoji}</span>
          <div className={`w-2 h-2 rounded-full ${assignee.color}`}></div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-semibold text-[var(--text-primary)] mb-2">
        {mission.title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
        {mission.description}
      </p>

      {/* Progress Bar (if in progress) */}
      {columnId === 'inProgress' && mission.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-muted)]">Progress</span>
            <span className="text-xs text-[var(--text-primary)]">{mission.progress}%</span>
          </div>
          <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mission.progress}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className="bg-[var(--accent)] h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>
              {columnId === 'complete' 
                ? mission.completedDate 
                : columnId === 'inProgress' 
                  ? mission.startedDate 
                  : mission.dueDate}
            </span>
          </div>
          {mission.estimatedHours && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{mission.estimatedHours}h</span>
            </div>
          )}
        </div>
        <span className="text-[var(--text-primary)]">
          {assignee.name}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {mission.tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
        {mission.tags.length > 3 && (
          <span className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)]">
            +{mission.tags.length - 3}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function MissionsPage() {
  const totalMissions = Object.values(missions).flat().length;
  const completedMissions = missions.complete.length;
  const completionRate = Math.round((completedMissions / totalMissions) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Mission Board</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Track progress across all Olsen Brands initiatives
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--text-primary)]">{totalMissions}</div>
            <div className="text-sm text-[var(--text-muted)]">Total Missions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completionRate}%</div>
            <div className="text-sm text-[var(--text-muted)]">Completed</div>
          </div>
        </div>
      </div>

      {/* Mission Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const ColumnIcon = column.icon;
          
          return (
            <div key={column.id} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
              {/* Column Header */}
              <div className="p-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ColumnIcon size={20} className={column.color} />
                    <h2 className="font-semibold text-[var(--text-primary)]">
                      {column.title}
                    </h2>
                  </div>
                  <span className="text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded text-[var(--text-muted)]">
                    {column.missions.length}
                  </span>
                </div>
              </div>

              {/* Mission Cards */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {column.missions.map((mission, index) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    columnId={column.id}
                    index={index}
                  />
                ))}
                
                {column.missions.length === 0 && (
                  <div className="text-center py-8 text-[var(--text-muted)]">
                    <div className="mb-2">🎯</div>
                    <p>No missions in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">High Priority</h3>
              <p className="text-2xl font-bold text-red-400 mt-1">
                {[...missions.backlog, ...missions.inProgress].filter(m => m.priority === 'high').length}
              </p>
            </div>
            <Flag size={24} className="text-red-400" />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Steve's Tasks</h3>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {Object.values(missions).flat().filter(m => m.assignee === 'steve').length}
              </p>
            </div>
            <span className="text-2xl">🦞</span>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">This Week</h3>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {missions.complete.filter(m => {
                  const completed = new Date(m.completedDate);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return completed > weekAgo;
                }).length}
              </p>
            </div>
            <TrendingUp size={24} className="text-green-400" />
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Overdue</h3>
              <p className="text-2xl font-bold text-yellow-400 mt-1">0</p>
            </div>
            <AlertCircle size={24} className="text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
}