import React from 'react';
import AdminModelCrud from '../../lib/AdminModelCrud'
import UserLevelModel from '../../models/UserLevelModel';


export default class AdminUserLevels extends AdminModelCrud {
  options = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text'
      },
      {
        name: 'isAdmin',
        label: 'Admin ?',
        type: 'boolean'
      }
    ],

    // name of the objects
    name: 'User Level'

  }

  model = new UserLevelModel();
}
