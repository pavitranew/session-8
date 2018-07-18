import React, { Component } from 'react';

import base from './base';
import Header from './components/Header';
import Pirate from './components/Pirate';
import PirateForm from './components/PirateForm';

import piratesFile from './data/sample-pirates-object';

class App extends Component {

  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.removePirate = this.removePirate.bind(this);
    this.updatePirate = this.updatePirate.bind(this);
    this.state = {
      pirates: {}
    }
  }

  render() {
    return (
      <div className="App">
        <Header headerTitle="Pirates!" />

          {
            Object.keys(this.state.pirates)
              .map( key => <Pirate
                key={key}
                index={key}
                details={this.state.pirates[key]}
                removePirate = {this.removePirate}
              />)
          }

        <PirateForm
          pirates={this.state.pirates}
          updatePirate={this.updatePirate}
          addPirate={this.addPirate}
          loadSamples={this.loadSamples}
        />
      </div>
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

  updatePirate(key, updatedPirate) {
    const pirates = { ...this.state.pirates }
    pirates[key] = updatedPirate;
    this.setState({ pirates });
  }

  componentWillMount(){
    this.ref = base.syncState(`pirates`, {
      context: this,
      state: 'pirates'
    })
  }

  componentWillUmount(){
    base.removeBinding(this.ref)
  }

}

export default App;
