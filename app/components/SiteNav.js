import Link from 'next/link';
import { Logo } from './icons';

// Top bar for the public website (landing and pricing pages).
export default function SiteNav() {
  return (
    <nav className="lp-wrap lp-nav">
      <Link href="/" className="lp-home" aria-label="Roveboard home"><Logo /></Link>
      <div>
        <Link className="lp-login" href="/pricing">Pricing</Link>
        <Link className="lp-login" href="/login">Log in</Link>
        <Link className="lp-btn lp-btn-sm" href="/login?mode=signup">Sign up free</Link>
      </div>
    </nav>
  );
}
