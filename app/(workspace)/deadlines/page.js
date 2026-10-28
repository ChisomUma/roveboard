'use client';
import { useStore } from '../store';
import { DeadlineSections, Icon, PageHead } from '../ui';

export default function DeadlinesPage() {
  const { trips } = useStore();
  return (
    <>
      <PageHead title="Deadlines" sub={<p className="ws-sub">Deposits and final balances across all your trips.</p>} />
      <div className="ws-body">
        <p className="ws-callout ws-gap"><Icon name="mail" size={18} />Email reminders before each deadline are planned. In this demo, check this page and mark a payment as paid once you’ve paid the supplier. Roveboard tracks payments; it never moves money.</p>
        <DeadlineSections trips={trips} showTrip />
      </div>
    </>
  );
}
