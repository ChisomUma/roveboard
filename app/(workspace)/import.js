'use client';
import { useState } from 'react';
import { newId, useStore } from './store';
import { Icon, Modal, Pill, fmtDate, money } from './ui';

/* ---------- reading spreadsheets ---------- */

// [field, label, header names we recognise (lowercase, punctuation stripped)]
const FIELDS = [
  ['name', 'Supplier name', ['supplier', 'supplier name', 'name', 'company', 'vendor', 'business']],
  ['category', 'Category', ['category', 'type', 'service', 'service type', 'supplier type']],
  ['place', 'Location', ['location', 'city', 'place', 'destination', 'town']],
  ['status', 'Confirmation', ['status', 'confirmation', 'confirmed', 'booking status']],
  ['contact', 'Contact', ['contact', 'email', 'phone', 'contact email', 'contact details', 'contact person']],
  ['notes', 'Notes', ['notes', 'note', 'comments', 'details', 'description']],
  ['depositAmount', 'Deposit amount', ['deposit', 'deposit amount', 'deposit value']],
  ['depositDue', 'Deposit due date', ['deposit due', 'deposit date', 'deposit deadline', 'deposit due date']],
  ['depositPaid', 'Deposit paid?', ['deposit paid', 'deposit status']],
  ['balanceAmount', 'Final balance amount', ['balance', 'final balance', 'balance amount', 'final balance amount', 'remaining', 'final payment']],
  ['balanceDue', 'Final balance due date', ['balance due', 'balance date', 'balance deadline', 'balance due date', 'final balance due', 'final balance due date', 'final payment date', 'final payment due']],
  ['balancePaid', 'Final balance paid?', ['balance paid', 'final balance paid', 'final paid', 'balance status']],
];

const TEMPLATE = `Supplier name,Category,Location,Confirmation,Contact,Deposit amount,Deposit due date,Deposit paid,Final balance amount,Final balance due date,Final balance paid,Notes
Hotel Bella Vista,Hotel,Rome,Confirmed,reservations@bellavista.it,1440,30/04/2027,Yes,3360,01/08/2027,No,10 rooms
Coastal Coaches,Transport,Naples,Pending,bookings@coastalcoaches.it,500,15/05/2027,No,1500,01/08/2027,No,Airport transfers
`;

const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Handles commas, semicolons (European Excel) or tabs (cells pasted from Excel/Sheets), and quoted cells.
export function parseTable(text) {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0];
  const delim = first.includes('\t') ? '\t' : first.split(';').length > first.split(',').length ? ';' : ',';
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"' && cell === '') quoted = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.map(r => r.map(c => c.trim())).filter(r => r.some(Boolean));
}

// "€1,440", "1.440,00", "1440.50" -> number. A separator followed by exactly 3 digits is a thousands separator.
export function parseAmount(raw) {
  if (!raw) return { value: '' };
  let s = raw.replace(/[^\d.,-]/g, '');
  if (!/\d/.test(s)) return { value: '', bad: true };
  const thousands = sep => s.split(sep).slice(1).every(g => /^\d{3}$/.test(g));
  const hasDot = s.includes('.'), hasComma = s.includes(',');
  if (hasDot && hasComma) {
    const decimal = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
    s = s.split(decimal === '.' ? ',' : '.').join('').replace(',', '.');
  } else if (hasComma) {
    s = thousands(',') ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (hasDot && thousands('.')) {
    s = s.replace(/\./g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? { value: n } : { value: '', bad: true };
}

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Accepts 2027-04-30, 30/04/2027 (day first, UK style), 30.04.27, "30 April 2027", "April 30, 2027".
export function parseDate(raw) {
  if (!raw) return { value: '' };
  const s = raw.trim().toLowerCase();
  let y, m, d, x;
  if ((x = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) [, y, m, d] = x;
  else if ((x = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/))) [, d, m, y] = x;
  else if ((x = s.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\.?,?\s+(\d{4})$/))) { d = x[1]; m = MONTH_NAMES.indexOf(x[2].slice(0, 3)) + 1; y = x[3]; }
  else if ((x = s.match(/^([a-z]+)\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/))) { m = MONTH_NAMES.indexOf(x[1].slice(0, 3)) + 1; d = x[2]; y = x[3]; }
  else return { value: '', bad: true };
  y = Number(y); m = Number(m); d = Number(d);
  if (y < 100) y += 2000;
  const check = new Date(Date.UTC(y, m - 1, d));
  if (!m || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return { value: '', bad: true };
  return { value: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` };
}

const isYes = v => /^(y|yes|true|paid|1|x|✓|✔|done)$/i.test(v.trim());

function parseStatus(v) {
  const s = v.toLowerCase();
  if (/cancel/.test(s)) return 'Cancelled';
  if (/confirm|booked|^y(es)?$/.test(s)) return 'Confirmed';
  return 'Pending';
}

function parseCategory(v) {
  const s = v.toLowerCase();
  if (/hotel|accommodation|resort|villa|b&b|hostel|apartment/.test(s)) return 'Hotel';
  if (/coach|bus|transfer|transport|driver|taxi|car|train|ferry/.test(s)) return 'Transport';
  if (/guide/.test(s)) return 'Guide';
  if (/restaurant|dinner|lunch|meal|catering/.test(s)) return 'Restaurant';
  if (/activity|tour|excursion|boat|ticket|museum|tasting|experience/.test(s)) return 'Activity';
  return 'Other';
}

function guessMapping(headers) {
  const used = new Set();
  return headers.map(h => {
    const hit = FIELDS.find(([key, , names]) => !used.has(key) && names.includes(norm(h)));
    if (!hit) return '';
    used.add(hit[0]);
    return hit[0];
  });
}

// Turns spreadsheet rows into suppliers, with a reason for every row we skip and every value we couldn't read.
function buildRows(table, mapping, trip) {
  const onTrip = new Set(trip.suppliers.map(s => s.name.trim().toLowerCase()));
  const inFile = new Set();
  return table.slice(1).map(cells => {
    const get = key => { const i = mapping.indexOf(key); return i < 0 ? '' : (cells[i] || '').trim(); };
    const warnings = [];
    const read = (parse, key, label) => {
      const r = parse(get(key));
      if (r.bad) warnings.push(`Couldn’t read ${label} “${get(key)}”, left blank`);
      return r.value;
    };
    const payment = (prefix, label) => {
      const amount = read(parseAmount, prefix + 'Amount', `${label} amount`);
      const due = read(parseDate, prefix + 'Due', `${label} date`);
      return amount === '' && !due ? null : { amount, due, paid: isYes(get(prefix + 'Paid')) };
    };
    const name = get('name');
    const s = {
      id: newId(), name, category: parseCategory(get('category')), place: get('place'),
      status: parseStatus(get('status')), contact: get('contact'), notes: get('notes'),
      deposit: payment('deposit', 'deposit'), balance: payment('balance', 'final balance'),
    };
    const key = name.toLowerCase();
    let skip = '';
    if (!name) skip = 'No supplier name';
    else if (onTrip.has(key)) skip = 'Already on this trip';
    else if (inFile.has(key)) skip = 'Listed twice in your file';
    inFile.add(key);
    return { s, skip, warnings };
  });
}

function downloadTemplate() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([TEMPLATE], { type: 'text/csv' }));
  a.download = 'roveboard-suppliers-template.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- dialog ---------- */

export function ImportDialog({ trip, onClose, onImported }) {
  const { addSuppliers } = useStore();
  const [table, setTable] = useState(null);
  const [mapping, setMapping] = useState([]);
  const [pasted, setPasted] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  function load(text) {
    const rows = parseTable(text);
    if (rows.length < 2) return setError('We couldn’t find any suppliers. The first row should be column names, with one supplier per row below it.');
    setError('');
    setTable(rows);
    setMapping(guessMapping(rows[0]));
  }

  async function loadFile(file) {
    if (!file) return;
    if (/\.(xlsx|xls|numbers)$/i.test(file.name)) {
      return setError('Excel and Numbers files can’t be read directly yet. Save as CSV (File → Save As → CSV), or copy the cells and paste them below.');
    }
    load(await file.text());
  }

  if (!table) {
    return (
      <Modal wide title="Import suppliers" sub={`Add suppliers to ${trip.name} from a spreadsheet.`} onClose={onClose}>
        <label
          className={'ws-drop' + (dragging ? ' is-drag' : '')}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
        >
          <Icon name="upload" size={28} />
          <b>Choose a CSV file</b>
          <span>or drop it here. Export one from Excel or Google Sheets with File → Download / Save As → CSV.</span>
          <input type="file" accept=".csv,.tsv,.txt,text/csv" hidden onChange={e => { loadFile(e.target.files[0]); e.target.value = ''; }} />
        </label>
        <p className="ws-or">or paste from Excel or Google Sheets</p>
        <div className="ws-form">
          <label className="span2">Copied cells, including the header row
            <textarea rows={6} value={pasted} onChange={e => setPasted(e.target.value)} placeholder="Select your cells in the spreadsheet, copy (⌘C / Ctrl+C) and paste here" />
          </label>
          {error && <p className="ws-error span2" role="alert">{error}</p>}
          <div className="ws-form-actions span2">
            <button type="button" className="ws-btn ws-btn-left" onClick={downloadTemplate}><Icon name="file" size={16} />Download a template</button>
            <button type="button" className="ws-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="ws-btn primary" disabled={!pasted.trim()} onClick={() => load(pasted)}>Continue <Icon name="arrow" size={16} /></button>
          </div>
        </div>
      </Modal>
    );
  }

  const rows = buildRows(table, mapping, trip);
  const ready = rows.filter(r => !r.skip);
  const skipped = rows.length - ready.length;
  const unreadable = ready.reduce((n, r) => n + r.warnings.length, 0);
  const hasName = mapping.includes('name');
  const payText = p => (p ? [money(p.amount, trip.currency) || 'No amount', p.due && `due ${fmtDate(p.due)}`, p.paid && 'paid'].filter(Boolean).join(' · ') : '—');

  function runImport() {
    addSuppliers(trip.id, ready.map(r => r.s));
    onImported(ready.length);
    onClose();
  }

  return (
    <Modal wide title="Check your import" sub="We matched your columns automatically. Fix any that are wrong, then check the preview below." onClose={onClose}>
      <div className="ws-map">
        {table[0].map((h, i) => (
          <label key={i}>
            <span>{h || `Column ${i + 1}`}</span>
            <select value={mapping[i]} onChange={e => setMapping(mapping.map((m, j) => (j === i ? e.target.value : m)))}>
              <option value="">Don’t import</option>
              {FIELDS.map(([key, label]) => <option key={key} value={key} disabled={mapping.includes(key) && mapping[i] !== key}>{label}</option>)}
            </select>
          </label>
        ))}
      </div>
      {!hasName && <p className="ws-error ws-gap-top">Choose which column holds the supplier name.</p>}
      <p className="ws-callout ws-gap-top"><Icon name="info" size={18} />Dates are read day first (30/04/2027 is 30 April). Amounts are in {trip.currency}. Contact details, confirmation, payments and notes come from your file.</p>
      <p className="ws-import-summary">
        <b>{ready.length} supplier{ready.length === 1 ? '' : 's'} ready to import</b>
        {skipped > 0 && <span> · {skipped} row{skipped === 1 ? '' : 's'} skipped</span>}
        {unreadable > 0 && <span> · {unreadable} value{unreadable === 1 ? '' : 's'} couldn’t be read</span>}
      </p>
      <div className="ws-table ws-preview">
        <table>
          <thead><tr><th /><th>Supplier</th><th>Category</th><th>Confirmation</th><th>Deposit</th><th>Final balance</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.skip ? 'is-skip' : ''}>
                <td>{r.skip ? <Pill tone="muted" icon="x">Skipped</Pill> : <Pill tone="ok" icon="check">Ready</Pill>}</td>
                <td>
                  <b>{r.s.name || '—'}</b>
                  {r.skip && <small className="ws-warn">{r.skip}</small>}
                  {!r.skip && r.warnings.map(w => <small className="ws-warn" key={w}>{w}</small>)}
                </td>
                <td>{r.s.category}</td>
                <td>{r.s.status}</td>
                <td>{payText(r.s.deposit)}</td>
                <td>{payText(r.s.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ws-form-actions ws-gap-top">
        <button type="button" className="ws-btn ws-btn-left" onClick={() => setTable(null)}>Back</button>
        <button type="button" className="ws-btn" onClick={onClose}>Cancel</button>
        <button type="button" className="ws-btn primary" disabled={!hasName || !ready.length} onClick={runImport}>Import {ready.length} supplier{ready.length === 1 ? '' : 's'}</button>
      </div>
    </Modal>
  );
}
