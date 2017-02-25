import React, {Component} from 'react';
import wwwOSMLayer from './frontend/wwwOSM.js';
//import AutoScale from 'react-auto-scale'; //Might be useful later

class WorldWind extends Component{
  constructor(props) {
    super(props);
    this.state = {selectedLayers: [], layerlist: []};
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateWWLayers = this.updateWWLayers.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    var list = [];
    if (nextProps.selectedLayers.length) {
      nextProps.selectedLayers.split(',').forEach( (index) => {
        list.push(this.layerList[index].layer);
      });
      this.setState({ selectedLayers: list },
        () => {
          console.log(this.state.selectedLayers);
          console.log(this);
          this.updateWWLayers(list);
        });
    }
  }

  updateWWLayers(newLayersCapsList) {
    function wasLayerRemoved(name) {
      newLayersCapsList.forEach( (newLayer) => {
        if (name == newLayer.name) {
          return false;
        }
      });
      return true;
    }
    var updatedLayerList = [];
    this.serverLayers.forEach( (layer) => {
        if (wasLayerRemoved(layer.layer.name)){
          console.log("Removing layer ", layer.layer.name);
          this.globe.removeLayer(layer.layer);
        }
        else {
          updatedLayerList.push(layer);
        }
    });
    this.serverLayers = updatedLayerList;

    function isNewLayer(name, list) {
      list.forEach( (oldLayer) => {
        if (name == oldLayer.layer.name) {
          return false;
        }
      });
      return true;
    }

    newLayersCapsList.forEach( (layer) => {
      if (isNewLayer(layer.name, updatedLayerList)) {
        console.log("Adding layer ", layer.name)
        this.addNewLayerFromCaps(layer);
      }
    });
  }

  addNewLayerFromCaps(layerCaps) {
    const WorldWind = window.WorldWind;
    console.log(layerCaps);
    var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
    var SpringfieldWmsLayer = {layer: new WorldWind.WmsLayer(config, null), enabled: true};
    console.log(SpringfieldWmsLayer);
    SpringfieldWmsLayer.layer.enabled = SpringfieldWmsLayer.enabled;

    this.serverLayers.push(SpringfieldWmsLayer);
    this.globe.addLayer(SpringfieldWmsLayer.layer);
  }

  getLayerList(allLayers) {
    var layers = [],
         global_index = 0;
    allLayers.forEach( (group) => {
      group.layers.forEach( (layer, index) => {
        layers.push({label: layer.name,
          value: (global_index + index).toString(),
          layer: layer,
        })
      });
      global_index += group.layers.length;
      });
    return layers;
  }

  shouldComponentUpdate(){
      return false;
  }

  componentDidMount(){
      const WorldWind = window.WorldWind;
      const wwReact = this;
      this.serverLayers = [];
      this.globe = new WorldWind.WorldWindow(this.refs.canvasOne.id);

      var OpenStreetMapLayer = new WorldWind.OpenStreetMapImageLayer();
      var BingAerialLayer = new WorldWind.BingAerialLayer();
      var serverAddress = 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map';

      function getXMLDom (globe, serverAddress) { // Asynchronously adding layers from Sprinfield's WMS
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

          // url = 'http://localhost:3000/mapserv.xml';
          request.open("GET", url, true);
          console.log(url);
          request.onreadystatechange = function () {
              if (request.readyState === 4 && request.status === 200) {

                  var xmlDom = request.responseXML;

                  if (xmlDom && request.responseText.indexOf("<?xml") === 0) {
                      xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                      var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
                      var layerlist = wwReact.getLayerList(wmsCapsDoc.capability.layers);
                      wwReact.layerList = layerlist;
                      wwReact.setState({layerlist}, () => {
                        wwReact.props.updateLayerList(wwReact.state.layerlist);
                      });
                      // wwReact.addNewLayerFromCaps(layerlist[0].layer);
                  }
                  if (!xmlDom) {
                      alert(serverAddress + " retrieval failed. It is probably not a WMS server.");
                      return;
                  }
              }
              else {
                  console.log("didnt work");
              }
          };
          request.send(null);
      }

      // Switch default (and defunct) OSM tile server from MapQuest to OpenStreetMap test servers
      OpenStreetMapLayer.urlBuilder = {
          urlForTile: function (tile, imageFormat) {
                  //OSM Tile server only for development purposes, DO NOT use in production.
                  return "http://a.tile.openstreetmap.org/" +
                      (tile.level.levelNumber + 1) + "/" + tile.column + "/" + tile.row + ".png";
          }
      }

      // Render notice of OSM tiles copyright and tile usage policy
      // see: https://operations.osmfoundation.org/policies/tiles/
      var dc = this.globe.drawContext;
      OpenStreetMapLayer.doRender = function(dc){
          WorldWind.MercatorTiledImageLayer.prototype.doRender.call(this, dc);
          if(this.inCurrentFrame){
              dc.screenCreditController.addStringCredit(" ", WorldWind.Color.BLACK);
              dc.screenCreditController.addStringCredit(" ", WorldWind.Color.BLACK);
              dc.screenCreditController.addStringCredit("See: https://operations.osmfoundation.org/policies/tiles/", WorldWind.Color.BLACK);
              dc.screenCreditController.addStringCredit("Do not use OSM Foundation tile servers for production purposes.", WorldWind.Color.BLACK);
              dc.screenCreditController.addStringCredit("OSM tiles by \u00A9OpenStreetMap. ", WorldWind.Color.BLACK);
          }

      }

      // Create WorldWind's layers
      this.layers = [
          {layer: new WorldWind.BMNGOneImageLayer(), enabled: false},
          {layer: new WorldWind.BingRoadsLayer(), enabled: false},
          {layer: BingAerialLayer, enabled: false},
          {layer: OpenStreetMapLayer, enabled: true},
          {layer: new WorldWind.CompassLayer(), enabled: true},
          {layer: new WorldWind.CoordinatesDisplayLayer(this.globe), enabled: true},
          {layer: new WorldWind.ViewControlsLayer(this.globe), enabled: true}
      ];

      // Create layers.
      for (var l = 0; l < this.layers.length; l++) {
          this.layers[l].layer.enabled = this.layers[l].enabled;
          this.globe.addLayer(this.layers[l].layer);
      }

      // Create Springfield layer from WMS
      getXMLDom(this.globe, serverAddress);

      // Create 3D buildings
      //wwwOSMLayer(this.globe, WorldWind, OpenStreetMapLayer);

      //let {initialCenter, zoom} = this.props;
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
