const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../frontend')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

const db = new sqlite3.Database('./groceries.db', (err) => {
  if (err) {
    console.error('Failed to open database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
  initializeDatabase();
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS groceries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      category TEXT NOT NULL
    )
  `);
}

app.get('/api/groceries', (req, res) => {
  db.all('SELECT * FROM groceries', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
});

app.post('/api/groceries', (req, res) => {
  const { name, quantity, category } = req.body;
  if (!name || !quantity || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.run(
    'INSERT INTO groceries (name, quantity, category) VALUES (?, ?, ?)',
    [name, quantity, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, quantity, category });
    }
  );
});

app.put('/api/groceries/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, category } = req.body;
  if (!name || !quantity || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  db.run(
    'UPDATE groceries SET name = ?, quantity = ?, category = ? WHERE id = ?',
    [name, quantity, category, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Grocery not found' });
      res.status(200).json({ message: 'Grocery updated', id, name, quantity, category });
    }
  );
});

app.delete('/api/groceries/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM groceries WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Grocery not found' });
    res.status(200).json({ message: 'Grocery deleted', id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
