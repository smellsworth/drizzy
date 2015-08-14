var rita = require('rita');
var lexicon = new rita.RiLexicon();
var fs = require('fs');
var r = rita.RiTa;
var _ = require('lodash');
var Promise = require( 'promise' );
var dLex = require('./lexicon.js');

// helper added to all arrays for picking a random element
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function getRhyme( word ) {
  var a = lexicon.rhymes(word);

  if ( a.length === 0 ) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    var stress = r.getStresses(a[i]);
    if (r.getStresses(word) === stress) {
      return a[i];
    }
  }
}

function rhymeSayer (word) {
  return new Promise( function( fulfill, reject ) {
    while( true ) {
      var rhyme = getRhyme( word );
      process.stdout.write( '.' );
      if ( false === rhyme ) {
        var a = [];
        while ( a.length === 0 ) {
          word = lexicon.randomWord();
          a = lexicon.rhymes( word );
          process.stdout.write( '|' );
        }
      } else {
        fulfill( [word,rhyme] );
        break;
      }
    }
  } );
}


function catchUp (word) {
  return new Promise( function( fulfill, reject ) {
    rhymeSayer( word ).done( function( pair ) {
      word = pair[0];
      var rhyme1 = pair[1];
      rhymeSayer( rhyme1 ).done( function( pair2 ) {
        rhyme1 = pair2[0];
        var rhyme2 = pair2[1];

        var line1 = 'Fuck being on some chill ' + rhyme1;
        var line2 = 'We go 0 to 100 niggas, real ' + rhyme2;
        fulfill( line1 + "\n" + line2 );
      } );
    } );
  } );
}



for (var x = 0; x < 10; x++) {
  catchUp( dLex.pick().word ).done( function( statement ) {
    console.log( statement );
  } );
}
