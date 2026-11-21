import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

export const getMovies = () => api.get('/movies').then((r) => r.data);
export const createMovie = (body) => api.post('/movies', body).then((r) => r.data);
export const updateMovie = (id, body) => api.patch(`/movies/${id}`, body).then((r) => r.data);
export const getRewatchOrder = (id) => api.get(`/movies/${id}/rewatch-order`).then((r) => r.data);

export const getCinemas = () => api.get('/cinemas').then((r) => r.data);
export const getBooking = (id, groupSize) =>
  api.get(`/cinemas/${id}/booking`, { params: { groupSize } }).then((r) => r.data);