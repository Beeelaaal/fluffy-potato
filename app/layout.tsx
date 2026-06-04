import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans } from 'next/font/google';
// @ts-ignore
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TestimonialPrompt from '@/components/popup/TestimonialPrompt';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeShutter from '@/components/layout/ThemeShutter';
import AdminRedirectGuard from '@/components/guards/AdminRedirectGuard';

const displayFont = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "Tute — Your University Life, Simplified",
  description: "Pakistan's premier platform connecting students with universities, resources, and expert tutors.",
  keywords: 'tute, tutor, university, pakistan, education, edtech, resources, marketplace',
  authors: [{ name: 'Tute' }],
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Tute — Your University Life, Simplified',
    description: "Pakistan's premier platform for university students",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body bg-[#FDFBF7] text-[#0B071E] antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <AdminRedirectGuard>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <TestimonialPrompt />
              <ThemeShutter />
            </AdminRedirectGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
