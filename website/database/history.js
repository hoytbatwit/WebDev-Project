const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database('historydb.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the historydb.db SQLite database.');
});

db.run('CREATE TABLE IF NOT EXISTS emp (empid INTEGER PRIMARY KEY, empname TEXT, email TEXT)', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/history.html');
});

app.post('/addEntry', (req, res) => {
  const { entid, entname} = req.body;
  db.run(`INSERT INTO ent (entid, entname) VALUES (?, ?)`, [entid, entname], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

// Add this code after the /addEmployee endpoint
app.get('/entries', (req, res) => {
    db.all('SELECT * FROM emp', [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(rows);
    });
  });