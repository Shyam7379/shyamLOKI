/**
 * Loki Helmet Emblem & Brand Wordmark.
 * Uses the circular Loki horned helmet seal.
 */

type MonogramProps = {
  size?: number;
  className?: string;
  /** Supply for a standalone/meaningful mark; omit inside a wordmark. */
  title?: string;
};

export function Monogram({ size = 36, className, title }: MonogramProps) {
  return (
    <img
      src="/media/brand/loki-helmet-emblem.png"
      alt={title || 'Loki Helmet Emblem'}
      width={size}
      height={size}
      className={`brand-mark ${className || ''}`.trim()}
      aria-hidden={title ? undefined : true}
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'contain',
        verticalAlign: 'middle',
      }}
    />
  );
}

/**
 * Wordmark = brand emblem + name. Used in the navigation and the footer.
 * The trailing period is gold, echoing the "V." punctuation as a monogram.
 */
export function Wordmark({
  size = 32,
  onDark = true,
}: {
  size?: number;
  onDark?: boolean;
}) {
  return (
    <span className="wordmark" data-on-dark={onDark || undefined}>
      <Monogram size={size} className="wordmark__mark" />
      <span className="wordmark__text">
        <span className="wordmark__first">Shyam</span>{' '}
        <span className="wordmark__last">V</span>
        <span className="wordmark__dot">.</span>
      </span>
    </span>
  );
}

