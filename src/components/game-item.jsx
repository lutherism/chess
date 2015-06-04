var React = require('react');
var chessEngine = require('../util/chessEngine.js');
var Board = require('./chess-board.jsx');

var GameItem = React.createClass({
  getInitialState: function() {
    return {
      hover: false,
      board: chessEngine(this.props.game.get('moves') || [])
    };
  },
  render: function() {
    var style = {
      position: "relative"
    };
    if (!this.props.game.get('white_player') ||
      !this.props.game.get('black_player')) return <li>New Game</li>;

    if (page.data.currentGame.id === this.props.game.id) style.backgroundColor = "red";
    return (
      <li className="game-item"
        style={style}
        onMouseOver={this.onHover}
        onMouseOut={this.onLeave}>
        {this.state.hover ?
          this.renderFlyoverBoard() : null}
        <a href={"?game=" + this.props.game.id}>
          {this.props.game.get('white_player').get('username') + ' v ' + this.props.game.get('black_player').get('username')}
        </a>
      </li>
    )
  },
  onHover: function(e) {
    this.setState({
      hover: true
    });
  },
  onLeave: function(e) {
    this.setState({
      hover: false
    });
  },
  renderFlyoverBoard: function() {
    return (
      <div style={{
          position: "absolute",
          width: 130,
          height: 130,
          bottom: 25,
          zIndex: 10,
          left: 0
        }}>
        <Board
          board={this.state.board}
          selectedCell={null}
          onBoardClick={function(){}}
          onClick={function(){}}
          remainingCastles={chessEngine.remainingCastles(this.props.game.get('moves'))} />
      </div>
    )
  }
});

module.exports = GameItem;
