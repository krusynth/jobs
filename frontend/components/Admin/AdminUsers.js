import React from 'react';
import AdminModelCrud from '../../lib/AdminModelCrud'
import UserModel from '../../models/UserModel';
import UserLevelModel from '../../models/UserLevelModel';

export default class AdminUsers extends AdminModelCrud {
  options = {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email'
      },
      // {
      //   name: 'password',
      //   label: 'Password',
      //   type: 'password'
      // },
      {
        name: 'userLevelId',
        label: 'Level',
        type: 'select'
      }
    ],
    list_fields: [
      {name: 'name', label: 'Name'},
      {name: 'email', label: 'Email'},
      {name: 'userLevel', label: 'Level'}
    ],

    // name of the objects
    name: 'User',

    userLevels: {}
  }

  model = new UserModel();

  postLoadListData(data) {
    return this.fetchUserLevels()
      .then( () => Promise.resolve(data) );
  }

  postLoadDetailData(data) {
    return this.fetchUserLevels()
      .then( () => Promise.resolve(data) );
  }

  fetchUserLevels() {
    let userLevel = new UserLevelModel();

    return userLevel.list().then( (data) => {
      for(let i in data) {
        let row = data[i];
        this.options.userLevels[row.id] = row.name;
      }
    });
  }

  getUserLevels() {
    return this.options.userLevels;
  }

  getUserLevel(level) {
    if(level) {
      return this.options.userLevels[level];
    }
    else return '';
  }

  getOptions(field) {
    switch(field) {
      case 'userLevelId':
        return this.getUserLevels();
    }
  }

  getListField(field, data) {
    switch(field) {
      case 'name':
        return `${data['firstName']} ${data['lastName']}`;

      case 'userLevel':
        return this.getUserLevel(data['userLevelId']);

      default:
        return data[field].toString();
    }
  }

}
