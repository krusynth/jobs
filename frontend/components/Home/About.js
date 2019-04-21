'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return(
    <section className="about">
      <h2>About Job.Hunt.Works</h2>
      <p>
        This site is not a jobs board. Instead, it's a set of tools to help you
        manage the process of job hunting. Keep track of jobs you're interested
        in, and see what's coming up next at a glance.
      </p>
      <p>
        <img className="screenshot" src="/images/screenshots/job-list.png"/>
      </p>
      <p>
        Manage events and prepare notes for your interviews. You'll always know
        what questions you want to ask, and what answers you want to give.
      </p>
      <p>
        <img className="screenshot" src="/images/screenshots/milestone.png"/>
      </p>
      <p>
        <strong>Job.Hunt.Works</strong> also nudges you to make sure you're
        keeping your spirits up. Recommended activities and a mood tracker help
        you stay focused and positive.
      </p>
      <p>
        <img className="screenshot" src="/images/screenshots/helpers.png"/>
      </p>
      <p>
        <strong>Sign up today for free! No credit card required!</strong>
      </p>
      <p className="button-group">
        <Link to="/signup/" className="btn btn-lg btn-primary">Sign Up!</Link>
        <Link to="/login/"  className="btn btn-lg btn-success">Login!</Link>
      </p>
    </section>
  );
}
