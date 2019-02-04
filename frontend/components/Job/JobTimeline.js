import React, { Component } from 'react';
import AsyncComponent from 'lib/AsyncComponent';

import JobEventModel from 'models/JobEventModel';

import JobEventForm from './JobEventForm';
import JobEvent from './JobEvent';

export default class JobTimeline extends AsyncComponent {
  jobEvent = new JobEventModel();

  state = {
    showAddForm: false,
    event: {}
  };

  createEvent = jobEvent => {
    this.jobEvent.create(jobEvent)
    .then(this.props.refresh);
  }

  updateEvent = jobEvent => {
    this.jobEvent.update(jobEvent)
    .then(() => this.setStateAsync({showAddForm: false}))
    .then(this.props.refresh);
  }

  deleteEvent = eventId => {
    this.jobEvent.delete(eventId)
    .then(() => this.setStateAsync({showAddForm: false}))
    .then(this.props.refresh);
  }

  addEventForm = (job) => {
    let event = {
      id: 0,
      name: '',
      date: new Date(),
      jobId: job.id,
      type: job.applied ? 'Interview' : 'Applied'
    };

    this.setState({
      event: event
    });
    this.openForm();
  }

  showEvent = (event) => {
    this.setState({
      event: event,
      showAddForm: true
    });
  }

  toggleForm = () => {
    if(!this.state.showAddForm) {
      this.openForm();
    }
    else {
      this.closeForm();
    }
  }

  openForm = () => {
    this.setState({
      showAddForm: true
    });
  }

  closeForm = () => {
    this.setState({
      showAddForm: false,
      event: null
    });
  }

  submitForm = (event) => {
    if(event.id) {
      this.updateEvent(event);
    }
    else {
      this.createEvent(event);
    }

    this.setState({
      event: null,
      showAddForm: false
    });
  }

  renderJobEventForm() {
    if(this.state.showAddForm) {
      return (
        <JobEventForm
          key={this.state.event.id}
          event={this.state.event}
          submitForm={this.submitForm}
          deleteEvent={this.deleteEvent}
          closeForm={this.closeForm}
        />
      );
    }
  }

  renderJobTimeline() {
    return (
      <div className="job-timeline">
        <button className="event-button event-add-button"
          onClick={ (e) => { e.preventDefault(); this.addEventForm(this.props.job)} }
        ><span className="event-add"></span></button>

        { this.renderEvents() }
      </div>
    );
  }

  renderEvents() {
    let events = '';
    if(this.props.job.JobEvents && this.props.job.JobEvents.length) {
      events = this.props.job.JobEvents.map((event, index) => {
        return <JobEvent
          key={event.id}
          event={event}
          clickHandler={this.showEvent}
        />
      });

    }
    else {
      events = <div className="events-placeholder">
        <span className="icon"></span>Click the button to add your first milestone.
      </div>
    }

    return (
      <div className="job-events">
        {events}
      </div>
    );
  }

  render() {
    return (
      <section className="job-timeline-wrapper">

        { this.renderJobTimeline() }

        { this.renderJobEventForm() }

      </section>
    );
  }
}
