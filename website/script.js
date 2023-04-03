//Code written by our group and Professor Othman
document.addEventListener("DOMContentLoaded", () => {
  //When one of these pages are loaded a different set of events happen
  const checkForm = document.getElementById("check-form");
  const statusText = document.getElementById("status-text");
  const historyTable = document.getElementById("history-table");

  //if the check form page is loaded
  if (checkForm) {
    checkForm.addEventListener("submit", async (e) => {
      //get the website the user entered and append https:// to it
      e.preventDefault();
      var website = document.getElementById("website").value;  
      website = "https://" + website;

      //call the app.js method to check the status of the site
      try {
        const response = await fetch(`/check-status?website=${encodeURIComponent(website)}`);
        const data = await response.json();

        //push the response to the webpage
        if (data.status) {
          localStorage.setItem("lastStatus", JSON.stringify(data));
          location.href = "Website_Search.html";
        } else {
          statusText.textContent = "Error checking website status.";
        }
      } catch (err) {
        console.error(err);
      }
    });
    //when the page that displays the status of a site is loaded these events happen
  } else if (statusText) {
    (async () => {
      //get the status that was stored in local memory form the check status
      const data = JSON.parse(localStorage.getItem("lastStatus"));

      //push data to the site
      if (data) {
        statusText.textContent = `The website ${data.website} is ${data.status}.`;
      } else {
        statusText.textContent = "Error fetching website status.";
      }

      //Tells the user the number of times that the site they search has been searched
      var i = 0;
      const responseStats = await fetch(`/get-stats?website=${encodeURIComponent(data.website)}`);
      const dataStats = await responseStats.json();
      if(dataStats && dataStats.length){
        dataStats.forEach((record) => {
          i = i + 1;
        })
      }
      document.getElementById("stats").innerHTML = "This website has been searched "+ i + " times recently!"
    })();
    //events when the history table is loaded
  } else if (historyTable) {
    (async () => {
      try {
        const response = await fetch("/get-history");
        const data = await response.json();

        if (data && data.length) {
          data.forEach((record) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${record.website}</td><td>${record.status}</td><td>${record.time}</td>`;
            historyTable.querySelector("tbody").appendChild(row);
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }
});