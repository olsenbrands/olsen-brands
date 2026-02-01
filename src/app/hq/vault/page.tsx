'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Folder,
  Calendar,
  Tag,
  Clock,
  Eye,
  Filter,
  ChevronRight,
  ChevronDown,
  BookOpen
} from 'lucide-react';

// Sample documents that represent real Steve files
const sampleDocuments = [
  {
    id: 'memory-core',
    title: 'MEMORY.md',
    path: 'memory/MEMORY.md',
    category: 'memory',
    content: `# My Core Memory\n\n## Who I Am\nI'm Steve, Jordan's AI assistant. I help manage Olsen Brands businesses and think through strategic decisions.\n\n## Key Principles\n- Act with agency, think strategically\n- Utah food scene expertise is my specialty\n- Always consider the human impact\n- Bias toward action over analysis paralysis\n\n## Recent Learning\n- Fast-casual restaurants thrive on consistency + local flavor\n- FiiZ's success model: premium ingredients, consistent experience, local community connection\n- Technology should amplify human capability, not replace human judgment`,
    tags: ['core', 'identity', 'principles'],
    lastModified: '2025-02-01',
    size: '2.1 KB'
  },
  {
    id: 'daily-2025-02-01',
    title: '2025-02-01 Daily Log',
    path: 'daily-logs/2025-02-01.md',
    category: 'daily-logs',
    content: `# Daily Log - February 1, 2025\n\n## Morning Brief\n- Reviewed FiiZ Q4 metrics: 23% growth YoY\n- Clinton Comeback applications: 47 new submissions\n- Shift Check deployment successful\n\n## Key Decisions Made\n1. **FiiZ Expansion**: Recommended Draper location based on demographic analysis\n2. **Hiring Priority**: Focus on technical roles for Q1\n3. **Tech Stack**: Approved React 19 + Next.js 16 for new projects\n\n## Tomorrow's Focus\n- Complete Jimmy proposal analysis\n- Review Wedgie's new menu strategy\n- Finalize Subway franchise metrics`,
    tags: ['daily', 'decisions', 'metrics'],
    lastModified: '2025-02-01',
    size: '1.8 KB'
  },
  {
    id: 'jimmy-proposal',
    title: 'Jimmy Proposal Analysis',
    path: 'proposals/jimmy-partnership-2025.md', 
    category: 'proposals',
    content: `# Jimmy Partnership Proposal - Strategic Analysis\n\n## Executive Summary\nJimmy's approach to Utah expansion aligns with our fast-casual expertise. Strong synergy potential.\n\n## Market Opportunity\n- **Market Size**: $847M Utah fast-casual market\n- **Growth Rate**: 12.3% annually\n- **Competition Gap**: Premium burger segment underserved\n\n## Strategic Fit\n✅ **Strengths**\n- Proven operations model\n- Strong brand identity\n- Technology-forward approach\n\n⚠️ **Considerations**\n- Kitchen complexity vs FiiZ simplicity\n- Higher labor requirements\n- Market saturation risk in SLC\n\n## Recommendation\n**PROCEED WITH PILOT** - Single location test in Draper area. Lower risk, high learning potential.`,
    tags: ['proposal', 'analysis', 'partnership', 'jimmy'],
    lastModified: '2025-01-30',
    size: '3.2 KB'
  },
  {
    id: 'utah-market-research',
    title: 'Utah Restaurant Market Deep Dive',
    path: 'brainstorms/utah-market-analysis-2025.md',
    category: 'brainstorms',
    content: `# Utah Restaurant Market - Strategic Deep Dive\n\n## Market Dynamics\nUtah's unique cultural and demographic profile creates interesting restaurant opportunities.\n\n### Key Insights\n1. **Family-Focused**: 3.1 average household size (US: 2.5)\n2. **Health-Conscious**: Higher demand for fresh, quality ingredients\n3. **Value-Driven**: Price sensitivity balanced with quality expectations\n4. **Tech-Adoption**: High smartphone penetration, app-friendly market\n\n## Opportunity Areas\n\n### Fast-Casual Sweet Spot\n- **Price Range**: $8-15 per person\n- **Service Style**: Order-ahead, quick pickup\n- **Menu**: Fresh, customizable, Instagram-worthy\n\n### Underserved Niches\n- Premium breakfast (non-chain)\n- Healthy Mexican alternatives  \n- Asian-fusion fast-casual\n\n## Strategic Recommendations\n1. Double down on FiiZ expansion - perfect market fit\n2. Consider breakfast concept development\n3. Avoid: Pizza (saturated), Fine dining (cultural mismatch)`,
    tags: ['research', 'market-analysis', 'strategy', 'utah'],
    lastModified: '2025-01-28',
    size: '4.7 KB'
  },
  {
    id: 'fiiz-expansion-strategy',
    title: 'FiiZ Expansion Strategy 2025',
    path: 'brainstorms/fiiz-growth-plan.md',
    category: 'brainstorms', 
    content: `# FiiZ Expansion Strategy - 2025 Roadmap\n\n## Current State\n- **Locations**: 12 active stores\n- **Performance**: Top 3 performing above $45K/month\n- **Brand Recognition**: 78% awareness in Utah County\n\n## Expansion Criteria\n\n### Location Requirements\n1. **Demographics**: Median income >$65K\n2. **Traffic**: >15K vehicles/day or equivalent foot traffic\n3. **Competition**: No direct competitors within 0.5mi\n4. **Visibility**: Street-facing with signage opportunities\n\n### Priority Markets\n1. **Draper** - High income, family demographic, tech corridor\n2. **Park City** - Tourist traffic + local affluence\n3. **Lehi** - Tech company density, young professionals\n\n## Financial Model\n- **Initial Investment**: $180K per location\n- **Break-even**: Month 8-12 (target)\n- **ROI Target**: 35%+ within 24 months\n\n## Risk Mitigation\n- Lease negotiation: Built-in performance clauses\n- Staffing: Cross-training program between locations\n- Supply chain: Regional distribution partnerships`,
    tags: ['expansion', 'strategy', 'fiiz', 'planning'],
    lastModified: '2025-01-25',
    size: '3.8 KB'
  },
  {
    id: 'shift-check-roadmap',
    title: 'Shift Check Product Roadmap',
    path: 'brainstorms/shift-check-features.md',
    category: 'brainstorms',
    content: `# Shift Check - Product Development Roadmap\n\n## Vision\nSimplify shift management for small-medium restaurants. Make scheduling feel effortless.\n\n## Current Features\n✅ Basic shift scheduling\n✅ Employee availability tracking\n✅ SMS notifications\n✅ Simple time tracking\n\n## Q1 2025 Priorities\n\n### Core Features\n1. **Advanced Analytics**\n   - Labor cost optimization\n   - Peak hour analysis\n   - Employee performance metrics\n\n2. **Manager Dashboard**\n   - Real-time labor costs\n   - Schedule conflict alerts\n   - Performance trending\n\n3. **Employee Mobile App**\n   - Shift swapping\n   - Availability updates\n   - Payroll preview\n\n## Market Opportunity\n- **Target Market**: 50-500 employee restaurants\n- **Current Solutions**: Clunky, expensive enterprise tools\n- **Our Advantage**: Restaurant-focused, simple UX\n\n## Technical Strategy\n- React Native for mobile\n- Next.js dashboard (consistency with other tools)\n- PostgreSQL for scheduling data\n- Real-time updates via websockets`,
    tags: ['product', 'roadmap', 'shift-check', 'features'],
    lastModified: '2025-01-22',
    size: '2.9 KB'
  }
];

const categories = [
  { id: 'all', name: 'All Documents', icon: FileText },
  { id: 'memory', name: 'Memory', icon: BookOpen },
  { id: 'daily-logs', name: 'Daily Logs', icon: Calendar },
  { id: 'brainstorms', name: 'Brainstorms', icon: Folder },
  { id: 'proposals', name: 'Proposals', icon: Eye }
];

export default function VaultPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(sampleDocuments[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredDocuments = useMemo(() => {
    return sampleDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const renderContent = (content: string) => {
    // Simple markdown renderer for basic formatting
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-[var(--text-primary)]">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-[var(--text-primary)]">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-[var(--text-primary)]">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1 text-[var(--text-secondary)]">{line.replace('- ', '')}</li>;
      }
      if (line.startsWith('✅ ')) {
        return <div key={index} className="flex items-start gap-2 mb-2"><span className="text-green-400 mt-1">✅</span><span className="text-[var(--text-secondary)]">{line.replace('✅ ', '')}</span></div>;
      }
      if (line.startsWith('⚠️ ')) {
        return <div key={index} className="flex items-start gap-2 mb-2"><span className="text-yellow-400 mt-1">⚠️</span><span className="text-[var(--text-secondary)]">{line.replace('⚠️ ', '')}</span></div>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      }
      return <p key={index} className="mb-3 text-[var(--text-secondary)] leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Sidebar */}
      <div className={`bg-[var(--bg-secondary)] border-r border-[var(--border)] transition-all duration-300 ${
        sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Categories</h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                Documents ({filteredDocuments.length})
              </h3>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 hover:bg-[var(--bg-tertiary)] rounded"
              >
                <ChevronDown size={16} className={`transform transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>
            
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filteredDocuments.map((doc) => (
                <motion.button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedDocument.id === doc.id
                      ? 'bg-[var(--bg-tertiary)] border border-[var(--border-hover)]'
                      : 'hover:bg-[var(--bg-tertiary)]'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[var(--text-primary)] truncate">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
                        {doc.path}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock size={12} />
                        <span className="text-xs text-[var(--text-muted)]">
                          {doc.lastModified}
                        </span>
                      </div>
                    </div>
                    <FileText size={16} className="text-[var(--text-muted)] mt-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Document Header */}
        <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {selectedDocument.title}
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {selectedDocument.path}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Modified {selectedDocument.lastModified}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span>{selectedDocument.size}</span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-2 mt-3">
            <Tag size={14} className="text-[var(--text-muted)]" />
            <div className="flex gap-2">
              {selectedDocument.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-xs text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={selectedDocument.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              {renderContent(selectedDocument.content)}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}