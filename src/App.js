import React, { Component } from 'react';
import WorldWind from './WorldwindReact';
import SideBar from './SideBar.js';
//import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      layersList: [],
      layersSelected: [],
      serversList: [],
      serversSelected: [],
    };
  }

  handleSelect(list) {
    this.setState(list);
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh',
      //alignItems: 'center',
      backgroundColor: '#2E4272',
      display: 'flex',
      color: '#fff',
      fontFamily: 'Tahoma, Verdana, Segoe, sans-serif'

    }

    return (

        <div style={style}>
            <SideBar onSelectLayer={this.handleSelect.bind(this)}
              layersList={this.state.layersList}
              serversSelected={this.state.serversSelected}
              serversList={this.state.serversList}
            />
            <WorldWind layersSelected={this.state.layersSelected}
              updateLayerList={this.handleSelect.bind(this)}
              serversSelected={this.state.serversSelected}
              serversList={this.state.serversList}
            />
        </div>


    );
  }
}

export default App;
