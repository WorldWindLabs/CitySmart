import React, {Component} from 'react';
import AutoScale from 'react-auto-scale';
import wwwOSMLayer from './frontend/wwwOSM.js';

export default class extends Component{

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){

        this.map = new WorldWind.WorldWindow(this.refs.canvasOne.id);

        // update OSM server
        var osmLayer = new WorldWind.OpenStreetMapImageLayer();
        osmLayer.urlBuilder = {
                urlForTile: function(tile, imageFormat) {
                    return "http://c.tile.osm.org/" +
                        (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
                }
            };

        var layers = [
            {layer: osmLayer, enabled: true},
            {layer: new WorldWind.BMNGLayer(), enabled: false},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(this.map), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(this.map), enabled: true}
        ];

        // Create those layers.
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.map.addLayer(layers[l].layer);
        }

       wwwOSMLayer(this.map, window.WorldWind, osmLayer);
    }

    render() {
        return(
            <div>
                <AutoScale>
                    <canvas id="canvasOne" ref="canvasOne" style={{height: 500}}>
                        Your browser does not support HTML5 Canvas.
                    </canvas>
                </AutoScale>
            </div>
        )
    }
}
