const search = new URLSearchParams(window.location.search);
const value = search.get("websiteURL");
var returnStat;

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