import Link from 'next/link';
import SiteNav from '../components/SiteNav';
import { Icon, Logo } from '../components/icons';
import { site } from '../site';
import PricingPlans from './PricingPlans';
import { COMING_SOON, INCLUDED, TRIAL_DAYS } from './plans';

export const metadata = {
  title: 'Pricing · Roveboard',
  description: `Simple plans for tour operators, DMCs and travel agencies. Start with a ${TRIAL_DAYS}-day free trial, no credit card required.`,
};

// Answers must stay true to how billing works today (no automatic charges yet).
const faqs = [
  ['How does the free trial work?', `Every plan starts with a ${TRIAL_DAYS}-day free trial with full access. No credit card is needed to start.`],
  ['What happens when my trial ends?', 'We’ll get in touch before your trial ends to help you choose a plan. You won’t be charged automatically, and you keep your trips and suppliers.'],
  ['What counts as a trip?', 'Each trip you create in Roveboard, such as a group tour or a custom journey, with as many suppliers as it needs. Trips are counted per year.'],
  ['Can I switch plans or move between monthly and yearly?', 'Yes. Change plan as your business grows, or switch between monthly and yearly billing. Yearly billing gives you two months free.'],
  ['Do my suppliers pay anything?', 'No. Hotels, coach companies and guides never need an account and never pay. Only the travel company subscribes.'],
  ['Which currency are prices in?', 'Prices are shown in pounds sterling (GBP). VAT may apply depending on where your business is based.'],
];

export default function PricingPage() {
  return (
    <div className="lp pr">
      <header className="pr-head">
        <SiteNav />
        <div className="lp-wrap pr-intro">
          <small className="lp-eyebrow">Pricing</small>
          <h1>Simple pricing for every travel team</h1>
          <p>One subscription for your whole company, priced by how many trips you run. Start with a {TRIAL_DAYS}-day free trial. No credit card required.</p>
        </div>
      </header>

      <section className="lp-wrap pr-body">
        <PricingPlans />

        <div className="pr-enterprise">
          <div>
            <h3>Running more than 200 trips a year?</h3>
            <p>Enterprise plans include unlimited trips, tailored onboarding and help connecting the tools you already use.</p>
          </div>
          <a className="lp-btn lp-btn-ghost-dark" href={`mailto:${site.contactEmail}`}>Talk to us</a>
        </div>

        <div className="pr-included">
          <div>
            <h2>Every plan includes</h2>
            <ul>{INCLUDED.map(f => <li key={f}><Icon name="check" size={16} />{f}</li>)}</ul>
          </div>
          <div>
            <h2>Coming soon</h2>
            <ul className="pr-soon">{COMING_SOON.map(f => <li key={f}><Icon name="sparkle" size={16} />{f}</li>)}</ul>
            <p className="pr-soon-note">New features are added to every plan as they launch, at no extra cost during early access.</p>
          </div>
        </div>
      </section>

      <section className="lp-faq" id="faq">
        <div className="lp-wrap">
          <small className="lp-eyebrow">Questions</small>
          <h2 className="lp-h2">Pricing questions</h2>
          <div className="lp-faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<Icon name="plus" size={20} /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-final">
        <div className="lp-wrap">
          <h2>Try Roveboard free for {TRIAL_DAYS} days</h2>
          <p>Set up your first trip in minutes. No credit card required.</p>
          <Link className="lp-btn" href="/login?mode=signup">Start your free trial <Icon name="arrow" /></Link>
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-wrap lp-foot-inner">
          <Logo />
          <nav aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Log in</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <small>© 2026 {site.name}</small>
        </div>
      </footer>
    </div>
  );
}
