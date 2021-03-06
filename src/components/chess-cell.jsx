var React = require('react');
var ClassSet = require('classnames');

var ChessCell = React.createClass({
  render: function(){
    var cellCN = ClassSet({
      "cell": true,
      "occupied": this.props.cell !== '__',
      "dark": this.props.dark
    });
    var highlightCN = ClassSet({
      "highlight": true,
      "attacked": this.props.attacked,
      "hover-attacked": this.props.hoverAttacked,
      "hover": this.props.hover,
      "selected": this.props.selected
    })
    return (
      <div key={this.props.passKey} onClick={this.cellClick}
          className={cellCN}
          onMouseOver={this.handleHover}
          onMouseOut={this.handleMouseLeave}>
          <span className={highlightCN} />
          <span className={'piece-icon ' + this.props.cell} />
      </div>
    );
  },
  handleStart: function(e) {
    this.props.onClick(this.props.pos, this.props.cell, e);
  },
  handleHover: function(e) {
    this.props.onMouseOver(this.props.pos, this.props.cell, e);
  },
  handleMouseLeave: function(e) {
    this.props.onMouseOut(this.props.pos, this.props.cell, e);
  },
  cellClick: function(e) {
    this.props.onClick(this.props.pos, this.props.cell, e);
  }
});

module.exports = ChessCell;
