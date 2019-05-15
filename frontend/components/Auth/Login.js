import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import AuthModel from 'models/AuthModel';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    redirect: false
  };

  model = new AuthModel();

  handleSubmit = (e) => {
    e.preventDefault();

    this.model.login(this.state.email, this.state.password)
    .then( this.props.refresh )
    .then( () => {
      this.setState({
        redirect: '/'
      });
    })
    .catch( (error) => {
      this.setState({
        errors: [`The email or password you've entered appears to be incorrect. Please try again.`]
      });
    });

  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {


    return (
      <section className="login-form">
        { this.state.redirect && <Redirect to={this.state.redirect} /> }
        <header>
          <h1>Login</h1>
        </header>
        <form
          onSubmit={this.handleSubmit}
        >
          <div className="field-group errors login-form-errors">
            <ul>
              { this.state.errors.map( (error, i) => <li key={i}>{error}</li>) }
            </ul>
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>

          <div className="field-group login-form-submit-group">
            <input
              type="submit"
              value="Login"
              className="login-form-submit"
              onClick={this.handleSubmit}
            />

            <Link to="/forgotpassword/" className="login-form-reset">
              Reset My Password</Link>
          </div>
        </form>
      </section>
    );
  }
}
