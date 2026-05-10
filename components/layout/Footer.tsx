import Link from 'next/link';
import { Zap, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Universities', href: '/universities' },
    { label: 'Resources', href: '/resources' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Admin Panel', href: '/admin' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Contact Us', href: '#' },
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
    <footer className="relative mt-24 border-t border-glass-border overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-600/10 blur-[100px] pointer-events-none" />

      <div className="section-container pt-16 pb-10 relative z-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5b63f5, #7c3aed)' }}>
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-2xl">
                Tutor<span className="gradient-text">Tap</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              Pakistan&apos;s premier EdTech platform connecting university students with resources, 
              university insights, and expert tutoring — all in one place.
            </p>
            <div className="flex flex-col gap-2 text-white/40 text-sm">
              <span className="flex items-center gap-2"><MapPin size={14} /> Islamabad, Pakistan</span>
              <span className="flex items-center gap-2"><Mail size={14} /> hello@tutortap.pk</span>
              <span className="flex items-center gap-2"><Phone size={14} /> +92-51-1234-5678</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white/90 font-semibold text-sm mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/45 hover:text-white/85 text-sm transition-colors duration-200"
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm">
            © 2025 TutorTap. All rights reserved. Built with ❤️ for Pakistani students.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-white/40 hover:text-white/80 transition-colors"
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
