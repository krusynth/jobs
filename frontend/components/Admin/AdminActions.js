import React from 'react';
import AdminModelCrud from '../../lib/AdminModelCrud'
import ActionModel from '../../models/ActionModel';

export default class AdminActions extends AdminModelCrud {
  options = {
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text'
      },
      {
        name: 'icon',
        label: 'Icon',
        type: 'text'
      },
      {
        name: 'type',
        label: 'Type',
        type: 'text'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text'
      }
    ],

    // name of the objects
    name: 'User Level'

  }

  model = new ActionModel();
}
