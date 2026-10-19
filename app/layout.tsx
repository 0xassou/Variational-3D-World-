import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Variational Summit · 3D World',
  description:
    'Hall de conférence 3D interactif dédié à Variational : moteur RFQ, Omni à 0 % de fees, Variational Pro OTC et tokenomics.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4f6fa',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans">{children}</body>
    </html>
  );
}
