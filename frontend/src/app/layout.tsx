import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/navigation/Navbar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Forecast Budget',
  description: 'Application de gestion de budget',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='fr'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className='container mx-auto px-4 py-8'>{children}</main>
          <Toaster richColors position='bottom-right' />
        </AuthProvider>
      </body>
    </html>
  );
}
