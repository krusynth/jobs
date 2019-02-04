import { config } from '../config';

export default class Model {

  baseUrl = config.BASE_URI;
  url = '';

  constructor() {}

  _fetch(...params) {
    return fetch(...params)
    .then( response => {
      return Promise.all([
        response.status,
        response.json()
      ]);
    })
    .then( ([res, data]) => {
      if(res !== 200) {
        throw new HTTPError({status: res, message: data});
      }

      return data;
    })
    // .catch(error => {
    //   console.error('error', error);
    // });
  }

  _get(url, options) {
    let params = this.queryString(options);
    if(params) {
      params = '?'+params;
    }
    return this._fetch(url + params);
  }

  _post(url, data) {
    return this._fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  _put(url, data) {
    return this._fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  }

  _delete(url) {
    return this._fetch(url, {
      method: 'delete'
    });
  }

  read(id) {
    return this._get(this.baseUrl+'/'+this.url+'/'+id);
  }

  list(options) {
    return this._get(this.baseUrl+'/'+this.url, options);
  }

  create(data) {
    return this._post(this.baseUrl+'/'+this.url, data);
  }

  update(data) {
    return this._put(this.baseUrl+'/'+this.url+'/'+data.id, data);
  }

  delete(id) {
    return this._delete(this.baseUrl+'/'+this.url+'/'+id);
  }

  queryString(options) {
    let params = [];
    if(typeof options === 'object') {
      let keys = Object.keys(options);
      for(let i in keys) {
        let key = keys[i];
        params.push(`${key}=${options[key]}`);
      }
    }

    return params.join('&');
  }
}

export class HTTPError extends Error {
  constructor(response) {
    super(response.statusText);
    this.response = response;
  }

}
