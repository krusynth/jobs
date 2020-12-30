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
    document.body.className = 'page-account';

    let calendarUrl = `webcal:${window.location.host}/api/calendar/${this.state.user.meta.calendarId}`;

    return (<section className="block-wrapper">
      <h1>{this.title}</h1>

      <a href={calendarUrl}><i className="far fa-calendar-alt"></i> Subscribe to Events Calendar</a>

      {this.state.success && this.success()}
      {this.showForm()}
    </section>);
  }
}
