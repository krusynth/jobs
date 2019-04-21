'use strict';

import React, { Component } from 'react';
import AsyncComponent from 'lib/AsyncComponent';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FieldPlus } from 'lib/FormikPlus';

import UserModel from 'models/UserModel';

Yup.addMethod(Yup.mixed, 'equalTo', function(ref, message) {
    const msg = message || '${path} should match ${ref.path}';
    return this.test('equalTo', msg, function (value) {
      let refValue = this.resolve(ref);
      return value === refValue;
    })
})

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

  schema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, 'Please tell us your first name.')
      .max(100, 'Whoa, that\'s a long name. Do you use a shorter name?')
      .required('Please tell us your first name.'),
    lastName: Yup.string()
      .min(1, 'Please tell us your last name.')
      .max(100, 'Whoa, that\'s a long name. Do you use a shorter name?')
      .required('Please tell us your last name.'),
    email: Yup.string()
    /* TODO: create a feedback mechanism for this validation! */
      .email('That email address doesn\'t appear to be a real email address.')
      .required('Please tell us your email address.'),
    password: Yup.string()
      .min(6, 'Please choose a longer password.')
      .max(254, 'Whoa, that password is too long for us. Can you please choose one shorter than 254 characters?'),
    confirmPassword: Yup.string()
      .equalTo(Yup.ref('password'), "Your passwords don't match. Please try again?")
  });

  title = 'Edit Account';
  submitButtonText = 'Submit Form';

  handleSubmit(values, actions) {
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
    return (<section>
      <h1>{this.title}</h1>
      {this.state.success && this.success()}
      {!this.state.success && this.showForm()}
    </section>);
  }

  success() {
    return(<section className="user-form-message success-message">
      Your account was saved!
    </section>);
  }

  showForm() {
    return (
      <Formik
        initialValues={this.state.user}
        validationSchema={this.schema}
        onSubmit={this.handleSubmit.bind(this)}
      >
        {(formik) => (
          <Form className="user-form">

            <Field type="hidden" name="id" />

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
