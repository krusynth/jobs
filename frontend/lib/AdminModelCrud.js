import React from 'react';
import { AdminCrud, AdminCrudList, AdminCrudDetail } from './AdminCrud'

export default class AdminModelCrud extends AdminCrud {
  options = {
    fields: [],
    list_fields: [],
    name: '',
    model: null
  }

  loadListData(obj) {
    return this.model.list({
      limit: obj.state.per_page,
      offset: ((obj.state.page-1) * obj.state.per_page)
    })
    .then( (data) => this.postLoadListData(data) )
    .then( (data) => {
      return Promise.resolve(data);
    });
  }

  loadDetailData(obj) {
    if(obj.props.match.params.id !== 'create') {
      return this.model.read(obj.props.match.params.id)
      .then( (data) => this.postLoadDetailData(data) )
      .then( (data) => {
        return Promise.resolve(data);
      });
    }
    else {
      return this.postLoadDetailData({});
    }
  }

  saveData(data) {
    if(data.id) {
      return this.model.update(data);
    }
    else {
      return this.model.create(data);
    }
  }
}
