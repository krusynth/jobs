'use strict';

import React, { Component, } from 'react';
// import AsyncComponent from 'lib/AsyncComponent';
import { Formik, Form, Field } from 'formik';
import Yup from 'lib/Yup';
import { Link, Redirect } from 'react-router-dom';
import { FieldPlus } from 'lib/FormikPlus';

import AuthModel from 'models/AuthModel';

export default class ResetPassword extends Component {
  state = {
    loading: true,
    success: false,
    error: false,
    notoken: false,
    token: null
  }

  model = new AuthModel();


  constructor(props) {
    super(props);

    if(props.match.params.token) {
      this.model.checktoken(props.match.params.token)
      .then( result => {
        this.setState({
          loading: false,
          token: props.match.params.token
        });
      })
      .catch( result => {
        let error = result.errors.error;
        if(error == 'Token not found.') {
          error = 'We couldn\'t find that token - perhaps it\'s expired?'
        }

        this.setState({
          loading: false,
          error: error
        });
      });
    }
    else {
      this.state.loading = false;
      this.state.notoken = true;
    }
  }

  success() {
    this.setState({
      success: true
    })
  }

  render() {
    let content;
    if(this.state.loading) {
      content = (<p>Loading</p>);
    }
    else {
      if(this.state.notoken) {
        return (<Redirect to="/forgotpassword/" />);
      }

      if(!this.state.success) {
        if(!this.state.error) {
          content = (
            <ResetPasswordForm
              token={this.state.token}
              model={this.model}
              success={this.success.bind(this)}
            />
          );
        }
        else {
          content = (<React.Fragment>
            <p className="errors">
              {this.state.error}
            </p>
            <p>
              <Link to="/forgotpassword/">Try resetting your password again.</Link>
            </p>
          </React.Fragment>);
        }
      }
      else {
        content = (
          <section className="reset-passwordm-message success-message">
            <p>Your password has been reset!</p>
            <p><Link className="login-button" to="/login/">Login</Link></p>
          </section>
        );
      }
    }

    return (
      <section>
        <h1>Reset Password</h1>
        {content}
      </section>
    );
  }


}

class ResetPasswordForm extends Component {
  state = {
    token: '',
    password: '',
    confirmPassword: '',
    errors: []
  }

  schema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Please choose a longer password.')
      .max(254, 'Whoa, that password is too long for us. Can you please choose one shorter than 254 characters?'),
    confirmPassword: Yup.string()
      .equalTo(Yup.ref('password'), "Your passwords don't match. Please try again?")
  });

  constructor(props) {
    super(props);
    this.state.token = props.token;
    this.model = props.model;
  }

  render() {
    return (
      <Formik
        initialValues={this.state}
        validationSchema={this.schema}
        onSubmit={this.handleSubmit.bind(this)}
      >
        {(formik) => (
          <Form className="reset-password-form">
            <ul className="errors">
              { this.state.errors.map( (elm, i) => {
                return (<li key={i}>{elm}</li>)
              })}
            </ul>

            <Field type="hidden" name="token" />

            <FieldPlus name="Password" type="password" formik={formik}
              instructions="Please pick a good password - preferably one you haven't used somewhere else." />

            <FieldPlus name="Confirm Password" type="password" formik={formik}
              instructions="Please type the password one more time to make sure we've both got it correct." />

            <div className="form-group">
              <button className="button reset-password-form-button">Reset Password</button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  handleSubmit(values, actions) {
    this.model.resetpassword(values.token, values.password)
    .then( result => {
      actions.setSubmitting(false);
      this.props.success();
    })
    .catch( error => {
      actions.setSubmitting(false);
      this.setState({
        errors: Object.values(error.errors)
      });

    });
  }
}
