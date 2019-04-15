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

export default class Signup extends AsyncComponent {
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

  handleSubmit = (values, actions) => {
    this.model.create(values)
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
    if(this.state.success) {
      return (<section>
        <p>Your account has been created.</p>
        <p><Link to="/login/" className="btn btn-lg btn-success">Login!</Link></p>
      </section>);
    }
    else {
      return (
        <section>
          <h1>Signup</h1>

          <Formik
            initialValues={this.state.user}
            validationSchema={signupSchema}
            onSubmit={this.handleSubmit}
          >
            {(formik) => (
              <Form>
                <FieldPlus name="First Name" formik={formik}
                  instructions="To start, please tell us what to call you." />

                <FieldPlus name="Last Name" formik={formik}
                  instructions="Now please tell us your last name or family name." />

                <FieldPlus name="Email" type="email" formik={formik}
                  instructions="We'll need your email address as well. Don't worry, we won't give it out to anyone else." />

                <FieldPlus name="Password" type="password" formik={formik}
                  instructions="Please pick a good password - preferably one you haven't used somewhere else." />

                <FieldPlus name="Confirm Password" type="password" formik={formik}
                  instructions="Please type the password one more time to make sure we've both got it correct." />

                <div className="form-group">
                  <button className="button create-account-button">Create Account</button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      );
    }
  }
}


const FormPage = (props) => {
  return (
      <div className={"form-group" + (props.active ? " active" : "")}>
        <label htmlFor={props.name}>{props.label}</label>
        <p>{props.message}</p>
        {props.children}
      </div>
    );
}

const FormPageNav = (props) => {
  return (
    <nav>
      {props.page > 1 && <button onClick={props.handlePrev}>Previous</button>}
      {props.page < props.maxPage && <button onClick={props.handleNext}>Next</button>}
      {props.page === props.maxPage && <button onClick={props.handleSubmit}>Create Account</button>}
    </nav>
  );
}
