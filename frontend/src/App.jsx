import { useState } from 'react';
import Movies from './pages/Movies';
import RewatchPlan from './pages/RewatchPlan';
import Booking from './pages/Booking';

const TABS = ['Movies', 'Rewatch Plan', 'Booking'];

export default function App() {
  const [tab, setTab] = useState('Movies');

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-indigo-600">Doomsday Ready</h1>
      <nav className="mt-4 flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium ${tab === t ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </nav>
      <main className="mt-6">
        {tab === 'Movies' && <Movies />}
        {tab === 'Rewatch Plan' && <RewatchPlan />}
        {tab === 'Booking' && <Booking />}
      </main>
    </div>
  );
}