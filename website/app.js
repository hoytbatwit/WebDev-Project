//Code written by our group and Professor Othman

//Initializing all the packages we use 
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("myDatabase.sqlite");
const ping = require("ping");
const { URL } = require("url");
const app = express();
app.use(express.static(__dirname));
app.use(express.json());


//If there is no database present one is created
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Main (id INTEGER PRIMARY KEY, website TEXT, status TEXT, time TEXT)");
});

//function to check the status of a site
app.get("/check-status", (req, res) => {
  //get the website that was attached to the request
  let website = req.query.website;

  //declare the website as a URL
  try {
    const url = new URL(website);
    website = url.hostname;
  } catch (err) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  //first we check to make sure that the URL is valid
  require("dns").resolve(website, (err) => {
    let status = "down";

    //configuration for the ping
    var config = {
      timeout: 4
    };
    //if there is no error meaning the url is valid we ping the site
    if (!err) {
      //call the ping
       ping.sys.probe(website, function(isAlive){
        //if the boolean isAlive is true then the site is up and we can tell the user that
        if(isAlive){
          status = "alive";
          //get current time to store in database
          let temp = new Date();
          let time = temp.toLocaleTimeString();
          //push data to database
          db.run("INSERT INTO Main (website, status, time) VALUES (?, ?, ?)", [website, status, time], (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ website, status, time });
          });
          //if the boolean isAlive is false then the site is down and we tell the user that
        }else{
          status = "down";
          //get current time to store in database
          let temp = new Date();
          let time = temp.toLocaleTimeString();
          //push data to database
          db.run("INSERT INTO Main (website, status, time) VALUES (?, ?, ?)", [website, status, time], (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ website, status, time });
          });
        }
      }, config);
    }
  });
});

//Gets the status of the most recent database entry to display to the user since that was the status of their last search
app.get("/get-status", (req, res) => {
  db.get("SELECT * FROM Main ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

//Return 8 rows of the database to display to the user as their history
app.get("/get-history", (req, res) => {
  db.all("SELECT * FROM Main ORDER BY id DESC LIMIT 8", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

//Will return all instances of a certain site in the database so that the amount of times it has been search can be displayed to the user.
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

//The port that the service runs on locally and the link to click on
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('http://localhost:3000')
});