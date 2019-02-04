'use strict'

import React, { Component } from 'react';

export default function SaveStatus(props) {
  return (
    <div className="save-status">
      <span className="icon">
        <span className="bg"></span>
        <span className={props.status}></span>
      </span>
      <span className="message">{props.status}</span>
    </div>
  );
}
