import React, { Component } from 'react';

import Jobs from 'components/Job/Jobs';
import Status from './Status';
import Activity from './Activity';

export default class UserHome extends Component {
  render() {
    return (
      <section className="row">
        <header className="page-header">
          <h1>JobsCRM</h1>
        </header>
        <div className="status-wrapper">
          <Status user={this.props.user} />
        </div>
        <div className="jobs-wrapper">
          <Jobs user={this.props.user} />
        </div>
        <div className="activity-wrapper">
          <Activity user={this.props.user} />
        </div>
      </section>
    );
  }
}
