import { BRAND_BLUE, EMBLEM_PATH, EMBLEM_WIDTH, LOGO_VIEWBOX, WORDMARK_PATHS } from '@/lib/brand';

interface VariationalLogoProps {
  /** `full` = emblème + wordmark, `emblem` = vague seule. */
  variant?: 'full' | 'emblem';
  /** Couleur du wordmark (l'emblème garde le bleu officiel). */
  textColor?: string;
  className?: string;
}

/** Logo officiel Variational en SVG inline (tracés repris de variational.io). */
export function VariationalLogo({ variant = 'full', textColor = '#0b1f3a', className }: VariationalLogoProps) {
  const width = variant === 'full' ? LOGO_VIEWBOX.width : EMBLEM_WIDTH;
  return (
    <svg
      viewBox={`0 0 ${width} ${LOGO_VIEWBOX.height}`}
      className={className}
      role="img"
      aria-label="Variational"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={EMBLEM_PATH.d} fill={BRAND_BLUE} fillRule={EMBLEM_PATH.evenOdd ? 'evenodd' : undefined} clipRule={EMBLEM_PATH.evenOdd ? 'evenodd' : undefined} />
      {variant === 'full' &&
        WORDMARK_PATHS.map((p, i) => (
          <path key={i} d={p.d} fill={textColor} fillRule={p.evenOdd ? 'evenodd' : undefined} clipRule={p.evenOdd ? 'evenodd' : undefined} />
        ))}
    </svg>
  );
}
