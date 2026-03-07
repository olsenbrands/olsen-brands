'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface JournalEntry {
  filename: string;
  date: string;
  displayDate: string;
  title: string;
  preview: string;
}

export default function JournalPage() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('/api/journals')
      .then((r) => r.json())
      .then((data) => {
        setJournals(data.journals || []);
        setLoading(false);
        if (data.journals?.length > 0) {
          selectEntry(data.journals[0].filename);
        }
      });
  }, []);

  const selectEntry = useCallback((filename: string) => {
    const date = filename.replace('.md', '');
    setSelectedDate(date);
    setContentLoading(true);
    fetch(`/api/journals?file=${filename}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || '');
        setContentLoading(false);
      });
  }, []);

  const filtered = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.displayDate.toLowerCase().includes(search.toLowerCase())
  );

  const currentIndex = filtered.findIndex((j) => j.date === selectedDate);
  const prevEntry = filtered[currentIndex + 1] ?? null;
  const nextEntry = filtered[currentIndex - 1] ?? null;

  const currentEntry = journals.find((j) => j.date === selectedDate);

  return (
    <div className="flex h-full min-h-0 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col overflow-hidden"
          >
            {/* Sidebar header */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-[var(--accent)]" />
                <h2 className="font-semibold text-[var(--text-primary)]">Steve&apos;s Journal</h2>
                <span className="ml-auto text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full">
                  {journals.length}
                </span>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search entries…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            {/* Journal list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-[var(--text-muted)] text-sm py-8">No entries found</p>
              ) : (
                <ul className="p-2 space-y-1">
                  {filtered.map((entry) => (
                    <li key={entry.filename}>
                      <button
                        onClick={() => selectEntry(entry.filename)}
                        className={`w-full text-left px-3 py-3 rounded-lg transition-all group ${
                          selectedDate === entry.date
                            ? 'bg-[var(--accent)] text-white'
                            : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className={`flex items-center gap-1.5 text-xs mb-1 ${
                          selectedDate === entry.date ? 'text-white/70' : 'text-[var(--text-muted)]'
                        }`}>
                          <Calendar size={11} />
                          <span>{entry.displayDate}</span>
                        </div>
                        <p className={`text-sm font-medium leading-snug ${
                          selectedDate === entry.date ? 'text-white' : 'text-[var(--text-primary)]'
                        }`}>
                          {entry.title}
                        </p>
                        <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                          selectedDate === entry.date ? 'text-white/60' : 'text-[var(--text-muted)]'
                        }`}>
                          {entry.preview}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <BookOpen size={16} />
          </button>

          <div className="h-4 w-px bg-[var(--border)]" />

          {/* Prev / Next */}
          <button
            onClick={() => prevEntry && selectEntry(prevEntry.filename)}
            disabled={!prevEntry}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Older entry"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => nextEntry && selectEntry(nextEntry.filename)}
            disabled={!nextEntry}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Newer entry"
          >
            <ChevronRight size={16} />
          </button>

          {currentEntry && (
            <>
              <div className="h-4 w-px bg-[var(--border)]" />
              <span className="text-sm text-[var(--text-muted)]">{currentEntry.displayDate}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">{currentEntry.title}</span>
            </>
          )}

          <div className="ml-auto text-xs text-[var(--text-muted)]">
            {currentIndex >= 0 ? `${currentIndex + 1} / ${filtered.length}` : ''}
          </div>
        </div>

        {/* Journal content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {contentLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-64"
              >
                <Loader2 size={24} className="animate-spin text-[var(--text-muted)]" />
              </motion.div>
            ) : content ? (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto px-8 py-10"
              >
                <article className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-[var(--text-primary)] prose-headings:font-bold
                  prose-h1:text-2xl prose-h1:mb-2 prose-h1:mt-0
                  prose-h2:text-lg prose-h2:mt-8
                  prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:text-[15px]
                  prose-strong:text-[var(--text-primary)]
                  prose-em:text-[var(--text-muted)]
                  prose-hr:border-[var(--border)]
                  prose-ul:text-[var(--text-secondary)]
                  prose-li:text-[var(--text-secondary)]
                ">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]"
              >
                <BookOpen size={40} className="mb-4 opacity-30" />
                <p className="text-sm">Select an entry from the sidebar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
