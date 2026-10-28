'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../store';
import { Category, Empty, PageHead, SupplierForm, SupplierName, contactDetails, supplierDirectory } from '../ui';

export default function SuppliersPage() {
  const { trips } = useStore();
  const [reusing, setReusing] = useState(null);
  const list = supplierDirectory(trips);

  return (
    <>
      <PageHead title="Supplier directory" sub={<p className="ws-sub">Every supplier you’ve worked with. Reuse one on another trip without retyping their details.</p>} />
      <div className="ws-body">
        {list.length ? (
          <div className="ws-table">
            <table>
              <thead><tr><th>Supplier</th><th>Category</th><th>Contact</th><th>Used in</th><th /></tr></thead>
              <tbody>
                {list.map(({ s, trips: used }) => (
                  <tr key={s.name}>
                    <td><SupplierName s={s} /></td>
                    <td><Category name={s.category} /></td>
                    <td>{s.contact || <span className="ws-dash">—</span>}</td>
                    <td className="ws-used">{used.map(t => <Link key={t.id} href={`/trips/${t.id}`}>{t.name}</Link>)}</td>
                    <td><button className="ws-btn small" disabled={!trips.length} onClick={() => setReusing(contactDetails(s))}>Add to trip</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty icon="users" title="No suppliers yet" text="Suppliers you add to any trip appear here so you can reuse them later." action={<Link className="ws-btn primary" href="/trips">Go to trips</Link>} />
        )}
      </div>
      {reusing && <SupplierForm initial={reusing} onClose={() => setReusing(null)} />}
    </>
  );
}
