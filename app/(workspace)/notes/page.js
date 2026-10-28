'use client';
import { useStore } from '../store';
import { PageHead } from '../ui';

export default function NotesPage() {
  const { notes, setNotes } = useStore();
  return (
    <>
      <PageHead title="Notes" sub={<p className="ws-sub">A scratchpad for your team. Saved automatically in this browser.</p>} />
      <div className="ws-body">
        <textarea className="ws-notepad" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Call notes, supplier preferences, things to remember…" aria-label="Notes" />
      </div>
    </>
  );
}
