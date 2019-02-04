import React, { Component } from 'react';
import DatePick from 'lib/DatePick';

export default class JobEventForm extends Component {
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
    return (
      <form
        className="event-form"
        onSubmit={ (e) => {e.preventDefault(); this.props.submitForm(this.state)} }
      >
        <a href="#" onClick={this.props.closeForm} className="button-close">close</a>

        <input type="hidden" name="jobId" value={this.state.jobId} />
        <input type="hidden" name="id" value={this.state.id} />

        <h2>{this.state.id ? 'Update Milestone' : 'Add Milestone' }</h2>

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
    );
  }
}
