import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GovMate AI',
  description: 'AI-powered document assistant for immigrants in Germany',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
