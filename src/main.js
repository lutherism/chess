var ChessGame = require('./components/chess-game.jsx');
var React = require('react');
var uuid = require('node-uuid');
var url = require('url');

Parse.initialize("pEMmmQSKAsdP4JCRGew3AOtrbcEY2gU3n8cIWZLu",
  "VJOgJjwApqS8rBpH0umb9uyRYU2m8QDSqJUepS9d");

var location = url.parse(window.location.href, true);

if (!location.query.game) {
  var Game = Parse.Object.extend("Game");
  var newGame = new Game();
  newGame.save({
    moves: []
  }).then(function (obj) {
    window.location = "/?game=" + obj.id
  });
} else {
  var Game = Parse.Object.extend("Game");
  var gn = new Game({id: location.query.game});
  gn.fetch().then(function() {
    React.render(React.createElement(ChessGame, {
      parseGame: gn,
      initialMoves: gn.get('moves')
    }), document.body);
  });
}
