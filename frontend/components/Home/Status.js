import React, { Component } from 'react';

import UserMoodModel from 'models/UserMoodModel';

export default class Status extends Component {
  userMoodModel = new UserMoodModel();

  updateStatus = (status) => {
    this.userMoodModel.create({
      'mood': status
    });
  }

  render() {
    return (
      <section className="status">
        <span className="message">How are you doing today?</span>
        <div className="status-buttons">
          <a href="#" className="button button-happy"
            onClick={(e) => {e.preventDefault(); this.updateStatus(1)}}>
            <span className="icon fa-smile far"></span>
          </a>
          <a href="#" className="button button-neutral"
            onClick={(e) => {e.preventDefault(); this.updateStatus(0)}}>
            <span className="icon fa-meh far"></span>
          </a>
          <a href="#" className="button button-down"
            onClick={(e) => {e.preventDefault(); this.updateStatus(-1)}}>
            <span className="icon fa-frown far"></span>
          </a>
        </div>
      </section>
    );
  }
}
