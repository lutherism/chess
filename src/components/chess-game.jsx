var React = require('react');
var chessEngine = require('../util/chessEngine');
var ChessCell = require('./chess-cell.jsx');
var _ = require('lodash');

var chessGame = React.createClass({
  getInitialState: function() {
    return {
      board: chessEngine(this.props.initialMoves || []),
      moves: this.props.initialMoves,
      selectedCell: null,
      hoveredCell: null,
    };
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
  render: function() {
    var board = this.state.board;//chessEngine(this.state.moves);
    var remainingCastles = chessEngine.remainingCastles(this.state.moves);
    var turn;
    turn = this.state.moves.length % 2 ? "Black" : "White";
    var check = chessEngine.check(board);
    return (
      <div onClick={this.boardClick}>
        <h1>
          {"It's " + turn + "'s turn."}
        </h1>
        <div className="board">
        {board.map(function(row, x) {
          return (
            <div key={x} className="row">
            {row.map(function(cell, y) {
              return (
                <ChessCell
                  key={'' + x + y}
                  cell={cell}
                  pos={[x, y]}
                  hover={
                      this.state.hoverCell &&
                      this.state.hoverCell[0] === x &&
                      this.state.hoverCell[1] === y
                    }
                  attacked={this.state.selectedCell &&
                    chessEngine.availMoves(board, this.state.selectedCell, remainingCastles)
                      .map(chessEngine.posToReadable)
                      .indexOf(chessEngine.posToReadable([x, y])) > -1}
                  hoverAttacked={this.state.hoverCell &&
                    chessEngine.availMoves(board, this.state.hoverCell, remainingCastles)
                      .map(chessEngine.posToReadable)
                      .indexOf(chessEngine.posToReadable([x, y])) > -1}
                  selected={this.state.selectedCell &&
                    this.state.selectedCell[0] === x &&
                    this.state.selectedCell[1] === y}
                  dark={(y%2) + (x%2) === 1}
                  onMouseOver={this.handleHover}
                  onMouseOut={this.handleMouseLeave}
                  onClick={this.cellClick} />
              );
            }.bind(this))}
          </div>
        );
      }.bind(this))}
    </div>
      {check ?
        <h3>
          check.
        </h3> : null}
      <a onClick={this.handleReset}>Reset</a>
      <div style={{display:"inline"}}>
        <ul>
          {this.state.moves.map(function(m, i) {
            return (
              <li>
                <label>
                  {Math.ceil((i+1) / 2) + '. '}
                </label>
                <span>
                  {chessEngine.moveToReadable(m)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <a href="https://github.com/lutherism/chess">
        Github Page
      </a>
      </div>
    );
  },
  handleHover: function(pos, cell, e) {
    this.setState({hoverCell: pos});
  },
  handleMouseLeave: function(pos, cell, e) {
    if (this.state.hoverCell === pos) this.setState({hoverCell: null});
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
  cellClick: function(pos, cell, e) {
    var turn = "W";
    if (this.state.moves.length % 2) turn = "B";
    if (!this.state.selectedCell && turn === cell[0]) {
      this.setState({
        selectedCell: pos
      });
      e.stopPropagation();
    } else {
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
    }
  }
});

module.exports = chessGame;
