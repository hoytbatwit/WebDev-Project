document.addEventListener("DOMContentLoaded", () => {
  const checkForm = document.getElementById("check-form");
  const statusText = document.getElementById("status-text");
  const historyTable = document.getElementById("history-table");

  if (checkForm) {
    checkForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      var website = document.getElementById("website").value;  
      website = "https://" + website;

      try {
        const response = await fetch(`/check-status?website=${encodeURIComponent(website)}`);
        const data = await response.json();

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
  } else if (statusText) {
    (async () => {
      const data = JSON.parse(localStorage.getItem("lastStatus"));

      if (data) {
        statusText.textContent = `The website ${data.website} is ${data.status}.`;
      } else {
        statusText.textContent = "Error fetching website status.";
      }

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