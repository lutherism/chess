var React = require('react');
var chessEngine = require('../util/chessEngine');

var MoveList = React.createClass({
  getInitialState: function() {
    return {
      displayToggle: false
    }
  },
  render: function() {
    return (
      <div
        style={{
          display: "inline",
          backgroundColor: "grey",
          width: 100,
        }}
        onMouseOver={this.mouseHover}
        onMouseOut={this.mouseLeave}>
        {this.state.displayToggle || this.state.buttonHover ?
          this.renderMoves() : null}
        <button
          onClick={this.toggleList}>
          Move List</button>
      </div>
    )
  },
  renderMoves: function() {
    return (
      <ul style={{
          position: "absolute",
          backgroundColor: "grey",
          bottom: 30,
          maxHeight: 500,
          overflow: "auto"
        }}>
        {this.props.moves.length === 0 ?
          <li><span>No Moves Taken.</span></li> :
          this.props.moves.map(function(m, i) {
            return (
              <li key={i}
                style={{
                  display: "block",
                  margin: 5
                }}>
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
    )
  },
  mouseLeave: function() {
    this.setState({
      buttonHover: false
    });
  },
  mouseHover: function() {
    this.setState({
      buttonHover: true
    });
  },
  toggleList: function() {
    this.setState({
      displayToggle: !this.state.displayToggle
    });
  }
});

module.exports = MoveList;
