'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Globe,
  Briefcase,
  Palette,
  Shield,
  ChevronDown,
  PlayCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

// Types
type Priority = 'high' | 'medium' | 'low';
type Assignee = 'jordan' | 'jimmy';
type Category = 'website' | 'business' | 'design' | 'legal';
type Status = 'todo' | 'doing' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: Assignee;
  priority: Priority;
  category: Category;
  status: Status;
}

// Config
const assignees = {
  jordan: { name: 'Jordan', emoji: '👨‍💼' },
  jimmy: { name: 'Jimmy', emoji: '🏋️' },
};

const priorities = {
  high: { color: '#ff0000', label: 'High' },
  medium: { color: '#f59e0b', label: 'Medium' },
  low: { color: '#22c55e', label: 'Low' },
};

const categories = {
  website: { icon: Globe, color: '#2bbede', label: 'Website' },
  business: { icon: Briefcase, color: '#22c55e', label: 'Business' },
  design: { icon: Palette, color: '#a855f7', label: 'Design' },
  legal: { icon: Shield, color: '#ff0000', label: 'Legal' },
};

const statusConfig: Record<Status, { label: string; nextAction?: string; nextStatus?: Status; prevAction?: string; prevStatus?: Status }> = {
  todo: { label: 'To Do', nextAction: 'Start Working', nextStatus: 'doing' },
  doing: { label: 'Doing', nextAction: 'Mark Done', nextStatus: 'done', prevAction: 'Move Back', prevStatus: 'todo' },
  done: { label: 'Done', prevAction: 'Move Back', prevStatus: 'doing' },
};

// Initial tasks data
const initialTasks: Task[] = [
  { id: 'olw-1', title: 'Choose Option A or B — Mac Mini vs Manual Claude', description: "Review Jordan's proposal and decide on development approach. Option A ($625 upfront + $170/mo) gives you a 24/7 AI assistant. Option B ($170/mo) is manual but no hardware purchase.", assignee: 'jimmy', priority: 'high', category: 'business', status: 'todo' },
  { id: 'olw-2', title: 'Purchase Mac Mini M4 (if Option A)', description: '16GB/256GB from Apple.com or Best Buy. ~$600. This becomes the always-on home base for Clawdbot.', assignee: 'jimmy', priority: 'high', category: 'business', status: 'todo' },
  { id: 'olw-3', title: 'Register VictoryBioLabs.com domain', description: 'Check availability and register. Keep registration separate from VictoryPeptides — different accounts.', assignee: 'jimmy', priority: 'high', category: 'website', status: 'todo' },
  { id: 'olw-4', title: 'Register VictoryHeadshots.com domain', description: 'Photography brochure site. Lower priority than BioLabs but register early.', assignee: 'jimmy', priority: 'medium', category: 'website', status: 'todo' },
  { id: 'olw-5', title: 'Set up Stripe account for BioLabs', description: 'Stripe approval already secured for peptide sales. Set up the actual account and connect bank details.', assignee: 'jimmy', priority: 'high', category: 'business', status: 'todo' },
  { id: 'olw-6', title: 'Define VictoryHeadshots.com pages and content', description: 'What pages does the photography site need? Portfolio, pricing, contact, booking? Outline the sitemap.', assignee: 'jimmy', priority: 'medium', category: 'design', status: 'todo' },
  { id: 'olw-7', title: 'Establish entity separation plan', description: 'VictoryPeptides and VictoryBioLabs MUST remain completely separate entities. Document the separation: different accounts, databases, branding, no cross-linking.', assignee: 'jordan', priority: 'high', category: 'legal', status: 'todo' },
  { id: 'olw-8', title: 'Build Operation Little Wiggles hub', description: "Mission control for the Victory project. You're looking at it right now! 🐛", assignee: 'jordan', priority: 'high', category: 'website', status: 'doing' },
];

// Task Card Component
function TaskCard({
  task,
  isExpanded,
  onToggle,
  onStatusChange,
}: {
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, newStatus: Status) => void;
}) {
  const CategoryIcon = categories[task.category].icon;
  const config = statusConfig[task.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border shadow-sm overflow-hidden"
      style={{ borderColor: '#d1e3e6' }}
    >
      {/* Compact Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left"
        style={{ minHeight: '64px' }}
      >
        {/* Priority Dot */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: priorities[task.priority].color }}
        />
        
        {/* Title & Category */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 truncate pr-2" style={{ fontSize: '15px' }}>
            {task.title}
          </h3>
        </div>

        {/* Category Icon */}
        <CategoryIcon
          size={18}
          className="flex-shrink-0"
          style={{ color: categories[task.category].color }}
        />

        {/* Assignee Emoji */}
        <span className="text-lg flex-shrink-0">{assignees[task.assignee].emoji}</span>

        {/* Expand Indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t" style={{ borderColor: '#e8f4f6' }}>
              {/* Description */}
              <p className="text-gray-600 text-sm mt-3 mb-4 leading-relaxed">
                {task.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-xs">
                <span
                  className="px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${priorities[task.priority].color}15`,
                    color: priorities[task.priority].color,
                  }}
                >
                  {priorities[task.priority].label} Priority
                </span>
                <span
                  className="px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${categories[task.category].color}15`,
                    color: categories[task.category].color,
                  }}
                >
                  {categories[task.category].label}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {config.prevAction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, config.prevStatus!);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors"
                    style={{
                      borderColor: '#d1e3e6',
                      color: '#5c6a6d',
                      minHeight: '48px',
                    }}
                  >
                    <ArrowLeft size={16} />
                    {config.prevAction}
                  </button>
                )}
                {config.nextAction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(task.id, config.nextStatus!);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: task.status === 'doing' ? '#22c55e' : '#ff0000',
                      minHeight: '48px',
                    }}
                  >
                    {task.status === 'todo' ? (
                      <>
                        <PlayCircle size={16} />
                        {config.nextAction}
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        {config.nextAction}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Create Task Form Component
function CreateTaskForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id' | 'status'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState<Assignee>('jimmy');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('business');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), assignee, priority, category });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">New Task</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 rounded-lg border text-base"
          style={{ borderColor: '#d1e3e6', minHeight: '48px' }}
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border text-base resize-none"
          style={{ borderColor: '#d1e3e6' }}
        />
      </div>

      {/* Assignee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assignee
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(assignees) as [Assignee, typeof assignees.jordan][]).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setAssignee(key)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                assignee === key ? 'ring-2 ring-red-500' : ''
              }`}
              style={{
                borderColor: assignee === key ? '#ff0000' : '#d1e3e6',
                backgroundColor: assignee === key ? '#fff5f5' : 'white',
                minHeight: '48px',
              }}
            >
              <span className="text-lg">{value.emoji}</span>
              <span>{value.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(priorities) as [Priority, typeof priorities.high][]).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPriority(key)}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all"
              style={{
                borderColor: priority === key ? value.color : '#d1e3e6',
                backgroundColor: priority === key ? `${value.color}10` : 'white',
                boxShadow: priority === key ? `0 0 0 2px ${value.color}` : 'none',
                minHeight: '48px',
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: value.color }}
              />
              <span>{value.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(categories) as [Category, typeof categories.website][]).map(([key, value]) => {
            const Icon = value.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all"
                style={{
                  borderColor: category === key ? value.color : '#d1e3e6',
                  backgroundColor: category === key ? `${value.color}10` : 'white',
                  boxShadow: category === key ? `0 0 0 2px ${value.color}` : 'none',
                  minHeight: '48px',
                }}
              >
                <Icon size={16} style={{ color: value.color }} />
                <span>{value.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!title.trim()}
        className="w-full py-4 rounded-lg text-white text-base font-semibold transition-colors disabled:opacity-50"
        style={{
          backgroundColor: '#ff0000',
          minHeight: '52px',
        }}
      >
        Create Task
      </button>
    </form>
  );
}

// Main Page Component
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<Status>('todo');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filteredTasks = tasks.filter((t) => t.status === activeTab);
  const counts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    doing: tasks.filter((t) => t.status === 'doing').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setExpandedId(null);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: `olw-${Date.now()}`,
      status: 'todo',
    };
    setTasks((prev) => [newTask, ...prev]);
    setActiveTab('todo');
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: '#f4fafb' }}>
      {/* Sticky Tab Bar */}
      <div
        className="sticky top-0 z-10 bg-white border-b px-4 py-3"
        style={{ borderColor: '#d1e3e6' }}
      >
        <div className="flex gap-2 max-w-3xl mx-auto">
          {(['todo', 'doing', 'done'] as Status[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveTab(status);
                setExpandedId(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === status ? '#ff0000' : 'white',
                color: activeTab === status ? 'white' : '#5c6a6d',
                border: activeTab === status ? 'none' : '1px solid #d1e3e6',
                minHeight: '44px',
              }}
            >
              <span>{statusConfig[status].label}</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: activeTab === status ? 'rgba(255,255,255,0.2)' : '#f4fafb',
                  color: activeTab === status ? 'white' : '#5c6a6d',
                }}
              >
                {counts[status]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isExpanded={expandedId === task.id}
                  onToggle={() =>
                    setExpandedId(expandedId === task.id ? null : task.id)
                  }
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-4xl mb-3">
                  {activeTab === 'done' ? '🎉' : '🐛'}
                </div>
                <p className="text-gray-500">
                  {activeTab === 'todo' && 'No tasks to do — nice!'}
                  {activeTab === 'doing' && "Nothing in progress"}
                  {activeTab === 'done' && 'No completed tasks yet'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-20"
        style={{ backgroundColor: '#ff0000' }}
      >
        <Plus size={28} className="text-white" />
      </motion.button>

      {/* Create Task Modal / Bottom Sheet */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/40 z-30"
            />

            {/* Modal/Sheet */}
            {isMobile ? (
              // Bottom Sheet for Mobile
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 max-h-[90vh] overflow-y-auto"
              >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
                <CreateTaskForm
                  onClose={() => setShowCreateModal(false)}
                  onCreate={handleCreateTask}
                />
              </motion.div>
            ) : (
              // Centered Modal for Desktop
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-40 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
              >
                <CreateTaskForm
                  onClose={() => setShowCreateModal(false)}
                  onCreate={handleCreateTask}
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
