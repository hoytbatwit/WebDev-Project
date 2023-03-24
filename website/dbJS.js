const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('mydb.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the mydb.db SQLite database.');
});

db.run('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, siteName TEXT, recentDate TEXT, totalPings INTEGER)', (err) => {
    if (err) {
      return console.error(err.message);
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + './database/dbHTML.html');
});

app.post('/addInfo', (req, res) => {
    const { id, siteName, recentDate, totalPings } = req.body;
    db.run(`INSERT INTO test (id, siteName, recentDate, totalPings) VALUES (?, ?, ?, ?)`, [id, siteName, recentDate, totalPings], (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/');
    });
});

app.get('/userData', (req, res) => {
    db.all('SELECT * FROM test', [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.send(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});