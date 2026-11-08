'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../components/icons';
import { CURRENCY, PLANS, TRIAL_DAYS } from './plans';

const money = n => `${CURRENCY}${n.toLocaleString('en-GB')}`;

// Plan cards with a yearly/monthly switch. Yearly is shown first (2 months free).
export default function PricingPlans() {
  const [billing, setBilling] = useState('yearly');
  const yearly = billing === 'yearly';

  return (
    <>
      <div className="pr-toggle" role="group" aria-label="Billing period">
        <button type="button" className={yearly ? 'on' : ''} aria-pressed={yearly} onClick={() => setBilling('yearly')}>
          Yearly <span>2 months free</span>
        </button>
        <button type="button" className={yearly ? '' : 'on'} aria-pressed={!yearly} onClick={() => setBilling('monthly')}>Monthly</button>
      </div>

      <div className="pr-plans">
        {PLANS.map(plan => {
          const perMonth = yearly ? Math.round(plan.yearly / 12) : plan.monthly;
          return (
            <article key={plan.id} className={'pr-plan' + (plan.popular ? ' is-popular' : '')}>
              {plan.popular && <p className="pr-badge">Most popular</p>}
              <h3>{plan.name}</h3>
              <p className="pr-tagline">{plan.tagline}</p>
              <p className="pr-price"><b>{money(perMonth)}</b><span>/month</span></p>
              <p className="pr-billed">{yearly ? `Billed yearly at ${money(plan.yearly)}` : 'Billed monthly'}</p>
              <p className="pr-trips"><Icon name="globe" size={16} />{plan.trips}</p>
              <Link className={'lp-btn pr-cta' + (plan.popular ? '' : ' pr-cta-plain')} href="/login?mode=signup">Start {TRIAL_DAYS}-day free trial</Link>
              <ul>
                {plan.features.map(f => <li key={f}><Icon name="check" size={16} />{f}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </>
  );
}
