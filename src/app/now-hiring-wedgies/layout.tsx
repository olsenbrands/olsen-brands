import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Now Hiring | Wedgie's — Clinton, UT",
  description:
    "Apply to join the Wedgie's crew in Clinton, UT. We're looking for friendly, hardworking team members. Greens, proteins, and ice cream.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
