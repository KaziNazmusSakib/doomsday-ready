import { useEffect, useState } from 'react';
import { getMovies, getRewatchOrder, updateMovie, errorMessage } from '../api/client';

function formatMinutes(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export default function RewatchPlan() {
  const [movies, setMovies] = useState([]);
  const [targetId, setTargetId] = useState('');
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovies().then(setMovies).catch((e) => setError(errorMessage(e)));
  }, []);

  async function loadPlan(id) {
    if (!id) {
      setPlan(null);
      return;
    }
    setError('');
    try {
      setPlan(await getRewatchOrder(id));
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  function handleSelect(e) {
    setTargetId(e.target.value);
    loadPlan(e.target.value);
  }

  async function toggleWatched(m) {
    setError('');
    try {
      await updateMovie(m.id, { watched: !m.watched });
      loadPlan(targetId);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  const percent = plan && plan.totalCount > 0 ? Math.round((plan.watchedCount / plan.totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">I want to watch</label>
        <select value={targetId} onChange={handleSelect}
          className="w-full rounded border border-slate-300 px-2 py-2">
          <option value="">Pick a target movie...</option>
          {movies.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      {plan && (
        <div className="space-y-4 rounded border border-slate-200 p-4">
          <h2 className="font-semibold">Before you watch {plan.title}</h2>

          {plan.totalCount === 0 ? (
            <p className="text-slate-600">Nothing to watch first. You're ready to go!</p>
          ) : (
            <>
              <div>
                <div className="mb-1 flex justify-between text-sm text-slate-600">
                  <span>{plan.watchedCount} of {plan.totalCount} watched</span>
                  <span>{formatMinutes(plan.remainingRuntimeMinutes)} left to watch</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded bg-slate-200">
                  <div className="h-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>

              <ol className="space-y-2">
                {plan.order.map((m, index) => (
                  <li key={m.id} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={m.watched} onChange={() => toggleWatched(m)} />
                      <span className="text-sm text-slate-400">{index + 1}.</span>
                      <span className={m.watched ? 'text-slate-400 line-through' : 'font-medium'}>{m.title}</span>
                    </label>
                    <span className="text-sm text-slate-500">{m.releaseYear} · {m.runtimeMinutes} min</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
}