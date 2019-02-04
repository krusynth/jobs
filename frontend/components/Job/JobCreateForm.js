import React, {Component} from 'react';

export default class JobCreateForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: ''
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
      <form onSubmit={this.submitForm}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={this.state.name}
          onChange={this.handleChange} />

        <input
          type="button"
          value="Submit"
          onClick={this.submitForm} />
      </form>
      );
  }
}
