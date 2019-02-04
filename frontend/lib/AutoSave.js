import React, { Component } from 'react';
import {debounce, isEqual} from 'lodash';
import { connect } from 'formik';
import AsyncComponent from './AsyncComponent'; // TODO

export default connect(
  class AutoSave extends Component {
    state = {
      isSaving: false,
    }

    componentDidUpdate(prevProps) {
      console.log(this.props.debounce);
      if (!_.isEqual(prevProps.formik.values, this.props.formik.values)) {
        this.save(this.props.formik.values)
      }
    }

    save = debounce(() => this.props.save(this.props.values), 300)


    render() {
      return this.props.render ? this.props.render(this.state) : null
    }
  }
)
