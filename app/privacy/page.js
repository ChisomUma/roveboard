import LegalPage from '../LegalPage';
import { site } from '../site';

export const metadata = { title: 'Privacy Policy · Roveboard' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what personal information {site.name} collects, why, and what you can do about it. {site.name} is run by {site.legalName} (“we”, “us”). If you have any questions, email us at {site.contactEmail}.</p>

      <h2>What we collect</h2>
      <p><b>When you sign up for product updates</b>, we collect your email address and the date you signed up.</p>
      <p><b>When you create an account</b>, we collect your email address and your company name. Your password is handled by our login provider, stored in encrypted form, and we never see it. If you sign in with Google, we receive your email address from Google.</p>
      <p><b>When you use your workspace</b>, we store the information you add: trips, suppliers and their contact details, payments, notes and supplier photos. It belongs to your company, and only people in your company’s workspace can see it.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>To provide your {site.name} account and workspace.</li>
        <li>To email you about {site.name} early access, including an invitation to try it and occasional updates.</li>
        <li>To understand which kinds of travel companies are interested, so we build the right product.</li>
      </ul>
      <p>We use your account and workspace information to provide the service you signed up for, and your email for product updates because you asked us to contact you (your consent). We don’t sell your information, and we don’t use it for advertising.</p>

      <h2>Who we share it with</h2>
      <p>Only the service providers we need to run {site.name}. They may only use your information to provide that service to us:</p>
      <ul>
        <li><b>Supabase</b>: database, login and storage (data stored in the UK/EU region).</li>
        <li><b>Vercel</b>: website hosting.</li>
        <li><b>Google</b>: only if you choose to sign in with Google.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>We keep your account and workspace information for as long as your account is open. If you ask us to close your account, we delete it and your company’s workspace data. We keep your email for product updates until you unsubscribe or ask us to delete it.</p>

      <h2>Your rights</h2>
      <p>You can ask us to show you, correct or delete the information we hold about you, or stop emailing you at any time. Just email {site.contactEmail}. Every email we send will also include a way to unsubscribe. If you’re unhappy with how we handle your information, you can complain to your local data protection authority (in the UK, the Information Commissioner’s Office).</p>

      <h2>Cookies</h2>
      <p>We only use essential cookies that keep you logged in. We don’t use advertising or tracking cookies.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we’ll update the date at the top of this page, and tell account holders and people subscribed to updates by email about any important changes.</p>
    </LegalPage>
  );
}
