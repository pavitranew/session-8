import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import '../assets/css/Pirate.css'

class Pirate extends Component {
  render(){
    const { details } = this.props;
    return (
      <Router>
      <div className='pirate'>
      <ul>
      <li>{details.name}</li>
      <li>{details.weapon}</li>
      <li>{details.vessel}</li>
      <li>
         <button onClick={() => this.props.removePirate(this.props.index)}>
              X
          </button>
      </li>
      </ul>
        </div>
        </Router>
      )
  }
}
export default Pirate;