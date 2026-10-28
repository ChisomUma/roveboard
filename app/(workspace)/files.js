'use client';

// Stage 1: uploaded documents live in this browser's IndexedDB, which (unlike localStorage) can hold
// multi-megabyte files. Supplier records keep only metadata ({ id, name, size, type, addedAt }).
// Stage 2 moves the files to Supabase Storage.
const DB_NAME = 'roveboard-files';
const STORE = 'files';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, action) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = action(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(req.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export const saveFile = (id, blob) => run('readwrite', s => s.put(blob, id));
export const getFile = id => run('readonly', s => s.get(id));
export const deleteFile = id => run('readwrite', s => s.delete(id)).catch(() => {});
export const clearFiles = () => run('readwrite', s => s.clear()).catch(() => {});

// PDFs and images open in a new tab; other files (e.g. Word) download.
export async function openDocument(doc) {
  const viewable = doc.type === 'application/pdf' || doc.type.startsWith('image/');
  const win = viewable ? window.open('', '_blank') : null; // opened now so pop-up blockers allow it
  const blob = await getFile(doc.id).catch(() => null);
  if (!blob) {
    win?.close();
    alert('This file isn’t available in this browser. Demo documents are stored only on the device where they were uploaded.');
    return;
  }
  const url = URL.createObjectURL(blob);
  if (win) win.location.href = url;
  else {
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
