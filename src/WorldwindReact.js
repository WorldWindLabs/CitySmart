import React, {Component} from 'react';
//import AutoScale from 'react-auto-scale'; //Might be useful later

class WorldWind extends Component{

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){

        const WorldWind = window.WorldWind;

        this.globe = new WorldWind.WorldWindow(this.refs.canvasOne.id);

        var OpenStreetMapLayer = new WorldWind.OpenStreetMapImageLayer();
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

        let {initialCenter, zoom} = this.props;
     }

    render() {
        const style = {
            width: '100vw',
            height: '99vh',
            align: 'center'
        }

        return(
            <section>
                <canvas id="canvasOne" ref="canvasOne" style={style}>
                    Your browser does not support HTML5 Canvas.
                </canvas>
            </section>
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


