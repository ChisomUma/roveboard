import Link from 'next/link';
import LegalPage from '../LegalPage';
import { site } from '../site';

export const metadata = { title: 'Terms · Roveboard' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>These terms apply to the {site.name} website, the demo and the waitlist. {site.name} is run by {site.legalName} (“we”, “us”). By using the site, you agree to them. Questions? Email {site.contactEmail}.</p>

      <h2>{site.name} is in early access</h2>
      <p>{site.name} is an early-stage product. The demo shows how it is intended to work, using sample data. Some features described on the site, including AI suggestions, document uploads and email reminders, are planned and not yet available. We’ll say so wherever that’s the case.</p>

      <h2>The demo</h2>
      <p>The demo is free and provided “as is”. Anything you enter is stored only in your own browser, so it may be lost if you clear your browser data or switch devices. Please don’t rely on the demo as your only record of real bookings or payments.</p>

      <h2>Payments and bookings</h2>
      <p>{site.name} helps you track supplier confirmations, deposits and deadlines. It does not book suppliers, process payments or hold money on your behalf. Your contracts and payments remain between you and your suppliers.</p>

      <h2>Acceptable use</h2>
      <p>Please don’t misuse the site: no attempting to break or overload it, access data that isn’t yours, or use it for anything unlawful.</p>

      <h2>Our content</h2>
      <p>The {site.name} name, design and software belong to us. Photos are used under their respective licences.</p>

      <h2>Liability</h2>
      <p>We work hard to keep the site accurate and available, but we can’t guarantee it will always be error-free or uninterrupted. To the extent the law allows, we aren’t liable for losses arising from your use of the demo or the site. Nothing in these terms limits liability that can’t legally be limited.</p>

      <h2>Changes and governing law</h2>
      <p>We may update these terms as {site.name} develops; the date at the top shows the latest version. These terms are governed by the laws of {site.country}. See also our <Link href="/privacy">Privacy Policy</Link>.</p>
    </LegalPage>
  );
}
