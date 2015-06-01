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
    var turn;
    turn = this.state.moves.length % 2 ? "W" : "B";
    var check = chessEngine.check(board);
    return (
      <div onClick={this.boardClick}>
        {turn === "B" ?
          <h1>
            {"It's "}
            <span style={{position: "relative", display:"inline-block", width:24, height:24}} className="piece-icon WQ" />
            {" "+ page.data.currentGame.get("white_player").get("username") + "'s turn."}
          </h1> :
          <h1>
            {"It's "}
            <span style={{position: "relative", display:"inline-block", width:24, height:24}} className="piece-icon BQ" />
            {" "+ page.data.currentGame.get("black_player").get("username") + "'s turn."}
          </h1>}
        <div className="board">
        {board.map(function(row, x) {
          return (
            <div key={''+x} className="row">
            {row.map(function(cell, y) {
              return (
                <ChessCell
                  passKey={'' + x + y}
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
                  onClick={this.cellSelect}
                  onDrop={this.cellDrop} />
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
      <a onClick={this.handleLogout}>Logout</a>
      <div style={{display:"inline"}}>
        <ul>
          {this.state.moves.map(function(m, i) {
            return (
              <li key={i}>
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
  handleLogOut: function() {
    Parse.User.logOut().then(function() {
      window.location = "/";
    });
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
