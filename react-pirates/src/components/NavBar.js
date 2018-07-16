import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <nav>
        <Link to='/' className="navLink">Home</Link>
        <Link to='/foo' className="navLink">Foo</Link>
      </nav>
      )
  }
}

export default NavBar;