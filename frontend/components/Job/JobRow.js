import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Moment from 'react-moment';

import Job from './Job';
import JobTimeline from './JobTimeline';

import JobModel from 'models/JobModel';
import JobEventModel from 'models/JobEventModel';

/* Custom rendering for list view */
export default class JobRow extends Job {
  constructor(props) {
    super(props);
    this.state.job = props.job;
  }

  componentDidMount() {
    this.job = new JobModel();
    this.jobEvent = new JobEventModel();
  }

  renderJobTitle() {
    let closes = new Date(this.state.job.closes)

    let closesSoon = this.state.job.closes &&
      closes > new Date() &&
      closes < moment().add(6,'d').toDate();

    return (
      <header>
        <Link to={"/job/"+this.state.job.id}><span className="job-title"
          >{this.state.job.name} at {this.state.job.company}</span></Link>
        <button
          className={"button-watch "+(this.state.job.watching ? "active": "")}
          onClick={ this.toggleWatching }
        ><span className="icon"></span>Watch this Job</button>
        { !this.state.job.applied &&
           closesSoon &&
           <div className="upcoming-notice">Closes <Moment fromNow>{closes}</Moment></div>
        }
      </header>
    );
  }

  render() {
    return (
      <article key={'job-'+this.state.job.id} className="job">
        { this.renderJobTitle() }

        {/* <button type="button" className="event-button event-remove-button"
          onClick={()=>this.handleDelete(job.id)}
        ><span className="event-remove">Remove</span></button> */}

        <JobTimeline
          job={this.state.job}
          refresh={this.fetchJob} />

      </article>
    );
  }
}
