import React, { Component } from 'react';
import logo from './logo.svg';
import WorldWind from './components/worldwind-react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div style={{height: '100%'}} >
        Map me!
        <WorldWind/>
      </div>
    );
  }
}

export default App;
