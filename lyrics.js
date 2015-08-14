var dotenv = require('dotenv').config({path: './genius.env'});
var fs = require('fs');
var Genius = require('node-genius');
var geniusClient = new Genius(process.env.GENIUS_ACCESS_TOKEN);
var importKey = process.env.IMPORT_KEYS;
var _ = require('lodash');
var noodle = require('noodlejs');
var geniusSongs = require('./lyrics/genius-songs.js');
var drakeSongs = require('./lyrics/drake-songs.js');
var Promise = require( 'promise' );
var answer = process.argv[2];


// Song object constructs Songs for noodle queries & grabbing lyrics

function Song (songObject) {
  this.url = 'https://api.import.io/store/data/fc252b20-4ca8-4dd3-b7d2-4de3da96bde8/_query?input/webpage/url=' +
    songObject.url + importKey;
  this.type = 'json';
  this.selector = '.results .lyrics';
}

// Get all of Drake's songs - only needed occasionally

function grabSongs (count) {
  geniusClient.getArtistSongs('130', {"page": "1", "per_page": count, "sort": "title"},
  function (error, songs) {
    if (error) {
      console.error("Whops. Something went wrong:", error);
    }
    else {
      var results = JSON.parse(songs);
      fs.writeFileSync('./lyrics/genius-songs1.json', JSON.stringify(results
        , null, '\t'));
    }
  });
}



// filter out non-Drake songs

function filterSongs (list) {
  var filtered = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].primary_artist.id == 130) {
      filtered.push(new Song(list[i]));
    }
  }
  var clean = 'module.exports = ' + JSON.stringify(filtered, null, '\t');
  fs.writeFileSync('./lyrics/drake-songs1.js', clean);
}

// grab the actual lyrics text from genius using import.io api
function importLyrics (queries) {
  noodle.query(queries).then(function (results) {
    var result = results.results;
    var lyrics;
    for (var i = 0; i < result.length; i++) {
      lyrics = lyrics + '\n' + result[i].results[0];
    }
    fs.writeFileSync('./lyrics/lyrics-dump.txt', lyrics);
    });

}

function runIt(command) {
  if (command === 'filter') {
    filterSongs(geniusSongs);
  } else if (command === 'songs') {
    grabSongs(300);
  } else if (command === 'lyrics') {
    importLyrics(drakeSongs);
  }
}


runIt(answer);
noodle.stopCache();
