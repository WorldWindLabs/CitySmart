import React, {Component} from 'react';
import AutoScale from 'react-auto-scale';

export default class extends Component{

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){

        const WorldWind = window.WorldWind;

        this.map = new WorldWind.WorldWindow(this.refs.canvasOne.id);

        var OpenStreetMapsLayer = new WorldWind.OpenStreetMapImageLayer();
        OpenStreetMapsLayer.urlBuilder = {
            urlForTile: function (tile, imageFormat) {
                    //OSM Tile server only for development purposes, DO NOT use in production.
                    // see tile usage policy: https://operations.osmfoundation.org/policies/tiles/
                    return "http://a.tile.openstreetmap.org/" +
                        (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
            }
        }


        var layers = [
            {layer: new WorldWind.BMNGOneImageLayer(), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(), enabled: true},
            {layer: OpenStreetMapsLayer, enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(this.map), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(this.map), enabled: true}
        ];

        // Create those layers.
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.map.addLayer(layers[l].layer);
        }
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
