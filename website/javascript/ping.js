const search = new URLSearchParams(window.location.search);
const value = search.get("websiteURL");
var returnStat;


//creating an instance of the database that we can point to
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/mydb.db', err => {
    if(err){
        return console.error(err.message);
    }
    console.log('Connected to database');
});

function pingSite2() {
    $.ajax({
        url: "https://" + value + "/",
        method: "GET",
        dataType: "jsonp",
        async: false,
        crossDomain: true,
        headers: {
          accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        complete: function (xhr, textStatus) {
            returnStat = xhr.status
            document.getElementById("value").innerHTML = value + " returned a status code of " + returnStat + " meaning it is up!"
            write(1, value, 3/2/1, up)
        }
    });
    if(returnStat != null){
        testPrint(returnStat)
    }else{
        testPrint(null)
    }
}

function testPrint(returnStat) {
    if(returnStat == null){
        document.getElementById("value").innerHTML = "The server is currently unreachable. Please double check your search or try again later."
    }else{
        console.log(returnStat)
    }
}


//Where we are trying to write to the database
function write(id, siteName, recentDate, totalPings){
    db.run(`INSERT INTO test (id, siteName, recentDate, totalPings) VALUES (?, ?, ?, ?)`, [id, siteName, recentDate, totalPings], (err) => {
        if (err) {
          return console.error(err.message);
        }
        res.redirect('/');
      });
}