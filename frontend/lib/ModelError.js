'use strict';

// Lightweight error class for passing around objects.
// The default HttpError class only returns strings.
export default class ModelError {
  constructor(status, errors) {
    this.status = status;
    this.errors = errors;
  }
}
