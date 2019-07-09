'use strict';

import React, { Component, } from 'react';
import { Link } from 'react-router-dom';
import UserForm from './UserForm';
import TermsOfService from '../Home/TermsOfService';

export default class Signup extends UserForm {
  title = 'Sign Up';
  submitButtonText = 'Create Account';

  componentDidMount() {
    this.schema.fields.password =
      this.schema.fields.password.required('Please create a password.');

    this.schema.fields.confirmPassword =
      this.schema.fields.confirmPassword.required('Please confirm your password.');
  }

  render() {
    document.body.className = 'page-signup';

    return (<section className="signup-form">
      <h1>{this.title}</h1>
      {this.state.success && this.success()}
      {!this.state.success && this.showForm()}
      <TermsOfService/>
    </section>);
  }

  saveData(values) {
    return this.model.create(values);
  }

  success() {
    return (<section className="user-form-message success-message">
      <p>Your account has been created.</p>
      <p><Link to="/login/" className="btn btn-lg btn-success">Login!</Link></p>
    </section>);
  }
}
