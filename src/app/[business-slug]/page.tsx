import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MapPin, Users, ArrowRight, Building2 } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────

interface Business {
  id: string;
  name: string;
  slug: string;
  type: string;
  location: string;
  active: boolean;
}

// ─── Helpers ───────────────────────────────────────────

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    restaurant: 'Restaurant',
    'quick-service': 'Quick Service Restaurant',
    'food-drink': 'Food & Drink',
    franchise: 'Franchise Location',
    education: 'Education',
    music: 'Music School',
    software: 'Software',
  };
  return labels[type] ?? type;
}

// ─── Page ──────────────────────────────────────────────

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ 'business-slug': string }>;
}) {
  const { 'business-slug': slug } = await params;

  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, slug, type, location, active')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !business) {
    notFound();
  }

  const biz = business as Business;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-6 border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
              <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
                Olsen Brands
              </Link>
              <span>/</span>
              <span className="text-[var(--text-secondary)]">{biz.name}</span>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                <Building2 size={28} className="text-[var(--accent)]" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                  {biz.name}
                </h1>
                <p className="text-[var(--text-muted)] mt-2 text-lg">
                  An Olsen Brands Management business
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {biz.location && (
                    <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                      <MapPin size={14} />
                      {biz.location}
                    </span>
                  )}
                  {biz.type && (
                    <span className="text-xs px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)]">
                      {typeLabel(biz.type)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links grid */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-6">
              Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Employees */}
              <Link
                href={`/${biz.slug}/employees`}
                className="group flex items-start gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/40 hover:bg-[var(--bg-secondary)] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/20 transition-colors">
                  <Users size={20} className="text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--text-primary)]">
                      Employees
                    </h3>
                    <ArrowRight
                      size={16}
                      className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all"
                    />
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Onboarding, training, documentation, and resources for {biz.name} team members.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'business-slug': string }>;
}) {
  const { 'business-slug': slug } = await params;
  const { data } = await supabase
    .from('businesses')
    .select('name, location')
    .eq('slug', slug)
    .single();

  if (!data) return {};

  return {
    title: `${data.name} | Olsen Brands Management`,
    description: `${data.name} — ${data.location}. An Olsen Brands Management business.`,
  };
}
