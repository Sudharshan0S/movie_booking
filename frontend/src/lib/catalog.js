import BASE from '../data/movies';

// The catalog = movies in src/data/movies.js, plus movies the admin added in this browser,
// minus movies the admin deleted in this browser. No backend involved.
const CUSTOM_KEY = 'mb_custom_movies';
const DELETED_KEY = 'mb_deleted_movies';

const read = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const getMovies = () => {
  const deleted = read(DELETED_KEY);
  return [...read(CUSTOM_KEY).reverse(), ...BASE].filter((m) => !deleted.includes(m.id));
};

export const getMovie = (id) => getMovies().find((m) => m.id === id) || null;

export const addMovie = (movie) => {
  const created = { ...movie, id: `m-${Date.now().toString(36)}` };
  if (!write(CUSTOM_KEY, [...read(CUSTOM_KEY), created])) {
    throw new Error('Browser storage is full. Delete a movie or use a smaller poster.');
  }
  return created;
};

export const deleteMovie = (id) => {
  const custom = read(CUSTOM_KEY);
  if (custom.some((m) => m.id === id)) {
    write(CUSTOM_KEY, custom.filter((m) => m.id !== id));
  } else {
    write(DELETED_KEY, [...new Set([...read(DELETED_KEY), id])]);
  }
};

// Back to the movies listed in src/data/movies.js
export const resetCatalog = () => {
  try {
    localStorage.removeItem(CUSTOM_KEY);
    localStorage.removeItem(DELETED_KEY);
  } catch { /* ignore */ }
};

// Downloads the current catalog as a ready-to-paste src/data/movies.js
export const exportCatalog = () => {
  const body = `// Exported from the Admin panel\nconst movies = ${JSON.stringify(getMovies(), null, 2)};\n\nexport default movies;\n`;
  const url = URL.createObjectURL(new Blob([body], { type: 'text/javascript' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'movies.js';
  a.click();
  URL.revokeObjectURL(url);
};
