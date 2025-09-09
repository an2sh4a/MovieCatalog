const moviesList = document.getElementById('moviesList');
const addForm = document.getElementById('addForm');

async function fetchMovies(){
  const res = await fetch('/movies');
  const data = await res.json();
  renderMovies(data);
}

function renderMovies(movies) {
  moviesList.innerHTML = '';
  if (!movies.length) {
    moviesList.innerHTML = '<p class="text-gray-500">No movies yet.</p>';
    return;
  }

  movies.forEach(m => {
    const div = document.createElement('div');
    div.className = 'p-3 border rounded flex justify-between items-center';
    div.innerHTML = `
      <div>
        <div class="font-semibold">${escapeHtml(m.title)} <span class="text-sm text-gray-400">(${m.release_year || '—'})</span></div>
        <div class="text-sm text-gray-600">${escapeHtml(m.director || 'Unknown')} • ${escapeHtml(m.genre || '—')} • Rating: ${m.rating ?? '—'}</div>
      </div>
      <div class="space-x-2">
        <button class="edit-btn px-3 py-1 border rounded" data-id="${m.id}">Edit</button>
        <button class="delete-btn px-3 py-1 bg-red-600 text-white rounded" data-id="${m.id}">Delete</button>
      </div>
    `;
    moviesList.appendChild(div);
  });

  document.querySelectorAll('.delete-btn').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Delete this movie?')) return;
      await fetch('/movies/' + id, { method: 'DELETE' });
      fetchMovies();
    });
  });

  document.querySelectorAll('.edit-btn').forEach(b => {
    b.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const title = prompt('New title (leave blank to keep current)');
      if (title === null) return;
      const director = prompt('Director (leave blank to keep current)');
      const genre = prompt('Genre (leave blank to keep current)');
      const release_year = prompt('Year (leave blank to keep current)');
      const rating = prompt('Rating (e.g. 8.5)');

      const payload = {};
      if (title) payload.title = title;
      if (director) payload.director = director;
      if (genre) payload.genre = genre;
      if (release_year) payload.release_year = release_year ? Number(release_year) : undefined;
      if (rating) payload.rating = rating ? Number(rating) : undefined;

      if (Object.keys(payload).length === 0) {
        alert('No changes made');
        return;
      }

      await fetch('/movies/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      fetchMovies();
    });
  });
}

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(addForm);
  const payload = {
    title: fd.get('title'),
    director: fd.get('director') || null,
    genre: fd.get('genre') || null,
    release_year: fd.get('release_year') ? Number(fd.get('release_year')) : null,
    rating: fd.get('rating') ? Number(fd.get('rating')) : null
  };
  const res = await fetch('/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    addForm.reset();
    fetchMovies();
  } else {
    const err = await res.json();
    alert('Error: ' + (err.error || 'unknown'));
  }
});

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

fetchMovies();
