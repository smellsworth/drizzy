/*
The Lexer is used to add new words to the DrizzyAI lexicon.
It will grab the file, create a word array, de-dupe that array,
and it add it to the overall lexicon.

From command line, run 'node lexer.js <txt file name>'

*/
var rita = require('rita');
var r = rita.RiTa;
var fs = require('fs');
var _ = require('lodash');
var dLex = require('./lexicon.js');

// grab text file and turn into a string
var txt = fs.readFileSync(process.argv[2]).toString();
var numBefore = dLex.length;
var strang;

// function for creating lexer object
function Lexer(word) {
  this.word = word;
  this.pos = r.getPosTags(word);
  this.phoneme = r.getPhonemes(word);
  this.stress = r.getStresses(word);
}

// tagging words and creating arrays
function tagger(text) {
  // Turn text file string into tokens and remove duplicates
  var text = _.uniq(r.tokenize(text));
  for (var i = 0; i < text.length; i++) {
    var token = new Lexer(text[i]);
    dLex.push(token);
  }
  //de-dupe the new lexicon
  dLex = _.uniq(dLex);
  if (numBefore < dLex.length) {
    var numAfter = dLex.length;
    var numAdded = dLex.length - numBefore;
    console.log('\n\n\nYou started with ' +
    numBefore + ' words, and now you have ' + numAfter + '.\n'
    + '\nThat means you added ' + numAdded + ' words to the lexicon!');
  }
  //turn lexicon into a string for writing to file
  strang = JSON.stringify(dLex, null, '\t');
  // adding module.exports to the front of the file for loading
  strang = 'module.exports = ' + strang + ";";
  return strang;
}


// run the function
tagger(txt);

// append the new words to the drake lexicon
fs.writeFile('./lexicon.js', strang, function (err) {
  if (err) throw err;
  console.log('\n\n\nIT WORKED, I think! Check the file.');
});
