import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kiro 97',
  description: 'A nostalgic retro OS experience in your browser',
};

export const dynamicParams = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <FileSystemProvider>{children}</FileSystemProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
