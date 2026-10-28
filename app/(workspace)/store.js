'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { clearFiles, deleteFile } from './files';

// Stage 1 prototype: everything lives in this browser's localStorage.
// Stage 2 replaces this provider with Supabase (see the roadmap in the roveboard skill).
const KEY = 'roveboard-demo-v2';

const pay = (amount, due, paid = false) => ({ amount, due, paid });

const seed = {
  notes: '',
  trips: [
    {
      id: 'italy-explorer-2027',
      name: 'Italy Explorer 2027',
      start: '2027-09-12',
      end: '2027-09-20',
      travellers: 24,
      currency: 'EUR',
      suppliers: [
        { id: 's1', name: 'Hotel Bella Vista', place: 'Rome', category: 'Hotel', status: 'Confirmed', contact: 'reservations@bellavista.it', notes: '10 rooms · 12–15 Sep (3 nights)', img: 'thumb-bella-vista', deposit: pay(1440, '2027-04-30', true), balance: pay(3360, '2027-08-01') },
        { id: 's2', name: 'Grand Hotel Miramare', place: 'Sorrento', category: 'Hotel', status: 'Confirmed', contact: 'groups@miramare.it', notes: '12 rooms · 15–20 Sep (5 nights)', img: 'thumb-miramare', deposit: pay(1800, '2027-03-15', true), balance: pay(4200, '2027-07-15') },
        { id: 's3', name: 'Alpine Coaches', place: 'Group transport', category: 'Transport', status: 'Pending', contact: 'bookings@alpinecoaches.it', notes: 'Airport transfers and day trips. Waiting on the pickup quote.', img: 'thumb-alpine-coaches', deposit: pay(600, '2027-04-30'), balance: pay(1400, '2027-08-01') },
        { id: 's4', name: 'Luigi’s Local Guides', place: 'Amalfi Coast', category: 'Guide', status: 'Confirmed', contact: '+39 333 123 4567', notes: 'Full-day coastal walk, 16 Sep', img: 'thumb-luigis-guides', deposit: pay(300, '2027-02-01', true), balance: pay(700, '2027-06-01', true) },
        { id: 's5', name: 'Pompeii Archaeological Tours', place: 'Pompeii', category: 'Guide', status: 'Pending', contact: 'info@pompeiitours.it', notes: 'Morning tour, 18 Sep. Confirm group size.', img: 'thumb-pompeii', deposit: pay(240, '2027-05-15'), balance: pay(560, '2027-08-15') },
        { id: 's6', name: 'La Piazza Restaurant', place: 'Rome', category: 'Restaurant', status: 'Confirmed', contact: 'eventi@lapiazza.it', notes: 'Welcome dinner, 12 Sep. Confirm final numbers 2 weeks before.', deposit: pay(400, '2027-06-01', true), balance: pay(900, '2027-09-01') },
        { id: 's7', name: 'Blue Sea Boat Tours', place: 'Positano', category: 'Activity', status: 'Confirmed', contact: 'hello@blueseatours.it', notes: 'Private boat, 17 Sep', deposit: pay(500, '2027-05-01', true), balance: pay(1100, '2027-08-01') },
        { id: 's8', name: 'Vesuvio Wine Estate', place: 'Naples', category: 'Activity', status: 'Confirmed', contact: 'visite@vesuviowine.it', notes: 'Tasting and lunch, 19 Sep', deposit: null, balance: pay(720, '2027-09-01') },
      ],
    },
    {
      id: 'lisbon-porto-2027',
      name: 'Lisbon & Porto Discovery',
      start: '2027-10-04',
      end: '2027-10-10',
      travellers: 18,
      currency: 'EUR',
      suppliers: [
        { id: 's9', name: 'Hotel Ribeira', place: 'Porto', category: 'Hotel', status: 'Pending', contact: 'reservas@hotelribeira.pt', notes: '9 rooms · 7–10 Oct', deposit: pay(1200, '2027-05-20'), balance: pay(2800, '2027-09-04') },
        { id: 's10', name: 'Douro Valley Cruises', place: 'Porto', category: 'Activity', status: 'Confirmed', contact: 'groups@dourocruises.pt', notes: 'Day cruise, 8 Oct', deposit: pay(350, '2027-04-01', true), balance: pay(650, '2027-09-01') },
      ],
    },
  ],
};

export const newId = () => Math.random().toString(36).slice(2, 10);

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [data, setData] = useState(seed);
  const [ready, setReady] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Array.isArray(saved.trips)) setData(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Usually fails only when browser storage is full (e.g. too many photos); Shell shows a warning.
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [data, ready]);

  const setTrips = fn => setData(d => ({ ...d, trips: fn(d.trips) }));
  const updateTrip = (id, fn) => setTrips(ts => ts.map(t => (t.id === id ? fn(t) : t)));
  const updateSuppliers = (tripId, fn) => updateTrip(tripId, t => ({ ...t, suppliers: fn(t.suppliers) }));

  const actions = {
    saveTrip: trip => setTrips(ts => (ts.some(t => t.id === trip.id)
      ? ts.map(t => (t.id === trip.id ? { ...t, ...trip } : t))
      : [...ts, { suppliers: [], ...trip }])),
    deleteTrip: id => {
      const trip = data.trips.find(t => t.id === id);
      trip?.suppliers.forEach(s => (s.documents || []).forEach(d => deleteFile(d.id)));
      setTrips(ts => ts.filter(t => t.id !== id));
    },
    saveSupplier: (tripId, s) => updateSuppliers(tripId, list => (list.some(x => x.id === s.id)
      ? list.map(x => (x.id === s.id ? s : x))
      : [...list, s])),
    addSuppliers: (tripId, list) => updateSuppliers(tripId, existing => [...existing, ...list]),
    deleteSupplier: (tripId, id) => {
      const supplier = data.trips.find(t => t.id === tripId)?.suppliers.find(x => x.id === id);
      (supplier?.documents || []).forEach(d => deleteFile(d.id));
      updateSuppliers(tripId, list => list.filter(x => x.id !== id));
    },
    setPaid: (tripId, id, kind, paid) => updateSuppliers(tripId, list => list.map(x => (x.id === id ? { ...x, [kind]: { ...x[kind], paid } } : x))),
    setNotes: notes => setData(d => ({ ...d, notes })),
    resetDemo: () => { clearFiles(); setData(seed); },
  };

  return <StoreContext.Provider value={{ ...data, ready, saveFailed, ...actions }}>{children}</StoreContext.Provider>;
}
