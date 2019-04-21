'use strict';

import React, { Component } from 'react';
import UserForm from './UserForm';

export default class EditAccount extends UserForm {
  submitButtonText = 'Save Account';

  constructor(props) {
    super(props);
    this.state.user = props.user;
  }

  saveData(values) {
    if(!values['password']) {
      delete values['password'];
      delete values['passwordConfirm'];
    }
    delete values['meta'];

    return this.model.update(values);
  }

  render() {
    return (<section>
      <h1>{this.title}</h1>

      {this.state.success && this.success()}
      {this.showForm()}
    </section>);
  }
}
