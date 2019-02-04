import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router'

import AuthModel from 'models/AuthModel';

export default class Logout extends Component {
  state = {
    redirect: false
  };

  model = new AuthModel();

  componentDidMount() {
    this.handleLogout();
  }

  handleLogout() {
    this.model.logout()
    .then( this.props.refresh )
    .then(() => {
      this.setState({
        redirect: '/'
      });
    });
  }

  render() {
    return (
      <div>
        Logging out...
        { this.state.redirect && <Redirect to={this.state.redirect}/> }
      </div>
    );
  }
}
