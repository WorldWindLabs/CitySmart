import React, {Component} from 'react';
import SelectLayer from './SelectLayer.js';
import 'react-select/dist/react-select.css';

class SideBar extends Component{
    constructor(props) {
      super(props);
      this.state = {selectedLayers: [], layerList: []};
      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ layerList: nextProps.layerList });
    }

    componentDidMount() {
    }

    handleSelectLayer(selectedLayers) {
        this.setState({ selectedLayers });
        this.props.onSelectLayer(selectedLayers);
    }

    render(){
        const style = {
            backgroundColor: '#4F628E',
            justifyContent: 'center',
            padding: 20,
            width: 250,
            height: '95vh'
            //float: 'left',

        }

        const header = {
            textAlign: 'center',
            lineHeight: 0.4,
            padding: 30
        }

        const imageStyle = {
            display: 'block',
            margin: 'auto',
            width: 130,
            align: 'center',
            // padding: '10%'
        }

        return(
            <div style={style}>
                <div><img src={require('./DelBiancoLogo.png')} style={imageStyle}/></div>
                <div style={header}><b>DelBianco</b><br/><h1>CitySmart</h1></div>
                {/*Placehoder UI elements*/}
                &emsp;<input></input> <b>Search</b>
                <br/>
                <h3>
                    <p>&emsp;+ Layers</p>
                    <h5>&emsp;&emsp; OpenStreetMap</h5>
                    <h5>&emsp;&emsp; Springfield Fire Reporting</h5>
                    <br/>
                    <p>&emsp;+ Servers</p>
                </h3>
                    &emsp;<input></input> <b>Add</b>
                <SelectLayer
                    name="form-field-name"
                    onChange={this.handleSelectLayer.bind(this)}
                    layerList={this.state.layerList}
                />
            </div>
        );
    }
}

export default SideBar;
