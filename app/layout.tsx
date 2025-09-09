import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next';

// This is automatically inherited by all pages that use this layout.
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // The %s will be replaced with the specific page title (See /dashboard/invoices/page.tsx)
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dasbhoard, built with App Router.',
  metadataBase: new URL('http://localhost:3000/'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
