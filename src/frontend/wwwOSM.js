import $ from 'jquery';
import globals from '../global.js';
import buildGeometries from './buildGeometries.js';

export default function wwwOSM(wwd, WorldWind, osmLayer) {

    var shapesLayer = new WorldWind.RenderableLayer("wwwOSM");
    wwd.addLayer(shapesLayer);
    var _shapeAttributes = new WorldWind.ShapeAttributes(null);

    /**
     * APIs Endpoint
     * @type {string}
     */
    var endpoint = "http://ec2-35-166-171-213.us-west-2.compute.amazonaws.com:8080";

    /*
    disable Web World Wind logging
     */
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_NONE);

    /*
     Layer with the OpenStreetMap geometries
     */
    var shapesLayer = new WorldWind.RenderableLayer("wwwOSM");
    wwd.addLayer(shapesLayer);
    var _shapeAttributes = new WorldWind.ShapeAttributes(null);

    /*
     Globe elevation settings
     */
    var globe = wwd.globe;
    globe.elevationModel = new WorldWind.ZeroElevationModel();

    /*
     Map projection settings
     */
    var map = new WorldWind.Globe2D();
    map.elevationModel = new WorldWind.EarthElevationModel();
    map.projection = new WorldWind.ProjectionEquirectangular();

    /*
     Default Location -> Trento, city centre
     */
    wwd.navigator.lookAtLocation.latitude = 46.06686259487552;
    wwd.navigator.lookAtLocation.longitude = 11.120719683053174;
    wwd.navigator.range = 170.55557907761514;
    wwd.navigator.tilt = 61;

    /*
     Apply
     */
    wwd.redraw();

    /*
     Internal use variables
     */
    var oldTiles = 0;
    var currentLayer = osmLayer;
    var db = [];
    var activeTiles = [];
    var highlightedGeoms = [];
    var lastRedraw = 0;
    var redrawThreshold = 800;
    var highlightPolygons = [];

    /**
     * Render a polygon
     * @param entry Polygon object
     */
    var renderPolygon = function(entry){
        entry.visible = true;
        entry._attributes._drawOutline = globals.drawOutlineFlag;
        shapesLayer.addRenderable(entry);
    }

    /**
     * Render the enabled geometries of the provided tile
     * @param tile Tile object
     */
    var drawTile = function(tile){

        /**
         * Internal use
         */

        var isGeomEnabled = function(entity, typeId){
            var list = undefined;

            if (entity === globals.POLYGON) {
                list = globals.types.polygonEnabled;
            } else if (entity === globals.LINE) {
                list = globals.types.lineEnabled;
            } else {
                list = globals.types.pointEnabled;
            }

            if (list){
                for (var i in list){
                    if (list[i] === typeId){
                        return true;
                    }
                }
            }
            return false;
        }


        if (tile.draw === undefined || tile.draw === null || tile.points === null){
            tile.draw = {polygons: [], lines: [], points: []};
            buildGeometries(tile, tile.draw.polygons, tile.draw.lines, tile.draw.points, tile.geometries, false, WorldWind, shapesLayer);
        }

        /**
         * Internal use
         */
        var isHighlighted = function(id){
            for (var i in highlightPolygons){
                if (parseInt(highlightPolygons[i].osmid) === parseInt(id)){
                    return true;
                }
            }
            return false;
        }


        tile.draw.polygons.forEach(function (entry) {
            if (isGeomEnabled(globals.POLYGON, entry.typeId)){
                if (!isHighlighted(entry.osmid)){
                    renderPolygon(entry);
                }

            }
        });

        tile.draw.lines.forEach(function (entry) {
            if (isGeomEnabled(globals.LINE, entry.typeId)){
                entry.visible = true;
                shapesLayer.addRenderable(entry);
            }
        });

        tile.draw.points.forEach(function (entry) {
            if (isGeomEnabled(globals.POINT, entry.typeId)){
                entry.visible = true;
                shapesLayer.addRenderable(entry);
            }
        });
    }

    /**
     * Internal use
     */
    var redrawEvent = function(){
        setTimeout(function() {
            redrawEvent_aux();

        }, 0);
    }

    /**
     * Internal use
     */
    var redrawEvent_aux = function(){

        /**
         * Internal use
         */
        var refreshTiles = function(){

            /**
             * Internal use
             */
            var storeTile = function(tile){
                db.push(tile);
            }

            /**
             * Internal use
             */
            var getTileFromServer = function(tile) {
                var request = {
                    maxLatitude : tile.sector.maxLatitude,
                    maxLongitude : tile.sector.maxLongitude,
                    minLatitude : tile.sector.minLatitude,
                    minLongitude : tile.sector.minLongitude,
                    lod: tile.level.levelNumber
                };

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(request),
                    url:   endpoint+"/bbox",
                    success: function(result) {
                        tile.geometries = result.geometries;
                        do1(tile);
                    },

                    fail: function (){console.log("fail")},
                    async:      true,
                    crossDomain:true
                });

            }


            /**
             * Internal use
             */
            var fun_a = function(tile){
                drawTile(tile);
                activeTiles.push(tile);
                fun_b();
            }

            /**
             * Internal use
             */
            var do1 = function(tile){
                storeTile(tile);
                fun_a(tile);
            }

            /**
             * Internal use
             */
            var fun_b = function(){
                for (var j in activeTiles){
                    var found = false;
                    for (var i in currentLayer.currentTiles){
                        if (currentLayer.currentTiles[i].tileKey === activeTiles[j].tileKey){
                            found = true;
                            break;
                        }
                    }

                    if (!found){
                        eraseTile(activeTiles[j]);
                        activeTiles.splice(j, 1);
                    }
                }
            }

            /**
             * Internal use
             */
            var getTile = function(tile) {
                var found = false;

                for (var i in db){
                    if (db[i].tileKey === tile.tileKey){
                        tile = db[i];
                        found = true;
                        break;
                    }
                }

                if (found){
                    fun_a(tile);
                } else {
                    getTileFromServer(tile);
                }
            }

            /**
             * Internal use
             */
            var isTileActive = function(tile){
                for (var i in activeTiles){
                    if (activeTiles[i].tileKey === tile.tileKey){
                        return true;
                    }
                }

                return false;
            }

            /**
             * Internal use
             */
            var eraseTile = function(tile){
                if (tile.draw){
                    tile.draw.polygons.forEach(function (entry){
                        shapesLayer.removeRenderable(entry);
                    });

                    tile.draw.lines.forEach(function (entry){
                        shapesLayer.removeRenderable(entry);
                    });

                    tile.draw.points.forEach(function (entry){
                        shapesLayer.removeRenderable(entry);
                    });
                }
            }

            var tile = undefined;


            for (var i in currentLayer.currentTiles){
                tile = currentLayer.currentTiles[i];

                if (isTileActive(tile)) {
                    fun_b();
                } else {
                    getTile(tile);
                }

            }
        }

        /**
         * Internal use
         */
        var checkTiles = function(){

            var currentTime = new Date().getTime();
            if ((currentTime - lastRedraw) > redrawThreshold){
                lastRedraw = currentTime;
                setTimeout(function() {
                    //console.log("redraw");
                    var currentLength = currentLayer.currentTiles.length;
                    if (oldTiles !== currentLength){
                        refreshTiles();
                        wwd.redraw();
                    }

                    oldTiles = currentLength;

                }, 0);
            }


        }

        checkTiles();
    }

    var highlightedItems = [];
    var handlePick = function (o) {
        // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
        // the mouse or tap location.
        var x = o.clientX,
            y = o.clientY;

        var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

        // De-highlight any previously highlighted placemarks.
        for (var h = 0; h < highlightedItems.length; h++) {
            highlightedItems[h].highlighted = false;
        }
        highlightedItems = [];

        // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
        // relative to the upper left corner of the canvas rather than the upper left corner of the page.
        var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
        if (pickList.objects.length > 0) {
            //console.log(pickList.objects.length+ " objs have been picked");
            redrawRequired = true;
        }

        // Highlight the items picked by simply setting their highlight flag to true.
        if (pickList.objects.length > 0) {
            for (var p = 0; p < pickList.objects.length; p++) {
                pickList.objects[p].userObject.highlighted = true;

                // Keep track of highlighted items in order to de-highlight them later.
                highlightedItems.push(pickList.objects[p].userObject);

                // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                // If instead the user picked the placemark's image, the "labelPicked" property is false.
                // Applications might use this information to determine whether the user wants to edit the label
                // or is merely picking the placemark as a whole.
                if (pickList.objects[p].labelPicked) {
                    //console.log("Label picked");
                }
            }
        }

        // Update the window if we changed anything.
        if (redrawRequired) {
            wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
        }
    };
    //wwd.addEventListener("dbclick", handlePick);

    /**
     * Canvas in which Web World Wind is embedded
     * @type {Element}
     */
    var canvas = document.getElementById("canvasOne");
    /**
     * Fire the Redraw Event in order to redraw the OSM geometries if it is necessary
     */
    canvas.addEventListener(WorldWind.REDRAW_EVENT_TYPE, function(){
        setTimeout(function() {
            redrawEvent_aux();
        }, 0);

    }, false);


    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

