'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, Logo } from '../components/icons';
import { sampleImage } from '../components/images';
import { newId, useStore } from './store';
import { DocumentField, checkDocument } from './documents';
import { deleteFile, saveFile } from './files';

export { Icon };

/* ---------- formatting helpers ---------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const CATEGORIES = ['Hotel', 'Transport', 'Guide', 'Restaurant', 'Activity', 'Other'];
const categoryIcon = { Hotel: 'bed', Transport: 'bus', Guide: 'users', Restaurant: 'utensils', Activity: 'ticket', Other: 'box' };

const parts = iso => iso.split('-').map(Number);

export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function fmtRange(start, end) {
  if (!start || !end) return fmtDate(start || end);
  const [y1, m1, d1] = parts(start);
  const [y2, m2, d2] = parts(end);
  if (y1 !== y2) return `${fmtDate(start)} – ${fmtDate(end)}`;
  if (m1 !== m2) return `${d1} ${MONTHS[m1 - 1]} – ${d2} ${MONTHS[m2 - 1]} ${y2}`;
  return `${d1} – ${d2} ${MONTHS[m2 - 1]} ${y2}`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function money(amount, currency = 'EUR') {
  if (amount === '' || amount == null) return '';
  // Whole amounts show as "€1,440"; amounts with cents keep them ("€2,800.50"), since invoices must match exactly.
  const digits = Math.round(Number(amount) * 100) % 100 === 0 ? 0 : 2;
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/* ---------- derived data ---------- */

// 'none' | 'paid' | 'overdue' | 'due'
export function paymentState(p, today = todayISO()) {
  if (!p) return 'none';
  if (p.paid) return 'paid';
  if (p.due && p.due < today) return 'overdue';
  return 'due';
}

export function paymentRows(trips) {
  return trips.flatMap(trip => trip.suppliers.flatMap(s => ['deposit', 'balance']
    .filter(kind => s[kind])
    .map(kind => ({ trip, s, kind, p: s[kind] }))));
}

export function sortPayments(rows) {
  const open = rows.filter(r => !r.p.paid).sort((a, b) => (a.p.due || '9999').localeCompare(b.p.due || '9999'));
  const paid = rows.filter(r => r.p.paid).sort((a, b) => (b.p.due || '').localeCompare(a.p.due || ''));
  return { open, paid };
}

export function tripStats(trip) {
  const today = todayISO();
  return {
    suppliers: trip.suppliers.length,
    confirmed: trip.suppliers.filter(s => s.status === 'Confirmed').length,
    pending: trip.suppliers.filter(s => s.status === 'Pending').length,
    overdue: paymentRows([trip]).filter(r => paymentState(r.p, today) === 'overdue').length,
  };
}

// Money for one trip, from the deposits and final balances recorded on its suppliers.
// Unpaid amounts for cancelled suppliers aren't owed; anything already paid still counts as paid.
export function tripMoney(trip) {
  const today = todayISO();
  const m = { total: 0, paid: 0, owed: 0, overdue: 0, missing: 0 };
  paymentRows([trip]).forEach(({ s, p }) => {
    const amount = Number(p.amount);
    const hasAmount = p.amount !== '' && p.amount != null && Number.isFinite(amount);
    if (p.paid) {
      if (hasAmount) m.paid += amount; else m.missing++;
      return;
    }
    if (s.status === 'Cancelled') return;
    if (!hasAmount) { m.missing++; return; }
    m.owed += amount;
    if (paymentState(p, today) === 'overdue') m.overdue += amount;
  });
  m.total = m.paid + m.owed;
  return m;
}

export const nextPayment = trip => sortPayments(paymentRows([trip])).open.find(r => r.p.due);

// One entry per supplier name across all trips. Stage 2 replaces this with a real supplier table.
export function supplierDirectory(trips) {
  const byName = new Map();
  trips.forEach(t => t.suppliers.forEach(s => {
    const key = s.name.trim().toLowerCase();
    const entry = byName.get(key) || { s, trips: [] };
    if (!entry.trips.some(x => x.id === t.id)) entry.trips.push(t);
    byName.set(key, entry);
  }));
  return [...byName.values()].sort((a, b) => a.s.name.localeCompare(b.s.name));
}

// Reusing a supplier copies its contact details only; confirmation, payments and notes are per trip.
export const contactDetails = s => ({ name: s.name, category: s.category, place: s.place, contact: s.contact, img: s.img, photo: s.photo });

/* ---------- small pieces ---------- */

export function Pill({ tone, icon, children }) {
  return <span className={'ws-pill is-' + tone}><Icon name={icon} size={15} />{children}</span>;
}

export function StatusPill({ status }) {
  if (status === 'Confirmed') return <Pill tone="ok" icon="check">Confirmed</Pill>;
  if (status === 'Cancelled') return <Pill tone="muted" icon="x">Cancelled</Pill>;
  return <Pill tone="warn" icon="dot">{status}</Pill>;
}

export function DepositPill({ p }) {
  const state = paymentState(p);
  if (state === 'none') return <span className="ws-dash">No deposit</span>;
  if (state === 'paid') return <Pill tone="ok" icon="dot">Paid</Pill>;
  if (state === 'overdue') return <Pill tone="due" icon="alert">Overdue · {fmtDate(p.due)}</Pill>;
  return <Pill tone="due" icon="dot">{p.due ? `Due ${fmtDate(p.due)}` : 'Unpaid'}</Pill>;
}

export function BalancePill({ p }) {
  const state = paymentState(p);
  if (state === 'none') return <span className="ws-dash">—</span>;
  if (state === 'paid') return <Pill tone="muted" icon="circle">Complete</Pill>;
  if (state === 'overdue') return <Pill tone="due" icon="alert">Overdue · {fmtDate(p.due)}</Pill>;
  return <Pill tone="muted" icon="receipt">{p.due ? `Due ${fmtDate(p.due)}` : 'Unpaid'}</Pill>;
}

export function Category({ name }) {
  return <span className="ws-cat"><Icon name={categoryIcon[name] || 'box'} size={18} />{name}</span>;
}

// photo: a user-added thumbnail (data URL). img: a bundled sample image. Otherwise initials.
export function SupplierAvatar({ s }) {
  const src = s.photo || (s.img && sampleImage(s.img));
  if (src) return <img className="ws-thumb" src={src} alt="" />;
  const initials = s.name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return <span className={'ws-avatar is-' + (s.category || 'Other').toLowerCase()} aria-hidden="true">{initials || '?'}</span>;
}

// Crops any image to a small square JPEG so photos stay tiny in browser storage (~10 KB each).
async function makeThumbnail(file, size = 160) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // transparent logos would otherwise turn black as JPEG
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export function SupplierName({ s, sub }) {
  return (
    <div className="ws-sup">
      <SupplierAvatar s={s} />
      <div><b>{s.name}</b><small>{sub ?? (s.place || '—')}</small></div>
    </div>
  );
}

export function MoneySummary({ trip }) {
  const m = tripMoney(trip);
  const cur = trip.currency;
  const pct = m.total ? Math.round((m.paid / m.total) * 100) : 0;
  return (
    <section className="ws-money" aria-label="Money summary">
      <div className="ws-money-head"><h2>Money</h2><span>{pct}% paid</span></div>
      <div className="ws-money-bar"><span style={{ width: `${pct}%` }} /></div>
      <dl className="ws-money-grid">
        <div><dt>Total supplier cost</dt><dd>{money(m.total, cur)}</dd></div>
        <div><dt>Paid</dt><dd className="is-ok">{money(m.paid, cur)}</dd></div>
        <div><dt>Still owed</dt><dd>{money(m.owed, cur)}</dd></div>
        <div><dt>Overdue</dt><dd className={m.overdue ? 'is-due' : ''}>{money(m.overdue, cur)}</dd></div>
      </dl>
      <p className="ws-money-note">
        <Icon name="info" size={15} />
        {m.missing > 0 && `${m.missing} payment${m.missing > 1 ? 's have' : ' has'} no amount yet and ${m.missing > 1 ? 'aren’t' : 'isn’t'} included. `}
        Unpaid amounts for cancelled suppliers aren’t counted.
      </p>
    </section>
  );
}

export function Modal({ title, sub, onClose, children, wide }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="ws-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={'ws-dialog' + (wide ? ' is-wide' : '')} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ws-dialog-head">
          <div><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
          <button className="ws-icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ icon, title, text, action }) {
  return (
    <div className="ws-empty">
      <i><Icon name={icon} size={24} /></i>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function PageHead({ crumb, title, sub, actions, children }) {
  return (
    <header className="ws-head">
      <div className="ws-head-row">
        <div>{crumb}<h1>{title}</h1>{sub}</div>
        {actions && <div className="ws-head-actions">{actions}</div>}
      </div>
      {children}
    </header>
  );
}

/* ---------- layout ---------- */

const nav = [['/trips', 'globe', 'Trips'], ['/suppliers', 'users', 'Suppliers'], ['/documents', 'file', 'Documents'], ['/deadlines', 'calendar', 'Deadlines'], ['/notes', 'note', 'Notes']];

export function Shell({ children }) {
  const path = usePathname();
  const { ready, saveFailed, resetDemo } = useStore();
  const active = href => path.startsWith(href) || (href === '/trips' && path === '/dashboard');
  return (
    <div className="ws">
      <aside className="ws-side">
        <Link href="/" className="ws-brand" aria-label="Roveboard home"><Logo /></Link>
        <nav>
          {nav.map(([href, icon, label]) => (
            <Link key={href} href={href} className={active(href) ? 'on' : ''} aria-label={label}>
              <Icon name={icon} size={20} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="ws-side-foot">
          <b>Demo workspace</b>
          <span>Saved in this browser only</span>
          <button onClick={() => confirm('Reset the demo? Your changes will be replaced with the sample trips.') && resetDemo()}>Reset sample data</button>
          <Link href="/">← Back to website</Link>
        </div>
      </aside>
      <main className="ws-main">
        {saveFailed && <p className="ws-banner" role="alert"><Icon name="alert" size={18} />Your latest changes couldn’t be saved because this browser’s storage is full. Remove some supplier photos, or reset the sample data.</p>}
        {ready ? children : null}
      </main>
    </div>
  );
}

/* ---------- tables and lists ---------- */

export function SupplierTable({ suppliers, onEdit }) {
  return (
    <div className="ws-table">
      <table>
        <thead>
          <tr><th>Supplier</th><th>Category</th><th>Confirmation</th><th>Deposit</th><th>Final balance</th></tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id} className="is-click" tabIndex={0} onClick={() => onEdit(s)} onKeyDown={e => e.key === 'Enter' && onEdit(s)}>
              <td><SupplierName s={s} /></td>
              <td><Category name={s.category} /></td>
              <td><StatusPill status={s.status} /></td>
              <td><DepositPill p={s.deposit} /></td>
              <td><BalancePill p={s.balance} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SupplierContacts({ suppliers, onEdit }) {
  return (
    <div className="ws-table">
      <table>
        <thead>
          <tr><th>Supplier</th><th>Contact</th><th>Confirmation</th><th>Notes</th><th /></tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td><SupplierName s={s} sub={`${s.category} · ${s.place || '—'}`} /></td>
              <td>{s.contact || <span className="ws-dash">—</span>}</td>
              <td><StatusPill status={s.status} /></td>
              <td className="ws-notes"><span>{s.notes || '—'}</span></td>
              <td><button className="ws-btn small" onClick={() => onEdit(s)}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentList({ rows, showTrip }) {
  const { setPaid } = useStore();
  const today = todayISO();
  return (
    <div className="ws-pays">
      {rows.map(({ trip, s, kind, p }) => {
        const state = paymentState(p, today);
        const [d, m, y] = p.due ? fmtDate(p.due).split(' ') : [];
        return (
          <div className={'ws-pay' + (state === 'paid' ? ' is-paid' : '')} key={trip.id + s.id + kind}>
            <div className="ws-pay-date">{p.due ? <><b>{d}</b><small>{m} {y}</small></> : <small>No date</small>}</div>
            <div className="ws-pay-who">
              <b>{s.name}</b>
              <small>{kind === 'deposit' ? 'Deposit' : 'Final balance'}{showTrip && <> · <Link href={`/trips/${trip.id}`}>{trip.name}</Link></>}</small>
            </div>
            <span className="ws-pay-amount">{money(p.amount, trip.currency) || '—'}</span>
            {state === 'paid' ? <Pill tone="ok" icon="check">Paid</Pill>
              : state === 'overdue' ? <Pill tone="due" icon="alert">Overdue</Pill>
              : <Pill tone="warn" icon="dot">Upcoming</Pill>}
            <button className="ws-btn small" onClick={() => setPaid(trip.id, s.id, kind, state !== 'paid')}>{state === 'paid' ? 'Undo' : 'Mark paid'}</button>
          </div>
        );
      })}
    </div>
  );
}

export function DeadlineSections({ trips, showTrip }) {
  const { open, paid } = sortPayments(paymentRows(trips));
  return (
    <>
      {open.length
        ? <PaymentList rows={open} showTrip={showTrip} />
        : <Empty icon="calendar" title={paid.length ? 'Everything is paid' : 'No payments recorded'} text={paid.length ? 'No deposits or final balances are waiting.' : 'Add a deposit or final balance to a supplier and it will show up here.'} />}
      {paid.length > 0 && <><h2 className="ws-section-title">Paid</h2><PaymentList rows={paid} showTrip={showTrip} /></>}
    </>
  );
}

/* ---------- forms ---------- */

export function TripForm({ trip, onClose }) {
  const { saveTrip, deleteTrip } = useStore();
  const router = useRouter();
  const [f, setF] = useState(trip || { name: '', start: '', end: '', travellers: '', currency: 'EUR' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const badDates = f.start && f.end && f.end < f.start;

  function submit(e) {
    e.preventDefault();
    if (badDates) return;
    const id = trip?.id || newId();
    saveTrip({ ...f, id, travellers: Number(f.travellers) });
    onClose();
    if (!trip) router.push(`/trips/${id}`);
  }

  function remove() {
    if (!confirm(`Delete ${trip.name} and all its suppliers?`)) return;
    deleteTrip(trip.id);
    router.push('/trips');
  }

  return (
    <Modal title={trip ? 'Edit trip' : 'Create a trip'} sub={trip ? 'Update dates or group size when plans change.' : 'Start with the essentials. You’ll add suppliers next.'} onClose={onClose}>
      <form className="ws-form" onSubmit={submit}>
        <label className="span2">Trip name<input required value={f.name} onChange={set('name')} placeholder="e.g. Italy Explorer 2027" /></label>
        <label>Start date<input required type="date" value={f.start} onChange={set('start')} /></label>
        <label>End date<input required type="date" min={f.start || undefined} value={f.end} onChange={set('end')} /></label>
        {badDates && <p className="ws-error span2">The end date must be on or after the start date.</p>}
        <label>Travellers<input required type="number" min="1" value={f.travellers} onChange={set('travellers')} /></label>
        <label>Currency<select value={f.currency} onChange={set('currency')}>{['EUR', 'GBP', 'USD'].map(c => <option key={c}>{c}</option>)}</select></label>
        <div className="ws-form-actions span2">
          {trip && <button type="button" className="ws-btn danger" onClick={remove}><Icon name="trash" size={16} />Delete trip</button>}
          <button type="button" className="ws-btn" onClick={onClose}>Cancel</button>
          <button className="ws-btn primary">{trip ? 'Save changes' : 'Create trip'}</button>
        </div>
      </form>
    </Modal>
  );
}

const blankPay = { amount: '', due: '', paid: false };
const cleanPay = p => (p.amount === '' && !p.due ? null : { amount: p.amount === '' ? '' : Number(p.amount), due: p.due, paid: !!p.paid });

// supplier: edit an existing booking. initial: prefill a new one (e.g. reuse from the directory).
// Without tripId the form asks which trip to add to.
export function SupplierForm({ tripId, supplier, initial, onClose }) {
  const { trips, saveSupplier, deleteSupplier } = useStore();
  const [targetTrip, setTargetTrip] = useState(tripId || trips[0]?.id || '');
  const [mode, setMode] = useState('manual');
  const [pasted, setPasted] = useState('');
  const base = supplier || initial || {};
  const [f, setF] = useState({
    name: '', category: 'Hotel', place: '', status: 'Pending', contact: '', notes: '',
    ...base, deposit: base.deposit || blankPay, balance: base.balance || blankPay, documents: base.documents || [],
  });
  const trip = trips.find(t => t.id === targetTrip);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const setPay = (kind, k) => e => setF({ ...f, [kind]: { ...f[kind], [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value } });

  function submit(e) {
    e.preventDefault();
    if (!trip) return;
    saveSupplier(trip.id, { ...f, id: supplier?.id || newId(), deposit: cleanPay(f.deposit), balance: cleanPay(f.balance) });
    removed.current.forEach(deleteFile);
    unsaved.current.clear();
    onClose();
  }

  function remove() {
    if (!confirm(`Remove ${supplier.name} from this trip?`)) return;
    unsaved.current.forEach(deleteFile);
    deleteSupplier(tripId, supplier.id);
    onClose();
  }

  function usePasted() {
    if (pasted.trim()) setF(prev => ({ ...prev, notes: [prev.notes, pasted.trim()].filter(Boolean).join('\n\n') }));
    setMode('manual');
  }

  // Documents are stored in the browser as soon as they're attached. Any that never get saved
  // with the supplier are deleted on cancel; ones removed from a saved supplier are deleted on save.
  const unsaved = useRef(new Set());
  const removed = useRef(new Set());
  const [docError, setDocError] = useState('');

  async function addDocument(file) {
    const problem = checkDocument(file);
    if (problem) return setDocError(problem);
    setDocError('');
    const doc = { id: newId(), name: file.name, size: file.size, type: file.type, addedAt: todayISO() };
    try {
      await saveFile(doc.id, file);
    } catch {
      return setDocError('Couldn’t store that file in this browser. It may be out of space.');
    }
    unsaved.current.add(doc.id);
    setF(prev => ({ ...prev, documents: [...prev.documents, doc] }));
  }

  function removeDocument(id) {
    setF(prev => ({ ...prev, documents: prev.documents.filter(d => d.id !== id) }));
    if (unsaved.current.delete(id)) deleteFile(id);
    else removed.current.add(id);
  }

  function cancel() {
    unsaved.current.forEach(deleteFile);
    onClose();
  }

  // Reusing saved suppliers: pick from "Your suppliers" or accept a name suggestion.
  const directory = supplierDirectory(trips);
  const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();
  const onThisTrip = name => !!trip?.suppliers.some(x => x.id !== supplier?.id && sameName(x.name, name));
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(null);

  function useSaved(s) {
    setF(prev => ({ ...prev, ...contactDetails(s) }));
    setPicked(s.name);
    setMode('manual');
  }

  const q = query.trim().toLowerCase();
  const matches = directory.filter(({ s }) => !q || [s.name, s.place, s.category, s.contact].some(v => v?.toLowerCase().includes(q)));
  const typed = f.name.trim().toLowerCase();
  const suggestions = !supplier && !initial && typed.length >= 2 && !(picked && sameName(picked, f.name))
    ? directory.filter(({ s }) => s.name.toLowerCase().includes(typed) && !onThisTrip(s.name)).slice(0, 3)
    : [];

  const fileInput = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const hasPhoto = !!(f.photo || f.img);

  async function addPhoto(file) {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) return setPhotoError('Please choose an image file (JPG or PNG).');
    try {
      const photo = await makeThumbnail(file);
      setF(prev => ({ ...prev, photo, img: null }));
    } catch {
      setPhotoError('Couldn’t read that image. Try a JPG or PNG.');
    }
  }

  // Pasting an image anywhere in the form (e.g. copied from a hotel's website) adds it as the photo.
  function onPaste(e) {
    const file = [...e.clipboardData.files].find(x => x.type.startsWith('image/'));
    if (!file) return;
    e.preventDefault();
    addPhoto(file);
  }

  const photoField = (
    <div
      className={'ws-photo span2' + (dragging ? ' is-drag' : '')}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); addPhoto(e.dataTransfer.files[0]); }}
    >
      <SupplierAvatar s={f} />
      <div className="ws-photo-text">
        <b>Photo <span>(optional)</span></b>
        <small>{photoError || 'Click, drop or paste an image. Without one, we show their initials.'}</small>
      </div>
      <div className="ws-photo-actions">
        <button type="button" className="ws-btn small" onClick={() => fileInput.current.click()}>{hasPhoto ? 'Change' : 'Add photo'}</button>
        {hasPhoto && <button type="button" className="ws-btn small ghost" onClick={() => setF({ ...f, photo: null, img: null })}>Remove</button>}
      </div>
      <input ref={fileInput} type="file" accept="image/*" hidden onChange={e => { addPhoto(e.target.files[0]); e.target.value = ''; }} />
    </div>
  );

  const payFields = (kind, legend) => (
    <fieldset>
      <legend>{legend}</legend>
      <label>Amount ({trip?.currency || 'EUR'})<input type="number" min="0" step="any" value={f[kind].amount} onChange={setPay(kind, 'amount')} /></label>
      <label>Due date<input type="date" value={f[kind].due} onChange={setPay(kind, 'due')} /></label>
      <label className="ws-check"><input type="checkbox" checked={!!f[kind].paid} onChange={setPay(kind, 'paid')} />Paid</label>
    </fieldset>
  );

  const isNew = !supplier;
  return (
    <Modal
      title={supplier ? 'Edit supplier' : initial ? 'Add to a trip' : 'Add supplier'}
      sub={initial ? 'Contact details are copied. Add the arrangements for this trip.' : 'Review the details before saving.'}
      onClose={cancel}
    >
      {isNew && !initial && (
        <div className="ws-segment">
          <button type="button" className={mode === 'manual' ? 'on' : ''} onClick={() => setMode('manual')}><Icon name="note" size={16} />Enter manually</button>
          <button type="button" className={mode === 'saved' ? 'on' : ''} onClick={() => setMode('saved')}><Icon name="users" size={16} />Your suppliers</button>
          <button type="button" className={mode === 'paste' ? 'on' : ''} onClick={() => setMode('paste')}><Icon name="sparkle" size={16} />Email or contract</button>
        </div>
      )}
      {mode === 'saved' ? (
        <div className="ws-form">
          {directory.length ? (
            <>
              <label className="span2">Search your suppliers
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Name, place or type, e.g. Rome" />
              </label>
              <div className="ws-pick span2">
                {matches.length ? matches.map(({ s, trips: used }) => {
                  const already = onThisTrip(s.name);
                  return (
                    <button type="button" key={s.name} className="ws-pick-row" disabled={already} onClick={() => useSaved(s)}>
                      <SupplierName s={s} sub={`${s.category} · ${s.place || '—'}`} />
                      <small>{already ? 'Already on this trip' : `Used in ${used.length} trip${used.length > 1 ? 's' : ''}`}</small>
                    </button>
                  );
                }) : <p className="ws-dash">No saved suppliers match “{query}”.</p>}
              </div>
              <p className="ws-callout span2"><Icon name="info" size={18} />Only contact details are copied. You’ll add this trip’s confirmation, payments and notes next.</p>
            </>
          ) : (
            <p className="ws-callout span2"><Icon name="info" size={18} />No saved suppliers yet. Every supplier you add to a trip is saved here so you can reuse it on the next one.</p>
          )}
        </div>
      ) : mode === 'paste' ? (
        <div className="ws-form">
          <label className="span2"><span>Paste a supplier email or message <span className="ws-optional">(optional)</span></span>
            <textarea rows={6} value={pasted} onChange={e => setPasted(e.target.value)} placeholder="Paste a confirmation from a hotel, coach company or guide…" />
          </label>
          <DocumentField large docs={f.documents} onAdd={addDocument} onRemove={removeDocument} error={docError} />
          <p className="ws-callout span2"><Icon name="info" size={18} />AI suggestions are an early access concept and aren’t connected in this demo. Pasted text goes into the notes, and the contract is attached to this supplier so it’s always one click away. You fill in the details yourself.</p>
          <div className="ws-form-actions span2">
            <button type="button" className="ws-btn" onClick={cancel}>Cancel</button>
            <button type="button" className="ws-btn primary" disabled={!pasted.trim() && !f.documents.length} onClick={usePasted}>Continue <Icon name="arrow" size={16} /></button>
          </div>
        </div>
      ) : (
        <form className="ws-form" onSubmit={submit} onPaste={onPaste}>
          {!tripId && (
            <label className="span2">Trip
              <select required value={targetTrip} onChange={e => setTargetTrip(e.target.value)}>
                {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
          )}
          {picked && <p className="ws-callout span2"><Icon name="check" size={18} />Contact details copied from your saved supplier “{picked}”. Add this trip’s confirmation, payments and notes.</p>}
          {photoField}
          <label className="span2">Supplier name<input required value={f.name} onChange={set('name')} placeholder="e.g. Hotel Bella Vista" /></label>
          {suggestions.length > 0 && (
            <div className="ws-suggest span2">
              <span>From your suppliers:</span>
              {suggestions.map(({ s }) => (
                <button type="button" key={s.name} onClick={() => useSaved(s)}><SupplierAvatar s={s} />{s.name}</button>
              ))}
            </div>
          )}
          <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Location<input value={f.place} onChange={set('place')} placeholder="e.g. Rome" /></label>
          <label>Confirmation<select value={f.status} onChange={set('status')}>{['Pending', 'Confirmed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}</select></label>
          <label>Contact<input value={f.contact} onChange={set('contact')} placeholder="Email or phone" /></label>
          {payFields('deposit', 'Deposit')}
          {payFields('balance', 'Final balance')}
          <label className="span2">Notes<textarea rows={3} value={f.notes} onChange={set('notes')} placeholder="Rooms, times, special requests…" /></label>
          <DocumentField docs={f.documents} onAdd={addDocument} onRemove={removeDocument} error={docError} />
          <div className="ws-form-actions span2">
            {supplier && <button type="button" className="ws-btn danger" onClick={remove}><Icon name="trash" size={16} />Remove</button>}
            <button type="button" className="ws-btn" onClick={cancel}>Cancel</button>
            <button className="ws-btn primary" disabled={!trip}>{supplier ? 'Save changes' : 'Add supplier'}</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
