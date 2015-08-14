var rita = require('rita');
var lexicon = new rita.RiLexicon();
var fs = require('fs');
var r = rita.RiTa;
var _ = require('lodash');
var Promise = require( 'promise' );
var dLex = require('./lexicon.js');
var rm = new rita.RiMarkov(3, true, false);
var text = fs.readFileSync('./lyrics/lyrics-dump.txt').toString();

rm.useSmoothing(true);
rm.loadText(text);

var sentences = _.unescape(rm.generateSentences(20));

console.log(sentences);
