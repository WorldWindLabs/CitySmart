import React, {Component} from 'react';
import SelectLayer from './SelectLayer.js';
import ServerSelection from './ServerSelection.js';
import 'react-select/dist/react-select.css';

class SideBar extends Component{
    constructor(props) {
      super(props);
      this.state = {
        layersList: [],
        layersSelected: [],
        serversList: [],
        serversSelected: [],
      };

      this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        layersList: nextProps.layersList,
        serversList: nextProps.serversList,
        serversSelected: nextProps.serversSelected,
      });
    }

    componentDidMount() {
    }

    handleSelect(selected) {
        this.setState(selected);
        this.props.onSelectLayer(selected);
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
                {/*&emsp;<input></input> <b>Search</b>*/}
                <br/>
                <ServerSelection
                    label="+ Server"
                    serversList={this.state.serversList}
                    serversSelected={this.state.serversSelected}
                    onChange={this.handleSelect.bind(this)}
                />
                <br/><br/>
                <SelectLayer
                    name="form-field-name"
                    onChange={this.handleSelect.bind(this)}
                    layerList={this.state.layersList}
                    label="+ Layer"
                />
            </div>
        );
    }
}

export default SideBar;
