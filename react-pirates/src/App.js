import React, { Component } from 'react';

// import { HashRouter as Router, Route } from 'react-router-dom';
import PirateDetail from './components/PirateDetail.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Switch from '../node_modules/react-router-dom/Switch';

import base from './base';
import Header from './components/Header';
import Pirate from './components/Pirate';
import PirateForm from './components/PirateForm';
import NavBar from './components/NavBar';

import piratesFile from './data/sample-pirates-object';

class App extends Component {

  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.removePirate = this.removePirate.bind(this);
    this.updatePirate = this.updatePirate.bind(this)
    this.state = {
      pirates: {}
    }
  }

  render() {
    return (
      <Router>
      <div className="App">
      <Header headerTitle="Pirates!" />
      <NavBar />
      <Switch>
        <Route path='/detail/:id' render = { () => <PirateDetail pirates={this.state.pirates} /> 
        } />
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
          updatePirate={this.updatePirate}
          pirates={this.state.pirates}
          addPirate={this.addPirate}
          loadSamples={this.loadSamples}
        />
      </div>
      </Router>
    );
  }

  addPirate(pirate) {
    const pirates = {...this.state.pirates}
    const timestamp = Date.now()
    pirates[`pirate-${timestamp}`] = pirate
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

  updatePirate(key, updatedPirate){
    const pirates = {...this.state.pirates};
    pirates[key] = updatedPirate;
    this.setState({ pirates })
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
