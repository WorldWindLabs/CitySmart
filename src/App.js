import React, { Component } from 'react';
import logo from './logo.svg';
import WorldWind from './worldwind-react';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
      <script src="%PUBLIC_URL%/worldwind.js"></script>
        WorldWind should be below
        <div  style={{height: '100%'}}>
          <WorldWind/>
        </div>
      </div>
    );
  }
}

export default App;
