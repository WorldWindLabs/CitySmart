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
        var serverAddress = 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map';


        //function resolveAfter2Seconds(x) {   return new Promise(resolve => {setTimeout(() => {resolve(x);}, 2000);}); }

        function getXMLDom () {
            if (!serverAddress) {
                return;
            }

            serverAddress = serverAddress.trim();

            serverAddress = serverAddress.replace("Http", "http");
            if (serverAddress.lastIndexOf("http", 0) != 0) {
                serverAddress = "http://" + serverAddress;
            }

            var thisExplorer = this,
                request = new XMLHttpRequest(),
                url = WorldWind.WmsUrlBuilder.fixGetMapString(serverAddress);

            url += "service=WMS&request=GetCapabilities&vers";

            request.open("GET", url, true);
            request.onreadystatechange = function () {
                //console.log(request);
                if (request.readyState === 4 && request.status === 200) {
                    
                    var xmlDom = request.responseXML;
                    
                    if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                        xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                    
                    }

                    if (!xmlDom) {
                        alert(serverAddress + " retrieval failed. It is probably not a WMS server.");
                        return;
                    }

                    var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
                    console.log(wmsCapsDoc);
                    var SpringfieldWmsLayer = {layer: new WorldWind.WmsLayer(wmsCapsDoc), enabled: true};
                    console.log('Im here2');
                    console.log(SpringfieldWmsLayer);
                    this.globe.addLayer(SpringfieldWmsLayer);


                } else if (request.readyState === 4) {
                    if (request.statusText) {
                        alert(request.responseURL + " " + request.status + " (" + request.statusText + ")");
                    } else {
                        alert("Failed to retrieve WMS capabilities from " + serverAddress + ".");
                    }
                }

                return xmlDom;
            };

            request.send(null);

        }

        // var springfieldConfig = {
        //     service: 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map&service=wms&version=1.1.1',
        //     sector: new WorldWind.Sector(-90, 90, -180, 180),
        //     levelZeroDelta: new WorldWind.Location(),
        //     format: 'image/png',
        //     numLevels: '12',
        //     size: 193,
        //     layerNames: 'fireprotectionarea1'
        // }

        // var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
        // var SpringfieldWmsLayer = new WorldWind.WmsLayer(wmsCapsDoc);


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
            // {layer: SpringfieldWmsLayer, enabled: false},
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

        getXMLDom();

       //wwwOSMLayer(this.globe, WorldWind, OpenStreetMapLayer);

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


