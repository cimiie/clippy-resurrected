import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { SystemSettingsProvider } from '@/contexts/SystemSettingsContext';
import { InstalledAppsProvider } from '@/contexts/InstalledAppsContext';
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
          <SystemSettingsProvider>
            <InstalledAppsProvider>
              <FileSystemProvider>{children}</FileSystemProvider>
            </InstalledAppsProvider>
          </SystemSettingsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
