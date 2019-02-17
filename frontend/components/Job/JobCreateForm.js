import React, {Component} from 'react';

export default class JobCreateForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: '',
      company: ''
    };

    this.state = this.initialState;
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name] : value
    });
  }

  submitForm = (event) => {
    event.preventDefault();
    this.props.createJob(this.state);
    this.setState(this.initialState);
  }

  render() {
    return (
      <form onSubmit={this.submitForm} className="job-form job-create-form">
        <div className="field-group">
          <label>Position</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={this.state.name}
            onChange={this.handleChange} />
        </div>

        <div className="field-group">
          <label><span className="plain-text">at</span> Company</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={this.state.name}
            onChange={this.handleChange} />
        </div>

        <div className="field-group">
          <input
            type="button"
            value="Submit"
            className="button"
            onClick={this.submitForm} />
        </div>
      </form>
      );
  }
}
