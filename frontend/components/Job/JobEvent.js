import React, { Component } from 'react';
import Moment from 'react-moment';

export default function JobEvent({event, clickHandler}) {
  let className = 'job-event event-'+event.type.toLowerCase();
  // if(this.state.event && this.state.event.id === event.id) {
  //   className += ' selected';
  // }

  return (
    <div key={"event-"+event.id}
      className={className}
      role="progressbar"
      onClick={ (e) => {e.preventDefault(); clickHandler(event);} }
    >
      <span className="icon"></span>
      <span className="type">{ event.type }</span>
      <Moment format="MMM Do">{ event.date }</Moment>
    </div>
  );
}