import { mailtoHref, navItems, profile } from '../../data/profile';
import { Wordmark } from '../../components/brand/Monogram';
import { BranchDivider } from '../../components/ui/Timeline';
import { Icon, BrandIcon } from '../../components/ui/Icon';
import './footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <BranchDivider />

      <div className="shell shell--wide footer__inner">
        <div className="footer__brand">
          <a
            className="footer__brand-link"
            href="#home"
            aria-label={`${profile.name} — back to top`}
          >
            <Wordmark size={38} />
          </a>
          <p className="footer__role">{profile.role}</p>
          <p className="footer__line">Architecting experiences across timelines.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <p className="footer__label">Navigate</p>
          <ul className="footer__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__connect">
          <p className="footer__label">Connect</p>
          <ul className="footer__list">
            <li>
              <a href={mailtoHref}>
                <Icon name="mail" size={15} />
                {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <BrandIcon name="github" size={15} />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <BrandIcon name="linkedin" size={15} />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell shell--wide footer__base">
        <p className="footer__copy">
          © <span>{year}</span> {profile.name} — {profile.role}.
        </p>
        <p className="footer__sign">
          Designed and built by hand, on the sacred timeline.
        </p>
      </div>
    </footer>
  );
}
