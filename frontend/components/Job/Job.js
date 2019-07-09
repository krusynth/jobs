import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {debounce, isEqual} from 'lodash';

import JobModel from 'models/JobModel';

import FormikPlus from 'lib/FormikPlus';
import AsyncComponent from 'lib/AsyncComponent';
import DatePick from 'lib/DatePick';
import SaveStatus from 'lib/SaveStatus';
import AutoSave from 'lib/AutoSave';
import JobTimeline from './JobTimeline';


// const statuses = {
//   'open': 'Open',
//   'closed': 'Closed'
// }

const jobSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, 'Whoa, that\'s a long name. Is there a shorter name?')
    .required('Please fill out the job position name.'),

  company: Yup.string()
    .max(100, 'Whoa, that\'s a long company name. Is there a shorter company name?')
    .required('Please fill out the company name.'),

  description: Yup.string()
    .max(10000, 'The description is a bit too long, please use a shorter description (10000 characters or less).')
    .nullable(),

  contacts: Yup.string()
    .max(2048, 'The list of contacts is a bit too long, please use a shorter description (2048 characters or less).')
    .nullable(),

  url: Yup.string()
    .url('That doesn\'t look like a real url. Please check it and try again?')
    .max(255, 'Whoa, that\'s a long url. Is there a shorter url?')
    .nullable(),

  closes: Yup.date()
    .nullable()

  // status: Yup.mixed()
  //   .oneOf(Object.keys(statuses), 'Please choose a status from the list.'),

  // watching: Yup.boolean()
});

export default class Job extends AsyncComponent {
  state = {
    job: {},
    status: 'syncing',
    redirect: false
  };

  job = new JobModel();

  componentDidMount() {
    this.state.job.id = this.props.match.params.id;
    this.fetchJob();
  }

  fetchJob = () => {
    this.job.read(this.state.job.id)
    .then(this.setJob);
  }

  setJob = (data) => {
    // Commenting this out because it's a dumb rule and I'd rather just deal
    // with the warning that's generated than set wrong values.
    //
    // Forms don't like null values, so we set some empty strings.
    // for(let i in data) {
    //   if(data[i] === null) {
    //     data[i] = '';
    //   }
    // }

    this.setState({
      job: data,
      status: 'saved'
    });
  }

  updateJob = () => {
    this.job.update(this.state.job)
      .then(this.setJob);
  }

  toggleWatching = () => {
    let job = this.state.job;
    job.watching = !job.watching;
    this.setState({
      job: job
    }, this.updateJob());
  }

  deleteJob = () => {
    let doDelete = window.confirm(
      'Are you sure you want to delete this? It\'s permanent!');
    if(doDelete) {
      this.job.delete(this.state.job.id)
      .then(() => {
       this.setState({
          redirect: '/'
        });
      });
    }
  }

  handleSubmit(values) {

  }

  handleBlur = (values, errors) => {
    // I have no idea why Formik is setting this error on the DatePicker blur,
    // and having lost hours trying to figure it out, I'm giving up and just
    // overriding it.
    if(isEqual(errors, {isCanceled: true})) {
      errors = {};
    }
    if(!isEqual(values, this.state.job)) {
      this.setStateAsync({
        status: 'unsaved',
        job: values
      }).then( () => {
        if(isEqual(errors, {})) {
          this.updateJob();
        }
      });
    }
  }

  /* Reusable rendering methods - these do not warrant separate components. */

  watchButton() {
    return (
      <button
        className={"toggle-watch-button "+(this.state.job.watching ? "active": "inactive")}
        onClick={ this.toggleWatching }
      ><span className="icon"></span>
        {this.state.job.watching ? "Watching": "Watch this Job"}
      </button>
    );
  }

  deleteButton() {
    return(
      <button
        className="delete-button"
        onClick={ this.deleteJob }
      ><span className="icon"></span>
        Delete this Job
      </button>
    )
  }

  render() {
    document.body.className = 'page-job';

    return (
      <article key={'job-'+this.state.job.id} className="job-details job block-wrapper">
        { this.state.redirect && <Redirect to={this.state.redirect} /> }
        <FormikPlus
          initialValues={this.state.job}
          validationSchema={jobSchema}
          onSubmit={this.handleSubmit}
          onBlur={this.handleBlur}
        >
          {({
            values,
            errors,
            dirty,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
           }) => (
            <Form className="job-form job-edit-form">
              <header className="job-form-title">
                <SaveStatus status={this.state.status}/>

                <div className="job-name">
                  <label for="name">Job Title</label>
                  <Field type="text" name="name" id="name"
                    placeholder="Job Title" className="form-control" />
                  <ErrorMessage className="form-error" name="name" component="div" />
                </div>

                <span className="plain-text at-text">at</span>

                <div className="company-name">
                  <label for="company">Company</label>
                  <Field type="text" name="company" id="company"
                    placeholder="Company" className="form-control" />
                  <ErrorMessage className="form-error" name="company" component="div" />
                </div>
              </header>
              <header className="button-group">
                { this.watchButton() }
                { this.deleteButton() }
              </header>

              <div className="row">
                <div className="field-group">
                  <div className="form-group job-url">
                    <label htmlFor="url">URL</label>
                    <p>The website address that you found this job posting.</p>
                    <Field type="url" name="url" id="url" className="form-control" />
                    <ErrorMessage className="form-error" name="url" component="div" />
                  </div>
                  <div className="form-group job-closes">
                    <label htmlFor="closes">Close Date</label>
                    <p>The last day that this position will accept applications.</p>
                    <DatePick name="closes" value={values.closes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      />
                    <ErrorMessage className="form-error" name="closes" component="div" />
                  </div>
                  <div className="form-group job-contacts">
                    <label htmlFor="contacts">Contact(s)</label>
                    <Field component="textarea" name="contacts" id="contacts" className="form-control" />
                    <ErrorMessage className="form-error" name="contacts" component="div" />
                  </div>
                </div>

                <div className="field-group">
                  <div className="form-group job-description">
                    <label htmlFor="description">Position Description</label>
                    <Field component="textarea" name="description" id="description" className="form-control" />
                    <ErrorMessage className="form-error" name="description" component="div" />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </FormikPlus>

        <JobTimeline
          job={this.state.job}
          refresh={this.fetchJob} />

      </article>
    );
  }
}
