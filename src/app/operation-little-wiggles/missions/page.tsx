'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock,
  Flag,
  AlertCircle,
  CheckCircle,
  Circle,
  PlayCircle,
  Eye,
  Globe,
  Briefcase,
  Palette,
  Shield
} from 'lucide-react';

const priorities = {
  high: { color: 'border-red-400 bg-red-50', textColor: 'text-red-600', label: 'High' },
  medium: { color: 'border-yellow-400 bg-yellow-50', textColor: 'text-yellow-600', label: 'Medium' },
  low: { color: 'border-green-400 bg-green-50', textColor: 'text-green-600', label: 'Low' }
};

const assignees = {
  jordan: { name: 'Jordan', emoji: '👨‍💼', color: 'bg-orange-500' },
  jimmy: { name: 'Jimmy', emoji: '🏋️', color: 'bg-blue-500' },
  ai: { name: 'Future AI', emoji: '🤖', color: 'bg-purple-500' }
};

const categories = {
  website: { icon: Globe, color: 'text-teal-500' },
  business: { icon: Briefcase, color: 'text-green-500' },
  design: { icon: Palette, color: 'text-purple-500' },
  legal: { icon: Shield, color: 'text-red-500' }
};

type Priority = keyof typeof priorities;
type Assignee = keyof typeof assignees;
type Category = keyof typeof categories;

interface Mission {
  id: string;
  title: string;
  description: string;
  assignee: Assignee;
  priority: Priority;
  category: Category;
  dueDate?: string;
  startedDate?: string;
  completedDate?: string;
  progress?: number;
}

const missions: Record<string, Mission[]> = {
  backlog: [
    {
      id: 'olw-1',
      title: 'Choose Option A or B — Mac Mini vs Manual Claude',
      description: "Review Jordan's proposal and decide on development approach. Option A ($625 upfront + $170/mo) gives you a 24/7 AI assistant. Option B ($170/mo) is manual but no hardware purchase.",
      assignee: 'jimmy',
      priority: 'high',
      category: 'business',
    },
    {
      id: 'olw-2',
      title: 'Purchase Mac Mini M4 (if Option A)',
      description: '16GB/256GB from Apple.com or Best Buy. ~$600. This becomes the always-on home base for Clawdbot.',
      assignee: 'jimmy',
      priority: 'high',
      category: 'business',
    },
    {
      id: 'olw-3',
      title: 'Register VictoryBioLabs.com domain',
      description: 'Check availability and register. Keep registration separate from VictoryPeptides — different accounts.',
      assignee: 'jimmy',
      priority: 'high',
      category: 'website',
    },
    {
      id: 'olw-4',
      title: 'Register VictoryHeadshots.com domain',
      description: 'Photography brochure site. Lower priority than BioLabs but register early.',
      assignee: 'jimmy',
      priority: 'medium',
      category: 'website',
    },
    {
      id: 'olw-5',
      title: 'Set up Stripe account for BioLabs',
      description: 'Stripe approval already secured for peptide sales. Set up the actual account and connect bank details.',
      assignee: 'jimmy',
      priority: 'high',
      category: 'business',
    },
    {
      id: 'olw-6',
      title: 'Define VictoryHeadshots.com pages and content',
      description: 'What pages does the photography site need? Portfolio, pricing, contact, booking? Outline the sitemap.',
      assignee: 'jimmy',
      priority: 'medium',
      category: 'design',
    },
    {
      id: 'olw-7',
      title: 'Establish entity separation plan',
      description: 'VictoryPeptides and VictoryBioLabs MUST remain completely separate entities. Document the separation: different accounts, databases, branding, no cross-linking.',
      assignee: 'jordan',
      priority: 'high',
      category: 'legal',
    },
  ],
  inProgress: [
    {
      id: 'olw-8',
      title: 'Build Operation Little Wiggles hub',
      description: "Mission control for the Victory project. You're looking at it right now! 🐛",
      assignee: 'jordan',
      priority: 'high',
      category: 'website',
      startedDate: '2026-02-01',
      progress: 80,
    },
  ],
  review: [],
  done: []
};

const columns = [
  { 
    id: 'backlog', 
    title: 'Backlog', 
    missions: missions.backlog,
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-50'
  },
  { 
    id: 'inProgress', 
    title: 'In Progress', 
    missions: missions.inProgress,
    icon: PlayCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  { 
    id: 'review', 
    title: 'Review', 
    missions: missions.review,
    icon: Eye,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  { 
    id: 'done', 
    title: 'Done', 
    missions: missions.done,
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  }
];

interface MissionCardProps {
  mission: Mission;
  columnId: string;
  index: number;
}

function MissionCard({ mission, columnId, index }: MissionCardProps) {
  const priority = priorities[mission.priority];
  const assignee = assignees[mission.assignee];
  const category = categories[mission.category];
  const CategoryIcon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CategoryIcon size={16} className={category.color} />
          <span className={`text-xs px-2 py-1 rounded border ${priority.color} ${priority.textColor} font-medium`}>
            {priority.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{assignee.emoji}</span>
          <div className={`w-2 h-2 rounded-full ${assignee.color}`}></div>
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
        {mission.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {mission.description}
      </p>

      {/* Progress Bar (if in progress) */}
      {columnId === 'inProgress' && mission.progress && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs text-gray-700">{mission.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mission.progress}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className="bg-red-500 h-2 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {mission.startedDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Started {mission.startedDate}</span>
            </div>
          )}
          {mission.dueDate && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Due {mission.dueDate}</span>
            </div>
          )}
        </div>
        <span className="text-gray-700 font-medium">
          {assignee.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function MissionsPage() {
  const totalMissions = Object.values(missions).flat().length;
  const completedMissions = missions.done.length;
  const highPriorityCount = [...missions.backlog, ...missions.inProgress].filter(m => m.priority === 'high').length;

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: '#f4fafb', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mission Board</h1>
          <p className="text-gray-600 mt-1">
            Track progress on Victory project tasks
          </p>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-gray-800">{totalMissions}</div>
            <div className="text-xs md:text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-red-500">{highPriorityCount}</div>
            <div className="text-xs md:text-sm text-gray-500">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-green-500">{completedMissions}</div>
            <div className="text-xs md:text-sm text-gray-500">Done</div>
          </div>
        </div>
      </div>

      {/* Mission Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {columns.map((column) => {
          const ColumnIcon = column.icon;
          
          return (
            <div key={column.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Column Header */}
              <div className={`p-4 border-b border-gray-100 rounded-t-xl ${column.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ColumnIcon size={20} className={column.color} />
                    <h2 className="font-semibold text-gray-800">
                      {column.title}
                    </h2>
                  </div>
                  <span className="text-sm bg-white px-2.5 py-1 rounded-full text-gray-600 border border-gray-200">
                    {column.missions.length}
                  </span>
                </div>
              </div>

              {/* Mission Cards */}
              <div className="p-3 space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                {column.missions.map((mission, index) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    columnId={column.id}
                    index={index}
                  />
                ))}
                
                {column.missions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-2">🐛</div>
                    <p className="text-sm">No tasks here yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">High Priority</h3>
              <p className="text-2xl font-bold text-red-500 mt-1">
                {highPriorityCount}
              </p>
            </div>
            <Flag size={24} className="text-red-400" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Jimmy&apos;s Tasks</h3>
              <p className="text-2xl font-bold text-blue-500 mt-1">
                {Object.values(missions).flat().filter(m => m.assignee === 'jimmy').length}
              </p>
            </div>
            <span className="text-2xl">🏋️</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Jordan&apos;s Tasks</h3>
              <p className="text-2xl font-bold text-orange-500 mt-1">
                {Object.values(missions).flat().filter(m => m.assignee === 'jordan').length}
              </p>
            </div>
            <span className="text-2xl">👨‍💼</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
              <p className="text-2xl font-bold text-green-500 mt-1">0</p>
            </div>
            <AlertCircle size={24} className="text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
