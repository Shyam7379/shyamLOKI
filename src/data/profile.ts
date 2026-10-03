/**
 * Single source of truth for personal + contact details.
 * Everything here is information Shyam supplied directly. Nothing invented.
 */

export const profile = {
  name: 'Shyam V.',
  /** Split wordmark so the nav/footer monogram can style the surname distinctly. */
  nameParts: { first: 'Shyam', last: 'V.' },
  role: 'Full Stack Developer',
  tagline: 'Architecting Experiences Across Timelines.',
  supporting:
    'Building meaningful digital experiences through code, creativity, and curiosity.',

  email: 'shyamhere2077@gmail.com',
  /** Display form vs. dialable form. */
  phone: { display: '+91 88258 90738', tel: '+918825890738' },

  github: 'https://github.com/Shyam7379',
  linkedin: 'https://www.linkedin.com/in/shyam-v-3b6232352/',

  college: 'Dwarka Doss Goverdhan Doss Vaishnav College',
  internship: 'Webbed',
  internshipRole: 'Full Stack Developer Intern',

  /** Where he's reachable. Justified by the +91 number and his Chennai college. */
  based: 'India',
} as const;

export type NavItem = { id: string; label: string };

/** Order here drives the nav, the scroll-spy and the footer link list. */
export const navItems: readonly NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

/** `mailto:` built once so the address can't drift between sections. */
export const mailtoHref = `mailto:${profile.email}`;
export const telHref = `tel:${profile.phone.tel}`;
