import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AdminUsers from './AdminUsers';
import AdminUserLevels from './AdminUserLevels';
import AdminActions from './AdminActions';

export default function Admin ({match}) {
  return (

      <div>
        <Route exact path={`${match.path}`} component={AdminIndex} />
        <Route path={`${match.path}users/`} component={AdminUsers} />
        <Route path={`${match.path}userlevels/`} component={AdminUserLevels} />
        <Route path={`${match.path}actions/`} component={AdminActions} />
      </div>

  );
}

export function AdminIndex ({match}) {
  return (
    <section>
      <h1>Admin</h1>
      <ul>
        <li><Link to={`${match.url}users/`}>Users</Link></li>
        <li><Link to={`${match.url}userlevels/`}>User Levels</Link></li>
      </ul>
    </section>
  );
}
