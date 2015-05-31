var React = require('react');
var chessEngine = require('../util/chessEngine');
var _ = require('lodash');

var chessGame = React.createClass({
  getInitialState: function() {
    return {
      board: chessEngine.BEGINING_POSITIONS,
      moves: [],
      selectedCell: null,
    };
  },
  render: function() {
    var board = chessEngine(this.state.moves);
    var STYLE_TEMP = {
      width: 50,
      height: 50,
      display: "inline-block",
      textAlign: "center",
      textSize: "2em",
      backgroundColor: "#DDDDDD"
    };
    return (
      <div onClick={this.boardClick} className="board">
        {board.map(function(row, x) {
          return (
            <div key={x} className="row">
            {row.map(function(cell, y) {
              var cn = React.addons.classSet({
                "cell": true,
                "dark": ((y%2) + (x%2) === 1),
                "attacked": (this.state.selectedCell &&
                  chessEngine.availMoves(
                    board, this.state.selectedCell)
                  .map(chessEngine.posToReadable)
                  .indexOf(chessEngine.posToReadable([x, y])) > -1),
                "selected": (this.state.selectedCell &&
                  this.state.selectedCell[0] === x &&
                  this.state.selectedCell[1] === y)
              });
              return (
                <div key={''+x+y} onClick={this.cellClick.bind(this, [x, y], cell)}
                    className={cn}>
                  {cell}
                </div>
              );
            }.bind(this))}
          </div>
        );
      }.bind(this))}
      </div>
    );
  },
  boardClick: function(e) {
    this.setState({selectedCell: null});
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

      if (chessEngine(newMoves)) {
        e.stopPropagation();
        this.setState({
          moves: newMoves,
          selectedCell: null
        });
      }
    }
  }
});

module.exports = chessGame;
