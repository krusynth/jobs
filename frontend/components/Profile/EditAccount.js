'use strict';

import React, { Component } from 'react';
import UserForm from './UserForm';

export default class EditAccount extends UserForm {
  submitButtonText = 'Save Account';

  saveData(values) {
    return this.model.create(values);
  }

  render() {
    return(
      <section>
        <h1>My Account</h1>
        { this.showForm() }
      </section>
    );
  }
}
