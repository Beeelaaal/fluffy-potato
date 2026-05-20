import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { TuteLogo } from '@/components/brand/TuteLogo';

const footerLinks = {
  Platform: [
    { label: 'Universities', href: '/universities' },
    { label: 'Resources', href: '/resources' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Admin Panel', href: '/admin' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

const socials = [
  { label: 'Twitter / X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'GitHub', href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-black/10 overflow-hidden bg-white/70">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#8B5CF6]/5 blur-[100px] pointer-events-none" />

      <div className="section-container pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <TuteLogo size={36} />
            </Link>
            <p className="text-[#0B071E]/80 text-sm leading-relaxed max-w-sm mb-6 font-semibold">
              Pakistan&apos;s premier EdTech platform connecting university students with resources,
              university insights, and expert tutoring in one unified place.
            </p>
            <div className="flex flex-col gap-2 text-[#0B071E]/60 text-sm font-bold">
              <span className="flex items-center gap-2"><MapPin size={14} className="text-[#8B5CF6]" /> Karachi, Pakistan</span>
              <span className="flex items-center gap-2"><Mail size={14} className="text-[#8B5CF6]" /> hello@tute.pk</span>
              <span className="flex items-center gap-2"><Phone size={14} className="text-[#8B5CF6]" /> 03312030359</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[#0B071E]/80 font-black text-sm mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[#0B071E]/70 hover:text-[#8B5CF6] text-sm font-semibold transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#0B071E]/50 text-sm font-semibold">
            © 2025 Tute. All rights reserved. Made for university students.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-[#0B071E]/50 hover:text-[#8B5CF6] font-semibold transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
