'use strict';

import React, { Component } from 'react';
import AsyncComponent from 'lib/AsyncComponent';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FieldPlus } from 'lib/FormikPlus';

import UserModel from 'models/UserModel';

const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, 'Please tell us your name.')
    .max(100, 'Whoa, that\'s a long name. Do you use a shorter name?')
    .required('Please tell us your name.'),
  lastName: Yup.string()
    .min(1, 'Please tell us your name.')
    .max(100, 'Whoa, that\'s a long name. Do you use a shorter name?')
    .required('Please tell us your name.'),
  email: Yup.string()
  /* TODO: create a feedback mechanism for this validation! */
    .email('That email address doesn\'t appear to be a real email address.')
    .required('Please tell us your email address.'),
  password: Yup.string()
    .min(6, 'Please choose a longer password.')
    .max(254, 'Whoa, that password is too long for us. Can you please choose one shorter than 254 characters?')
    .required('Please create a password.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Your passwords don't match. Please try again?")
    .required('Please confirm your password.'),
});

export default class UserForm extends AsyncComponent {
  model = new UserModel();

  state = {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    saving: false,
    success: false
  };

  submitButtonText = 'Submit Form';

  handleSubmit = (values, actions) => {
    this.saveData(values)
    .then( () => {
      actions.setSubmitting(false);
      this.setState({
        success: true
      });
    })
    .catch( (err, other) => {
      actions.setSubmitting(false);
      actions.setErrors(this.translateErrors(err.errors));
    });
  }

  saveData(values) {
    console.log(this.constructor.name + ' needs to implement saveData()')
    return Promise.resolve();
  }

  translateErrors(errors) {
    for(let field in errors) {
      switch(field) {
        case 'email':
          if( errors[field] === 'email must be unique' ) {
            errors[field] = `That email address is already in use.
              Do you want to log in instead?`;
          }
      }
    }
    return errors;
  }

  render() {
    return(
      <section>
        { this.showForm() }
      </section>
    );
  }

  showForm() {
    if(this.state.success) {
      return (<React.Fragment>
        <p>Your account has been created.</p>
        <p><Link to="/login/" className="btn btn-lg btn-success">Login!</Link></p>
      </React.Fragment>);
    }
    else {
      return (
          <Formik
            initialValues={this.state.user}
            validationSchema={signupSchema}
            onSubmit={this.handleSubmit}
          >
            {(formik) => (
              <Form className="user-form">
                <FieldPlus name="First Name" formik={formik} />

                <FieldPlus name="Last Name" formik={formik} />

                <FieldPlus name="Email" type="email" formik={formik} />

                <FieldPlus name="Password" type="password" formik={formik}
                  instructions="Please pick a good password - preferably one you haven't used somewhere else." />

                <FieldPlus name="Confirm Password" type="password" formik={formik}
                  instructions="Please type the password one more time to make sure we've both got it correct." />

                <div className="form-group">
                  <button className="button create-account-button">{ this.submitButtonText }</button>
                </div>
              </Form>
            )}
          </Formik>
      );
    }
  }
}
