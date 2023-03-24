const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/mydb.db', err => {
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to database');
});

db.all('SELECT * FROM test', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.send(rows);
  });

  console.log(rows)


// db.run(`INSERT INTO test (id, siteName, recentDate, totalPings) VALUES (?, ?, ?, ?)`, [id, siteName, recentDate, totalPings], (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.redirect('/');
//   });

