import React, { Component } from 'react';

import UserActionModel from 'models/UserActionModel';

export default class Activity extends Component {
  userAction = new UserActionModel();

  handleActivity = (id, value) => {
    this.userAction.create(
      {
        activityId: id,
        result: value
      }
    ).then( this.props.refresh );
  }

  render() {
    return (
      <section className="activity">
        <header>
          <h4>Activity</h4>
          <p>Here are some activities to try today!</p>
        </header>

        { this.props.user.meta.actions.map( elm =>
          <ActivityCard
            handleActivity={this.handleActivity}
            key={elm.id}
            {...elm} />) }
      </section>
    );
  }
}

const ActivityCard = function(props) {
  console.log('activity', props);

  let active = 'card-active';
  let result = '';
  if(typeof props.result !== 'undefined') {
    active = 'card-inactive';
    if(props.result) {
      result = 'You did it!';
    }
    else {
      result = 'Skipped.';
    }
  }
  return (
    <div className={'card-wrapper ' + active}>
      <div className="card">
        <div className="card-header"
          dangerouslySetInnerHTML={{__html: props.icon}}
        >
        </div>
        <div className="card-body">
          <p className="card-text">
            {props.description}
          </p>
          { result && <p className="result"><span>{result}</span></p> }
          <div className="card-buttons">
            <button className="button btn-success"
              disabled={ typeof props.result !== 'undefined' }
              onClick={(e) => {e.preventDefault(); props.handleActivity(props.id, true);}}
            >
              <span className="fas fa-check"></span>
            </button>
            <button className="button btn-danger"
              disabled={ typeof props.result !== 'undefined' }
              onClick={(e) => {e.preventDefault(); props.handleActivity(props.id, false);}}
            >
              <span className="fas fa-times"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
