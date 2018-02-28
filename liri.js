//worked with Alex Cryderman
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var mode = process.argv[2];
var arg = process.argv;
var argName = "";
var fs = require("fs");
for (var i = 3; i < arg.length; i++) {
    if (i > 3 && i < arg.length) {
        argName = argName + "+" + arg[i];
    }
    else {
        argName += arg[i];
    }
}
function go() {
    switch (mode) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}
function myTweets() {
    var params = { screen_name: 'SeanGerbich' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < 3; i++) {
                console.log(tweets[i].text);
            }
        }
    });
}
function spotifyThis() {
    if (argName == "") {
        argName = "The Sign Ace of Base";
    }
    spotify
        .search({ type: 'track', query: argName })
        .then(function (response) {
            // console.log(response.tracks.items[0]);
            console.log(response.tracks.items[0].artists[0].name);
            console.log(response.tracks.items[0].name);
            console.log(response.tracks.items[0].external_urls);
            console.log(response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });

}
function movieThis() {
    if (argName == "") {
        argName = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + argName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMBD Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatos Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        
        var dataArr = data.split(",");
        mode = dataArr[0];
        argName = dataArr[1];
    });
    go();
}

go();