var rita = require('rita');
var fs = require('fs');
var lyrics = fs.readFileSync('catchup.txt');
lyrics = lyrics.toString();
var rs = rita.RiString(lyrics);
console.log(rs.features());
