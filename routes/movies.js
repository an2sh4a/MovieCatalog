const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  try {
    const [result] = await pool.execute(
      'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',
      [title, director || null, genre || null, release_year || null, rating || null]
    );

    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  try {
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (director !== undefined) { fields.push('director = ?'); values.push(director); }
    if (genre !== undefined) { fields.push('genre = ?'); values.push(genre); }
    if (release_year !== undefined) { fields.push('release_year = ?'); values.push(release_year); }
    if (rating !== undefined) { fields.push('rating = ?'); values.push(rating); }

    if (fields.length === 0) return res.status(400).json({ error: 'no fields to update' });

    values.push(id);
    const sql = `UPDATE movies SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'movie not found' });

    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'movie not found' });
    res.json({ message: 'deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
