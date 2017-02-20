import React, {Component} from 'react';
import wwwOSMLayer from './frontend/wwwOSM.js';
//import AutoScale from 'react-auto-scale'; //Might be useful later

class WorldWind extends Component{

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){

        const WorldWind = window.WorldWind;

        this.globe = new WorldWind.WorldWindow(this.refs.canvasOne.id);

        var OpenStreetMapLayer = new WorldWind.OpenStreetMapImageLayer();
        var BingAerialLayer = new WorldWind.BingAerialLayer();

        // var springfieldConfig = {
        //     service: 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map&service=wms&version=1.1.1',
        //     sector: new WorldWind.Sector(-90, 90, -180, 180),
        //     levelZeroDelta: new WorldWind.Location(),
        //     format: 'image/png',
        //     numLevels: '12',
        //     size: 193,
        //     layerNames: 'fireprotectionarea1'
        // }

        // var SpringfieldWmsLayer = new WorldWind.WmsLayer(springfieldConfig);


        OpenStreetMapLayer.urlBuilder = {
            urlForTile: function (tile, imageFormat) {
                    //OSM Tile server only for development purposes, DO NOT use in production.
                    // see tile usage policy: https://operations.osmfoundation.org/policies/tiles/
                    return "http://a.tile.openstreetmap.org/" +
                        (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
            }
        }

        // TODO: Change or remove "Tiles Courtesy of MapQuest" message

        var layers = [
            {layer: new WorldWind.BMNGOneImageLayer(), enabled: false},
            {layer: new WorldWind.BingRoadsLayer(), enabled: false},
            {layer: BingAerialLayer, enabled: false},
            //{layer: SpringfieldWmsLayer, enabled: false},
            {layer: OpenStreetMapLayer, enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(this.globe), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(this.globe), enabled: true}
        ];

        // Create those layers.
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.globe.addLayer(layers[l].layer);
        }

       wwwOSMLayer(this.globe, WorldWind, OpenStreetMapLayer);

       let {initialCenter, zoom} = this.props;
     }

    render() {
        const style = {
            backgroundColor: '#7887AB',
            //flexDirection: 'column',
            flexGrow: 1
            //height: '500',
            //flex: 1,
            //align: 'center'
        }

        return(
            <canvas id="canvasOne" ref="canvasOne" style={style}>
                Your browser does not support HTML5 Canvas.
            </canvas>
        )
    }
}

WorldWind.propTypes = {
    worldwind: React.PropTypes.object,
    zoom: React.PropTypes.number,
    initialCenter: React.PropTypes.object
}

WorldWind.defaultProps = {
    zoom: 15,
    // Florence by default
    initialCenter: {
        lat: 43.7696,
        lng: 11.2558
    }
}

export default WorldWind;


