'use client';

interface GlitchTextProps {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}

export default function GlitchText({ as: Tag = 'h2', children, className = '' }: GlitchTextProps) {
  return (
    <Tag className={className}>
      {children}
    </Tag>
  );
}
