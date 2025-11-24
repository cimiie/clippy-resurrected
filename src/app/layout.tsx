import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'Windows 95 Emulator',
  description: 'A nostalgic Windows 95 experience in your browser',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
