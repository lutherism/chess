var React = require('react');
var gameActions = require('../actions/games.js');
var GameObject = require('../util/gameObject.js');
var CreateGame = require('./create-game.jsx');
var MoveList = require('./move-list.jsx');
var GameItem = require('./game-item.jsx');

var Runner = React.createClass({
  getInitialState: function() {
    return {
      user: Parse.User.current(),
      games: [],
      showMoves: false
    };
  },
  render: function() {
    var turn = this.props.moves.length % 2 ? "B" : "W";
    return (
      <footer>
        <div style={{
            position: "relative",
            height: 25
          }}>
          <button onClick={this.handleLogout}>Log Out</button>
          <button onClick={this.props.onReset}>Reset</button>
          <MoveList moves={this.props.moves} />
          <div style={{display:"inline-block"}}>
            <h1>
              {"It's "}
              {turn === "B" ?
                <span style={{position: "relative", display:"inline-block", width:24, height:24}} className="piece-icon BQ" /> :
                <span style={{position: "relative", display:"inline-block", width:24, height:24}} className="piece-icon WQ" />}
              {"'s turn."}
            </h1>
          </div>
        </div>
        <div>
          <ul>
            <li>
              <CreateGame onCreate={this.createGame} />
            </li>

            {this.renderFooterItems()}
          </ul>

        </div>

      </footer>
    )
  },
  componentDidMount: function() {
    var blackPlayerQuery = new Parse.Query(GameObject);
    var whitePlayerQuery = new Parse.Query(GameObject);
    var myGamesQuery;
    blackPlayerQuery.equalTo("black_player", this.state.user);
    blackPlayerQuery.notEqualTo("status", "closed");
    whitePlayerQuery.equalTo("white_player", this.state.user);
    whitePlayerQuery.notEqualTo("status", "closed");

    myGamesQuery = Parse.Query.or(blackPlayerQuery, whitePlayerQuery);
    myGamesQuery.include("black_player");
    myGamesQuery.include("white_player");
    myGamesQuery.find({
      success: function(results) {
        this.setState({
          games: results
        });
      }.bind(this),
      error: function() {
        alert("couldn't find your games");
      }
    });
  },
  renderFooterItems: function() {
    return this.state.games.slice(0, 5).map(function(game) {
      return (
        <GameItem game={game} />
      )
    });
  },
  createGame: function(opts, e) {
    gameActions.createGame(opts);
  },
  handleLogout: function() {
    Parse.User.logOut().then(function() {
      window.location = "/";
    });
  }
});

module.exports = Runner;
