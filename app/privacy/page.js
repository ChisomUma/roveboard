import LegalPage from '../LegalPage';
import { site } from '../site';

export const metadata = { title: 'Privacy Policy · Roveboard' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what personal information {site.name} collects, why, and what you can do about it. {site.name} is run by {site.legalName} (“we”, “us”). If you have any questions, email us at {site.contactEmail}.</p>

      <h2>What we collect</h2>
      <p><b>When you join the waitlist</b>, we collect your email address and, if you choose to tell us, the type of company you work at and roughly how many group trips you run each year. We also record the date you signed up.</p>
      <p><b>When you try the demo</b>, everything you type (trips, suppliers, notes, photos) is stored only in your own web browser. It is not sent to us, and we can’t see it. Clearing your browser data deletes it.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To email you about {site.name} early access, including an invitation to try it and occasional updates.</li>
        <li>To understand which kinds of travel companies are interested, so we build the right product.</li>
      </ul>
      <p>We use your waitlist details because you asked us to contact you (your consent). We don’t sell your information, and we don’t use it for advertising.</p>

      <h2>Who we share it with</h2>
      <p>Only the service providers we need to run {site.name}, such as the company that hosts our website and stores the waitlist. They may only use your information to provide that service to us. We’ll list them here as we add them.</p>

      <h2>How long we keep it</h2>
      <p>We keep your waitlist details until you unsubscribe or ask us to delete them, or for up to 24 months after early access opens if we haven’t heard from you, whichever comes first.</p>

      <h2>Your rights</h2>
      <p>You can ask us to show you, correct or delete the information we hold about you, or stop emailing you at any time. Just email {site.contactEmail}. Every email we send will also include a way to unsubscribe. If you’re unhappy with how we handle your information, you can complain to your local data protection authority (in the UK, the Information Commissioner’s Office).</p>

      <h2>Cookies</h2>
      <p>We don’t use advertising or tracking cookies. The demo uses your browser’s local storage only to save the sample trips you edit.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we’ll update the date at the top of this page, and tell waitlist members by email about any important changes.</p>
    </LegalPage>
  );
}
