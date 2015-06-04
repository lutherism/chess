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
      <div style={{
          width: "100%",
          height: "100%"
        }}>
        <div className="splash">
          <h1>A Chess app from a guy who cares about chess.</h1>
          <br/>
          <h2>
            <p>Features:</p>
            <br/>
            <small>
              <ul>
                <li>Usable UI.</li>
                <li>Play unlimited games at once.</li>
                <li>Find human opponents.</li>
                <li>ELO Ratings.</li>
                <li>Free.</li>
              </ul>
            </small>
          </h2>
        </div>
        <form
          onSubmit={this.handleSubmit}>
          <div className="form-field">
            <span for="name">
              Name
            </span>
            <input type="text"
              value={this.state.name}
              onChange={this.handleInputChange.bind(this, "name")} />
          </div>
          <div className="form-field">
            <span for="password">
              Password
            </span>
            <input type="password"
              value={this.state.password}
              onChange={this.handleInputChange.bind(this, "password")} />
          </div>
          <div className="form-field">
            <span for="isSignup">
              New Account
            </span>
            <input type="checkbox"
              value={this.state.isSignup}
              onChange={this.handleInputChange.bind(this, "isSignup")}/>
          </div>
          <h3>
            Optional
          </h3>
          <div className="form-field">
            <span for="email">Email</span>
            <input type="text"
              value={this.state.text}
              onChange={this.handleInputChange.bind(this, "email")} />
          </div>
          <button
            type="submit">Submit</button>
        </form>
      </div>
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
