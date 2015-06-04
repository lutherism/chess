var React = require('react');
var ChessCell = require('./chess-cell.jsx');
var chessEngine = require('../util/chessEngine.js');

var Board = React.createClass({
  getInitialState: function() {
    return {
      hoverCell: null
    }
  },
  render: function() {
    return (
      <div className="board">
        {this.props.board.map(function(row, x) {
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
                  attacked={this.props.selectedCell &&
                    chessEngine.availMoves(this.props.board, this.props.selectedCell, this.props.remainingCastles)
                      .map(chessEngine.posToReadable)
                      .indexOf(chessEngine.posToReadable([x, y])) > -1}
                  hoverAttacked={this.state.hoverCell &&
                    chessEngine.availMoves(this.props.board, this.state.hoverCell, this.props.remainingCastles)
                      .map(chessEngine.posToReadable)
                      .indexOf(chessEngine.posToReadable([x, y])) > -1}
                  selected={this.props.selectedCell &&
                    this.props.selectedCell[0] === x &&
                    this.props.selectedCell[1] === y}
                  dark={(y%2) + (x%2) === 1}
                  onMouseOver={this.handleHover}
                  onMouseOut={this.handleMouseLeave}
                  onClick={this.props.onClick}
                  onDrop={this.cellDrop} />
              );
            }.bind(this))}
            </div>
          );
        }.bind(this))}
      </div>
    );
  },
  handleHover: function(pos, cell, e) {
    this.setState({hoverCell: pos});
  },
  handleMouseLeave: function(pos, cell, e) {
    if (this.state.hoverCell === pos) this.setState({hoverCell: null});
  },
  handleBoardClick: function() {
    this.props.onBoardClick && this.props.onBoardClick(e);
  }
});

module.exports = Board;
