'use client';
import { BUSINESS_TYPES, INTERESTS, SOURCES, TRIP_VOLUMES } from './options';

export const emptyAnswers = { name: '', businessType: '', tripsPerYear: '', interests: [], heardFrom: '' };

// Sign-up step 2 ("Tell us about your business"). Used by the email sign-up and by /onboarding (Google users).
export default function BusinessFields({ answers, setAnswers }) {
  const set = key => e => setAnswers({ ...answers, [key]: e.target.value });
  const toggle = value => setAnswers({
    ...answers,
    interests: answers.interests.includes(value) ? answers.interests.filter(v => v !== value) : [...answers.interests, value],
  });

  return (
    <>
      <label>Company name
        <input required maxLength={120} autoFocus placeholder="e.g. Sunshine Travel" value={answers.name} onChange={set('name')} />
      </label>

      <div className="au-row">
        <label>What best describes your business?
          <select required value={answers.businessType} onChange={set('businessType')}>
            <option value="">Choose one</option>
            {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label><span>Group trips per year <span className="au-opt">(optional)</span></span>
          <select value={answers.tripsPerYear} onChange={set('tripsPerYear')}>
            <option value="">Choose one</option>
            {TRIP_VOLUMES.map(v => <option key={v}>{v}</option>)}
          </select>
        </label>
      </div>

      <div className="au-row">
        <fieldset className="au-checks">
          <legend>What interests you most about Roveboard? <span className="au-opt">(optional)</span></legend>
          {INTERESTS.map(([value, soon]) => (
            <label key={value} className="au-check">
              <input type="checkbox" checked={answers.interests.includes(value)} onChange={() => toggle(value)} />
              <span>{value}{soon && <em>Coming soon</em>}</span>
            </label>
          ))}
        </fieldset>
        <label className="au-top">How did you hear about Roveboard?
          <select required value={answers.heardFrom} onChange={set('heardFrom')}>
            <option value="">Choose one</option>
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
    </>
  );
}
