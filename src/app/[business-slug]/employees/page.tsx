import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  ClipboardList,
  BookOpen,
  FileText,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────

interface Business {
  id: string;
  name: string;
  slug: string;
  location: string;
}

// ─── Resource Cards ─────────────────────────────────────

interface ResourceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  status: 'active' | 'coming-soon';
  badge?: string;
}

// ─── Page ──────────────────────────────────────────────

export default async function EmployeeHubPage({
  params,
}: {
  params: Promise<{ 'business-slug': string }>;
}) {
  const { 'business-slug': slug } = await params;

  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, name, slug, location')
    .eq('slug', slug)
    .eq('active', true)
    .single();

  if (error || !business) {
    notFound();
  }

  const biz = business as Business;

  const resources: ResourceCard[] = [
    {
      icon: ClipboardList,
      title: 'New Employee Onboarding',
      description:
        'Complete your required documents and get set up as a new team member. Sign company policy, upload your Food Handler\'s Permit, and more.',
      href: `/${biz.slug}/onboarding`,
      status: 'active',
      badge: 'Required',
    },
    {
      icon: BookOpen,
      title: 'Training Library',
      description:
        'Step-by-step training modules for your role. Learn procedures, food safety, customer service standards, and everything you need to thrive.',
      status: 'coming-soon',
    },
    {
      icon: FileText,
      title: 'Documentation & Handbook',
      description:
        'Company policies, employee handbook, and reference materials — available anytime you need them.',
      status: 'coming-soon',
    },
    {
      icon: Calendar,
      title: 'Schedules & Time Off',
      description:
        'View your schedule, request time off, and stay up to date on shift changes.',
      status: 'coming-soon',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-6 border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
              <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
                Olsen Brands
              </Link>
              <span>/</span>
              <Link
                href={`/${biz.slug}`}
                className="hover:text-[var(--text-secondary)] transition-colors"
              >
                {biz.name}
              </Link>
              <span>/</span>
              <span className="text-[var(--text-secondary)]">Employees</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              Employee Resources
            </h1>
            <p className="text-[var(--text-secondary)] mt-4 text-lg max-w-xl">
              Everything you need as a {biz.name} team member — from your first day
              to your best day.
            </p>

            {biz.location && (
              <p className="text-sm text-[var(--text-muted)] mt-3">
                {biz.name} · {biz.location}
              </p>
            )}
          </div>
        </section>

        {/* Resource grid */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {resources.map((resource) => {
                const Icon = resource.icon;
                const isActive = resource.status === 'active';

                if (isActive && resource.href) {
                  return (
                    <Link
                      key={resource.title}
                      href={resource.href}
                      className="group relative flex flex-col gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/40 transition-all"
                    >
                      {resource.badge && (
                        <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-medium">
                          {resource.badge}
                        </span>
                      )}
                      <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)]/20 transition-colors">
                        <Icon size={22} className="text-[var(--accent)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between pr-16">
                          <h3 className="font-semibold text-[var(--text-primary)] text-lg">
                            {resource.title}
                          </h3>
                          <ArrowRight
                            size={16}
                            className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0"
                          />
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={resource.title}
                    className="relative flex flex-col gap-4 p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl opacity-60 cursor-not-allowed"
                  >
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border)]">
                      <Lock size={10} />
                      Coming soon
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                      <Icon size={22} className="text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 pr-24">
                      <h3 className="font-semibold text-[var(--text-secondary)] text-lg">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <Link
                href={`/${biz.slug}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft size={14} />
                Back to {biz.name}
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
    .select('name')
    .eq('slug', slug)
    .single();

  if (!data) return {};

  return {
    title: `Employee Resources — ${data.name} | Olsen Brands`,
    description: `Onboarding, training, and documentation for ${data.name} employees.`,
  };
}
