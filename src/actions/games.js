module.exports = {
  createGame: function(options) {
    var Game = Parse.Object.extend("Game");
    var newGame = new Game();
    var gameState = {
      moves: [],
      status: options.status
    };
    gameState[options.myColor + '_player'] = Parse.User.current();
    newGame.set(gameState).save().then(function (obj) {
      window.location = "/?game=" + obj.id
    });
  }
}
