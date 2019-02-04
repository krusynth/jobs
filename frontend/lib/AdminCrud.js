import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router'


export class AdminCrud extends Component {
  options = {
    fields: [],
    list_fields: [],
    name: ''
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path={`${this.props.match.path}`} component={this.render_list} />
          <Route path={`${this.props.match.path}:id`} component={this.render_detail} />
        </div>
      </Router>
    );
  }

  render_list = props => {
    return (
      <AdminCrudList
        match={props.match}
        load={this.loadListData}
        parent={this}
        {...this.options}
      />
    );
  }

  render_detail = props => {
    return (
      <AdminCrudDetail
        match={props.match}
        load={this.loadDetailData}
        save={this.saveData}
        parent={this}
        {...this.options}
      />
    );
  }

  loadListData(obj) {
    return Promise.resolve([])
      .then( postLoadListData );
  }

  postLoadListData(data) {
    return Promise.resolve(data);
  }

  loadDetailData(obj) {
    return Promise.resolve({})
      .then( postLoadDetailData );
  }

  postLoadDetailData(data) {
    return Promise.resolve(data);
  }

  saveData(data) {
    return Promise.resolve(data);
  }

  getOptions(field) {
    switch(field) {
      default:
         return {};
    }
  }

  getListField(field, data) {
    return data[field].toString();
  }
}

export class AdminCrudList extends Component {
  state = {
    queryset: [],
    page: 1,
    per_page: 25
  }

  constructor(props) {
    super(props);
    this.parent = props.parent;
  }

  componentDidMount() {
    this.setInitialData();
  }

  async setInitialData() {
    this.parent.loadListData(this).then( (data) => {
      this.setState({
        queryset: data
      });
    });
  }

  render() {
    return (
      <section>
        <h1>{ this.props.name } List</h1>

        <div className="form-actions">
          <Link
            to={`${this.props.match.path}create`}
            className="btn btn-primary"
          >Create { this.props.name }</Link>
        </div>

        <table className="table table-striped">
          <thead>
            { this.renderTableHead(this.state.queryset) }
          </thead>
          <tbody>
            { this.state.queryset.map( (row, index) => { return this.renderRow(row, index) }) }
          </tbody>
        </table>
      </section>
    );
  }

  renderTableHead(data) {
    let elms = [];
    if(this.props.list_fields && this.props.list_fields.length) {
      elms = this.props.list_fields.map( (field, index) =>
        (<th className={`field-${field.name}`} key={index}>{field.label}</th>)
      );
    }
    else if(this.props.fields.length) {
      elms = this.props.fields.map( (field, index) =>
        (<th className={`field-${field.name}`} key={index}>{field.label}</th>)
      );
    }
    else if(data && data.length) {
      elms = Object.keys(data[0]).map( (key, index) =>
        (<th className={`field-${key}`} key={index}>{key}</th>)
      );
    }

    return (
      <tr>
        { elms }
      </tr>
    );
  }

  renderRow(row, index) {
    let keys = [];
    if(this.props.list_fields && this.props.list_fields.length) {
      keys = this.props.list_fields.map( (field, index) => field.name );
    }
    else if(this.props.fields.length) {
      keys = this.props.fields.map( (field, index) => field.name );
    }
    else if(row) {
      keys = Object.keys(row);
    }

    return (
      <tr key={index}>
        { keys.map( (key, index) => { return this.renderField(key, row, index); } ) }
      </tr>
    );
  }

  renderField(key, row, index) {
    let value = this.parent.getListField(key, row);

    if(index === 0) {
      value = (
        <Link to={`${this.props.match.path}${row.id}`}>{ value }</Link>
      );
    }

    return (
      <td key={index} className={`field-${key}`}>{ value }</td>
    );
  }
}

export class AdminCrudDetail extends Component {

  messageSaved = 'Saved data.';
  parent = null;

  constructor(props) {
    super(props);
    this.parent = props.parent;
  }

  getListPath(message) {
    let path = this.props.match.path.replace(':id', '');
    if(message) {
      path += '?message=' + encodeURI(message);
    }
    return path;
  }

  componentDidMount() {
    this.setInitialData();
  }

  setInitialData() {
    this.parent.loadDetailData(this).then( (data) => {
      this.setState(
        data
      );
    });
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  submitForm = (e) => {
    e.preventDefault();

    this.parent.saveData(this.state).then( () => {
      this.setState({
        redirect: {
          pathname: this.getListPath(),
          state: {message: this.messageSaved}
        }
      });
    });
  }

  cancel = (e) => {
    e.preventDefault();

    this.setState({
      redirect: this.getListPath()
    });
  }

  render() {
    if(this.state) {

      if(this.state.redirect) {
        return <Redirect push
          to={this.state.redirect} />;
      }

      return(
        <section>
          <h1>{ this.props.name } Detail</h1>

          <form
            onSubmit={this.submitForm}>
            { this.props.fields.map( field =>
              <AdminFormInput
                key={field.name}
                field={field}
                value={this.state[field.name]}
                onChange={this.handleChange}
                options={this.props.parent.getOptions(field.name)}
              />
            )}

            <button className="btn btn-success"
              onClick={this.submitForm}
            >Save</button>

            <button className="btn btn-danger"
              onClick={this.cancel}
            >Cancel</button>
          </form>

        </section>
      );
    }
    else {
      return(
        <section>
          <span className="message loading-message">Loading...</span>
        </section>
      );
    }
  }
}

export const AdminFormInput = ({field, value, onChange, options}) => {
  let type = null;
  switch(field.type) {

    case 'boolean':
      return (
        <AdminFormRow field={field}>
          <select
            id={field.name}
            name={field.name}
            className="form-control"
            value={value}
            onChange={onChange}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </AdminFormRow>
      );

    case 'select':
      return (
        <AdminFormRow field={field}>
          <select
            id={field.name}
            name={field.name}
            className="form-control"
            value={value ? value : ''}
            onChange={onChange}
          >
            <option value=""> </option>
            {Object.entries(options).map( ([value, title]) =>
              (<option key={value} value={value}>{title}</option>)
            )}
          </select>
        </AdminFormRow>
      );

    default:
      return (
        <AdminFormRow field={field}>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value ? value.toString() : '' }
            onChange={onChange} />
        </AdminFormRow>
      );
  }
}

export function AdminFormRow(props) {
  return (
    <div className="form-group">
      <label htmlFor={props.field.name}>{props.field.label}</label>
      {props.children}
    </div>
  );
}
