import React, { Component } from 'react';
import moment from 'moment';
import UserMoodModel from 'models/UserMoodModel';

export default class Status extends Component {
  state = {
    recent: [],
    status: null,
    message: null
  }

  // TODO: set this on the serverside and deliver via API?
  messages = [
    'You\'re doing it!',
    'Keep going!',
    'You got this!',
    'I believe in you!'
  ]

  userMoodModel = new UserMoodModel();

  componentDidMount() {
    // Todo: finish this.
    // this.getRecent();
  }

  getRecent() {
    this.userMoodModel.getRecent().then(data => {
      this.setState({
        recent: data
      });
    });
  }

  getMessage(num) {
    if(typeof num === 'undefined') {
      num = Math.floor(Math.random()*this.messages.length)
    }
    return this.messages[num];
  }

  updateStatus = (status) => {
    if(this.state.status === null) {
      this.userMoodModel.create({'mood': status})
      .then( result => {
        this.setState({
          status: status,
          message: this.getMessage()
        });
      })
    }
  }

  // TODO. Work in progress.
  renderRecent() {
    let moods = this.state.recent;

    if(moods && moods.length) {
      return (
          <ol>
            {moods.map( (elm,i) => {
              let cls = 'neutral'
              if(elm.avgmood > 0) {
                cls = 'positive';
              }
              else if(elm.avgmood < 0) {
                cls = 'negative';
              }
              return (<li key={i} className={cls}>{elm.created}</li>)
            })}
          </ol>
      );
    }
  }

  render() {
    let buttons = {
      'happy': 1,
      'neutral': 0,
      'down': -1
    };
    return (
      <section className="status">
        <span className="status-question">How are you doing today?</span>
        <div className="status-buttons">
          { Object.entries(buttons).map( button =>
            this.renderButton(...button)
          ) }
        </div>
        <section className="status-message">
          {this.state.message}
        </section>
      </section>
    );
  }

  renderButton(name, value) {
    let classes = ['status-buttons-button', 'button-'+name];
    if( this.state.status !== null ) {
      if(this.state.status === value) {
        classes.push('active');
      }
      else {
        classes.push('inactive');
      }
    }
    return (
      <a href="#" key={name}
        className={classes.join(" ")}
        onClick={(e) => {e.preventDefault(); this.updateStatus(value)}}>
        <span className="icon"></span>
      </a>
    );
  }
}
