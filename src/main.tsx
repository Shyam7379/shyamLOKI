import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/*
 * Fonts are self-hosted via @fontsource rather than loaded from a CDN: no third
 * party connection, no layout shift while a stylesheet resolves, and the exact
 * weights used are the only ones downloaded.
 *
 *   Cinzel        — display: the name, section titles, monogram wordmark
 *   Inter Variable— body: everything meant to be read at length
 *   JetBrains Mono— labels, readouts, tech tags (the TVA register)
 */
import '@fontsource/cinzel/latin-600.css';
import '@fontsource/cinzel/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource-variable/inter/wght.css';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { App } from './App';

/*
 * Scroll reveals are opt-in from JS only. If this line never runs — a bundle
 * error, JS disabled, an ancient browser — the reveal styles never apply and
 * every section renders fully visible instead of staying at opacity 0.
 */
document.documentElement.classList.add('js-reveal');

const container = document.getElementById('root');
if (!container) throw new Error('Mount node #root was not found in index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
