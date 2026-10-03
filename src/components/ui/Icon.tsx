import type { SVGProps } from 'react';

/**
 * Inline stroke icons, drawn on a shared 24x24 grid with a 1.6 stroke so they
 * sit consistently next to the mono type.
 *
 * Kept inline rather than pulled from an icon package: the site needs about a
 * dozen shapes, and this avoids shipping (and tree-shaking) a whole library.
 */

export type IconName =
  | 'arrowRight'
  | 'arrowDown'
  | 'arrowUpRight'
  | 'mail'
  | 'phone'
  | 'github'
  | 'linkedin'
  | 'copy'
  | 'check'
  | 'menu'
  | 'close'
  | 'layers'
  | 'server'
  | 'database'
  | 'spark'
  | 'terminal'
  | 'cursor'
  | 'plus'
  | 'branch';

const paths: Record<IconName, string> = {
  arrowRight: 'M4 12h15m0 0-6-6m6 6-6 6',
  arrowDown: 'M12 4v15m0 0 6-6m-6 6-6-6',
  arrowUpRight: 'M7 17 17 7M9 7h8v8',
  mail: 'M3 6.5h18v11H3zM3.6 7.3l8.4 6.1 8.4-6.1',
  phone:
    'M6.4 3.5h3l1.5 3.7-2 1.4a12.5 12.5 0 0 0 6 6l1.4-2 3.7 1.5v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2z',
  github:
    'M9 19.5c-4 1.2-4-2.2-5.5-2.7m11 5.4v-3.4c0-1 .1-1.4-.5-2 2.4-.3 4.5-1.2 4.5-5.3a4.1 4.1 0 0 0-1.1-2.9 3.8 3.8 0 0 0-.1-2.9s-.9-.3-3 1.1a10.2 10.2 0 0 0-5.4 0C6.8 5.4 5.9 5.7 5.9 5.7a3.8 3.8 0 0 0-.1 2.9A4.1 4.1 0 0 0 4.7 11.5c0 4 2.1 4.9 4.5 5.2-.6.6-.6 1.2-.6 2v3.5',
  linkedin:
    'M4.5 9.5h3v10h-3zM6 4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM10.5 19.5v-10h3v1.4a3.4 3.4 0 0 1 3-1.6c2.3 0 3.5 1.5 3.5 4.2v6h-3v-5.4c0-1.4-.5-2.1-1.6-2.1s-1.9.8-1.9 2.3v5.2z',
  copy: 'M9 9h10.5v10.5H9zM5.5 15H4.5V4.5H15v1',
  check: 'M4.5 12.5 9.5 17.5 19.5 6.5',
  menu: 'M3.5 7h17M3.5 12h17M3.5 17h17',
  close: 'M6 6l12 12M18 6 6 18',
  layers: 'M12 3.5 21 8.5 12 13.5 3 8.5zM5.6 12.2 3 13.7l9 5 9-5-2.6-1.5M5.6 17.2 3 18.7l9 5 9-5-2.6-1.5',
  server:
    'M4 4.5h16v6H4zM4 13.5h16v6H4zM7.5 7.5h.01M7.5 16.5h.01',
  database:
    'M12 8.2c4.4 0 8-1 8-2.4S16.4 3.4 12 3.4 4 4.4 4 5.8s3.6 2.4 8 2.4zM20 5.8v12.4c0 1.3-3.6 2.4-8 2.4s-8-1.1-8-2.4V5.8M20 12c0 1.3-3.6 2.4-8 2.4S4 13.3 4 12',
  spark:
    'M12 3.2l1.9 5.2 5.2 1.9-5.2 1.9L12 17.4l-1.9-5.2-5.2-1.9 5.2-1.9zM18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
  terminal: 'M3.5 4.5h17v15h-17zM7 9.5l2.5 2.5L7 14.5M12 15h5',
  cursor: 'M6 3.5 19 12l-5.6 1.2L11 19z',
  plus: 'M12 5v14M5 12h14',
  branch:
    'M8 21V9m0 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm8-14a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 6v3a4 4 0 0 1-4 4h-1',
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Rendered size in px (square). */
  size?: number;
};

export function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Filled variant for the brand/social marks that read better as solids. */
export function BrandIcon({ name, size = 20, ...rest }: Omit<IconProps, 'strokeWidth'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
