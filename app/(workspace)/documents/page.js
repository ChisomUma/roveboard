'use client';
import Link from 'next/link';
import { useStore } from '../store';
import { DocumentList, documentRows } from '../documents';
import { Empty, Icon, PageHead } from '../ui';

export default function DocumentsPage() {
  const { trips } = useStore();
  const rows = documentRows(trips).sort((a, b) => b.doc.addedAt.localeCompare(a.doc.addedAt));
  return (
    <>
      <PageHead title="Documents" sub={<p className="ws-sub">Supplier contracts, confirmations and invoices across all your trips.</p>} />
      <div className="ws-body">
        <p className="ws-callout ws-gap"><Icon name="info" size={18} />In this demo, documents are stored only in this browser. AI reading of contracts is an early access concept and isn’t connected yet.</p>
        {rows.length ? <DocumentList rows={rows} showTrip /> : (
          <Empty
            icon="file"
            title="No documents yet"
            text="Attach a contract or confirmation when you add or edit a supplier (use the “Email or contract” tab, or Attach contract in the form). Everything you attach appears here."
            action={<Link className="ws-btn primary" href="/trips">Go to trips</Link>}
          />
        )}
      </div>
    </>
  );
}
