import React, { Component } from 'react';
import WorldWind from './WorldwindReact';
import SideBar from './SideBar.js';
//import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {selectedLayers: [], layerList: []};
  }

  updateAppLayerList(layerList) {
    this.setState({layerList})
  }

  handleSelectLayerUI(selectedLayers) {
      this.setState({ selectedLayers });
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
            <SideBar onSelectLayer={this.handleSelectLayerUI.bind(this)}
              layerList={this.state.layerList}/>
            <WorldWind selectedLayers={this.state.selectedLayers}
              updateLayerList={this.updateAppLayerList.bind(this)}/>
        </div>


    );
  }
}

export default App;
