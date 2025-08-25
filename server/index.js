

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';


const app = express();
const db = new Database('robot.db');
app.use(cors());
app.use(express.json());


// Create table for single robot (id always 1)
const createTable = `CREATE TABLE IF NOT EXISTS coordinates (
  id INTEGER PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;
db.prepare(createTable).run();

// Create history table with robot_id as foreign key
const createHistoryTable = `CREATE TABLE IF NOT EXISTS history (
  robot_id INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (robot_id) REFERENCES coordinates(id)
)`;
db.prepare(createHistoryTable).run();

// Ensure row exists
const ensureRow = () => {
  const row = db.prepare('SELECT * FROM coordinates WHERE id = 1').get();
  if (!row) {
    db.prepare("INSERT INTO coordinates (id, x, y, direction) VALUES (1, 0, 0, 'up')").run();
  }
};
ensureRow();

// Rotate endpoint: update direction for id=1
app.post('/api/rotate', (req, res) => {
  const { direction } = req.body;
  if (typeof direction !== 'string') {
    return res.status(400).json({ error: 'Invalid direction' });
  }
  ensureRow();
  db.prepare('UPDATE coordinates SET direction = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').run(direction);
  // Insert into history
  const current = db.prepare('SELECT x, y FROM coordinates WHERE id = 1').get();
  db.prepare('INSERT INTO history (robot_id, x, y, direction) VALUES (1, ?, ?, ?)').run(current.x, current.y, direction);
  res.json({ success: true });
});

// Move endpoint: update x/y for id=1
app.post('/api/move', (req, res) => {
  const { x, y } = req.body;
  if (typeof x !== 'number' || typeof y !== 'number') {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }
  ensureRow();
  // Get current direction
  const current = db.prepare('SELECT direction FROM coordinates WHERE id = 1').get();
  db.prepare('UPDATE coordinates SET x = ?, y = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').run(x, y);
  // Insert into history
  db.prepare('INSERT INTO history (robot_id, x, y, direction) VALUES (1, ?, ?, ?)').run(x, y, current.direction);
  res.json({ success: true });
});
// Get history
app.get('/api/history', (req, res) => {
  const rows = db.prepare('SELECT * FROM history ORDER BY timestamp ASC').all();
  res.json(rows);
});

// Report endpoint: get current coordinates for id=1
app.get('/api/report', (req, res) => {
  ensureRow();
  const row = db.prepare('SELECT * FROM coordinates WHERE id = 1').get();
  res.json(row);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
