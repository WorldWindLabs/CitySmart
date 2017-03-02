import React, {Component} from 'react';
import wwwOSMLayer from './frontend/wwwOSM.js';
//import AutoScale from 'react-auto-scale'; //Might be useful later

class WorldWind extends Component{
  constructor(props) {
    super(props);
    this.state = {
      layersList: [],
      layersSelected: [],
      serversList: [],
      serversSelected: [],
    };
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.updateWWLayers = this.updateWWLayers.bind(this);
    this.addServer = this.addServer.bind(this);
    this.removeServer = this.removeServer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layersSelected !== nextProps.layersSelected) {
      var list = [];
      if (nextProps.layersSelected.length) {
        nextProps.layersSelected.split(',').forEach( (name) => {
          list.push(this.layerMap[name].layer);
        });
      }
      this.setState({layersSelected: list},
        () => {
          this.updateWWLayers(list);
        });
    }

    Array.prototype.diff = function(a) {
      return this.filter(function(b) {
        for (var i of a) {
          if (i.value == b.value) {
            return false;
          }
        }
        return true;
      });
    };

    if (this.props.serversSelected !== nextProps.serversSelected) {
      var old = this.props.serversSelected;
      // console.log(old);
      var next = nextProps.serversSelected;
      // console.log(next);

      var removeList = old.diff(next);
      // console.log(removeList);
      removeList.forEach((newServer) => {
        this.removeServer(newServer.value, newServer.label);
      });

      var addList = next.diff(old);
      // console.log(addList);
      addList.forEach((newServer) => {
        this.addServer(newServer.value, newServer.label);
      });
    }

  }

  updateWWLayers(newLayersCapsList) {
    function wasLayerRemoved(name) {
      var result = true;
      newLayersCapsList.forEach( (newLayer) => {
        if (name == newLayer.title) {
          result = false;
        }
      });
      return result;
    }
    var updatedLayerList = [];
    this.serverLayers.forEach( (layer) => {
        if (wasLayerRemoved(layer.layer.displayName)){
          console.log("Removing layer ", layer.layer.displayName);
          this.globe.removeLayer(layer.layer);
          this.serverLayers = this.serverLayers.filter( (serverlayer) => {
              return serverlayer.layer.displayName != layer.layer.displayName;
          });

        }
    });

    var isNewLayer = function(name) {
      var result = true;
      this.serverLayers.forEach( (oldLayer) => {
        if (name == oldLayer.layer.displayName) {
          result = false;
        }
      });
      return result;
    }
    isNewLayer = isNewLayer.bind(this);


    newLayersCapsList.forEach( (layer) => {
      if (isNewLayer(layer.title)) {
        console.log("Adding layer ", layer.title)
        this.addNewLayerFromCaps(layer);
      }
    });
  }

  addNewLayerFromCaps(layerCaps) {
    const WorldWind = window.WorldWind;
    var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
    var WmsLayer = {layer: new WorldWind.WmsLayer(config, null), enabled: true};
    WmsLayer.layer.enabled = WmsLayer.enabled;

    this.serverLayers.push(WmsLayer);
    this.globe.addLayer(WmsLayer.layer);
  }

  getLayerList(allLayers, serverName) {
    var layers = [],
         global_index = 0;
     if (allLayers.layers) {
       allLayers.layers.forEach( (sublayer, subindex) => {
         layers = layers.concat(
           this.getLayerList(sublayer, serverName));
       });
     }
     else {
       var layer = allLayers;
       this.layerMap[layer.title] = {layer, server: serverName};
       return [{label: layer.title,
        //  value: (Object.keys(this.layerMap).length - 1).toString(),
         value: layer.title,
         layer: layer,
         server: serverName,
       }];
     }
    return layers;
  }

  shouldComponentUpdate(){
      return false;
  }

  removeServer(serverAddress, label) {
    console.log("removeServer: to be implemented");
    var serversSelected = this.props.serversSelected.filter((server) => {
      return !(server.value == serverAddress && server.label == label);
    });

    var layersList = this.state.layersList.filter((layer) => {
      return !(layer.server == label);
    });
    this.setState({layersList});
    this.props.updateLayerList({serversSelected, layersList});

  }

  addServer(serverAddress = 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map', label) {
    // serverAddress = 'neowms.sci.gsfc.nasa.gov/wms/wms';
    const wwReact = this;
    const WorldWind = window.WorldWind;

    if (!serverAddress) {
        return;
    }

    function buildUrl(serverAddress) {
      serverAddress = serverAddress.trim();

      serverAddress = serverAddress.replace("Http", "http");
      if (serverAddress.lastIndexOf("http", 0) != 0) {
          serverAddress = "http://" + serverAddress;
      }

      var url = WorldWind.WmsUrlBuilder.fixGetMapString(serverAddress);
      url += "service=WMS&request=GetCapabilities&vers";

      return url;
    }

    var url = buildUrl(serverAddress)
        , request = new XMLHttpRequest();

    // url = 'http://localhost:3000/mapserv.xml';
    request.open("GET", url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {

            var xmlDom = request.responseXML;

            if (xmlDom && request.responseText.indexOf("<?xml") === 0) {
                xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
                var layerlist = wwReact.getLayerList(wmsCapsDoc.capability.layers[0] , wmsCapsDoc.service.title);
                wwReact.setState({layersList: wwReact.state.layersList.concat(layerlist)}, () => {
                  var serversList = wwReact.props.serversList.map((server) => {
                    return server.value == serverAddress ?
                      {...server, label: wmsCapsDoc.service.title} : server;
                  });
                  var serversSelected = wwReact.props.serversSelected.map((server) => {
                    return server.value == serverAddress ?
                      {...server, label: wmsCapsDoc.service.title} : server;
                  });

                  wwReact.props.updateLayerList({layersList: wwReact.state.layersList, serversList, serversSelected});
                });
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

  componentDidMount(){
      const WorldWind = window.WorldWind;
      const wwReact = this;
      this.serverLayers = [];
      this.layerMap = {};
      this.globe = new WorldWind.WorldWindow(this.refs.canvasOne.id);

      var OpenStreetMapLayer = new WorldWind.OpenStreetMapImageLayer();
      var BingAerialLayer = new WorldWind.BingAerialLayer();
      var serverAddress = 'http://199.79.36.155/cgi-bin/mapserv?map=WorldWind.map';

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
      // this.addServer();

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
