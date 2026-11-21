import { useEffect, useState } from 'react';
import { getCinemas, getBooking, errorMessage } from '../api/client';

export default function Booking() {
  const [cinemas, setCinemas] = useState([]);
  const [cinemaId, setCinemaId] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCinemas().then(setCinemas).catch((e) => setError(errorMessage(e)));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const size = Number(groupSize);
    if (!cinemaId) return setError('Please pick a cinema');
    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      return setError('Group size must be a whole number between 1 and 10,000');
    }

    setLoading(true);
    try {
      setResult(await getBooking(cinemaId, size));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 rounded border border-slate-200 p-4">
        <h2 className="font-semibold">Book an opening-night watch party</h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Cinema</label>
          <select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-2">
            <option value="">Pick a cinema...</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (bundles of {c.bundleSizes.join(', ')})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Group size</label>
          <input type="number" value={groupSize} onChange={(e) => setGroupSize(e.target.value)}
            placeholder="e.g. 11" className="w-40 rounded border border-slate-300 px-2 py-2" />
        </div>

        <button disabled={loading}
          className="rounded bg-indigo-600 px-4 py-1.5 text-white hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Checking...' : 'Get quote'}
        </button>
      </form>

      {result && result.possible && (
        <div className="space-y-3 rounded border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-800">
            {result.bundleCount} {result.bundleCount === 1 ? 'bundle' : 'bundles'} for {result.groupSize} people at {result.cinemaName}
          </h3>
          <ul className="space-y-1">
            {result.bundles.map((b) => (
              <li key={b.size} className="text-slate-800">
                <span className="font-medium">{b.count} ×</span> bundle of {b.size}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && !result.possible && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Not possible. {result.cinemaName} cannot make exactly {result.groupSize} seats from its bundle sizes.
        </div>
      )}
    </div>
  );
}