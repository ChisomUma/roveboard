'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../store';
import { Empty, Icon, PageHead, TripForm, fmtDate, fmtRange, money, nextPayment, tripMoney, tripStats } from '../ui';

export default function TripsPage() {
  const { trips, removeSampleTrips } = useStore();
  const [creating, setCreating] = useState(false);
  const sampleCount = trips.filter(t => t.isSample).length; // only workspaces created while samples were seeded
  const create = <button className="ws-btn primary" onClick={() => setCreating(true)}><Icon name="plus" size={16} />Create trip</button>;

  return (
    <>
      <PageHead title="Trips" sub={<p className="ws-sub">Everything you’re planning, in one place.</p>} actions={create} />
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
                <Link key={t.id} href={`/trips/${t.id}`} className={'ws-card' + (t.cover ? ' has-cover' : '')}>
                  {t.cover && <img className="ws-card-cover" src={t.cover} alt="" />}
                  <small className="ws-eyebrow">{t.isSample ? 'Sample trip' : 'Group trip'}</small>
                  <h2>{t.name}</h2>
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
                </Link>
              );
            })}
          </div>
        ) : (
          <Empty icon="globe" title="No trips yet" text="Create your first trip, then add the hotels, transport and guides you’re working with." action={create} />
        )}
      </div>
      {creating && <TripForm onClose={() => setCreating(false)} />}
    </>
  );
}
