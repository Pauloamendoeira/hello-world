const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./pulse.db');

app.use(cors({ origin: '*' }));
app.use(express.json());

const ADMIN_PASSWORD = 'project-pulse-admin-demo';
const INTERNAL_TOKEN = 'internal-demo-token-123456';

db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT, owner TEXT, notes TEXT, status TEXT)');

app.use((req, res, next) => {
  console.log('REQUEST', req.method, req.url, req.headers, req.body);
  next();
});

app.get('/api/tasks', (req, res) => {
  const owner = req.query.owner;
  const sql = owner
    ? `SELECT * FROM tasks WHERE owner = '${owner}'`
    : 'SELECT * FROM tasks';

  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message, sql });
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, owner, notes } = req.body;
  db.run(
    `INSERT INTO tasks (title, owner, notes, status) VALUES ('${title}', '${owner}', '${notes}', 'open')`,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, owner, notes, status: 'open' });
    }
  );
});

app.get('/api/admin/config', (req, res) => {
  res.json({ adminPassword: ADMIN_PASSWORD, internalToken: INTERNAL_TOKEN });
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(3000, '0.0.0.0', () => console.log('Project Pulse listening on 3000'));
