import type { Metadata } from 'next';
import { Bungee, Sora } from 'next/font/google';
// @ts-ignore
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

const displayFont = Bungee({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const bodyFont = Sora({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "TutorTap - Pakistan's #1 EdTech Platform",
  description: "Pakistan's premier EdTech platform connecting students with universities, resources, and expert tutors.",
  keywords: 'tutor, university, pakistan, education, edtech, resources, marketplace',
  authors: [{ name: 'TutorTap' }],
  openGraph: {
    title: 'TutorTap - Your University Life, Simplified',
    description: "Pakistan's premier EdTech platform for university students",
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body bg-dark-900 text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
