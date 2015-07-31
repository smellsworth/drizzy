var rita = require('rita');
var lexicon = new rita.RiLexicon();
var fs = require('fs');
var r = rita.RiTa;
var _ = require('lodash');

// helper added to all arrays for picking a random element
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function rhymeSayer (word) {
  var a = lexicon.rhymes(word);
  for (var i = 0; i < a.length; i++) {
    var stress = r.getStresses(a[i]);
    if (r.getStresses(word) === stress) {
      return a[i];
    }
  }
}


function catchUp (word) {
  var rhyme1 = rhymeSayer(word);
  var rhyme2 = rhymeSayer(rhyme1);
  var line1 = 'Fuck being on some chill ' + rhyme1;
  var line2 = 'We go 0 to 100 niggas, real ' + rhyme2;
  return line1 + "\n" + line2;
}
for (var x = 0; x < 10; x++) {
  console.log(catchUp(lexicon.randomWord()));
}
