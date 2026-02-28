'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  slug: string;
}

interface EmployeeFiltersProps {
  businesses: Business[];
}

export default function EmployeeFilters({ businesses }: EmployeeFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const isFirstRender = useRef(true);

  // Debounce search input → URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('q', search);
      } else {
        params.delete('q');
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBusinessChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('business', value);
    } else {
      params.delete('business');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearAll = () => {
    setSearch('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters =
    searchParams.get('q') ||
    searchParams.get('business') ||
    searchParams.get('status');

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Business filter */}
      <select
        value={searchParams.get('business') || ''}
        onChange={(e) => handleBusinessChange(e.target.value)}
        className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
      >
        <option value="">All Businesses</option>
        {businesses.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={searchParams.get('status') || ''}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
      >
        <option value="">All Status</option>
        <option value="complete">Complete</option>
        <option value="missing">Missing Items</option>
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
