var React = require('react');

var CreateGame = React.createClass({
  getInitialState: function() {
    return {
      open: true,
      creatingGame: false
    }
  },
  render: function() {
   return (
     <div style={{display: "inline-block"}} >
      {this.state.creatingGame ?
        this.renderGameFlyover() : null}
      <span className="icon create-game"
        onClick={this.handleClick}
        {...this.props}>+</span>
    </div>
   );
  },
  renderGameFlyover: function() {
    return (
      <div className="new-game-flyover">
        <div className="new-game-color">
          <span onClick={this.handleWhite} className="piece-icon WQ" />
        </div>
        <div className="new-game-color">
          <span onClick={this.handleBlack} className="piece-icon BQ" />
        </div>
        <label>Public Game: </label>
        <input type="checkbox" value={this.state.open} onChange={this.changeOpen} />
      </div>
    )
  },
  changeOpen: function(e) {
    this.setState({
      open: e.target.value
    });
  },
  handleClick: function(e) {
    this.setState({
      creatingGame: !this.state.creatingGame
    });
  },
  handleBlack: function(e) {
    this.props.onCreate({
      myColor: "black",
      status: this.state.open ? 'open' : 'private'
    }, e);
    this.setState(this.getInitialState());
  },
  handleWhite: function(e) {
    this.props.onCreate({
      myColor: "white",
      status: this.state.open ? 'open' : 'private'
    }, e);
    this.setState(this.getInitialState());
  }
});

module.exports = CreateGame;
