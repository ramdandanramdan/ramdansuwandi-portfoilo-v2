'use client';

interface RichDescriptionProps {
  text: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function RichDescription({ text, className = '', style }: RichDescriptionProps) {
  if (!text) return null;

  const blocks = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map(b => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className={`text-[var(--text-secondary)] leading-relaxed text-base space-y-4 ${className}`} style={style}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const allBullets = lines.length > 0 && lines.every(l => /^[-*]\s+/.test(l));
        if (allBullets) {
          return (
            <div key={bi} className="space-y-1.5">
              {lines.map((line, li) => {
                const m = line.match(/^[-*]\s+(.+)/);
                return (
                  <div key={li} className="flex items-start gap-2.5">
                    <svg className="w-2 h-2 mt-[9px] shrink-0 text-[var(--electric-blue)]" viewBox="0 0 8 8" fill="currentColor">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    <span>{m ? m[1] : line}</span>
                  </div>
                );
              })}
            </div>
          );
        }
        return <p key={bi} className="whitespace-pre-wrap">{block.replace(/\n/g, ' ')}</p>;
      })}
    </div>
  );
}
