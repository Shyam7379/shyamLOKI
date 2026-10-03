import { useRef, useState, type FormEvent } from 'react';
import { mailtoHref, profile, telHref } from '../../data/profile';
import { atmosphere } from '../../data/media';
import { Reveal } from '../../components/ui/Reveal';
import { Icon, type IconName } from '../../components/ui/Icon';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import './contact.css';

/**
 * =============================================================================
 * THE CONTACT FORM — what actually happens when someone submits
 * =============================================================================
 * There is no backend for this site, and the form does not pretend there is.
 *
 *   · FORM_ENDPOINT is empty  ->  (default, and what ships)
 *       Submitting builds a fully formatted `mailto:` draft and hands it to the
 *       visitor's mail client. Name, reply-to address and message are all
 *       pre-filled and correctly percent-encoded. Nothing is transmitted by the
 *       page itself, and the UI says so in plain language.
 *
 *   · FORM_ENDPOINT is set   ->  the form POSTs JSON to that URL and reports a
 *       real success or failure state.
 *
 * To point it at a form service, paste its endpoint below. Any provider that
 * accepts `POST` with a JSON body works — Formspree
 * (https://formspree.io/f/xxxxxxx), Web3Forms (https://api.web3forms.com/submit),
 * Basin, or your own Cloudflare Worker / Vercel function. No other change is
 * needed: validation, states and accessibility are already handled.
 */
const FORM_ENDPOINT = '';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';
type FieldName = 'name' | 'email' | 'message';
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = 'Please tell me your name.';
  } else if (values.name.trim().length < 2) {
    errors.name = 'That looks a little short — at least 2 characters.';
  }

  if (!values.email.trim()) {
    errors.email = 'An email address is needed so I can reply.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'That email address looks incomplete.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please add a short message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'A few more words would help — at least 10 characters.';
  }

  return errors;
}

const CARDS: readonly {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  copyValue?: string;
}[] = [
  { id: 'email', icon: 'mail', label: 'Email', value: profile.email, href: mailtoHref, copyValue: profile.email },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Phone',
    value: profile.phone.display,
    href: telHref,
    copyValue: profile.phone.tel,
  },
  {
    id: 'github',
    icon: 'github',
    label: 'GitHub',
    value: 'github.com/Shyam7379',
    href: profile.github,
    external: true,
  },
  {
    id: 'linkedin',
    icon: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/shyam-v-3b6232352',
    href: profile.linkedin,
    external: true,
  },
];

export function Contact() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const refs = { name: nameRef, email: emailRef, message: messageRef };

  const setField = (field: FieldName) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear the error the moment the visitor starts fixing it.
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    const firstInvalid = (['name', 'email', 'message'] as const).find((field) => found[field]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    if (FORM_ENDPOINT) {
      setStatus('sending');
      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          setStatus('sent');
          setValues(EMPTY);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
      return;
    }

    const subject = `Portfolio enquiry — ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setStatus('mailto');
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      {/* Atmospheric closer: the tendrils shot, heavily veiled */}
      <img
        className="contact__atmosphere"
        src={atmosphere.tendrils}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        width={1600}
        height={738}
      />
      <div className="contact__veil" aria-hidden="true" />

      <div className="shell shell--wide contact__grid">
        <div className="contact__intro">
          <Reveal as="div" className="contact__intro-inner">
            <p className="eyebrow">Open a New Timeline</p>
            <h2 className="contact__title" id="contact-title">
              Have an idea? <em>Let&rsquo;s create its timeline.</em>
            </h2>
            <p className="contact__lead">
              Have a project in mind, want to collaborate, or simply want to connect? I&rsquo;d love
              to hear from you.
            </p>

            <ul className="contact__cards">
              {CARDS.map((card, index) => (
                <ContactCard key={card.id} card={card} delay={index * 60} />
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="div" className="contact__form-wrap" delay={120}>
          <form className="contact__form card" onSubmit={onSubmit} noValidate>
            <p className="contact__form-title">Send a message</p>

            <div className="field">
              <label className="field__label" htmlFor="contact-name">
                Name
              </label>
              <input
                ref={nameRef}
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className={`field__input${errors.name ? ' is-invalid' : ''}`}
                value={values.name}
                onChange={(event) => setField('name')(event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="Your name"
              />
              <FieldError id="contact-name-error" message={errors.name} />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="contact-email">
                Email
              </label>
              <input
                ref={emailRef}
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                className={`field__input${errors.email ? ' is-invalid' : ''}`}
                value={values.email}
                onChange={(event) => setField('email')(event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                placeholder="you@example.com"
              />
              <FieldError id="contact-email-error" message={errors.email} />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                ref={messageRef}
                id="contact-message"
                name="message"
                rows={5}
                className={`field__input field__input--area${errors.message ? ' is-invalid' : ''}`}
                value={values.message}
                onChange={(event) => setField('message')(event.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
                placeholder="What would you like to build?"
              />
              {errors.message ? (
                <FieldError id="contact-message-error" message={errors.message} />
              ) : (
                <p className="field__hint" id="contact-message-hint">
                  A sentence or two about the project is plenty.
                </p>
              )}
            </div>

            <button
              className="btn btn--primary contact__submit"
              type="submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
              <Icon name={status === 'sending' ? 'plus' : 'arrowRight'} size={17} className="btn__icon" />
            </button>

            <p className="contact__disclosure">
              {FORM_ENDPOINT
                ? 'This form posts directly to a form service. Your details are only used to reply.'
                : 'No server here: submitting opens your own email app with this message pre-filled, addressed to shyamhere2077@gmail.com. Nothing is sent automatically.'}
            </p>

            <p
              className={`contact__status contact__status--${status}`}
              role="status"
              aria-live="polite"
            >
              {status === 'mailto'
                ? 'Your email app should have opened with the message ready — just press send.'
                : null}
              {status === 'sent' ? 'Message sent. I’ll get back to you soon.' : null}
              {status === 'error'
                ? 'That didn’t go through. Please email shyamhere2077@gmail.com directly.'
                : null}
            </p>
          </form>
        </Reveal>
      </div>

      <Reveal as="p" className="contact__closing">
        Every great story begins with a single branch.
      </Reveal>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id} role="alert">
      {message}
    </p>
  );
}

function ContactCard({
  card,
  delay,
}: {
  card: (typeof CARDS)[number];
  delay: number;
}) {
  const { copy, copied, failed } = useCopyToClipboard();

  return (
    <Reveal as="li" className="contact__card" delay={delay}>
      <a
        className="contact__card-link"
        href={card.href}
        {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <span className="contact__card-icon" aria-hidden="true">
          <Icon name={card.icon} size={19} />
        </span>
        <span className="contact__card-text">
          <span className="contact__card-label">{card.label}</span>
          <span className="contact__card-value">{card.value}</span>
        </span>
        <Icon
          name={card.external ? 'arrowUpRight' : 'arrowRight'}
          size={16}
          className="contact__card-arrow"
        />
      </a>

      {card.copyValue ? (
        <button
          type="button"
          className="contact__card-copy"
          onClick={() => void copy(card.copyValue as string)}
          aria-label={`Copy ${card.label.toLowerCase()} — ${card.value}`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} />
          <span>{failed ? 'Copy failed' : copied ? 'Copied' : 'Copy'}</span>
        </button>
      ) : null}
    </Reveal>
  );
}
