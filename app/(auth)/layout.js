import Link from 'next/link';
import './auth.css';
import { Logo } from '../components/icons';

export default function AuthLayout({ children }) {
  return (
    <div className="au">
      <header className="au-head">
        <Link href="/" aria-label="Roveboard home"><Logo /></Link>
        <Link href="/" className="au-back">← Back to website</Link>
      </header>
      <main className="au-main">{children}</main>
      <p className="au-foot">By continuing you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
    </div>
  );
}
