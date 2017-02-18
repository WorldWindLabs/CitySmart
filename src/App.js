import React, { Component } from 'react';
import WorldWind from './WorldwindReact';
//import './App.css';

class App extends Component {

  constructor(props){
    super(props);
  }

  render() {

    const style = {
      width: '100vw',
      height: '100vh',
      alignItems: 'center'
    }

    return (
      
        <div style={style}>
            <WorldWind/>
        </div>
      
    );
  }
}

export default App;
