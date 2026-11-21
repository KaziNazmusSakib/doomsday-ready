import { useEffect, useState } from 'react';
import { getMovies } from './api/client';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovies().then(setMovies).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-indigo-600">Doomsday Ready</h1>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <ul className="mt-4 list-disc pl-5">
        {movies.map((m) => <li key={m.id}>{m.title}</li>)}
      </ul>
    </div>
  );
}