import Link from 'next/link';
import { Logo } from './components/icons';
import { site } from './site';

export default function LegalPage({ title, children }) {
  return (
    <div className="lp lp-legal">
      <header className="lp-legal-head">
        <div className="lp-wrap lp-legal-bar">
          <Link href="/" aria-label={`${site.name} home`}><Logo /></Link>
          <Link className="lp-legal-back" href="/">← Back to {site.name}</Link>
        </div>
      </header>
      <main className="lp-wrap lp-legal-body">
        <h1>{title}</h1>
        <p className="lp-legal-updated">Last updated: {site.legalUpdated}</p>
        {children}
      </main>
    </div>
  );
}
