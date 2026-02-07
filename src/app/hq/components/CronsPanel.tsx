'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, CheckCircle, XCircle, Pause, Play, Bot, Timer } from 'lucide-react';

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule_expr: string;
  schedule_tz: string;
  next_run_at: string | null;
  last_run_at: string | null;
  last_status: string | null;
  last_duration_ms: number | null;
  payload_summary: string;
  bot_id: string;
  bot_name: string;
  synced_at: string;
}

interface CronsData {
  jobs: CronJob[];
  byBot: Record<string, CronJob[]>;
  totalCount: number;
  lastSyncedAt: string | null;
  bots: string[];
}

const BOT_EMOJIS: Record<string, string> = {
  Steve: '🦞',
  Elaine: '👩‍💼',
  Erica: '✌️',
  George: '🐕',
  Jerry: '🐿️',
  Kramer: '🎭',
  Malcolm: '🎩',
};

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatNextRun(dateStr: string | null): string {
  if (!dateStr) return 'Not scheduled';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Overdue';
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 60) return `in ${diffMins}m`;
  if (diffHours < 24) return `in ${diffHours}h`;
  return date.toLocaleDateString();
}

function parseCronExpr(expr: string): string {
  // Simple cron expression parser for display
  const parts = expr.split(' ');
  if (parts.length < 5) return expr;
  
  const [min, hour, dom, mon, dow] = parts;
  
  if (min.startsWith('*/')) return `Every ${min.slice(2)} min`;
  if (hour === '*' && min !== '*') return `Every hour at :${min.padStart(2, '0')}`;
  if (hour.includes(',')) return `${hour.split(',').length}x daily`;
  if (hour !== '*' && min !== '*') {
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${min.padStart(2, '0')} ${ampm}`;
  }
  return expr;
}

export default function CronsPanel() {
  const [data, setData] = useState<CronsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [expandedBot, setExpandedBot] = useState<string | null>(null);

  async function fetchCrons() {
    try {
      const res = await fetch('/api/hq/crons');
      if (res.ok) {
        const cronsData = await res.json();
        setData(cronsData);
      }
    } catch (error) {
      console.error('Failed to fetch crons:', error);
    } finally {
      setLoading(false);
    }
  }

  async function syncNow() {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/hq/crons/sync', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        // Refetch crons after successful sync
        await fetchCrons();
      } else {
        setSyncError(result.error || 'Sync failed');
      }
    } catch (error) {
      setSyncError('Failed to trigger sync. Try asking Steve via Telegram.');
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    fetchCrons();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <RefreshCw className="animate-spin" size={20} />
          <span>Loading cron jobs...</span>
        </div>
      </div>
    );
  }

  if (!data || data.totalCount === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Timer size={20} />
            Scheduled Jobs
          </h3>
          <button
            onClick={syncNow}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            Sync Now
          </button>
        </div>
        <p className="text-[var(--text-muted)] text-center py-4">No cron jobs found</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <Timer size={20} />
            Scheduled Jobs
            <span className="text-sm font-normal text-[var(--text-muted)]">
              ({data.totalCount} across {data.bots.length} bots)
            </span>
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Last synced: {formatTimeAgo(data.lastSyncedAt)}
          </p>
        </div>
        <button
          onClick={syncNow}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {syncError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {syncError}
        </div>
      )}

      {/* Jobs by Bot */}
      <div className="space-y-3">
        {data.bots.map((botName) => {
          const jobs = data.byBot[botName] || [];
          const enabledCount = jobs.filter(j => j.enabled).length;
          const isExpanded = expandedBot === botName;
          const emoji = BOT_EMOJIS[botName] || '🤖';

          return (
            <motion.div
              key={botName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-[var(--border)] rounded-lg overflow-hidden"
            >
              {/* Bot Header */}
              <button
                onClick={() => setExpandedBot(isExpanded ? null : botName)}
                className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-medium">{botName}</span>
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                    {enabledCount}/{jobs.length} active
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <span className="text-xs">{isExpanded ? 'Hide' : 'Show'}</span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </div>
              </button>

              {/* Jobs List */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[var(--border)]"
                >
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`flex items-center justify-between p-3 border-b border-[var(--border)] last:border-b-0 ${
                        !job.enabled ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {job.enabled ? (
                          <Play size={14} className="text-green-400" />
                        ) : (
                          <Pause size={14} className="text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{job.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {parseCronExpr(job.schedule_expr)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <p className="text-[var(--text-muted)]">Last run</p>
                          <p className={job.last_status === 'ok' ? 'text-green-400' : 'text-yellow-400'}>
                            {formatTimeAgo(job.last_run_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[var(--text-muted)]">Next</p>
                          <p className="text-blue-400">{formatNextRun(job.next_run_at)}</p>
                        </div>
                        {job.last_status && (
                          job.last_status === 'ok' ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <XCircle size={16} className="text-red-400" />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
