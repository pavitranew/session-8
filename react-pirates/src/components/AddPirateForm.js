import React, { Component } from 'react';

import '../assets/css/AddPirateForm.css';

class AddPirateForm extends Component {
  render(){
    return (
      <div>
      <h4>Add Pirate Form</h4>
      <form
        ref={ (input) => this.pirateForm = input }
        onSubmit={(e) => this.createPirate(e)
        }>
        <input ref={ (input) => this.name = input } type="text" placeholder="Pirate name" />
        <input ref={ (input) => this.vessel = input } type="text" placeholder="Pirate vessel" />
        <input ref={ (input) => this.weapon = input } type="text" placeholder="Pirate weapon" />
        <button type="submit">Add Pirate</button>
      </form>
      </div>
    )
  }

  createPirate(e) {
    e.preventDefault();
    const pirate = {
      name: this.name.value,
      vessel: this.vessel.value,
      weapon: this.weapon.value
    }
    this.props.addPirate(pirate)
    this.pirateForm.reset();
    // console.log(pirate)
  }

}

export default AddPirateForm;