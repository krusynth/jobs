import React, { Component } from 'react';

import Jobs from 'components/Job/Jobs';
import Status from './Status';
import Activity from './Activity';

export default class UserHome extends Component {
  render() {
    return (
      <section className="row">
        <div className="status-wrapper">
          <Status {...this.props} />
        </div>
        <div className="jobs-wrapper">
          <Jobs {...this.props} />
        </div>
        <div className="activity-wrapper">
          <Activity {...this.props} />
        </div>
      </section>
    );
  }
}
