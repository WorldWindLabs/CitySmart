import React, {Component} from 'react';

export default class extends Component{
    
    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        new WorldWind.WorldWindow("canvasOne");
    }
    
    render() {
        return(
        <div id="map" ref="canvasOne" />
        );
    }
}