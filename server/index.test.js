import Database from 'better-sqlite3';
import assert from 'assert';

// Setup in-memory DB for testing
const db = new Database(':memory:');

db.prepare(`CREATE TABLE coordinates (
  id INTEGER PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE history (
  robot_id INTEGER NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  direction TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (robot_id) REFERENCES coordinates(id)
)`).run();

// Insert initial robot
const insertRobot = db.prepare('INSERT INTO coordinates (id, x, y, direction) VALUES (1, 0, 0, "up")');
insertRobot.run();

// Test move
const moveStmt = db.prepare('UPDATE coordinates SET x = ?, y = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1');
moveStmt.run(2, 3);
const current = db.prepare('SELECT direction FROM coordinates WHERE id = 1').get();
db.prepare('INSERT INTO history (robot_id, x, y, direction) VALUES (1, ?, ?, ?)').run(2, 3, current.direction);

// Test rotate
const rotateStmt = db.prepare('UPDATE coordinates SET direction = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1');
rotateStmt.run('right');
const pos = db.prepare('SELECT x, y FROM coordinates WHERE id = 1').get();
db.prepare('INSERT INTO history (robot_id, x, y, direction) VALUES (1, ?, ?, ?)').run(pos.x, pos.y, 'right');

// Check history
const history = db.prepare('SELECT * FROM history ORDER BY timestamp ASC').all();
assert.strictEqual(history.length, 2);
assert.deepStrictEqual(history[0], { robot_id: 1, x: 2, y: 3, direction: 'up', timestamp: history[0].timestamp });
assert.deepStrictEqual(history[1], { robot_id: 1, x: 2, y: 3, direction: 'right', timestamp: history[1].timestamp });

console.log('All tests passed!');
