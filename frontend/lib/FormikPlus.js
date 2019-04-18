import React, { Component } from 'react';
import { Formik, Field, ErrorMessage, isString, isFunction, warnAboutMissingIdentifier, setIn } from 'formik';

export default class FormikPlus extends Formik {
  // Extend Formik to be able to handle onBlur events correctly.
  handleBlur = (eventOrString) => {
    if (isString(eventOrString)) {
      // cache these handlers by key like Preact's linkState does for perf boost
      return isFunction(this.hbCache[eventOrString])
        ? this.hbCache[eventOrString]
        : (this.hbCache[eventOrString] = event =>
            this.executeBlur(event, eventOrString));
    } else {
      this.executeBlur(eventOrString);
    }
  };

  executeBlur = (e, path) => {
    if (e.persist) {
      e.persist();
    }
    const { name, id, outerHTML } = e.target;
    const field = path ? path : name ? name : id;

    if (!field && process.env.NODE_ENV !== 'production') {
      warnAboutMissingIdentifier({
        htmlContent: outerHTML,
        documentationAnchorLink: 'handleblur-e-any--void',
        handlerName: 'handleBlur',
      });
    }

    this.setState(prevState => ({
      touched: setIn(prevState.touched, field, true),
    }));

    if (this.props.validateOnBlur) {
      this.runValidations(this.state.values).then(errors => {
        if(this.props.onBlur) {
          this.props.onBlur(this.state.values, errors);
        }
      });
    }
  };
}

export class FieldWrapper extends Component {
  getId() {
    if(this.props.id) {
      return this.props.id;
    }
    else {
      return this.nameToId(this.props.name);
    }
  }

  // We camelize by default but hyphens are an option.
  nameToId(name) {
    if(this.props.idFormat == 'hyphen') {
      return this.hyphenize(name);
    }
    else {
      return this.camelize(name);
    }
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return "";
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  hyphenize(str) {
    return str.replace(/\s+/, '-').toLowerCase();
  }

  render() {
    let identifier = this.getId();
    return (
      <div className="field-group">
        <label htmlFor={identifier}>{this.props.name}</label>
        {this.props.instructions &&
          <p id={identifier+"-instructions"}>{this.props.instructions}</p>}
        {this.props.children}
        {this.renderErrors(identifier)}
      </div>
    )
  }

  renderErrors(identifier) {
    if(
      typeof this.props.formik != 'undefined' &&
      typeof this.props.formik.touched != 'undefined' &&
      this.props.formik.touched[identifier] &&
      typeof this.props.formik.errors != 'undefined' &&
      this.props.formik.errors[identifier]
    ) {
      return (
        <div className="form-error">
          {this.props.formik.errors[identifier]}
        </div>
      );
    }
  }
}

export class FieldPlus extends FieldWrapper {
  render() {
    let identifier = this.getId();
    return (
      <FieldWrapper {...this.props}>
        <Field type={this.props.type} name={identifier} id={identifier}
          aria-describedby={identifier+"-instructions"}/>
      </FieldWrapper>
    );
  }
}
