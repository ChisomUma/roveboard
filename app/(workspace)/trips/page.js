'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '../store';
import { Empty, Icon, PageHead, TripForm, fmtDate, fmtRange, money, nextPayment, tripMoney, tripStats } from '../ui';

export default function TripsPage() {
  const { trips } = useStore();
  const [creating, setCreating] = useState(false);
  const create = <button className="ws-btn primary" onClick={() => setCreating(true)}><Icon name="plus" size={16} />Create trip</button>;

  return (
    <>
      <PageHead title="Trips" sub={<p className="ws-sub">Everything you’re planning, in one place.</p>} actions={create} />
      <div className="ws-body">
        {trips.length ? (
          <div className="ws-cards">
            {trips.map(t => {
              const s = tripStats(t);
              const next = nextPayment(t);
              const owed = tripMoney(t).owed;
              return (
                <Link key={t.id} href={`/trips/${t.id}`} className="ws-card">
                  <small className="ws-eyebrow">Group trip</small>
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
