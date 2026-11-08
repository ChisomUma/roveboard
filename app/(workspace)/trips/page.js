'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStore } from '../store';
import { Empty, Icon, PageHead, TripForm, fmtDate, fmtRange, money, nextPayment, tripMoney, tripStats } from '../ui';
import { downloadTripsCsv } from '../export';

// ⋯ menu on a trip card: Edit and Delete.
function TripMenu({ trip, onEdit }) {
  const { deleteTrip } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = e => { if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  function remove() {
    setOpen(false);
    const count = trip.suppliers.length;
    const detail = count ? ` and its ${count} supplier${count === 1 ? '' : 's'} (with their payments)` : '';
    if (confirm(`Delete “${trip.name}”${detail}? This can’t be undone.`)) deleteTrip(trip.id);
  }

  return (
    <div className="ws-card-menu" ref={ref}>
      <button type="button" className="ws-card-menu-btn" aria-label={`Options for ${trip.name}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <Icon name="more" size={20} />
      </button>
      {open && (
        <div className="ws-card-menu-list" role="menu">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); onEdit(trip); }}><Icon name="pencil" size={16} />Edit trip</button>
          <button type="button" role="menuitem" className="is-danger" onClick={remove}><Icon name="trash" size={16} />Delete trip</button>
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  const { trips, removeSampleTrips, session, notify } = useStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const sampleCount = trips.filter(t => t.isSample).length; // only workspaces created while samples were seeded
  const create = <button className="ws-btn primary" onClick={() => setCreating(true)}><Icon name="plus" size={16} />Create trip</button>;
  function exportAll() {
    const suppliers = downloadTripsCsv(trips, `${session.org.name} trips`);
    notify(`Exported ${trips.length} trip${trips.length === 1 ? '' : 's'} and ${suppliers} supplier${suppliers === 1 ? '' : 's'}`);
  }
  const actions = <>
    {trips.length > 0 && <button className="ws-btn ghost" onClick={exportAll}><Icon name="file" size={16} />Export</button>}
    {create}
  </>;

  return (
    <>
      <PageHead title="Trips" sub={<p className="ws-sub">Everything you’re planning, in one place.</p>} actions={actions} />
      <div className="ws-body">
        {sampleCount > 0 && (
          <div className="ws-sample-bar">
            <Icon name="info" size={18} />
            <span><b>{sampleCount === 1 ? 'This is a sample trip' : `These ${sampleCount} trips are samples`}</b> to show you how Roveboard works. Explore and edit freely, then remove them when you’re ready to add your own.</span>
            <button className="ws-btn small" onClick={() => confirm('Remove the sample trips and their suppliers?') && removeSampleTrips()}>Remove sample trips</button>
          </div>
        )}
        {trips.length ? (
          <div className="ws-cards">
            {trips.map(t => {
              const s = tripStats(t);
              const next = nextPayment(t);
              const owed = tripMoney(t).owed;
              return (
                // The whole card opens the trip (stretched link); the ⋯ menu sits above it.
                <article key={t.id} className={'ws-card' + (t.cover ? ' has-cover' : '')}>
                  {t.cover && <img className="ws-card-cover" src={t.cover} alt="" />}
                  <TripMenu trip={t} onEdit={setEditing} />
                  <small className="ws-eyebrow">{t.isSample ? 'Sample trip' : 'Group trip'}</small>
                  <h2><Link href={`/trips/${t.id}`} className="ws-card-link">{t.name}</Link></h2>
                  <p className="ws-meta">{fmtRange(t.start, t.end)}<i />{t.travellers} travellers</p>
                  <div className="ws-progress"><span style={{ width: `${s.suppliers ? (s.confirmed / s.suppliers) * 100 : 0}%` }} /></div>
                  <div className="ws-card-foot">
                    <span>{s.confirmed} of {s.suppliers} suppliers confirmed</span>
                    {owed > 0 && <span className="ws-owed">{money(owed, t.currency)} still owed</span>}
                    {s.overdue > 0 && <span className="ws-overdue">{s.overdue} overdue</span>}
                  </div>
                  <p className="ws-next">
                    {next ? <>Next: <b>{next.kind === 'deposit' ? 'Deposit' : 'Final balance'} · {next.s.name}</b> · {fmtDate(next.p.due)}</> : 'No upcoming payments'}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty icon="globe" title="No trips yet" text="Create your first trip, then add the hotels, transport and guides you’re working with." action={create} />
        )}
      </div>
      {creating && <TripForm onClose={() => setCreating(false)} />}
      {editing && <TripForm trip={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
