import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Autoify — AI Automation Platform',
  description: 'Build powerful automations with AI. Connect your apps, automate workflows, and scale your business.',
  keywords: ['automation', 'AI', 'workflow', 'zapier alternative', 'no-code'],
  openGraph: {
    title: 'Autoify — AI Automation Platform',
    description: 'Build powerful automations with AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            gutter={10}
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(13, 13, 26, 0.95)',
                color: '#e2e8ff',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)',
                fontSize: '13.5px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                padding: '12px 16px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: 'transparent' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: 'transparent' },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
