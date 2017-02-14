import React, { Component } from 'react';
//import logo from './logo.svg';
import WorldWind from './WorldwindReact';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id="myDiv">
          <WorldWind/>
      </div>
    );
  }
}

export default App;
