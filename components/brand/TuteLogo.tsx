import Image from 'next/image';

interface TuteLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
}

export function TuteLogo({ size = 32, className = '', withText = true }: TuteLogoProps) {
  // The logo image already has the word "tute"
  // Aspect ratio is 16:9, so width = size * 1.77
  const width = Math.round(size * 1.77);
  const height = size;

  return (
    <span className={`inline-flex items-center bg-[#0B071E] px-3 py-1.5 rounded-2xl border border-[#0B071E] hover:border-[#8B5CF6] transition-all ${className}`}>
      <span className="relative flex items-center justify-center overflow-hidden" style={{ width, height }}>
        <Image
          src="/logo.jpg"
          alt="Tute Logo"
          width={width}
          height={height}
          className="object-contain"
          style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }}
          priority
        />
      </span>
    </span>
  );
}

export function TuteLogoMark({ size = 28 }: { size?: number }) {
  // TuteLogoMark is used when only the icon is wanted. We can show the stylized gradient 't' since it aligns with the brand colors (cyan/teal).
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #2EF2FF 0%, #00B8C8 100%)',
        boxShadow: '0 4px 20px rgba(46,242,255,0.25)',
      }}
    >
      <span
        className="font-display font-bold text-dark-900 select-none"
        style={{ fontSize: size * 0.48, letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        t
      </span>
    </span>
  );
}
