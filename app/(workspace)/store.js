'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '../lib/supabase/client';

// The workspace store: the signed-in company's trips and suppliers, loaded from and saved to Supabase.
// Row Level Security in the database keeps each company's data private.

// UUIDs, so ids can be created in the browser and used directly in the database.
export const newId = () => crypto.randomUUID();

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ session, children }) {
  return <LiveStoreProvider session={session}>{children}</LiveStoreProvider>;
}

// How each action changes what's on screen; the live store then saves it.
function stateActions(setData) {
  const setTrips = fn => setData(d => ({ ...d, trips: fn(d.trips) }));
  const updateSuppliers = (tripId, fn) => setTrips(ts => ts.map(t => (t.id === tripId ? { ...t, suppliers: fn(t.suppliers) } : t)));
  return {
    saveTrip: trip => setTrips(ts => (ts.some(t => t.id === trip.id)
      ? ts.map(t => (t.id === trip.id ? { ...t, ...trip } : t))
      : [...ts, { suppliers: [], ...trip }])),
    deleteTrip: id => setTrips(ts => ts.filter(t => t.id !== id)),
    saveSupplier: (tripId, s) => updateSuppliers(tripId, list => (list.some(x => x.id === s.id)
      ? list.map(x => (x.id === s.id ? s : x))
      : [...list, s])),
    addSuppliers: (tripId, list) => updateSuppliers(tripId, existing => [...existing, ...list]),
    deleteSupplier: (tripId, id) => updateSuppliers(tripId, list => list.filter(x => x.id !== id)),
    setPaid: (tripId, id, kind, paid) => updateSuppliers(tripId, list => list.map(x => (x.id === id ? { ...x, [kind]: { ...x[kind], paid } } : x))),
    setNotes: notes => setData(d => ({ ...d, notes })),
  };
}

/* ---------- live store (Supabase) ---------- */

const toAmount = p => (p && p.amount !== '' && p.amount != null ? Number(p.amount) : null);
const toPayment = (amount, due, paid) => (amount == null && !due ? null : { amount: amount == null ? '' : Number(amount), due: due || '', paid });

const supplierFromRow = r => ({
  id: r.id, name: r.name, category: r.category, place: r.place || '', status: r.status,
  contact: r.contact || '', notes: r.notes || '', photo: r.photo || null,
  deposit: toPayment(r.deposit_amount, r.deposit_due, r.deposit_paid),
  balance: toPayment(r.balance_amount, r.balance_due, r.balance_paid),
});

export const supplierToRow = (orgId, tripId, s) => ({
  id: s.id, org_id: orgId, trip_id: tripId, name: s.name.trim(), category: s.category,
  place: s.place || null, status: s.status, contact: s.contact || null, notes: s.notes || null, photo: s.photo || null,
  deposit_amount: toAmount(s.deposit), deposit_due: s.deposit?.due || null, deposit_paid: !!s.deposit?.paid,
  balance_amount: toAmount(s.balance), balance_due: s.balance?.due || null, balance_paid: !!s.balance?.paid,
});

const tripFromRow = (r, supplierRows) => ({
  id: r.id, name: r.name, start: r.start_date || '', end: r.end_date || '', travellers: r.travellers ?? '', currency: r.currency, isSample: !!r.is_sample, cover: r.cover || null,
  suppliers: supplierRows.filter(s => s.trip_id === r.id).map(supplierFromRow),
});

export const tripToRow = (orgId, t) => ({
  id: t.id, org_id: orgId, name: t.name.trim(), start_date: t.start || null, end_date: t.end || null,
  travellers: Number(t.travellers) || null, currency: t.currency || 'EUR', cover: t.cover || null,
});

function LiveStoreProvider({ session, children }) {
  const supabase = useMemo(() => createClient(), []);
  const orgId = session.org.id;
  const [data, setData] = useState({ trips: [], notes: session.org.notes || '' });
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState('');
  const notesTimer = useRef(null);

  const load = useCallback(async () => {
    const [trips, suppliers] = await Promise.all([
      supabase.from('trips').select('*').order('start_date', { nullsFirst: false }).order('created_at'),
      supabase.from('suppliers').select('*').order('created_at'),
    ]);
    if (trips.error || suppliers.error) {
      console.error('Load failed:', trips.error || suppliers.error);
      setSaveError('We couldn’t load your workspace. Check your connection and refresh the page.');
    } else {
      setData(d => ({ ...d, trips: trips.data.map(r => tripFromRow(r, suppliers.data)) }));
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // Changes appear on screen straight away and save in the background.
  // If a save fails, we reload the real data from the database and say so.
  // Confirmation pop-ups ("toasts"), shown only once the database has confirmed the save.
  const [toasts, setToasts] = useState([]);
  const notify = useCallback(message => {
    const id = newId();
    setToasts(list => [...list.slice(-2), { id, message }]);
    setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), 3200);
  }, []);

  const save = async (query, success) => {
    const { error } = await query;
    if (!error) {
      if (success) notify(success);
      return;
    }
    console.error('Save failed:', error);
    setSaveError('A change couldn’t be saved, so we reloaded your latest data. Please try again.');
    load();
  };

  // Says what actually changed, e.g. "Cover photo saved" rather than a generic "Trip saved".
  const photoMessage = (label, before, after, fallback) => {
    if ((before || null) === (after || null)) return fallback;
    return after ? `${label} saved` : `${label} removed`;
  };

  const local = stateActions(setData);
  const actions = {
    saveTrip: trip => {
      const before = data.trips.find(t => t.id === trip.id);
      local.saveTrip(trip);
      save(supabase.from('trips').upsert(tripToRow(orgId, trip)), before ? photoMessage('Cover photo', before.cover, trip.cover, 'Trip saved') : 'Trip created');
    },
    deleteTrip: id => { local.deleteTrip(id); save(supabase.from('trips').delete().eq('id', id), 'Trip deleted'); },
    removeSampleTrips: () => {
      setData(d => ({ ...d, trips: d.trips.filter(t => !t.isSample) }));
      save(supabase.from('trips').delete().eq('is_sample', true), 'Sample trips removed');
    },
    saveSupplier: (tripId, s) => {
      const before = data.trips.find(t => t.id === tripId)?.suppliers.find(x => x.id === s.id);
      local.saveSupplier(tripId, s);
      save(supabase.from('suppliers').upsert(supplierToRow(orgId, tripId, s)), before ? photoMessage('Photo', before.photo, s.photo, 'Supplier saved') : 'Supplier added');
    },
    addSuppliers: (tripId, list) => { local.addSuppliers(tripId, list); save(supabase.from('suppliers').insert(list.map(s => supplierToRow(orgId, tripId, s)))); },
    deleteSupplier: (tripId, id) => { local.deleteSupplier(tripId, id); save(supabase.from('suppliers').delete().eq('id', id), 'Supplier removed'); },
    setPaid: (tripId, id, kind, paid) => {
      local.setPaid(tripId, id, kind, paid);
      save(supabase.from('suppliers').update({ [kind === 'deposit' ? 'deposit_paid' : 'balance_paid']: paid }).eq('id', id), paid ? 'Marked as paid' : 'Marked as unpaid');
    },
    setNotes: notes => {
      local.setNotes(notes);
      clearTimeout(notesTimer.current); // save once typing pauses
      notesTimer.current = setTimeout(() => save(supabase.from('organizations').update({ notes }).eq('id', orgId)), 600);
    },
  };

  return (
    <StoreContext.Provider value={{ ...data, session, ready, saveError, clearSaveError: () => setSaveError(''), toasts, notify, ...actions }}>
      {children}
    </StoreContext.Provider>
  );
}
