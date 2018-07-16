# VIII - React Intro Continued

## Homework

For your final project you will create a version of the recipes list and details pages in React.

Of course, if you wish you can do something entirely original. Just propose it.

## Reading

It is important to get some hands on with 'primitive' (i.e. outside the Create React App setup) React coding.

* Spend some quality time with the exercises on [Built with React](http://buildwithreact.com) (do the simple Tutorial).
* Another useful tutorial you could try is the official [Intro to React](https://reactjs.org/tutorial/tutorial.html) tutorial.

## React Project

```sh
cd react-pirates
npm i
npm start
```

## Stateless Components

Not every component needs to be involved with data. When you only need to render some material use a Stateless Functional Component.

* Simplify `Header`:

```js
import React, { Component } from 'react';
import '../assets/css/Header.css';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1>Header Component</h1>
      </div>
    );
  }
}

export default Header;
```

To:

```js
import React from 'react';
import '../assets/css/Header.css';
import logo from '../assets/img/anchor.svg';

const Header = (props) => {
  return (
    <div className="header">
    <img src={logo} className="logo" alt="logo" />
      <h1>{props.headerTitle}</h1>
    </div>
  );
};

export default Header;
```

Add the required prop.

* `App`:

```html
<Header headerTitle="Pirates!" />
```

Note - no 'this' required in the props. No render method - just a return.

### Persisting the Data - Review

Demo using db on Firebase. Firebase is like one big object.

1. Create an account at [Firebase](https://firebase.com/)
1. Create a new project called `<firstname>-<lastname>-pirates`
1. Create Project
1. Go to the empty database (left hand menu)

Click on Rules at the top.

* Default

```js
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Change defaults to:

```js
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

and click Publish.

Examine App.js state. Any change to pirates needs to be made to firebase.

in src create `base.js`

```js
import Rebase from 're-base'

const base = Rebase.createClass({

})
```

[Rebase](https://www.npmjs.com/package/rebase) is a simple utility that we are going to need to massage strings.

`$ npm install re-base@2.2.0 --save`

Or add `"re-base": "2.2.0"` to your package.json dependencies.

### Add domain, database URL, API key

In Firebase click on Project Overview > Add Firebase to your web app.

Extract the following information:

```js
apiKey: "AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU",
authDomain: "daniel-deverell-pirates.firebaseapp.com",
databaseURL: "https://daniel-deverell-pirates.firebaseio.com",
```

* base.js:

```js
import Rebase from 're-base';

const base = Rebase.createClass({
  apiKey: 'AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU',
  authDomain: 'daniel-deverell-pirates.firebaseapp.com',
  databaseURL: 'https://daniel-deverell-pirates.firebaseio.com'
});

export default base;
```

* `App.js`:

`import base from './base'`

## React Component Lifecycle

[Documentation](https://reactjs.org/docs/react-component.html).

* component will mount - hooks into component before it is displayed.

* `App`:

```js
componentWillMount(){
  this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
    context: this,
    state: 'pirates'
  })
}
```

Note the path and the object.

```js
componentWillUmount(){
  base.removeBinding(this.ref)
}
```

To delete a pirate we need to accomodate Firebase:

```js
removePirate(key){
  const pirates = {...this.state.pirates}
  pirates[key] = null
  this.setState({pirates})
}
```

## Bi-Directional Data

* React's version of $scope

We will now use `PirateFrom` to allow the user to edit the pirates from a single location.

Make the state available to the `PirateForm`

* `App.js`:

`pirates={this.state.pirates}`:

```js
<PirateForm
pirates={this.state.pirates}
addPirate={this.addPirate}
loadSamples={this.loadSamples}
/>
```

* `PirateForm.js`:

Call `renderPirates` with a `.map`:

```js
render(){
  return (
    <div>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
```

Add the function

```js
  renderPirates(key){
    return (
    <p>{key}</p>
    )
  }
```

Note that we are calling this method from the return value of the component's render function.

Update the method to display additional data:

```js
  renderPirates(key){
    const pirate = this.props.pirates[key]
    return (
    <div key={key}>
      <p>{key}</p>
      <input value={pirate.name} type="text" name="name" placeholder="Pirate name" />
      <input value={pirate.weapon} type="text" name="weapon" placeholder="Pirate weapon" />
      <input value={pirate.vessel} type="text" name="vessel" placeholder="Pirate vessel" />

    </div>
    )
  }
```

Note the error. We need a constructor.

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
  }
```

Again, note the error. React only allows you to put state into a field if you have the intention of editing it. We will use `onChange`.

Listen for a change on one input.

```html
<input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
```

Create the method:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
  }
```

Remember to bind it in the constructor:

```js
constructor() {
  super();
  this.renderPirates = this.renderPirates.bind(this);
  this.handleChange = this.handleChange.bind(this);
}
```

Test by sending the pirate to the console:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    console.log(pirate)
    console.log(e.target)
    console.log(e.target.value)
    console.log(e.target.name, e.target.value)
  }
```

Values need to be put into state.

<!-- We need a copy of the object. This is the old method:

`const updatedPIrate = Object.assign([], pirate)` -->

We will use spread operator and overlay the new properties on top of it. `e.target.name` gives us the property name so we will use what's know as a computed property:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    const updatedPirate = {
      ...pirate,
      [e.target.name]: e.target.value
    }
    console.log(updatedPirate)
  }
```

## Moving the Function to App.js

Pass the updated pirate to the App component for updating.

* `App`:

```js
  updatePirate(key, updatedPirate){
    const pirates = {...this.state.pirates};
    pirates[key] = updatedPirate;
    this.setState({ pirates })
  }
```

Pass the method to the component.

`updatePirate={this.updatePirate}`:

```js
<PirateForm
  updatePirate={this.updatePirate}
  pirates={this.state.pirates}
  addPirate={this.addPirate}
  loadSamples={this.loadSamples}
/>
```

Bind it.

* App

```js
constructor() {
  super();
  this.addPirate = this.addPirate.bind(this);
  this.loadSamples = this.loadSamples.bind(this)
  this.updatePirate = this.updatePirate.bind(this)
  this.state = {
    pirates: {}
  }
}
```

* `PirateForm`:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    const updatedPirate = {
      ...pirate,
      [e.target.name]: e.target.value
    }
    this.props.updatePirate(key, updatedPirate);
  }
```

Add the onChange handler to the other fields.

```js
renderPirates(key){
  const pirate = this.props.pirates[key]
  return (
  <div key={key}>
    <p>{key}</p>
    <input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
    <input value={pirate.weapon} onChange={(e) => this.handleChange(e, key)} type="text" name="weapon" placeholder="Pirate weapon" />
    <input value={pirate.vessel} onChange={(e) => this.handleChange(e, key)} type="text" name="vessel" placeholder="Pirate vessel" />
  </div>
  )
}
```

Test and check out Firebase. We now have two way communication with the database. Look ma! No Submit button.

## Authentication

* Firebase

Enable Github authentication under Authentication > Sign In Method

* Github

Navigate to Settings > Developer settings > OAuth Apps and register a new OAuth application.

Copy the URL from Firebase and enter the Client ID and Client Secret into Firebase.

* `PirateForm`:

```js
  renderLogin(){
    return (
      <div>
      <p>Sign in</p>
      <button onClick={() => this.authenticate('github')} >Log in with Github</button>
      </div>
      )
  }
```

and bind it

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }
```

Set an initial value for uid in state:

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.state = {
      uid: null
    }
  }
```

Add an if statement that shows a button to log in:

```js
  render(){
    const logout = <button>Log Out</button>;
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    return (
      <div>
      {logout}
      {Object.keys(this.props.pirates).map(this.renderPirates)}
      <h3>Pirate Form Component</h3>
      <AddPirateForm addPirate={this.props.addPirate} />
      <button onClick={this.props.loadSamples}>Load Sample Pirates</button>`
      </div>
      )
  }
}
```

Create the authenticate method and bind it

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      uid: null
    }
  }

  authenticate(provider){
    console.log(`Trying to log in with ${provider}`)
  }
```

Import base:

```js
import base from '../base';
```

```js
  authenticate(provider){
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData)
  }
```

Bind the authHandler:

`this.authHandler = this.authHandler.bind(this);`

If no error add uid to state.

```js
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
```

Refresh is a problem. Use a lifecycle hook.

```js
componentDidMount(){
  base.onAuth((user) => {
    if(user) {
      this.authHandler(null, {user});
    }
  })
}
```

Log Out

```js
logout(){
  base.unauth();
  this.setState({uid: null})
}
```

Bind it

`this.logout = this.logout.bind(this);`

Add a call to the method in the button

```js
render(){
  const logout = <button onClick={() => this.logout()}>Log Out</button>;
```

## Routing

Make sure you are in the `react-pirates` directory.

[Quick start](https://reacttraining.com/react-router/web/guides/quick-start)

`npm install react-router-dom --save`

`App.js`:

```js
import { HashRouter as Router, Route } from 'react-router-dom';
// import PirateDetail from './components/PirateDetail.js';
```

```js
    return (
      <Router>
      <div className="App">
        <Header />
        <Route path='/' component={PirateDetail} />
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
  ```

  `import { BrowserRouter as Router, Route } from 'react-router-dom';`

```js
  <Route path='/' component={PirateDetail} />
  <Route path='/foo' component={PirateDetail} />
```

Two should show.

`import Switch from '../node_modules/react-router-dom/Switch';`

```js
      <Switch>
        <Route path='/' component={PirateDetail} />
        <Route path='/foo' component={PirateDetail} />
      </Switch>
```

`NavBar.js`:

```js
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
```

```js
      <NavBar />
      <Switch>
        <Route path='/' component={PirateDetail} exact={true} />
        {/* <Route path='/foo' component={PirateDetail} /> */}
      </Switch>
```

```js
      <Switch>
        <Route path='/detail/:id' component={PirateDetail}  /> 
        {/* exact={true} */}
        {/* <Route path='/foo' component={PirateDetail} /> */}
      </Switch>
```

`Pirate.js`:

```js
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import '../assets/css/Pirate.css'

class Pirate extends Component {
  render(){
    const { details } = this.props;
    let linkUrl = `/detail/${this.props.index}`;
    return (

      <div className='pirate'>
      <ul>
      <li><Link to={linkUrl}>{details.name}</Link></li>
      <li>{details.weapon}</li>
      <li>{details.vessel}</li>
      <li>
         <button onClick={() => this.props.removePirate(this.props.index)}>
              X
          </button>
      </li>
      </ul>
        </div>

      )
  }
}
export default Pirate;
```

`PirateDetail.js`:

```js
import React, { Component } from 'react';

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

```

`App.js`:

```js
      <Switch>
        <Route path='/detail/:id' render = { () => <PirateDetail pirates={this.state.pirates} /> 
        } />
      </Switch>
```
