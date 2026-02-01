'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Bot,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Code,
  TrendingUp,
  Clock,
  Filter,
  ChevronDown,
  ExternalLink,
  GitCommit,
  Database,
  Users,
  DollarSign,
  AlertCircle,
  Zap
} from 'lucide-react';

const feedSources = [
  { id: 'all', name: 'All Sources', icon: Activity },
  { id: 'steve', name: 'Steve 🦞', icon: Bot },
  { id: 'erica', name: 'Erica 🤖', icon: Bot },
  { id: 'system', name: 'System', icon: Code },
  { id: 'business', name: 'Business', icon: TrendingUp }
];

const activityTypes = {
  task_completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  deployment: { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  analysis: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  alert: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  system: { icon: Code, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  commit: { icon: GitCommit, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  performance: { icon: Database, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  insight: { icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' }
};

const intelFeed = [
  {
    id: 1,
    source: 'steve',
    type: 'task_completed',
    title: 'Market Analysis Complete',
    description: 'Finished comprehensive analysis of Utah fast-casual market. Identified 3 high-potential expansion opportunities.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    details: {
      locations: ['Draper Tech Corridor', 'Park City Main St', 'Lehi Station'],
      projectedROI: '35%+',
      timeframe: 'Q2 2025'
    },
    actions: [
      { label: 'View Report', href: '/hq/vault', type: 'internal' },
      { label: 'Schedule Review', href: '#', type: 'action' }
    ]
  },
  {
    id: 2,
    source: 'system',
    type: 'deployment',
    title: 'Clinton Comeback Site Updated',
    description: 'New application tracking features deployed successfully. Zero downtime deployment completed.',
    timestamp: new Date(Date.now() - 23 * 60 * 1000), // 23 minutes ago
    details: {
      version: 'v2.1.3',
      features: ['Advanced filtering', 'Email notifications', 'Mobile responsiveness'],
      performance: '99.9% uptime maintained'
    },
    actions: [
      { label: 'View Site', href: 'https://clintoncomeback.com', type: 'external' },
      { label: 'Deployment Log', href: '#', type: 'action' }
    ]
  },
  {
    id: 3,
    source: 'erica',
    type: 'task_completed',
    title: 'Application Processing Batch Complete',
    description: 'Processed 47 Clinton Comeback applications. 12 candidates moved to interview stage.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    details: {
      total: 47,
      qualified: 23,
      interviews: 12,
      avgScore: 8.2
    },
    actions: [
      { label: 'Review Candidates', href: '/hq/missions', type: 'internal' },
      { label: 'Schedule Interviews', href: '#', type: 'action' }
    ]
  },
  {
    id: 4,
    source: 'business',
    type: 'performance',
    title: 'FiiZ Revenue Spike Alert',
    description: 'Draper location showing 300% week-over-week growth in app orders. Investigate cause.',
    timestamp: new Date(Date.now() - 67 * 60 * 1000), // 1 hour ago
    details: {
      location: 'FiiZ Draper',
      metric: 'App Orders',
      increase: '300%',
      period: 'Week-over-week'
    },
    actions: [
      { label: 'View Analytics', href: 'https://analytics.olsenbrands.com', type: 'external' },
      { label: 'Investigate', href: '#', type: 'action' }
    ]
  },
  {
    id: 5,
    source: 'steve',
    type: 'analysis',
    title: 'Jimmy Partnership Risk Assessment',
    description: 'Completed financial and operational due diligence. Recommend proceeding with pilot location approach.',
    timestamp: new Date(Date.now() - 95 * 60 * 1000), // 1.5 hours ago
    details: {
      recommendation: 'Proceed with Pilot',
      riskLevel: 'Medium',
      investmentRequired: '$180K',
      timeline: '6 months'
    },
    actions: [
      { label: 'Read Analysis', href: '/hq/vault', type: 'internal' },
      { label: 'Schedule Meeting', href: '#', type: 'action' }
    ]
  },
  {
    id: 6,
    source: 'system',
    type: 'alert',
    title: 'Shift Check Server Load High',
    description: 'Application server experiencing elevated load. Performance within acceptable range but monitoring closely.',
    timestamp: new Date(Date.now() - 142 * 60 * 1000), // 2.3 hours ago
    details: {
      serverLoad: '78%',
      responseTime: '245ms',
      status: 'Monitoring',
      affectedUsers: 'None'
    },
    actions: [
      { label: 'View Metrics', href: 'https://monitoring.olsenbrands.com', type: 'external' },
      { label: 'Scale Resources', href: '#', type: 'action' }
    ]
  },
  {
    id: 7,
    source: 'erica',
    type: 'insight',
    title: 'Hiring Pattern Analysis',
    description: 'Detected correlation between application source and hire success rate. Social media referrals show 65% higher retention.',
    timestamp: new Date(Date.now() - 198 * 60 * 1000), // 3.3 hours ago
    details: {
      metric: 'Hire Success Rate',
      socialMedia: '85%',
      jobBoards: '52%',
      recommendation: 'Increase social recruiting budget'
    },
    actions: [
      { label: 'View Data', href: '/hq/vault', type: 'internal' },
      { label: 'Update Strategy', href: '#', type: 'action' }
    ]
  },
  {
    id: 8,
    source: 'system',
    type: 'commit',
    title: 'Security Updates Deployed',
    description: 'Applied latest security patches across all production systems. No issues detected.',
    timestamp: new Date(Date.now() - 267 * 60 * 1000), // 4.5 hours ago
    details: {
      systems: 5,
      patches: 12,
      status: 'Success',
      nextScan: 'February 8, 2025'
    },
    actions: [
      { label: 'Security Report', href: '#', type: 'action' }
    ]
  }
];

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}

interface IntelItemProps {
  item: any;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function IntelItem({ item, index, expanded, onToggle }: IntelItemProps) {
  const activityType = activityTypes[item.type as keyof typeof activityTypes];
  const Icon = activityType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--border-hover)] transition-all"
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${activityType.bg}`}>
            <Icon size={20} className={activityType.color} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{getTimeAgo(item.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {item.source === 'steve' ? '🦞 Steve' : 
                       item.source === 'erica' ? '🤖 Erica' :
                       item.source === 'system' ? '⚙️ System' :
                       '📈 Business'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ChevronDown 
                  size={20} 
                  className={`text-[var(--text-muted)] transform transition-transform ${
                    expanded ? 'rotate-180' : 'rotate-0'
                  }`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[var(--border)] px-4 pb-4"
          >
            <div className="pt-4 space-y-4">
              {/* Details */}
              {item.details && (
                <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {Object.entries(item.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-[var(--text-muted)] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="text-[var(--text-secondary)] font-mono">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {item.actions && item.actions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.actions.map((action: any, actionIndex: number) => (
                      <motion.a
                        key={actionIndex}
                        href={action.href}
                        target={action.type === 'external' ? '_blank' : '_self'}
                        rel={action.type === 'external' ? 'noopener noreferrer' : ''}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {action.label}
                        {action.type === 'external' && <ExternalLink size={14} />}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IntelPage() {
  const [selectedSource, setSelectedSource] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFeed = intelFeed.filter(item => 
    selectedSource === 'all' || item.source === selectedSource
  );

  const toggleExpanded = (itemId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getSourceStats = () => {
    const stats = feedSources.slice(1).map(source => ({
      ...source,
      count: intelFeed.filter(item => item.source === source.id).length
    }));
    return stats;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Intel Feed</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Real-time activity and intelligence across all systems
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Activity size={16} className="text-green-400" />
            <span className="text-[var(--text-secondary)]">Live</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar - Filters & Stats */}
        <div className="xl:col-span-1 space-y-6">
          {/* Source Filter */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} />
              <h3 className="font-semibold text-[var(--text-primary)]">Filter by Source</h3>
            </div>
            <div className="space-y-2">
              {feedSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedSource === source.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <source.icon size={16} />
                    <span>{source.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedSource === source.id ? 'bg-white/20' : 'bg-[var(--bg-tertiary)]'
                  }`}>
                    {source.id === 'all' 
                      ? intelFeed.length 
                      : intelFeed.filter(item => item.source === source.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Activity Summary</h3>
            <div className="space-y-3">
              {getSourceStats().map((stat) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} />
                    <span className="text-sm text-[var(--text-secondary)]">{stat.name}</span>
                  </div>
                  <span className="text-sm font-mono text-[var(--text-primary)]">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="xl:col-span-3">
          <div className="space-y-4">
            {filteredFeed.length > 0 ? (
              filteredFeed.map((item, index) => (
                <IntelItem
                  key={item.id}
                  item={item}
                  index={index}
                  expanded={expandedItems.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                />
              ))
            ) : (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-12 text-center">
                <Activity size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  No Activity
                </h3>
                <p className="text-[var(--text-secondary)]">
                  No intel entries found for the selected source.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}