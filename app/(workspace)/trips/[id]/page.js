'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '../../store';
import { DeadlineSections, Empty, Icon, MoneySummary, PageHead, SupplierContacts, SupplierForm, SupplierTable, TripForm, fmtRange, tripStats } from '../../ui';
import { ImportDialog } from '../../import';
import { DocumentList, documentRows } from '../../documents';

const TABS = ['Overview', 'Suppliers', 'Itinerary', 'Documents', 'Deadlines'];

export default function TripPage() {
  const { id } = useParams();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === id);
  const [tab, setTab] = useState('Overview');
  const [modal, setModal] = useState(null);
  const [imported, setImported] = useState(0);
  const close = () => setModal(null);

  if (!trip) {
    return (
      <div className="ws-body">
        <Empty icon="globe" title="Trip not found" text="It may have been deleted, or it was created in a different browser." action={<Link className="ws-btn primary" href="/trips">See all trips</Link>} />
      </div>
    );
  }

  const addSupplier = () => setModal({ type: 'supplier' });
  const editSupplier = s => setModal({ type: 'supplier', supplier: s });
  const importSuppliers = () => setModal({ type: 'import' });
  const noSuppliers = (
    <Empty
      icon="users"
      title="No suppliers yet"
      text="Add the hotels, transport, guides and activities for this trip to start tracking confirmations and payments. Already have them in a spreadsheet? Import them in one go."
      action={<div className="ws-empty-actions"><button className="ws-btn primary" onClick={addSupplier}>Add supplier</button><button className="ws-btn" onClick={importSuppliers}><Icon name="upload" size={16} />Import from spreadsheet</button></div>}
    />
  );

  return (
    <>
      <PageHead
        crumb={<Link href="/trips" className="ws-crumb"><Icon name="chevronLeft" size={14} />Trips</Link>}
        title={trip.name}
        sub={<p className="ws-meta">{fmtRange(trip.start, trip.end)}<i />{trip.travellers} travellers</p>}
        actions={<>
          <button className="ws-btn ghost" onClick={() => setModal({ type: 'trip' })}>Edit trip</button>
          <button className="ws-btn ghost" onClick={importSuppliers}><Icon name="upload" size={16} />Import</button>
          <button className="ws-btn" onClick={addSupplier}>Add supplier <Icon name="plus" size={18} /></button>
        </>}
      >
        <div className="ws-tabs" role="tablist">
          {TABS.map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={e => { setTab(t); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }}>{t}</button>)}
        </div>
      </PageHead>

      <div className="ws-body">
        {imported > 0 && <p className="ws-callout ws-gap" role="status"><Icon name="check" size={18} />{imported} supplier{imported === 1 ? '' : 's'} imported from your spreadsheet. Click any row to check or edit the details.</p>}
        {tab === 'Overview' && (
          <>
            <Stats trip={trip} />
            <MoneySummary trip={trip} />
            <h2 className="ws-section-title">Suppliers</h2>
            {trip.suppliers.length ? <SupplierTable suppliers={trip.suppliers} onEdit={editSupplier} /> : noSuppliers}
          </>
        )}
        {tab === 'Suppliers' && (trip.suppliers.length ? <SupplierContacts suppliers={trip.suppliers} onEdit={editSupplier} /> : noSuppliers)}
        {tab === 'Itinerary' && <Empty icon="calendar" title="Itinerary is coming later" text="A day-by-day plan built from your confirmed suppliers is planned for a later version." />}
        {tab === 'Documents' && (documentRows([trip]).length
          ? <DocumentList rows={documentRows([trip])} />
          : <Empty icon="file" title="No documents yet" text="Attach a supplier’s contract or confirmation when you add or edit a supplier, and it will appear here." action={<button className="ws-btn" onClick={addSupplier}>Add supplier</button>} />)}
        {tab === 'Deadlines' && <DeadlineSections trips={[trip]} />}
      </div>

      {modal?.type === 'trip' && <TripForm trip={trip} onClose={close} />}
      {modal?.type === 'supplier' && <SupplierForm tripId={trip.id} supplier={modal.supplier} onClose={close} />}
      {modal?.type === 'import' && <ImportDialog trip={trip} onClose={close} onImported={n => { setImported(n); setTab('Overview'); }} />}
    </>
  );
}

function Stats({ trip }) {
  const s = tripStats(trip);
  const items = [[s.suppliers, 'Suppliers', 'building', 'blue'], [s.confirmed, 'Confirmed', 'checkFilled', 'green'], [s.pending, 'Pending', 'alert', 'orange'], [s.overdue, 'Overdue', 'alert', 'red']];
  return (
    <div className="ws-stats">
      {items.map(([n, label, icon, tone]) => (
        <div className="ws-stat" key={label}>
          <i className={'is-' + tone}><Icon name={icon} size={22} /></i>
          <span><b>{n}</b><small>{label}</small></span>
        </div>
      ))}
    </div>
  );
}
