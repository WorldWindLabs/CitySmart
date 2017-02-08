import React, { Component } from 'react';
//import logo from './logo.svg';
import WorldWind from './worldwind';
import './App.css';

class App extends Component {

  

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
          <WorldWind/>
      </div>
    );
  }
}

export default App;
