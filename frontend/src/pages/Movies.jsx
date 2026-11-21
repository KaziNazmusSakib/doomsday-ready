import { useEffect, useState } from 'react';
import { getMovies, createMovie, updateMovie, errorMessage } from '../api/client';
 

function PrereqPicker({ movies, selected, onChange, excludeId }) {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  return (
    <div className="flex flex-wrap gap-2">
      {movies.filter((m) => m.id !== excludeId).map((m) => (
        <label key={m.id} className="flex items-center gap-1 rounded border border-slate-300 px-2 py-1 text-sm">
          <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)} />
          {m.title}
        </label>
      ))}
    </div>
  );
}

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', releaseYear: '', runtimeMinutes: '', prerequisiteIds: [] });
  const [editingId, setEditingId] = useState(null);
  const [editPrereqs, setEditPrereqs] = useState([]);

  const load = () => getMovies().then(setMovies).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const titleOf = (id) => movies.find((m) => m.id === id)?.title ?? `#${id}`;

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    try {
      await createMovie({
        title: form.title,
        releaseYear: Number(form.releaseYear),
        runtimeMinutes: Number(form.runtimeMinutes),
        prerequisiteIds: form.prerequisiteIds,
      });
      setForm({ title: '', releaseYear: '', runtimeMinutes: '', prerequisiteIds: [] });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function toggleWatched(m) {
    setError('');
    try {
      await updateMovie(m.id, { watched: !m.watched });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function savePrereqs(id) {
    setError('');
    try {
      await updateMovie(id, { prerequisiteIds: editPrereqs });
      setEditingId(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleAdd} className="space-y-3 rounded border border-slate-200 p-4">
        <h2 className="font-semibold">Add a movie</h2>
        <div className="flex flex-wrap gap-2">
          <input className="min-w-48 flex-1 rounded border border-slate-300 px-2 py-1" placeholder="Title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="w-28 rounded border border-slate-300 px-2 py-1" placeholder="Year" type="number"
            value={form.releaseYear} onChange={(e) => setForm({ ...form, releaseYear: e.target.value })} />
          <input className="w-32 rounded border border-slate-300 px-2 py-1" placeholder="Runtime (min)" type="number"
            value={form.runtimeMinutes} onChange={(e) => setForm({ ...form, runtimeMinutes: e.target.value })} />
        </div>
        <p className="text-sm text-slate-600">Prerequisites (optional)</p>
        <PrereqPicker movies={movies} selected={form.prerequisiteIds}
          onChange={(ids) => setForm({ ...form, prerequisiteIds: ids })} />
        <button className="rounded bg-indigo-600 px-4 py-1.5 text-white hover:bg-indigo-700">Add movie</button>
      </form>

      <ul className="space-y-3">
        {movies.map((m) => (
          <li key={m.id} className="rounded border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" checked={m.watched} onChange={() => toggleWatched(m)} />
                <span className={m.watched ? 'text-slate-400 line-through' : ''}>{m.title}</span>
              </label>
              <span className="text-sm text-slate-500">{m.releaseYear} · {m.runtimeMinutes} min</span>
            </div>

            {editingId === m.id ? (
              <div className="mt-3 space-y-2">
                <PrereqPicker movies={movies} excludeId={m.id} selected={editPrereqs} onChange={setEditPrereqs} />
                <div className="flex gap-2">
                  <button onClick={() => savePrereqs(m.id)} className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">Save</button>
                  <button onClick={() => setEditingId(null)} className="rounded border border-slate-300 px-3 py-1 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>
                  Prerequisites: {m.prerequisiteIds.length ? m.prerequisiteIds.map(titleOf).join(', ') : 'none'}
                </span>
                <button className="text-indigo-600 hover:underline"
                  onClick={() => { setEditingId(m.id); setEditPrereqs(m.prerequisiteIds); }}>
                  Edit prerequisites
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}