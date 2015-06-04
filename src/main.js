var ChessGame = require('./components/chess-game.jsx');
var Signup = require('./components/signup.jsx')
var React = require('react');
var uuid = require('node-uuid');
var url = require('url');
var GameActions = require('./actions/games.js');

Parse.initialize("pEMmmQSKAsdP4JCRGew3AOtrbcEY2gU3n8cIWZLu",
  "VJOgJjwApqS8rBpH0umb9uyRYU2m8QDSqJUepS9d");

window.page = {data: {}};

var location = url.parse(window.location.href, true);

if (!Parse.User.current()) {
  React.render(React.createElement(Signup, {
    onSubmit: function(userData, e) {
      e.preventDefault();
      if (userData.isSignup) {
        delete userData.isSignup;
        var user = new Parse.User();
        user.signUp(userData).then(function() {
          window.location = "/";
        })
      } else {
        Parse.User.logIn(userData.username, userData.password).then(function(u) {
          window.location = "/";
        })
      }
    }
  }), document.body)
} else if (!location.query.game) {
  GameActions.createGame({
    myColor: "white",
    status: "open"
  });
} else {
  var Game = Parse.Object.extend("Game");
  var gn = new Game({id: location.query.game});
  page.data.currentGame = gn;
  gn.fetch().then(function(game) {
    if (!game.get("black_player") &&
      game.get("white_player") !== Parse.User.current()) {
      gn.save({
        black_player: Parse.User.current(),
        status: "active"
      });
    }
    //game.get('black_player').fetch();
    //game.get('white_player').fetch();
    React.render(React.createElement(ChessGame, {
      parseGame: game,
      initialMoves: game.get('moves')
    }), document.body);
  });
}
