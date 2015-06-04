var React = require('react');
var chessEngine = require('../util/chessEngine');
var ChessCell = require('./chess-cell.jsx');
var _ = require('lodash');
var Runner = require('./runner.jsx');
var Board = require('./chess-board.jsx');

var chessGame = React.createClass({
  getInitialState: function() {
    return {
      board: chessEngine(this.props.initialMoves || []),
      moves: this.props.initialMoves,
      selectedCell: null
    };
  },
  componentWillMount: function() {
    this.props.parseGame.on("change", this.handleGameSync);
  },
  componentWillUnmount: function() {
    this.props.parseGame.off("change", this.handleGameSync);
  },/*
  componentWillMount: function() {
    this._windowListener = window.addEventListener('resize', this.handleResize, false);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize, false);
  },
  handleResize: function(e) {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth
    });
  },*/
  handleGameSync: function() {
    this.setState({
      moves: this.props.parseGame.get("moves"),
      board: chessEngine(this.props.parseGame.get("moves"))
    });
  },
  render: function() {
    var board = this.state.board;//chessEngine(this.state.moves);
    var remainingCastles = chessEngine.remainingCastles(this.state.moves);
    var check = chessEngine.check(board);
    return (
      <div>
        <Board board={board}
          selectedCell={this.state.selectedCell}
          onBoardClick={this.boardClick}
          onClick={this.cellSelect}
          remainingCastles={remainingCastles}/>
        {check ?
          <h3>
            check.
          </h3> : null}
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%'
          }} >
          <Runner
            onReset={this.handleReset}
            moves={this.state.moves}/>
        </div>
      </div>
    );
  },

  boardClick: function(e) {
    this.setState({selectedCell: null});
  },
  handleReset: function() {
    var newBoard = chessEngine([]);
    this.setState({
      moves: [],
      board: newBoard
    });
  },
  cellSelect: function(pos, cell, e) {
    var turn = "W";
    if (this.state.moves.length % 2) turn = "B";
    if (!this.state.selectedCell && turn === cell[0]) {
      this.setState({
        selectedCell: pos
      });
      e.stopPropagation();
    } else {
      try {
        var newMoves = this.state.moves.concat([[this.state.selectedCell, pos]]);
        var newBoard = chessEngine(newMoves);
        if (newBoard) {
          e.stopPropagation();
          this.props.parseGame.save({moves: newMoves});
          this.setState({
            board: newBoard,
            moves: newMoves,
            selectedCell: null
          });
        }
      } catch (err) {}
    }
  }
});

module.exports = chessGame;
