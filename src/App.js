import React, { Component } from 'react';
import WorldWind from './WorldwindReact';
import './App.css';
import AutoScale from 'react-auto-scale';

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      
        <div id="myDiv" class="container">
            <WorldWind/>
        </div>
      
    );
  }
}

export default App;
