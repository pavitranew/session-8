import React, { Component } from 'react';
import AddPirateForm from './AddPirateForm';
import base from '../base';

class PirateForm extends Component {

  constructor() {
    super()
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null
    }
  }

  authenticate(provider) {
    console.log(`Trying ${provider}`)
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData)
    if (err) {
      console.log(err)
      return
    }
    this.setState({
      uid: authData.user.uid
    })
  }

  render() {
    
    const logout = <button onClick={ () => this.logout()}>Log Out</button>

    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    return (
      <div className="pirate-form">
        {logout}
        <h3>Pirate Form Component</h3>
        {Object.keys(this.props.pirates).map(this.renderPirates)}
        <AddPirateForm addPirate={this.props.addPirate} />
        <button onClick={this.props.loadSamples}> Load Sample Pirates </button>
      </div>
      )
  }

  renderPirates(key) {
    const pirate = this.props.pirates[key];
    return (
      <div key={key}>
        <p>{key}</p>
        <input value={pirate.name}
          onChange={ (e) => this.handleChange(e, key) }
          type="text" name="name" placeholder="Pirate Name"
        />
        <input value={pirate.weapon}
          onChange={ (e) => this.handleChange(e, key) }
          type="text" name="weapon" placeholder="Pirate Weapon" />
        <input value={pirate.vessel}
          onChange={ (e) => this.handleChange(e, key) }
          type="text" name="vessel" placeholder="Pirate Vessel" />
      </div>
    )
  }

  handleChange(e, key) {
    const pirate = this.props.pirates[key]
    // console.log(e.target.name, e.target.value)
    const updatedPirate = {
      ...pirate, 
      [e.target.name]: [e.target.value]
    }
      this.props.updatePirate(key, updatedPirate)
  }

  renderLogin() {
    return (
      <div>
      <button onClick={ () => this.authenticate('github')} >Log in with Github</button>
      </div>
    )
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, {user})
      }
    })
  }logout

  () {
    base.unauth();
    this.setState( {uid: null})
  }

}

export default PirateForm;