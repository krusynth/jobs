import React, { Component } from 'react';
import DatePick from 'lib/DatePick';

export default class JobEventForm extends Component {
  defaultNotes = `Notes about this organization:

* What does this organization do?

* Why did I apply?

* Who am I interviewing with? What do they do?



Accomplishments I want to highlight about myself:



Questions I want to ask:

* What would success look like for someone in this role?

* Tell me about your organization's culture.

* Why did the previous person leave this role?

* What sort of continuing education opportunities do you offer?

* What other benefits do you offer?

* What are the next steps here? When will I hear back from you?

`;
  constructor(props) {
    super(props);

    this.state = props.event;
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }


  render() {
    // If this is for a new interview, let's set some default notes.
    // TODO: convert to Formik.
    // TODO: if this field hasn't changed reset on type change.
    if(!this.state.id && !this.state.notes && this.state.type == 'Interview') {
      this.setState({
        notes: this.defaultNotes
      });
    }

    return (
    <div className="event-form-wrapper">
      <form
        className="event-form"
        onSubmit={ (e) => {e.preventDefault(); this.props.submitForm(this.state)} }
      >
        <a href="#" onClick={this.props.closeForm} className="button-close">close</a>

        <input type="hidden" name="jobId" value={this.state.jobId} />
        <input type="hidden" name="id" value={this.state.id} />

        <h2>{this.state.id ? 'Update Milestone' : 'Add Milestone' }</h2>

        <div className="row">
          <div className="event-details">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                id="type"
                className="form-control"
                value={this.state.type}
                onChange={this.handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Response">Received Response</option>
                <option value="Interview">Interview</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <DatePick
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
              />
            </div>

            {this.state.type == 'Interview' &&
            <div className="form-group">
              <label htmlFor="duration">Length of Interview</label>
              <p>(in minutes)</p>
              <input
                name="duration"
                id="duration"
                type="number"
                value={this.state.duration}
                onChange={this.handleChange}
              />
            </div>}
          </div>

          <div className="event-notes">
            <div className="form-group">
              <label htmlFor="notes">My Notes</label>
              <textarea
                name="notes"
                className="form-control"
                value={this.state.notes}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <button
            type="button"
            value="Save"
            className="button-save"
            onClick={ () => {this.props.submitForm(this.state)} }
          >Save</button>

          {this.state.id === 0 || <button
            type="button"
            value="Delete"
            className="button-delete"
            onClick={ () => {this.props.deleteEvent(this.state.id)} }
          >Delete</button>}
        </div>
      </form>
    </div>
    );
  }
}
