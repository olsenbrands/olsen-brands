'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Search,
  X,
  Calendar,
  Clock,
  AlertTriangle,
  Trash2,
  Archive,
  ChevronDown,
} from 'lucide-react';

// Types
interface Blocker {
  id: string;
  type: 'credential' | 'auth' | 'api_key' | 'waiting_jordan' | 'waiting_external' | 'other';
  description: string;
  resolved: boolean;
  created_at: string;
  created_by: string;
  resolved_at?: string;
  resolved_by?: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  category: string;
  due_date: string | null;
  estimated_hours: number | null;
  tags: string[];
  blockers: Blocker[];
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Constants
const COLUMNS = [
  { id: 'brainstorm', title: '💡 Brainstorm', color: 'border-purple-500' },
  { id: 'backlog', title: '📋 Backlog', color: 'border-gray-500' },
  { id: 'ready', title: '✅ Ready', color: 'border-green-500' },
  { id: 'in_progress', title: '🔥 In Progress', color: 'border-blue-500' },
  { id: 'blocked', title: '🚫 Blocked', color: 'border-red-500' },
  { id: 'review', title: '👀 Review', color: 'border-yellow-500' },
  { id: 'done', title: '✅ Done', color: 'border-emerald-500' },
];

const ASSIGNEE_EMOJIS: Record<string, string> = {
  steve: '🦞',
  jerry: '🐿️',
  erica: '🤖',
  george: '🐕',
  kramer: '🎭',
  malcolm: '🎩',
  elaine: '💃',
  jordan: '👨‍💼',
  unassigned: '⬜',
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500' },
  high: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
  low: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500' },
};

const BLOCKER_TYPES = [
  { value: 'credential', label: 'Missing Credentials' },
  { value: 'auth', label: 'Auth Issue' },
  { value: 'api_key', label: 'API Key Needed' },
  { value: 'waiting_jordan', label: 'Waiting on Jordan' },
  { value: 'waiting_external', label: 'Waiting on External' },
  { value: 'other', label: 'Other' },
];

const CATEGORIES = ['tech', 'restaurant', 'business', 'expansion', 'content', 'clawvox', 'other'];

// API Functions
async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/hq/tasks');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch('/api/hq/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const res = await fetch(`/api/hq/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/hq/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}

async function addBlocker(taskId: string, blocker: { type: string; description: string; created_by: string }): Promise<Blocker> {
  const res = await fetch(`/api/hq/tasks/${taskId}/blockers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blocker),
  });
  if (!res.ok) throw new Error('Failed to add blocker');
  return res.json();
}

async function resolveBlocker(taskId: string, blockerId: string, resolvedBy: string): Promise<Blocker> {
  const res = await fetch(`/api/hq/tasks/${taskId}/blockers/${blockerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resolved: true, resolved_by: resolvedBy }),
  });
  if (!res.ok) throw new Error('Failed to resolve blocker');
  return res.json();
}

// Task Card Component
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const unresolvedBlockers = task.blockers?.filter(b => !b.resolved) || [];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const priorityStyle = PRIORITY_COLORS[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 
        hover:border-[var(--accent)] transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? 'shadow-lg ring-2 ring-[var(--accent)]' : ''}
      `}
    >
      {/* Header: Assignee + Priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl" title={task.assignee}>
          {ASSIGNEE_EMOJIS[task.assignee] || '⬜'}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityStyle.bg} ${priorityStyle.text} font-medium`}>
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-medium text-[var(--text-primary)] text-sm mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Blocker badge (if blocked) */}
      {unresolvedBlockers.length > 0 && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-500/30 text-red-300 font-medium">
            <AlertTriangle size={12} />
            {unresolvedBlockers.length} blocker{unresolvedBlockers.length > 1 ? 's' : ''}
          </span>
          {task.status === 'blocked' && unresolvedBlockers[0] && (
            <p className="text-xs text-red-300/80 mt-1 line-clamp-1">
              {unresolvedBlockers[0].description}
            </p>
          )}
        </div>
      )}

      {/* Footer: Due date + Hours */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        {task.due_date && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
            <Calendar size={12} />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
        {task.estimated_hours && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{task.estimated_hours}h</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable overlay card (shown while dragging)
function DragOverlayCard({ task }: { task: Task }) {
  const priorityStyle = PRIORITY_COLORS[task.priority];
  
  return (
    <div className="bg-[var(--bg-secondary)] border-2 border-[var(--accent)] rounded-lg p-3 shadow-2xl w-64">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{ASSIGNEE_EMOJIS[task.assignee] || '⬜'}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityStyle.bg} ${priorityStyle.text} font-medium`}>
          {task.priority}
        </span>
      </div>
      <h3 className="font-medium text-[var(--text-primary)] text-sm line-clamp-2">
        {task.title}
      </h3>
    </div>
  );
}

// Column Component
function Column({ column, tasks, onTaskClick }: { 
  column: typeof COLUMNS[0]; 
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  return (
    <div className={`
      bg-[var(--bg-primary)] border-t-4 ${column.color} rounded-lg min-w-[280px] max-w-[320px] flex flex-col
    `}>
      {/* Column Header */}
      <div className="p-3 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-primary)] text-sm">
            {column.title}
          </h2>
          <span className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded text-[var(--text-muted)]">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] space-y-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// Task Modal Component
function TaskModal({ 
  task, 
  onClose, 
  onSave, 
  onDelete,
  onAddBlocker,
  onResolveBlocker,
}: { 
  task: Task | null;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddBlocker: (blocker: { type: string; description: string }) => Promise<void>;
  onResolveBlocker: (blockerId: string) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [newBlocker, setNewBlocker] = useState({ type: 'other', description: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        category: task.category,
        due_date: task.due_date || '',
        estimated_hours: task.estimated_hours,
        tags: task.tags || [],
        notes: task.notes || '',
      });
    }
  }, [task]);

  if (!task) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task permanently?')) return;
    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddBlocker = async () => {
    if (!newBlocker.description.trim()) return;
    await onAddBlocker(newBlocker);
    setNewBlocker({ type: 'other', description: '' });
  };

  const unresolvedBlockers = task.blockers?.filter(b => !b.resolved) || [];
  const resolvedBlockers = task.blockers?.filter(b => b.resolved) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Task</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            {/* Row: Status, Priority, Assignee */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Status</label>
                <select
                  value={formData.status || 'backlog'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assignee</label>
                <select
                  value={formData.assignee || 'unassigned'}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {Object.entries(ASSIGNEE_EMOJIS).map(([key, emoji]) => (
                    <option key={key} value={key}>{emoji} {key}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: Category, Due Date, Estimated Hours */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
                <select
                  value={formData.category || 'other'}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date || ''}
                  onChange={e => setFormData({ ...formData, due_date: e.target.value || null })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Est. Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.estimated_hours || ''}
                  onChange={e => setFormData({ ...formData, estimated_hours: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            {/* Blockers Section */}
            <div className="border-t border-[var(--border)] pt-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" />
                Blockers
              </h3>

              {/* Unresolved Blockers */}
              {unresolvedBlockers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {unresolvedBlockers.map(blocker => (
                    <div key={blocker.id} className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex-1">
                        <span className="text-xs text-red-400 font-medium uppercase">{blocker.type.replace('_', ' ')}</span>
                        <p className="text-sm text-[var(--text-primary)]">{blocker.description}</p>
                        <span className="text-xs text-[var(--text-muted)]">by {blocker.created_by}</span>
                      </div>
                      <button
                        onClick={() => onResolveBlocker(blocker.id)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30"
                      >
                        Resolve
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resolved Blockers (collapsed) */}
              {resolvedBlockers.length > 0 && (
                <details className="mb-4">
                  <summary className="text-sm text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)]">
                    {resolvedBlockers.length} resolved blocker{resolvedBlockers.length > 1 ? 's' : ''}
                  </summary>
                  <div className="mt-2 space-y-2">
                    {resolvedBlockers.map(blocker => (
                      <div key={blocker.id} className="bg-[var(--bg-secondary)] rounded-lg p-3 opacity-60">
                        <span className="text-xs text-green-400 font-medium">✓ RESOLVED</span>
                        <p className="text-sm text-[var(--text-primary)]">{blocker.description}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {/* Add Blocker Form */}
              <div className="flex gap-2">
                <select
                  value={newBlocker.type}
                  onChange={e => setNewBlocker({ ...newBlocker, type: e.target.value })}
                  className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
                >
                  {BLOCKER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Describe the blocker..."
                  value={newBlocker.description}
                  onChange={e => setNewBlocker({ ...newBlocker, description: e.target.value })}
                  className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={handleAddBlocker}
                  disabled={!newBlocker.description.trim()}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => onSave({ status: 'archived' })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-lg hover:text-[var(--text-primary)]"
              >
                <Archive size={16} />
                Archive
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// New Task Modal
function NewTaskModal({ onClose, onCreate }: { onClose: () => void; onCreate: (task: Partial<Task>) => Promise<void> }) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    assignee: 'unassigned',
    category: 'other',
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!formData.title?.trim()) return;
    setIsCreating(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl w-full max-w-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">New Task</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Priority</label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assignee</label>
                <select
                  value={formData.assignee || 'unassigned'}
                  onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {Object.entries(ASSIGNEE_EMOJIS).map(([key, emoji]) => (
                    <option key={key} value={key}>{emoji} {key}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || !formData.title?.trim()}
              className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'error' | 'success'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
    >
      {message}
    </motion.div>
  );
}

// Main Page Component
export default function MissionsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data.filter(t => t.status !== 'archived'));
    } catch (err) {
      setToast({ message: 'Failed to load tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (assigneeFilter && task.assignee !== assigneeFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  // Group tasks by column
  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<string, Task[]>);

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Find target column
    let targetColumnId = over.id as string;
    
    // If dropped on another task, find that task's column
    const targetTask = tasks.find(t => t.id === over.id);
    if (targetTask) {
      targetColumnId = targetTask.status;
    }

    // Check if it's a valid column
    const isValidColumn = COLUMNS.some(col => col.id === targetColumnId);
    if (!isValidColumn) return;

    // Skip if same column
    if (task.status === targetColumnId) return;

    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: targetColumnId } : t
    ));

    // Persist to DB
    try {
      await updateTask(taskId, { status: targetColumnId });
    } catch (err) {
      // Revert on error
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: task.status } : t
      ));
      setToast({ message: 'Failed to move task', type: 'error' });
    }
  };

  // Task operations
  const handleSaveTask = async (updates: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      const updated = await updateTask(editingTask.id, updates);
      if (updates.status === 'archived') {
        setTasks(prev => prev.filter(t => t.id !== editingTask.id));
      } else {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      }
      setToast({ message: 'Task saved', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save task', type: 'error' });
      throw err;
    }
  };

  const handleDeleteTask = async () => {
    if (!editingTask) return;
    
    try {
      await deleteTask(editingTask.id);
      setTasks(prev => prev.filter(t => t.id !== editingTask.id));
      setToast({ message: 'Task deleted', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete task', type: 'error' });
      throw err;
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const created = await createTask(taskData);
      setTasks(prev => [...prev, created]);
      setToast({ message: 'Task created', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create task', type: 'error' });
      throw err;
    }
  };

  const handleAddBlocker = async (blocker: { type: string; description: string }) => {
    if (!editingTask) return;
    
    try {
      await addBlocker(editingTask.id, { ...blocker, created_by: 'jordan' });
      await loadTasks();
      // Refresh editing task
      const refreshed = tasks.find(t => t.id === editingTask.id);
      if (refreshed) {
        const updatedTask = await fetchTasks().then(all => all.find(t => t.id === editingTask.id));
        if (updatedTask) setEditingTask(updatedTask);
      }
    } catch (err) {
      setToast({ message: 'Failed to add blocker', type: 'error' });
    }
  };

  const handleResolveBlocker = async (blockerId: string) => {
    if (!editingTask) return;
    
    try {
      await resolveBlocker(editingTask.id, blockerId, 'jordan');
      await loadTasks();
      const updatedTask = await fetchTasks().then(all => all.find(t => t.id === editingTask.id));
      if (updatedTask) setEditingTask(updatedTask);
    } catch (err) {
      setToast({ message: 'Failed to resolve blocker', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-[var(--text-muted)]">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">🎯 Mission Board</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {tasks.length} tasks • {tasks.filter(t => t.status === 'done').length} completed
          </p>
        </div>
        
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)] w-48"
          />
        </div>

        {/* Assignee Filter Chips */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAssigneeFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !assigneeFilter 
                ? 'bg-[var(--accent)] text-white' 
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          {Object.entries(ASSIGNEE_EMOJIS).filter(([k]) => k !== 'unassigned').map(([key, emoji]) => (
            <button
              key={key}
              onClick={() => setAssigneeFilter(assigneeFilter === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                assigneeFilter === key 
                  ? 'bg-[var(--accent)] text-white' 
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title={key}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={priorityFilter || ''}
            onChange={e => setPriorityFilter(e.target.value || null)}
            className="appearance-none pl-3 pr-8 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">⚪ Low</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(column => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id] || []}
              onTaskClick={task => setEditingTask(task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <DragOverlayCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onAddBlocker={handleAddBlocker}
          onResolveBlocker={handleResolveBlocker}
        />
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
