'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { openDocument } from './files';
import { Icon } from '../components/icons';
import { fmtDate } from './ui';

export const DOC_ACCEPT = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,application/pdf,image/*';
export const MAX_DOC_BYTES = 20 * 1024 * 1024;

// Returns an error message, or '' if the file is fine to attach.
export function checkDocument(file) {
  if (!/\.(pdf|docx?|png|jpe?g|webp)$/i.test(file.name) && !file.type.startsWith('image/') && file.type !== 'application/pdf') {
    return `“${file.name}” isn’t a supported file. Attach a PDF, Word document or image.`;
  }
  if (file.size > MAX_DOC_BYTES) return `“${file.name}” is larger than 20 MB.`;
  return '';
}

export function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const fileIcon = doc => (/\.pdf$/i.test(doc.name) || doc.type === 'application/pdf' ? 'PDF' : /\.docx?$/i.test(doc.name) ? 'DOC' : 'IMG');

function DocChip({ doc, onRemove }) {
  return (
    <div className="ws-doc">
      <span className={'ws-doc-icon is-' + fileIcon(doc).toLowerCase()}>{fileIcon(doc)}</span>
      <span className="ws-doc-name"><b>{doc.name}</b><small>{fmtSize(doc.size)}</small></span>
      <button type="button" className="ws-btn small" onClick={() => openDocument(doc)}>Open</button>
      {onRemove && <button type="button" className="ws-btn small ghost" onClick={() => onRemove(doc.id)} aria-label={`Remove ${doc.name}`}>Remove</button>}
    </div>
  );
}

// Attached documents plus a way to add more. `large` shows a big drop zone (used in the email/contract tab).
export function DocumentField({ docs, onAdd, onRemove, error, large }) {
  const input = useRef(null);
  const [dragging, setDragging] = useState(false);
  const drop = {
    onDragOver: e => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop: e => { e.preventDefault(); setDragging(false); [...e.dataTransfer.files].forEach(onAdd); },
  };
  const picker = <input ref={input} type="file" accept={DOC_ACCEPT} multiple hidden onChange={e => { [...e.target.files].forEach(onAdd); e.target.value = ''; }} />;

  return (
    <div className="ws-docfield span2">
      {large ? (
        <label className={'ws-drop' + (dragging ? ' is-drag' : '')} {...drop}>
          <Icon name="upload" size={28} />
          <b>Upload a contract or confirmation</b>
          <span>PDF, Word or image, up to 20 MB. Choose a file or drop it here.</span>
          {picker}
        </label>
      ) : (
        <div className={'ws-docfield-head' + (dragging ? ' is-drag' : '')} {...drop}>
          <span>Documents <small>(optional)</small></span>
          <button type="button" className="ws-btn small" onClick={() => input.current.click()}><Icon name="upload" size={15} />Attach contract</button>
          {picker}
        </div>
      )}
      {docs.length > 0 && <div className="ws-docs">{docs.map(d => <DocChip key={d.id} doc={d} onRemove={onRemove} />)}</div>}
      {!large && docs.length === 0 && <small className="ws-docfield-hint">Contracts, confirmations or invoices. Drop a file here or use Attach.</small>}
      {error && <p className="ws-error" role="alert">{error}</p>}
    </div>
  );
}

export const documentRows = trips => trips.flatMap(trip => trip.suppliers.flatMap(s => (s.documents || []).map(doc => ({ trip, s, doc }))));

export function DocumentList({ rows, showTrip }) {
  return (
    <div className="ws-table">
      <table>
        <thead><tr><th>Document</th><th>Supplier</th>{showTrip && <th>Trip</th>}<th>Added</th><th /></tr></thead>
        <tbody>
          {rows.map(({ trip, s, doc }) => (
            <tr key={doc.id}>
              <td>
                <div className="ws-doc-cell">
                  <span className={'ws-doc-icon is-' + fileIcon(doc).toLowerCase()}>{fileIcon(doc)}</span>
                  <span className="ws-doc-name"><b>{doc.name}</b><small>{fmtSize(doc.size)}</small></span>
                </div>
              </td>
              <td>{s.name}</td>
              {showTrip && <td><Link className="ws-link" href={`/trips/${trip.id}`}>{trip.name}</Link></td>}
              <td>{fmtDate(doc.addedAt)}</td>
              <td><button className="ws-btn small" onClick={() => openDocument(doc)}>Open</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
