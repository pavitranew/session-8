import React, { Component } from 'react';
import '../assets/css/Header.css'
import logo from '../assets/img/anchor.svg';

class Header extends Component {
  render(){
    return (
      <div className="header">
        <img src={logo} className="logo" alt="logo" />
        <h1>Pirates!</h1>
      </div>)
    }
  }

export default Header;