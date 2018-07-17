import React, { Component } from 'react';
import base from '../base';

class PirateDetail extends Component {

  constructor(props){
    super(props)
    this.state = {}
    this.renderPirate = this.renderPirate.bind(this);
  }
  
  render() {
    return (
      <div className="pirate-detail">
        <h2>Pirate Detail</h2>

        {Object.keys(this.props.pirates).map(this.renderPirate)}

      </div>
      )
  }

  renderPirate(key){
    const pirate = this.props.pirates[key]
    return (
    <div key={key}>
      <p>{key}</p>
    </div>
    )}

}

export default PirateDetail;