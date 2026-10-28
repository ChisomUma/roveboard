import Link from 'next/link';
import { Icon, Logo } from './components/icons';
import { sampleImage } from './components/images';
import WaitlistForm from './WaitlistForm';
import { site } from './site';

const sideNav = [['globe', 'Trips'], ['users', 'Suppliers'], ['file', 'Documents'], ['calendar', 'Deadlines'], ['note', 'Notes']];
const tabs = ['Overview', 'Suppliers', 'Itinerary', 'Documents', 'Deadlines'];
const stats = [['8', 'Suppliers', 'building', 'blue'], ['6', 'Confirmed', 'checkFilled', 'green'], ['2', 'Pending', 'alert', 'orange'], ['0', 'Overdue', 'alert', 'red']];
const categoryIcon = { Hotel: 'bed', Transport: 'bus', Guide: 'users' };

// deposit: null means paid; balance: null means complete
const suppliers = [
  { img: 'thumb-bella-vista', name: 'Hotel Bella Vista', place: 'Rome', category: 'Hotel', confirmed: true, deposit: null, balance: 'Due 1 Aug 2027' },
  { img: 'thumb-miramare', name: 'Grand Hotel Miramare', place: 'Sorrento', category: 'Hotel', confirmed: true, deposit: null, balance: 'Due 15 Jul 2027' },
  { img: 'thumb-alpine-coaches', name: 'Alpine Coaches', place: 'Group transport', category: 'Transport', confirmed: false, deposit: 'Due 30 Apr 2027', balance: 'Due 1 Aug 2027' },
  { img: 'thumb-luigis-guides', name: 'Luigi’s Local Guides', place: 'Amalfi Coast', category: 'Guide', confirmed: true, deposit: null, balance: null },
  { img: 'thumb-pompeii', name: 'Pompeii Archaeological Tours', place: 'Pompeii', category: 'Guide', confirmed: false, deposit: 'Due 15 May 2027', balance: 'Due 15 Aug 2027' },
];

const steps = [
  ['Add your suppliers', 'Keep all your hotels, transport, guides and activity providers in one place.'],
  ['Track confirmations\nand payments', 'See what’s confirmed, what’s pending and what’s due — at a glance.'],
  ['Stay on top of deadlines', 'Get a clear view of upcoming deposits and final balances so you can plan ahead with confidence.'],
];

// Answers must stay true to what exists today; update them as features ship.
const faqs = [
  ['Do my suppliers need an account?', 'No. Hotels, coach companies and guides never need to sign up or pay. You keep talking to them by email or WhatsApp as you do today, and record what they confirm in Roveboard.'],
  ['Does Roveboard handle payments?', 'No. Roveboard tracks deposits and final balances, and when they’re due, so nothing is missed. You pay suppliers your usual way and mark the payment as paid. Roveboard never holds or moves your money.'],
  ['Is my data safe?', 'Today’s demo keeps everything in your own browser; nothing you type is sent to us. When early access opens, each company’s data will be private to its own team, and you’ll be able to export it at any time.'],
  ['Can I bring in my spreadsheet?', 'Yes. You can import suppliers from a CSV file, or copy cells straight from Excel or Google Sheets and paste them in. Roveboard matches your columns and shows a preview before anything is added.'],
  ['Does the AI read my emails?', 'Only what you choose to paste or upload. AI suggestions are an early access concept: Roveboard will suggest details from a supplier email or contract, and nothing is saved until you’ve reviewed and confirmed it.'],
  ['How much will it cost?', 'We’re setting pricing with our first users. It will be a monthly subscription paid by the travel company. Suppliers never pay.'],
  ['When can I start?', 'You can try the demo right now. Early access opens to a small group first; join the waitlist below to be one of them.'],
];

const suggestedFields = [
  ['calendar', 'Dates', '12 – 15 September 2027', '3 nights'],
  ['coins', 'Total amount', '€4,800'],
  ['card', 'Deposit', '€1,440 (30%)', 'Due 30 April 2027'],
];

function Pill({ tone, icon, children }) {
  return <span className={'lp-pill is-' + tone}><Icon name={icon} size={14} />{children}</span>;
}

function AppPreview() {
  return (
    <div className="lp-preview-wrap">
      <div className="lp-preview">
        <aside className="lp-pside">
          <Logo />
          <ul>
            {sideNav.map(([icon, label], i) => <li key={label} className={i ? '' : 'on'}><Icon name={icon} />{label}</li>)}
          </ul>
        </aside>
        <div className="lp-pmain">
          <div className="lp-phead">
            <div>
              <span className="lp-crumb"><Icon name="chevronLeft" size={14} />Trips</span>
              <h2>Italy Explorer 2027</h2>
              <p className="lp-meta">12 – 20 Sep 2027<i />24 travellers</p>
            </div>
            <Link className="lp-padd" href="/dashboard">Add supplier <Icon name="plus" size={16} /></Link>
          </div>
          <div className="lp-tabs">
            {tabs.map((t, i) => <span key={t} className={i ? '' : 'on'}>{t}</span>)}
          </div>
          <div className="lp-pbody">
            <div className="lp-pstats">
              {stats.map(([n, label, icon, tone]) => (
                <div key={label}>
                  <i className={'is-' + tone}><Icon name={icon} size={20} /></i>
                  <span><b>{n}</b><small>{label}</small></span>
                </div>
              ))}
            </div>
            <h3>Suppliers</h3>
            <div className="lp-table">
              <table>
                <thead>
                  <tr><th>Supplier</th><th>Category</th><th>Confirmation</th><th>Deposit</th><th>Final balance</th></tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.name}>
                      <td>
                        <div className="lp-sup">
                          <img src={sampleImage(s.img)} alt="" />
                          <div><b>{s.name}</b><small>{s.place}</small></div>
                        </div>
                      </td>
                      <td><span className="lp-cat"><Icon name={categoryIcon[s.category]} size={16} />{s.category}</span></td>
                      <td>{s.confirmed ? <Pill tone="ok" icon="check">Confirmed</Pill> : <Pill tone="warn" icon="dot">Pending</Pill>}</td>
                      <td>{s.deposit ? <Pill tone="due" icon="dot">{s.deposit}</Pill> : <Pill tone="ok" icon="dot">Paid</Pill>}</td>
                      <td>{s.balance ? <Pill tone="muted" icon="receipt">{s.balance}</Pill> : <Pill tone="muted" icon="circle">Complete</Pill>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <svg className="lp-badge" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="lp-badge-top" d="M18 60a42 42 0 0 1 84 0" />
        <path id="lp-badge-bottom" d="M10 60a50 50 0 0 0 100 0" />
      </defs>
      <text><textPath href="#lp-badge-top" startOffset="50%" textAnchor="middle">LESS CHAOS</textPath></text>
      <text><textPath href="#lp-badge-bottom" startOffset="50%" textAnchor="middle">MORE TRAVEL</textPath></text>
      <circle cx="13" cy="62" r="1.6" fill="currentColor" />
      <circle cx="107" cy="62" r="1.6" fill="currentColor" />
      <path d="M44 72l10-17 6 9 4-5 12 13z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M48 66l6-4 6 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GmailMark() {
  return (
    <svg viewBox="0 0 24 18" width="28" height="21" aria-hidden="true">
      <path d="M1.6 18h3.8V8.7L0 4.6v11.8C0 17.3.7 18 1.6 18z" fill="#4285f4" />
      <path d="M18.6 18h3.8c.9 0 1.6-.7 1.6-1.6V4.6l-5.4 4.1z" fill="#34a853" />
      <path d="M18.6 1.6v7.1L24 4.6V2.4c0-2-2.3-3.1-3.9-1.9z" fill="#fbbc04" />
      <path d="M5.4 8.7V1.6L12 6.5l6.6-4.9v7.1L12 13.6z" fill="#ea4335" />
      <path d="M0 2.4v2.2l5.4 4.1V1.6L3.9.5C2.3-.7 0 .4 0 2.4z" fill="#c5221f" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8z" fill="#2f80ed" />
      <path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z" fill="#35d3ea" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="lp">
      <header className="lp-hero">
        <nav className="lp-wrap lp-nav">
          <Logo />
          <div>
            <Link className="lp-login" href="/dashboard">Try the demo</Link>
            <a className="lp-btn lp-btn-sm" href="#early">Join the waitlist</a>
          </div>
        </nav>
        <div className="lp-wrap lp-hero-copy">
          <h1>The calm behind<br />every great trip.</h1>
          <p className="lp-lead">Keep supplier confirmations, contracts, deposits and deadlines together in one workspace.</p>
          <p className="lp-audience">Built for tour operators, DMCs, travel agencies and wholesalers.</p>
          <a className="lp-btn" href="#early">Join the waitlist <Icon name="arrow" /></a>
        </div>
      </header>

      <AppPreview />

      <section className="lp-intro">
        <svg className="lp-wave lp-wave-a" viewBox="0 0 330 830" aria-hidden="true">
          <path d="M300 0C340 120 300 250 240 330 170 420 110 470 120 560c10 100 120 160 210 200" />
        </svg>
        <Badge />
        <div className="lp-wrap">
          <small className="lp-eyebrow">A simpler way to manage suppliers</small>
          <h2 className="lp-h2">From first enquiry to final balance,<br />all in one place.</h2>
          <p className="lp-sub">Roveboard keeps your hotels, transport, guides and more organised with clear confirmation statuses, deposit tracking and upcoming deadlines — so nothing gets missed.</p>
          <div className="lp-steps">
            {steps.map(([title, text], i) => (
              <article key={title}>
                <span className="lp-num">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-ai">
        <div className="lp-wrap">
          <small className="lp-eyebrow">Early access concept</small>
          <h2 className="lp-h2">Turn supplier documents<br />into trip details.</h2>
          <p className="lp-sub">Paste a supplier email or upload a contract. AI suggests key details for you to review before adding them to your trip.</p>
          <div className="lp-ai-grid">
            <div className="lp-card">
              <div className="lp-card-head"><GmailMark />Supplier email<span className="lp-more"><Icon name="more" size={22} /></span></div>
              <p className="lp-mail-meta">From: reservations@bellavista.it<br />Subject: Booking Confirmation – Hotel Bella Vista</p>
              <div className="lp-mail-body">
                <p>Dear Sarah,</p>
                <p>We are pleased to confirm your reservation at Hotel Bella Vista, Rome.</p>
                <p>Dates: 12 – 15 September 2027 (3 nights)<br />Total: €4,800<br />Deposit: €1,440 (30%) due by 30 April 2027</p>
                <p>We look forward to welcoming your group.</p>
                <p>Kind regards,<br />Hotel Bella Vista</p>
              </div>
              <div className="lp-attach">
                <span className="lp-pdf"><Icon name="file" size={18} /></span>
                Supplier contract · PDF
                <span className="lp-upload"><Icon name="upload" size={24} /></span>
              </div>
            </div>
            <svg className="lp-arrow" viewBox="0 0 80 40" aria-hidden="true">
              <path d="M4 34C20 12 44 6 70 16M59 8l12 8-12 6" />
            </svg>
            <div className="lp-card">
              <div className="lp-card-head"><Sparkle />AI suggested details<span className="lp-tag">Early access concept</span></div>
              <div className="lp-hotel">
                <img src="/images/hotel-bella-vista-facade.jpg" alt="" />
                <div><b>Hotel Bella Vista</b><small>Rome, Italy</small></div>
                <span className="lp-edit"><Icon name="pencil" size={16} />Edit</span>
              </div>
              {suggestedFields.map(([icon, label, value, detail]) => (
                <div className="lp-field" key={label}>
                  <Icon name={icon} size={22} />
                  <span className="lp-field-label">{label}</span>
                  <span>{value}{detail && <small>{detail}</small>}</span>
                  <span className="lp-edit"><Icon name="pencil" size={16} />Edit</span>
                </div>
              ))}
              <Link className="lp-btn" href="/dashboard">Review details <Icon name="arrow" /></Link>
            </div>
          </div>
          <p className="lp-note"><Icon name="info" size={18} />This is a proposed early access concept. You’ll always review and confirm the details before adding them to your trip. No automatic booking.</p>
        </div>
        <svg className="lp-wave lp-wave-b" viewBox="0 0 300 110" aria-hidden="true"><path d="M0 104C90 104 150 40 300 8" /></svg>
      </section>

      <section className="lp-people">
        <img src="/images/lake-varenna.jpg" alt="Colourful lakeside houses and boats in Varenna on Lake Como" />
        <div className="lp-people-copy">
          <small className="lp-eyebrow">Built for travel people</small>
          <h2 className="lp-h2">Built for the people who bring travel together.</h2>
          <p className="lp-sub">Whether you plan group tours, custom journeys or destination experiences, Roveboard helps you keep every supplier on track.</p>
        </div>
        <svg className="lp-wave lp-wave-c" viewBox="0 0 640 90" aria-hidden="true"><path d="M0 80C120 80 170 22 310 32s220 40 330-22" /></svg>
      </section>

      <section className="lp-founder">
        <div className="lp-wrap lp-founder-inner">
          <small className="lp-eyebrow">Why I’m building Roveboard</small>
          <blockquote>
            <p>Group trips run on dozens of supplier conversations: a hotel deposit buried in one email thread, a coach confirmation on WhatsApp, a guide’s invoice in a PDF. When one detail slips, the whole trip feels it.</p>
            <p>I’m building Roveboard to give coordinators one calm place to see what’s confirmed, what’s owed and what’s next, without changing how they talk to their suppliers.</p>
            <p>Roveboard is in early access. If you coordinate group trips, I’d love to learn how you work today. Join the waitlist and I’ll be in touch.</p>
          </blockquote>
          <p className="lp-founder-sign"><b>{site.founderName}</b>Founder, {site.name}</p>
        </div>
      </section>

      <section className="lp-faq" id="faq">
        <div className="lp-wrap">
          <small className="lp-eyebrow">Questions</small>
          <h2 className="lp-h2">Frequently asked questions</h2>
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

      <section className="lp-closing" id="early">
        <div className="lp-wrap">
          <h2>A calmer way<br />to plan what’s next.</h2>
          <p>Be the first to experience Roveboard and get early access when we launch.</p>
          <WaitlistForm />
        </div>
      </section>

      <footer className="lp-foot">
        <div className="lp-wrap lp-foot-inner">
          <Logo />
          <nav aria-label="Footer">
            <Link href="/dashboard">Try the demo</Link>
            <a href="#faq">FAQ</a>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <small>© 2026 {site.name}</small>
        </div>
      </footer>
    </div>
  );
}
