import type { Metadata } from 'next';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: "OBM HQ | Olsen Brands Management",
  robots: "noindex, nofollow",
};

export default function HQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}