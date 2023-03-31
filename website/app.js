const express = require("express");
const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database(":memory:");
const db = new sqlite3.Database("myDatabase.sqlite");

const { URL } = require("url");

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Main (id INTEGER PRIMARY KEY, website TEXT, status TEXT, time TEXT)");
});

app.get("/check-status", (req, res) => {
  let website = req.query.website;

  try {
    const url = new URL(website);
    website = url.hostname;
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  require("dns").resolve(website, (err) => {
    let status = "down";

    if (!err) {
      status = "online";
    }

    let temp = new Date();
    let time = temp.toLocaleTimeString();
    db.run("INSERT INTO Main (website, status, time) VALUES (?, ?, ?)", [website, status, time], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ website, status, time });
    });
  });
});


app.get("/get-status", (req, res) => {
  db.get("SELECT *   FROM Main ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

app.get("/get-history", (req, res) => {
  db.all("SELECT * FROM Main ORDER BY id DESC LIMIT 5", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/get-stats", (req, res) => {
  let website = req.query.website;
  db.all("SELECT id FROM Main WHERE website = '" + website + "'", [], (err, rows) => {
    if(err){
      console.log(err);
      return res.status(500).json({error: err.message});
    }
    res.json(rows);
  })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('http://localhost:3000')
});