$(document).ready(function() {
    $('#numResults').keypress(function(e) {
        if(e.keyCode == 13) {
            $('#goBtn').click();
        }
    });
    $('#advanced-wrapper').keypress(function(e) {
        if(e.keyCode == 13) {
            $('#goBtn').click();
        }
    });
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
    if(isNaN(numResults) || Number(numResults) < 1 || !Number.isInteger(Number(numResults))) {
        document.getElementById('errorMessage').innerHTML = "Please enter a positive integer for the number of results desired before pressing go.";
        return 0;
    }

    document.getElementById("loadingMessage").innerHTML = "Waiting for results";
    document.getElementById("errorMessage").innerHTML = "";

    $.ajax({
        url: 'https://itunes.apple.com/search?term=' + artist + "&limit=" + numResults,
        jsonp: "callback",
        dataType: "jsonp",
        success: process
    });
}

function process(data) {
    console.log('data',data);

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
    var cols = {"Song Rank":"songRank","Artist Name":"artistName","Song Name":"trackName","Audio Preview":"previewUrl","Album Name":"collectionName","Album Art":"artworkUrl60"};
    if(document.getElementById('advanced-wrapper').innerHTML != '') {
        console.log('hi');
        cols = {};
        var boxes = document.getElementsByClassName('advCheckbox');
        for(let i=0; i < boxes.length; i++) {
            if(boxes.item(i).checked) {
                cols[boxes.item(i).name] = boxes.item(i).value;
            }
        }
        console.log('cols',cols);
    }

    o += "<tr>";
    for(let colName of Object.keys(cols)) {
        o += "<th>" + colName + "</th>";
    }
    o += "</tr>";

    for(var p=0;p<songs.length;p++) {
        o += "<tr>";
        for(let colParam of Object.values(cols)) {
            if(colParam == "songRank") {
                o += "<td>" + (p+1) + "</td>";
            }
            else if(colParam == 'artworkUrl60') {
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

    $('#advanced-wrapper').hide(duration=400);
    document.getElementById('advanced-wrapper').innerHTML = '';

    var table = document.getElementById("output");
    table.innerHTML = o;
    table.style.display = "block";

}

function showAdvanced() {
    $('#advanced-wrapper').show(duration=400);
    var div = document.getElementById('advanced-wrapper');
    var checks = {'Object Type':'wrapperType','Track Explicitness':'trackExplicitness','Album Explicitness':'collectionExplicitness','Track Price':'trackPrice','Album Price':'collectionPrice','Currency':'currency','Release Date':'releaseDate','Song Length (Milis)':'trackTimeMillis',"Song Rank":"songRank","Artist Name":"artistName","Song Name":"trackName","Audio Preview":"previewUrl","Album Name":"collectionName","Album Art":"artworkUrl60"};
    var o = "";
    o += "<ul class='checkbox-grid'>"
    o += "<label style='display:inline-block;'>Select All<input id='selectAllBtn' type='checkbox' onClick='selectAll()'></label><br>";
    var i = 1
    for(let name of Object.keys(checks)) {
        o += "<li><label style='display:inline-block;'>" + name + "<input class='advCheckbox' type='checkbox' name='" + name + "' value='" + checks[name] + "'></label></li>";
        i+=1;
    }
    o += "<button class='advancedBtn' onclick='hideAdvanced()'>Hide Advanced Parameters</button>";
    o += "</ul>";
    div.innerHTML = o;
}

function selectAll() {
    let boxes = document.getElementsByClassName('advCheckbox');
    for(let i=0; i < boxes.length; i++) {
        if(document.getElementById('selectAllBtn').checked) {
            boxes.item(i).checked = true;
        }
        else {
            boxes.item(i).checked = false;
        }
    }
}

function hideAdvanced() {
    $('#advanced-wrapper').hide(duration=400);
    document.getElementById('advanced-wrapper').innerHTML = '';
}