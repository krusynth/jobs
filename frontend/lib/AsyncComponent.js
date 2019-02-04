import React, { Component } from 'react';

export default class AsyncComponent extends Component {
  setStateAsync(args) {
    return new Promise((resolve, reject) => {
      this.setState(args, resolve);
    });
  }
}
