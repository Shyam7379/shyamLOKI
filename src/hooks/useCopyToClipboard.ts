import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy-to-clipboard with a transient "copied" flag for the button label.
 *
 * `navigator.clipboard` needs a secure context; on plain http (or a very old
 * browser) it is undefined, so the legacy `execCommand` path is kept as a
 * fallback and failure is reported honestly rather than silently swallowed.
 */
export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (value: string) => {
      window.clearTimeout(timer.current);

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const area = document.createElement('textarea');
          area.value = value;
          area.setAttribute('readonly', '');
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(area);
          if (!ok) throw new Error('execCommand copy failed');
        }
        setCopied(true);
        setFailed(false);
      } catch {
        setCopied(false);
        setFailed(true);
      }

      timer.current = window.setTimeout(() => {
        setCopied(false);
        setFailed(false);
      }, resetAfter);
    },
    [resetAfter],
  );

  return { copy, copied, failed };
}
