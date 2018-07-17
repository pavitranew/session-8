# VIII - React Intro Continued

## Homework

For your final project you will create a version of the recipes list and details pages in React.

Of course, if you wish you can do something entirely original. Just propose it.

## Reading

It is important to get some hands on with 'primitive' (i.e. outside the Create React App setup) React coding.

* Spend some quality time with the exercises on [Built with React](http://buildwithreact.com) (do the simple Tutorial).
* Another useful tutorial you could try is the official [Intro to React](https://reactjs.org/tutorial/tutorial.html) tutorial.

## React Project

```bash
cd react-pirates
npm i
npm run start
```

## Stateless Components

Not every component needs to be involved with data. When you only need to render some UI use a `Stateless Functional Component`.

* Simplify `Header.js` from:

```js
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
```

To:

```js
import React from 'react';
import '../assets/css/Header.css'
import logo from '../assets/img/anchor.svg';

const Header = props => {
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

* `App.js`:

```html
<Header headerTitle="Pirates!" />
```

Note - no 'this' required in the props.

### Persisting the Data

Demo using db on Firebase. Firebase is like one big object.

1. Create a free account at [Firebase](https://firebase.com/)
1. Create a new project called `<firstname>-<lastname>-pirates`
1. Create Project
1. Go to the empty database (left hand menu)

Click on Create Database at the top and choose `Start in Test Mode`.

This changes the defaults to:

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```

in src create `base.js`

```js
import Rebase from 're-base'

const base = Rebase.createClass({

})

export default base;
```

[Rebase](https://www.npmjs.com/package/rebase) is a utility that we are going to use to connect to Firebase and bind the data so whenever your data changes, your state will be updated.

`$ npm install re-base --save`
<!-- `$ npm install re-base@2.2.0 --save` -->

### Add domain, database URL, API key

In Firebase click on Project Overview > Add Firebase to your web app.

Extract the following information:

```js
apiKey: "XXXXXXXX",
authDomain: "XXXXXXXX",
databaseURL: "XXXXXXXXX",
```

* e.g. in `base.js`:

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

Test in the browser. Check that the Database > Rules are set properly:

```js
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Bi-Directional Data

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
</div>
```

* `PirateForm.js`:

Call `renderPirates` with a `.map`:

```js
render(){
  return (
    <div>
    <h3>Pirate Form Component</h3>
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

Try changing `<div key={key}>` to `<div>` to see why this is included. Be sure to change it back again.

Again, note the error. React only allows you to put state into a field if you have the intention of editing it. We will use `onChange`.

Listen for a change on one input with `onChange={ (e) => this.handleChange(e, key)}`.

```jsx
<input value={pirate.name}
  onChange={ (e) => this.handleChange(e, key) }
  type="text" name="name" placeholder="Pirate name" />
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

Note the values for `e.target.name` and `e.target.value`.

Values need to be put into state.

<!-- We need a copy of the object. This is the old method:

`const updatedPIrate = Object.assign([], pirate)` -->

We will use spread operator and overlay the new properties on top of it. `e.target.name` gives us the property name so we will use what's known as a computed property:

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

* `App.js`:

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

* `App.js`:

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

* `PirateForm.js`:

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

Test and note the data sync between the form and the Pirate listing above.

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

Test and exmine Firebase. We now have two way communication with the database. No Submit button required.

## Authentication

* Firebase:

Enable Github authentication in Firebase under `Authentication > Sign In Method`

* Github:

Sign in, navigate to `Settings` (top left under your account). Find `Developer Settings > OAuth Apps` and register a new OAuth application.

Copy the URL from Firebase and enter the Client ID and Client Secret into Firebase.

* `PirateForm.js`:

```js
renderLogin(){
  return (
    <div>
    <p>Sign in</p>
    <button onClick={ () => this.authenticate('github') } >Log in with Github</button>
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

<!-- ```js
render(){
  const logout = <button>Log Out</button>;
  if(!this.state.uid) {
    return <div>{this.renderLogin()}</div>
  }

  return (
    <div>
    {logout}
    <h3>Pirate Form Component</h3>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
    <h3>Pirate Form Component</h3>
    <AddPirateForm addPirate={this.props.addPirate} />
    <button onClick={this.props.loadSamples}>Load Sample Pirates</button>`
    </div>
    )
  }
}
``` -->

```js
render(){

  const logout = <button>Log Out</button>;
  if(!this.state.uid) {
    return <div>{this.renderLogin()}</div>
  }

  return (
    <div>
    {logout}
    <h3>Pirate Form Component</h3>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
      <AddPirateForm addPirate={this.props.addPirate} />
      <button onClick={this.props.loadSamples}> Load Sample Pirates </button>
    </div>
    )
}
```

Note the code location here - in the render method but not in the return. Also note the use of the `logout` variable in the return statement.

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

And click on the button to test.

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

Test.

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

Test and note any messages in the console. Make changes in Firebase to allow the sign in provider if necessary.

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

Test by logging in and out. Note the user in Firebase. This can be deleted if you need to re-login.

## Routing

[Quick start](https://reacttraining.com/react-router/web/guides/quick-start)

`npm install react-router-dom --save`

`App.js`:

```js
import { HashRouter as Router, Route } from 'react-router-dom';
import PirateDetail from './components/PirateDetail.js';
```

Create a new Pirate Detail component:

```js
import React, { Component } from 'react';
import base from '../base';

class PirateDetail extends Component {
  
  render() {
    return (
      <div className="pirate-detail">
        <h3>Pirate Detail</h3>
      </div>
      )
  }
}

export default PirateDetail;
```

Create our first route.

`App.js`:

```js
return (
  <Router>
  <div className="App">
    <Header />
    <Route path='/' component={PirateDetail} />
    ...
    </div>
    </Router>
);
```

Remove the hash by using BrowserRouter.

`import { BrowserRouter as Router, Route } from 'react-router-dom';`

(Clear out any hashes from the location bar.)

Create a second route:

```js
<Route path='/' component={PirateDetail} />
<Route path='/foo' component={PirateDetail} />
```

Test it by navigating to `/foo`. There should be two instances of the component. This is because both paths match.

We can prevent this by using `exact`:

`<Route path='/' component={PirateDetail} exact />`

But we will use another method - `Switch`:

`import Switch from '../node_modules/react-router-dom/Switch';`

```js
<Switch>
  <Route path='/' component={PirateDetail} />
  <Route path='/foo' component={PirateDetail} />
</Switch>
```

Create `NavBar.js` in the components folder:

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

Import it into `App.js`:

`import NavBar from './components/NavBar';`

And insert it into `App.js`:

```js
<NavBar />
<Switch>
  <Route path='/' component={PirateDetail} exact={true} />
  {/* <Route path='/foo' component={PirateDetail} /> */}
</Switch>
```

Optional: style the NavBar.

Let use a parameterized path to show the Detail component.

```js
<Switch>
  <Route path='/detail/:id' component={PirateDetail}  /> 
  {/* exact={true} */}
  {/* <Route path='/foo' component={PirateDetail} /> */}
</Switch>
```

Test with `http://localhost:3000/detail/foo`.

Edit the Pirate component to include links. Make `Link` available to the component, create a `linkUrl` variable and use it to create a `link` on the name property.

`Pirate.js`:

```js
import React, { Component } from 'react';
import '../assets/css/Pirate.css';
import { Link } from 'react-router-dom';

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

Optional: style the links.

Test the links. Note that the Pirate Detail shows.

Pass the pirates into the Detail component.

`App.js`:

```js
<Switch>
  <Route path='/detail/:id'
    render = { () => <PirateDetail pirates={this.state.pirates} />}
  />
</Switch>
```

Note that the Pirates are now available to the Detail component as props.

Edit Pirate Detail to show some data.

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
  )
}

}

export default PirateDetail;

```

## End

Use another Array method (`find` or `filter`) on the render method's return value to display additional details for a _single_ Pirate.