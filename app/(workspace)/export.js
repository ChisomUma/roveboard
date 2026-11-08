// Export trips and suppliers to a spreadsheet (CSV): "your data is yours".
// Column names match the import template, so an exported trip can be imported into another trip.
const HEADERS = [
  'Trip', 'Trip start', 'Trip end', 'Travellers', 'Currency',
  'Supplier name', 'Category', 'Location', 'Confirmation', 'Contact',
  'Deposit amount', 'Deposit due date', 'Deposit paid',
  'Final balance amount', 'Final balance due date', 'Final balance paid', 'Notes',
];

// Quote cells that need it. Text starting with = + - @ is prefixed with ' so spreadsheet apps
// show it as text instead of running it as a formula (CSV injection protection).
function cell(value) {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const paid = p => (p ? (p.paid ? 'Yes' : 'No') : '');

// One row per supplier; a trip without suppliers still gets a row so it isn't lost.
export function tripsToCsv(trips) {
  const rows = [HEADERS];
  trips.forEach(t => {
    const trip = [t.name, t.start, t.end, t.travellers, t.currency];
    if (!t.suppliers.length) rows.push([...trip, ...Array(HEADERS.length - trip.length).fill('')]);
    t.suppliers.forEach(s => rows.push([
      ...trip,
      s.name, s.category, s.place, s.status, s.contact,
      s.deposit?.amount ?? '', s.deposit?.due ?? '', paid(s.deposit),
      s.balance?.amount ?? '', s.balance?.due ?? '', paid(s.balance),
      s.notes,
    ]));
  });
  // The BOM makes Excel read the file as UTF-8, so € and £ display correctly.
  return '﻿' + rows.map(r => r.map(cell).join(',')).join('\r\n') + '\r\n';
}

const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export';

// Downloads the trips as roveboard-<name>-<date>.csv and returns how many suppliers were exported.
export function downloadTripsCsv(trips, name) {
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([tripsToCsv(trips)], { type: 'text/csv;charset=utf-8' }));
  a.download = `roveboard-${slug(name)}-${date}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return trips.reduce((n, t) => n + t.suppliers.length, 0);
}
