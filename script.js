$(document).ready(function() {
    $('#numResults').keypress(function(e) {
        if(e.keyCode == 13) {
            $('#goBtn').click();
        }
    })
})

function run() {
    document.getElementById('output').innerHTML = '';

    var artist = document.getElementById('artist').value;
    var numResults = document.getElementById('numResults').value;

    if(artist == '') {
        console.log('artist undef');
        document.getElementById('errorMessage').innerHTML = "Please enter an artist before pressing go.";
        return 0;
    }
    if(numResults == '') {
        console.log('numRes undef');
        document.getElementById('errorMessage').innerHTML = "Please enter the number of results desired before pressing go.";
        return 0;
    }
    if(isNaN(numResults) || Number(numResults) <= 1 || !Number.isInteger(Number(numResults))) {
        document.getElementById('errorMessage').innerHTML = "Please enter a positive integer for the number of results desired before pressing go.";
        return 0;
    }

    document.getElementById("loadingMessage").innerHTML = "Waiting for results";

    $.ajax({
        url: 'http://itunes.apple.com/search?term=' + artist + "&limit=" + numResults,
        jsonp: "callback",
        dataType: "jsonp",
        success: process
    });
}

function process(data) {
    console.log(data)

    var songs = data.results;

    document.getElementById('loadingMessage').innerHTML = '';


    if(songs.length == 0) {
        document.getElementById('errorMessage').innerHTML = 'No Songs Returned. Either iTunes doesn\'t have the artist you are looking for or there is a typo in your query parameters.';
        return 0;
    }

    document.getElementById('artist').value = '';
    document.getElementById('numResults').value = '';


    var o = "";

    // dict where keys are the name of the field that will be displayed at the head of the table, the values are the name of the parameter in the results object
    var cols = {"Artist Name":"artistName","Song Name":"trackName","Audio Preview":"previewUrl","Album Name":"collectionName","Album Art":"artworkUrl60"};
    o += "<tr>";
    for(let colName of Object.keys(cols)) {
        o += "<th>" + colName + "</th>";
    }
    o += "</tr>";

    for(var p=0;p<songs.length;p++) {
        o += "<tr>";
        for(let colParam of Object.values(cols)) {
            if(colParam == 'artworkUrl60') {
                o += "<td><img src=" + songs[p][colParam] + "></td>";
            }
            else if(colParam == 'previewUrl') {
                o += "<td><audio controls><source src=" + songs[p][colParam] + ">Your browser does not support the audio element</audio></td>";
            }
            else {
                o += "<td>" + songs[p][colParam] + "</td>";
            }
        }
        o += "</tr>";
    }

    var table = document.getElementById("output");
    table.innerHTML = o;
    table.style.display = "block";

}