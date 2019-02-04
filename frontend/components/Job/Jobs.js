import React, { Component } from 'react';
import { Redirect } from 'react-router'

import JobModel from 'models/JobModel';
import JobEventModel from 'models/JobEventModel';
import JobCreateForm from './JobCreateForm';
import JobRow from './JobRow';


export default class Jobs extends Component {
  state = {
    jobs: [],
    showAddJobForm: false,
    redirect: false
  };

  componentDidMount() {
    this.job = new JobModel();
    this.jobEvent = new JobEventModel();

    this.fetchJobs();
  }

  fetchJobs() {
    this.job.list().then(result => {
      this.setState({
        jobs: result
      })
    });
  }

  createJob = job => {
    this.job.create(job).then((data) => {
      this.setState({redirect: '/job/' + data.id});
      // this.setState({jobs: [data, ...this.state.jobs]});
    });
  }

  handleDelete = id => {
    this.job.delete(id).then(() => {
      let jobs = this.state.jobs.filter(job => job.id != id);
      this.setState({jobs: jobs});
    });
  }

  toggleForm = () => {
    this.setState({
      showAddForm: !this.state.showAddJobForm
    });
  }

  render() {
    const { jobs } = this.state;
    let result = '';

    if(jobs.length) {
      result = jobs.map((job, index) => {
        return (
          <JobRow key={job.id} job={job} />
        );
      });
    }
    else {
      result = (<p>
        Click the <span className="plus">+</span> above to begin tracking your
        first job!
      </p>);
    }

    return (
      <section>
        { this.state.redirect && <Redirect to={this.state.redirect} /> }
        <header>
          <h1>Jobs</h1>
          <button className="button-add" onClick={this.toggleForm}>
            <span className="icon"></span>Add Job
          </button>
          {this.state.showAddForm && <JobCreateForm createJob={this.createJob} />}
        </header>
        <section className="jobs">{result}</section>
      </section>
    );
  }
}
