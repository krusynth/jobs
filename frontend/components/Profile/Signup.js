import React, { Component } from 'react';
import AsyncComponent from 'lib/AsyncComponent';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

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
  passwordConfirm: Yup.string()
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
      passwordConfirm: ''
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
    .catch( (err) => {
      actions.setSubmitting(false);
      actions.setErrors(this.translateErrors(err.response.message));

      // for(err.response.message
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
              <Form>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <p>To start, please tell us what to call you.</p>
                  <Field type="text" name="firstName" id="firstName" />
                  <ErrorMessage className="form-error" name="firstName" component="div" />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last or Family Name</label>
                  <p>Now please tell us your last name or family name.</p>
                  <Field type="text" name="lastName" id="lastName" />
                  <ErrorMessage className="form-error" name="lastName" component="div" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <p>We'll need your email address as well. Don't worry, we won't
                    give it out to anyone else.</p>
                  <Field type="email" name="email" id="email" />
                  <ErrorMessage className="form-error" name="email" component="div" />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <p>Please pick a good password - preferably one you haven't used
                    somewhere else.</p>
                  <Field type="password" name="password" id="password" />
                  <ErrorMessage className="form-error" name="password" component="div" />
                </div>
                <div className="form-group">
                  <label htmlFor="passwordConfirm">Confirm Password</label>
                  <p>Please type the password one more time to make sure we've
                    both got it correct.</p>
                  <Field type="password" name="passwordConfirm" id="passwordConfirm" />
                  <ErrorMessage className="form-error" name="passwordConfirm" component="div" />
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
