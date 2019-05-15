'use strict';

import React, { Component, } from 'react';
import { Link } from 'react-router-dom';

import AuthModel from 'models/AuthModel';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    errors: [],
    success: false
  }

  model = new AuthModel();

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  saveData = event => {
    event.preventDefault();

    this.model.forgotpassword(this.state.email)
    .then( result => {
      this.setState({
        errors: [],
        success: true
      });
    })
    .catch( error => {

      if(error && error.errors) {
        this.setState({
          errors: error.errors
        });
      }
      else {
        console.log('error', error);
        // this.setState({
        //   errors: [error]
        // });
      }
    });
  }

  success() {
    return (<section className="user-form-message success-message">
      <p>Your account has been created.</p>
      <p><Link to="/login/" className="btn btn-lg btn-success">Login!</Link></p>
    </section>);
  }

  render() {
    return(
      <section>
        <h1>Reset Password</h1>
        { this.state.success && this.renderSuccess() }
        { !this.state.success && this.renderForm() }
      </section>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.saveData} className="forgot-password">
        <div className="field-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <ul className="errors">
            { Object.values(this.state.errors).map( (elm, i) => {
              return (<li key={i}>{elm}</li>)
            })}
          </ul>
        </div>
        <div className="field-group forgot-password-submit-group">
          <button className="forgot-password-submit">Reset Password</button>
        </div>
      </form>
    );
  }

  renderSuccess() {
    return (
      <div>
        <p>
          You've successfully submitted your password reset request. Please check
          your email for your password reset message.
        </p>
        <p>
          <Link to="/">Back</Link>
        </p>
      </div>
    );
  }
}
