import React, { Component } from 'react';
import UnderConstruction, {wip} from 'components/modules/UnderConstruction';

export default class Status extends Component {
  updateStatus = (status) => {
    wip();
  }

  render() {
    return (
      <section className="status">
        <UnderConstruction/>
        <span className="message">How are you doing today?</span>
        <div className="status-buttons">
          <a href="#" className="button button-happy"
            onClick={(e) => {e.preventDefault(); this.updateStatus(1)}}>
            <span className="icon fa-smile far"></span>
          </a>
          <a href="#" className="button button-neutral"
            onClick={(e) => {e.preventDefault(); this.updateStatus(0)}}>
            <span className="icon fa-meh far"></span>
          </a>
          <a href="#" className="button button-down"
            onClick={(e) => {e.preventDefault(); this.updateStatus(-1)}}>
            <span className="icon fa-frown far"></span>
          </a>
        </div>
      </section>
    );
  }
}
