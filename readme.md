# VIII - React Intro Continued

## Homework

For your final project you will create a version of the recipes list and details pages in React.

Of course, if you wish you can do something entirely original. Just propose it.

## Reading

It is important to get some hands on with 'primitive' (i.e. outside the Create React App setup) React coding.

* Spend some quality time with the exercises on [Built with React](http://buildwithreact.com) (do the simple Tutorial).
* Another useful tutorial you could try is the official [Intro to React](https://reactjs.org/tutorial/tutorial.html) tutorial.

## Routing

Make sure you are in the `react-pirates` directory.

[Quick start](https://reacttraining.com/react-router/web/guides/quick-start)

`npm install react-router-dom --save`

app

```
import { HashRouter as Router, Route } from 'react-router-dom';
import PirateDetail from './components/PirateDetail.js';
```

```
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


```
  <Route path='/' component={PirateDetail} />
  <Route path='/foo' component={PirateDetail} />
```

2 should show

`import Switch from '../node_modules/react-router-dom/Switch';`

```
      <Switch>
        <Route path='/' component={PirateDetail} />
        <Route path='/foo' component={PirateDetail} />
      </Switch>
```

NavBar.js

```
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <nav>
        <Link to='/' className="navLink">Home</Link>
      </nav>
      )
  }
}

export default NavBar;
```

```
      <NavBar />
      <Switch>
        <Route path='/' component={PirateDetail} exact={true} />
        {/* <Route path='/foo' component={PirateDetail} /> */}
      </Switch>
```





<!-- 
* `index.js`:

```js
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class Main extends React.Component {
  render() {
    return (
    <Router>
    <div>
      <Route exact path="/" component={App}/>
    </div>
  </Router>
      )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
  );
```

### Pirate Detail

Use `Header.js` as a template.

```js
import React, { Component } from 'react'

class PirateDetail extends Component {
  render() {
    return (
      <div className="pirate-detail">
        <h1>Pirate detail</h1>
      </div>
      )
  }
}

export default PirateDetail;
```

`<Route path="/pirate/:pid" component={PirateDetail} />`:

```js
import PirateDetail from './PirateDetail';

class Main extends React.Component {
  render() {
    return (
    <Router>
      <Route exact path="/" component={App}/>
      <Route path="/pirate/:pid" component={PirateDetail} />
  </Router>
      )
  }
}
```

We probably want the routing to occur in `App.js` to keep the header and replace `<Pirate />` and `<PirateForm />` -->

## Notes