import type { Metadata } from 'next';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { FileSystemProvider } from '@/contexts/FileSystemContext';
import { SystemSettingsProvider } from '@/contexts/SystemSettingsContext';
import { InstalledAppsProvider } from '@/contexts/InstalledAppsContext';
import { TokenProvider } from '@/contexts/TokenContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kiro 97',
  description: 'A nostalgic retro OS experience in your browser',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
          <TokenProvider>
            <SystemSettingsProvider>
              <InstalledAppsProvider>
                <FileSystemProvider>{children}</FileSystemProvider>
              </InstalledAppsProvider>
            </SystemSettingsProvider>
          </TokenProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
