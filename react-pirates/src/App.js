import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import PirateDetail from './components/PirateDetail';
import NavBar from './components/NavBar';

import base from './base';
import Header from './components/Header';
import Pirate from './components/Pirate';
import PirateForm from './components/PirateForm';

import piratesFile from './data/sample-pirates-object';

import Switch from '../node_modules/react-router-dom/Switch';

class App extends Component {
  
  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.removePirate = this.removePirate.bind(this);
    this.state = {
      pirates: {}
    }
  }
  
  render() {
    return (
      <Router>
      <div className="App">
      <Header />
      <NavBar />
      <Switch>
        <Route path='/' component={PirateDetail} exact={true} />
        {/* <Route path='/foo' component={PirateDetail} /> */}
          </Switch>
          
      <ul>
      {
        Object.keys(this.state.pirates)
        .map( key => <Pirate
          key={key}
          index={key}
          details={this.state.pirates[key]}
          removePirate = {this.removePirate}
          />)
        }
        </ul>
        <PirateForm
        addPirate={this.addPirate}
        loadSamples={this.loadSamples}
        />
        </div>
        </Router>
      );
    }
    
    addPirate(pirate) {
      //take a copy of the current state and put it into pirates var
      const pirates = {...this.state.pirates}
      //create a unique id
      const timestamp = Date.now()
      //add new pirate using accessor and id - 
      // objectName["propertyName"] and assignment
      pirates[`pirate-${timestamp}`] = pirate
      //set state pirates with var pirates
      this.setState({ pirates: pirates })
    }
    
    loadSamples() {
      this.setState({pirates: piratesFile})
    }
    
    removePirate(key) {
      const pirates = { ...this.state.pirates }
      // delete pirates[key]
      pirates[key] = null;
      this.setState({pirates})
    }
    
    componentWillMount(){
      this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
        context: this,
        state: 'pirates'
      })
    }
    
    componentWillUmount(){
      base.removeBinding(this.ref)
    }
    
  }
  
  export default App;
  