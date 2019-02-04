import React from 'React';
import { Formik, isString, isFunction, warnAboutMissingIdentifier, setIn } from 'formik';

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
