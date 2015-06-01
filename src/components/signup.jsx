var React = require('react');

var Signup = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      password: "",
      email: ""
    }
  },
  render: function() {
    return (
      <form
        onSubmit={this.handleSubmit}>
        <div>
          <label for="name">
            Name
          </label>
          <input type="text"
            value={this.state.name}
            onChange={this.handleInputChange.bind(this, "name")} />
        </div>
        <div>
          <label for="password">
            Password
          </label>
          <input type="password"
            value={this.state.password}
            onChange={this.handleInputChange.bind(this, "password")} />
        </div>
        <div>
          <label for="isSignup">
            Create New Account
          </label>
          <input type="checkbox"
            value={this.state.isSignup}
            onChange={this.handleInputChange.bind(this, "isSignup")}/>
        </div>
        <h3>
          Optional
        </h3>
        <div>
          <label for="email">Email</label>
          <input type="text"
            value={this.state.text}
            onChange={this.handleInputChange.bind(this, "email")} />
        </div>
        <button
          type="submit">Submit</button>
      </form>
    )
  },
  handleInputChange: function(field, e) {
    var newState = {};
    newState[field] = e.target.value;
    this.setState(newState);
  },
  handleSubmit: function(e) {
    var userData = {
      username: this.state.name,
      password: this.state.password
    };
    if (this.state.email) userData.email = this.state.email
    if (this.state.isSignup) userData.isSignup = true;
    this.props.onSubmit && this.props.onSubmit(userData, e);
  }
});

module.exports = Signup;
