import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AuthModel from 'models/AuthModel';

export default class Header extends Component {
  model = new AuthModel();

  noUserNav() {
    return (<ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link to="/" className="nav-link">Home</Link>
      </li>
      <li className="nav-item">
        <Link to="/signup/" className="nav-link">Signup</Link>
      </li>
      <li className="nav-item">
        <Link to="/login/" className="nav-link">Login</Link>
      </li>
    </ul>);
  }

  userNav() {
    return (<ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link to="/" className="nav-link">Home</Link>
      </li>
      <li className="nav-item">
        <Link to="/logout/" className="nav-link">Logout</Link>
      </li>
    </ul>);
  }

  adminNav() {
    return (<ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link to={`/admin/users/`} className="nav-link">Users</Link>
      </li>

      <li className="nav-item">
        <Link to={`/admin/userlevels/`} className="nav-link">User Levels</Link>
      </li>
    </ul>);
  }

  render() {
    return (<header className="main-header">
      <nav className="navbar navbar-expand-lg">
        <h1 className="navbar-brand">Job.Hunt.Works</h1>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          { this.props.userLevel === 0 && this.noUserNav() }
          { this.props.userLevel > 0 && this.userNav() }
          { this.props.userLevel === 2 && this.adminNav() }
        </div>
      </nav>
    </header>);
  }
};


