import { useEffect } from 'react';
import { Preloader } from './sections/Preloader/Preloader';
import { Navbar } from './sections/Navbar/Navbar';
import { Hero } from './sections/Hero/Hero';
import { About } from './sections/About/About';
import { Skills } from './sections/Skills/Skills';
import { Projects } from './sections/Projects/Projects';
import { Experience } from './sections/Experience/Experience';
import { Contact } from './sections/Contact/Contact';
import { Footer } from './sections/Footer/Footer';

/**
 * Honour a deep link once the sections actually exist.
 *
 * The browser resolves `#projects` against the document as it arrives — and at
 * that moment this app has not rendered a single section, so it finds nothing to
 * scroll to and quietly stays at the top. Re-applying the hash after mount is
 * what makes a shared link open on the thing it names.
 *
 * `scrollIntoView` rather than re-assigning `location.hash`, which would append
 * a second history entry and make the back button a no-op. The instant behaviour
 * is deliberate: a smooth scroll on arrival would drag the visitor through
 * several screens of content they did not ask to see. `scroll-padding-top` on
 * <html> is what keeps the landing position clear of the fixed navigation.
 */
function useDeepLinkLanding() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    // One frame after mount every section is in the DOM and has been laid out.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });

    return () => cancelAnimationFrame(frame);
  }, []);
}

/**
 * Section order is the narrative order, and it matches the navigation:
 * the timeline is introduced (Hero), explained (About), equipped (Skills),
 * demonstrated (Projects), traced back (Experience), and opened to the visitor
 * (Contact).
 */
export function App() {
  useDeepLinkLanding();

  return (
    <>
      <Preloader />
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
