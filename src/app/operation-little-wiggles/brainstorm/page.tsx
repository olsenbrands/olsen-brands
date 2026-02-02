'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb,
  Bot,
  ChevronDown,
  Filter,
  Zap,
  TrendingUp,
  FileText,
  Clock,
  User
} from 'lucide-react';

const feedSources = [
  { id: 'all', name: 'All Sources', icon: Lightbulb },
  { id: 'jordan', name: 'Jordan 👨‍💼', icon: User },
  { id: 'jimmy', name: 'Jimmy 🏋️', icon: User },
  { id: 'ai', name: 'AI 🤖', icon: Bot },
  { id: 'research', name: 'Research', icon: FileText }
];

const itemTypes = {
  insight: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  analysis: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  note: { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' }
};

interface BrainstormItem {
  id: number;
  source: string;
  type: keyof typeof itemTypes;
  title: string;
  description: string;
  timestamp: Date;
  details?: Record<string, string>;
}

const brainstormFeed: BrainstormItem[] = [
  {
    id: 1,
    source: 'jordan',
    type: 'insight',
    title: 'Entity Separation is Critical',
    description: 'VictoryPeptides (education) and VictoryBioLabs (sales) must be completely separate. Different accounts, databases, branding. No cross-linking. This is non-negotiable for compliance.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    details: {
      'Key Point': 'Compliance requires complete separation',
      'Affected Sites': 'VictoryPeptides.com, VictoryBioLabs.com',
      'Action': 'Document separation plan before building'
    }
  },
  {
    id: 2,
    source: 'jordan',
    type: 'analysis',
    title: 'Build Order: Headshots → BioLabs → Peptides',
    description: 'Start with VictoryHeadshots (simplest — brochure site). Then VictoryBioLabs (Stripe e-commerce). VictoryPeptides WordPress stays as-is and gets rebuilt last.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    details: {
      'Phase 1': 'VictoryHeadshots.com — Simple brochure',
      'Phase 2': 'VictoryBioLabs.com — E-commerce with Stripe',
      'Phase 3': 'VictoryPeptides.com — WordPress rebuild (later)',
      'Rationale': 'Start simple, build confidence, tackle complexity last'
    }
  },
  {
    id: 3,
    source: 'jimmy',
    type: 'insight',
    title: 'Stripe Approval Secured',
    description: 'Major hurdle cleared — Stripe has approved peptide sales for BioLabs. This was the biggest unknown and it\'s done.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    details: {
      'Status': 'APPROVED ✅',
      'Next Step': 'Set up actual Stripe account',
      'Timeline': 'Can proceed immediately'
    }
  }
];

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
}

interface BrainstormItemProps {
  item: BrainstormItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function BrainstormItemCard({ item, index, expanded, onToggle }: BrainstormItemProps) {
  const itemType = itemTypes[item.type];
  const Icon = itemType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white border rounded-lg hover:shadow-sm transition-all ${itemType.border}`}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${itemType.bg}`}>
            <Icon size={20} className={itemType.color} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{getTimeAgo(item.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {item.source === 'jordan' ? '👨‍💼 Jordan' : 
                       item.source === 'jimmy' ? '🏋️ Jimmy' :
                       item.source === 'ai' ? '🤖 AI' :
                       '📚 Research'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transform transition-transform ${
                    expanded ? 'rotate-180' : 'rotate-0'
                  }`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && item.details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 px-4 pb-4"
          >
            <div className="pt-4">
              <div className={`rounded-lg p-3 ${itemType.bg}`}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(item.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                      <span className="text-gray-500">{key}:</span>
                      <span className="text-gray-700 font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BrainstormPage() {
  const [selectedSource, setSelectedSource] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFeed = brainstormFeed.filter(item => 
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
      count: brainstormFeed.filter(item => item.source === source.id).length
    }));
    return stats;
  };

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: '#f4fafb', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Brainstorm</h1>
          <p className="text-gray-600 mt-1">
            Ideas, research, and insights for the Victory project
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb size={16} className="text-yellow-500" />
            <span className="text-gray-600">{brainstormFeed.length} ideas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar - Filters & Stats */}
        <div className="xl:col-span-1 space-y-6">
          {/* Source Filter */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-gray-500" />
              <h3 className="font-semibold text-gray-800">Filter by Source</h3>
            </div>
            <div className="space-y-2">
              {feedSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedSource === source.id
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <source.icon size={16} />
                    <span>{source.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedSource === source.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {source.id === 'all' 
                      ? brainstormFeed.length 
                      : brainstormFeed.filter(item => item.source === source.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Contribution Stats</h3>
            <div className="space-y-3">
              {getSourceStats().map((stat) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{stat.name}</span>
                  </div>
                  <span className="text-sm font-mono text-gray-800">{stat.count}</span>
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
                <BrainstormItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  expanded={expandedItems.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                />
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
                <Lightbulb size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Ideas Yet
                </h3>
                <p className="text-gray-600">
                  No brainstorm entries found for the selected source.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
