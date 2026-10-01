import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAD-ILA',
  description: 'Sistema de Apoio ao Desenvolvimento de Material Didático',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem' }}>
        {children}
      </body>
    </html>
  );
}
