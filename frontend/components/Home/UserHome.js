import React, { Component } from 'react';

import Jobs from 'components/Job/Jobs';
import Status from './Status';
import Activity from './Activity';

export default class UserHome extends Component {
  render() {
    document.body.className = 'page-private-home';

    return (
      <section className="row">
        <div className="status-wrapper block-wrapper">
          <Status {...this.props} />
        </div>
        <div className="jobs-wrapper block-wrapper">
          <Jobs {...this.props} />
        </div>
        <div className="activity-wrapper block-wrapper">
          <Activity {...this.props} />
        </div>
      </section>
    );
  }
}
