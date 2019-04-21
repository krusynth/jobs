'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default function Footer () {
  return (
    <footer className="footer">
      <nav className="footer-nav navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/about/" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/tos/" className="nav-link">Terms of Service</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" target="_blank"
            href="https://github.com/krues8dr/jobs/issues/new">Let us know if something isn't working!</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
