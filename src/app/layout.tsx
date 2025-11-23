import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
