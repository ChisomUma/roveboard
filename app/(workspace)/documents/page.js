'use client';
import { useStore } from '../store';
import { DocumentList, documentRows } from '../documents';
import { Icon, PageHead } from '../ui';

export default function DocumentsPage() {
  const { trips } = useStore();
  const rows = documentRows(trips).sort((a, b) => b.doc.addedAt.localeCompare(a.doc.addedAt));
  return (
    <>
      <PageHead title="Documents" sub={<p className="ws-sub">Supplier contracts, confirmations and invoices across all your trips.</p>} />
      <div className="ws-body">
        <p className="ws-callout ws-gap"><Icon name="info" size={18} />Contract uploads are coming soon, stored safely for your whole team. AI reading of contracts is an early access concept and isn’t connected yet.</p>
        {rows.length > 0 && <DocumentList rows={rows} showTrip />}
      </div>
    </>
  );
}
