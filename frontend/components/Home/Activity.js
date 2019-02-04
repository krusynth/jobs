import React, { Component } from 'react';
import UnderConstruction, {wip} from 'components/modules/UnderConstruction';

import UserACtionModel from 'models/UserActionModel';

export default class Activity extends Component {

  handleActivity = (id, value) => {
    wip();
  }

  render() {
    return (
      <UnderConstruction className="activity">
        <header>
          <h4>Activity</h4>
          <p>Here are some activities to try today!</p>
        </header>

        { this.props.user.meta.actions.map( elm => <ActivityCard key={elm.id} {...elm} />) }

      </UnderConstruction>
    );
  }
}

const ActivityCard = function(props) {
  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card-header"
          dangerouslySetInnerHTML={{__html: props.icon}}
        >
        </div>
        <div className="card-body">
          <p className="card-text">
            {props.description}
          </p>
          <div className="card-buttons">
            <a href="#" className="button btn-success"
              onClick={(e) => {e.preventDefault(); this.handleActivity(props.id, true);}}
            >
              <span className="fas fa-check"></span>
            </a>
            <a href="#" className="button btn-danger"
              onClick={(e) => {e.preventDefault(); this.handleActivity(props.id, false);}}
            >
              <span className="fas fa-times"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
