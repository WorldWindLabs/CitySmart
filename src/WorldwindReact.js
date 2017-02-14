import React, {Component} from 'react';

export default class extends Component{
    
    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){

        this.map = new window.WorldWind.WorldWindow(this.refs.canvasOne.id);
        var layers = [
            {layer: new window.WorldWind.BMNGLayer(), enabled: true},
            {layer: new window.WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new window.WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new window.WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new window.WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new window.WorldWind.CompassLayer(), enabled: true},
            {layer: new window.WorldWind.CoordinatesDisplayLayer(this.map), enabled: true},
            {layer: new window.WorldWind.ViewControlsLayer(this.map), enabled: true}
        ];

        // Create those layers.
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.map.addLayer(layers[l].layer);
        }
    }
     
    render() {
        return(
            <canvas id="canvasOne" ref="canvasOne">
                Your browser does not support HTML5 Canvas.
            </canvas>
        );
    }
}