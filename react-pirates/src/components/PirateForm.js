import React, { Component } from 'react';
import AddPirateForm from './AddPirateForm';

import base from '../base';

class PirateForm extends Component {

  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null
    }
  }

  render(){
    const logout = <button onClick={() => this.logout()}>Log Out</button>;
    // const logout = <button>Log Out</button>;
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    return (
      <div>
      {Object.keys(this.props.pirates).map(this.renderPirates)} 
      <h3>Pirate Form Component</h3>
        <AddPirateForm addPirate={this.props.addPirate} />
        <button onClick={this.props.loadSamples}> Load Sample Pirates </button>
      </div>
      )
  }

  handleChange(e, key){
    const pirate = this.props.pirates[key]
    const updatedPirate = {
      ...pirate,
      [e.target.name]: e.target.value
    }
    this.props.updatePirate(key, updatedPirate);
  }

  renderLogin(){
    return (
      <div>
      <button onClick={() => this.authenticate('github')} >Log in with Github</button>
      </div>
      )
  }

  authenticate(provider){
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData)
    if (err){
      console.log(err);
      return;
    }
    this.setState({
      uid: authData.user.uid
    })
  }

  componentDidMount(){
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, {user});
      }
    })
  }

  logout(){
    base.unauth();
    this.setState({uid: null})
  }

  renderPirates(key){
    const pirate = this.props.pirates[key]
    return (
    <div key={key}>x
      <p>{key}</p>
      <input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
      <input value={pirate.weapon} onChange={(e) => this.handleChange(e, key)} type="text" name="weapon" placeholder="Pirate weapon" />
      <input value={pirate.vessel} onChange={(e) => this.handleChange(e, key)} type="text" name="vessel" placeholder="Pirate vessel" />
    </div>
    )
  }

  
}

export default PirateForm;