(function(theme)
{
    theme.views.register('image-control', 'control',
    {
        _source: 'shared/common/image-control',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.imageLayer = undefined;
                self.vectorLayer = undefined;

                self.selectedPolygon = undefined;

                self.imagesAudit = {};
            },
            _create: function()
            {
                var self = this;

                self._super();

                //EVENT HANDLERSs
                var baseLayerChanged = function(event)
                {
                    IMu.log('image-control : baseLayerChanged - layer ID {0}', event.layer.id);
                    IMu.log('image-control : baseLayerChanged - baseLayer ID {0}', event.object.baseLayer.id);

                    var layerId = event.object.baseLayer.id;

                    event.layer.map.zoomToMaxExtent();
                    self.clearVectorFeatures();

                    if(layerId in self.imagesAudit)
                    {
                        if (self.imagesAudit[layerId].state || self.imagesAudit[layerId].polygons)
                        {
                            self.widget.setProperties(self.imagesAudit[layerId]);
                        }
                    }
                }

                var change = function(event, type)
                {
                    IMu.log('image-control : change - {0} change triggered', event.type);
                    var layerId = undefined;

                    if(this.baseLayer)
                        layerId = this.baseLayer.id;
                    else if (this.map.baseLayer)
                        layerId = this.map.baseLayer.id;

                    if (layerId in self.imagesAudit)
                    {
                        self.imagesAudit[layerId].state = self.getState();
                        self.imagesAudit[layerId].polygons = self.getPolygons();
                    }

                    self.widget.doChange();
                }

                var layerChanged = function(event, type)
                {
                    IMu.log('image-control : layerChanged triggered');

                    var layerId = event.layer.id;
                    var baseLayerId = this.baseLayer.id;
                    var name = event.layer.name;
                    var vis = event.layer.visibility;

                    if(vis == false)
                    {
                        // Get Current state and Polygons
                        IMu.log('image-control : mapChangeLayer - hide {0}({1})',layerId,name);

                        var state = self.getState();
                        var polygons = self.getPolygons();

                        if (layerId in self.imagesAudit)
                        {
                            self.imagesAudit[layerId].state = state;
                            self.imagesAudit[layerId].polygons = polygons;
                        }
                        if(baseLayerId in self.imagesAudit )
                        {
                            if (self.imagesAudit[baseLayerId].state || self.imagesAudit[baseLayerId].polygons)
                            {
                                self.widget.setProperties(self.imagesAudit[baseLayerId]);
                            }
                        }
                        else
                        {
                            self.imagesAudit[layerId] = {
                                "state": state,
                                "polygons": polygons
                            };
                        }
                    }
                    else if (vis == true)
                    {
                        // set properties on new image
                        IMu.log('image-control : mapChangeLayer - show {0}({1})',layerId,name);

                        if (layerId in self.imagesAudit)
                        {
                            self.widget.setProperties(self.imagesAudit[layerId]);
                        }
                    }
                }

                var onVectorSelected = function(feature)
                {
                    IMu.log('image-control : onVectorSelected triggered');

                    // var geoJson = new OpenLayers.Format.GeoJSON();
                    // var str = geoJson.write(feature, true);
                    // var obj = JSON.parse(str);
                    // self.setPolygon = obj.geometry.coordinates[0];
                }

                var removeCurrentLayer = function()
                {
                    if (self.imageLayer)
                    {
                        var baseLayerId = self.imageLayer.baseLayer.id;

                        for (var i = 0; i < self.imageLayer.layers.length; i++) 
                        {
                            var layer = self.imageLayer.layers[i];

                            if (baseLayerId == layer.id)
                            {
                                self.imageLayer.removeLayer(layer);
                                delete self.imagesAudit[layer.id];

                                if(layer.id in self.imagesAudit)
                                {
                                    self.imageLayer.setBaseLayer(layer);
                                    break;
                                }
                            }
                        };

                        for (var i = 0; i < self.widget.images.length; i++) 
                        {
                            var image = self.widget.images[i]

                            if (baseLayerId == image.id)
                            {
                                self.widget.images.splice(i,1);
                                break;
                            }
                        };
                        self.widget.autoHideLayerSelect();
                    }
                }

                var removePolygon = function()
                {
                    if (self.imageLayer && self.vectorLayer)
                    {
                        if (self.vectorLayer.features.length == 0)
                            return;
                        if (self.vectorLayer.selectedFeatures.length == 0)
                            return;

                        var selectedFeatures = self.vectorLayer.selectedFeatures;

                        while (selectedFeatures.length > 0) 
                        {
                            var feature = selectedFeatures[0];
                            feature.destroy();
                        }
                    }
                }

                var height = self.content.height();
                if (! height || height < 100)
                {
                    var height = self.widget.getOption('height');
                    if (! height)
                        height = 400;

                    self.content.height(height);
                }

                self.imageLayer = new OpenLayers.Map(self.content[0],
                {
                    units: 'pixels'
                });

                // IMAGE LAYER EVENTS
                self.imageLayer.events.on(
                {
/* The next 2 lines were removed to fix bug outlined in Jira IMU-318
** Though it introduced another issue where image-capture-control would not
** mark the form as being edited.
** As such, the lines have been re-added.
** Image capture should be investigated to see if we can trigger the change
** event after a user successfully adds an image.
*/
                    "moveend": change,
                    "zoomend": change,
                    "changebaselayer": baseLayerChanged,
                    "changelayer": layerChanged
                });

                self.vectorLayer = new OpenLayers.Layer.Vector("Vector Layer",
                {
                    'displayInLayerSwitcher': false
                });

                self.vectorLayer.events.on(
                {
                    "featuremodified": change,
                    "featureselected" : onVectorSelected
                });

                //CONTROLS
                var removeCurrentLayer = new OpenLayers.Control.Button(
                {
                    title: "Remove Layer",
                    trigger: removeCurrentLayer,
                    type: OpenLayers.Control.TYPE_BUTTON,
                    displayClass: "olControlRemoveCurrentLayer"
                })

                var navigationControl = new OpenLayers.Control.Navigation(
                    {
                        title: "Navigation",
                        displayClass: 'olControlNavigation'
                    });

                var modifyControl = new OpenLayers.Control.ModifyFeature(self.vectorLayer,
                {
                    title: "Edit Polygons",
                    'displayClass': 'olControlDrawFeaturePoint'
                });
                modifyControl.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
                modifyControl.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
                modifyControl.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
                modifyControl.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
                modifyControl.mode |= OpenLayers.Control.ModifyFeature.DRAG;
                modifyControl.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;

                modifyControl.events.on(
                {
                    "featuremodified": change
                });

                var removePolygon = new OpenLayers.Control.Button(
                {
                    title: "Remove Polygon/s",
                    trigger: removePolygon,
                    type: OpenLayers.Control.TYPE_BUTTON,
                    displayClass: "olControlRemovePolygon"
                });

                var polygonControl = new OpenLayers.Control.DrawFeature(self.vectorLayer, OpenLayers.Handler.Polygon,
                {
                    title: "Draw Polygons",
                    'displayClass' : 'olControlDrawFeaturePolygon'
                });

                polygonControl.events.on(
                {
                    "beforefeatureadded": change,
                    "featureadded": change,
                    "featuremodified": change
                });

                var panelControls = [
                    removeCurrentLayer,
                    navigationControl,
                    modifyControl,
                    removePolygon,
                    polygonControl
                ];

                var toolbar = new OpenLayers.Control.Panel(
                {
                    displayClass: 'olControlEditingToolbar',
                    defaultControl: panelControls[0]
                });
                toolbar.addControls(panelControls);

                self.imageLayer.addControls(
                [
                    toolbar
                ]);

                var options = {
                    clickout: true, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "altKey", // shift key adds to selection
                    box: true
                };

                var selectFeature = new OpenLayers.Control.SelectFeature(self.vectorLayer, options);
                self.imageLayer.addControl(selectFeature);
                //selectFeature.activate();

                var layerSwitcher = new OpenLayers.Control.LayerSwitcher(
                {
                    'ascending': false
                });
                self.imageLayer.addControl(layerSwitcher);
            },

            addLayer: function(graphic)
            {
                var self = this;

                self.clearImageLayer();

                self.imageLayer.addLayers([graphic, self.vectorLayer]);
                self.imageLayer.zoomToMaxExtent();
            },

            clearImageLayer: function()
            {
                var self = this;

                if (self.imageLayer.layers.length > 0)
                {
                    var i = 0;
                    while (self.imageLayer.layers[i])
                    {
                        self.imageLayer.removeLayer(self.imageLayer.layers[i]);
                    }

                    self.clearVectorFeatures();

                    var controls = self.imageLayer.controls[4].controls;
                    // set navigation to active control
                    controls[0].activate(); //navigation
                    controls[1].deactivate(); //polygon
                    controls[2].deactivate(); //edit polygon
                }
            },

            clearVectorFeatures: function()
            {
                var self = this;
                if (self.imageLayer && self.vectorLayer)
                {
                    self.vectorLayer.removeAllFeatures();
                }
            },

            displayImageUsingData: function(data, name, callback)
            {
                var self = this;

                var bounds = undefined;
                var viewPort = self.imageLayer.getViewport();

                var vh = jQuery(viewPort).height();
                var vw = jQuery(viewPort).width();

                var i = new Image();

                i.onload = function()
                {
                    var scale = 1;
                    var graphic;

                    if (this.width && this.height)
                    {
                        bounds = new OpenLayers.Bounds(0, 0, this.width, this.height);
                        var aspectWidth = vw / this.width;
                        var aspectHeight = vh / this.height;
                        scale = Math.min(aspectWidth, aspectHeight);

                        graphic = new OpenLayers.Layer.Image(
                            name,
                            data,
                            bounds,
                            new OpenLayers.Size(this.width * scale, this.height * scale)
                        );
                    }
                    else
                    {
                        bounds = new OpenLayers.Bounds(0, 0, 10, 10);

                        graphic = new OpenLayers.Layer.Image(
                            name,
                            data,
                            bounds,
                            new OpenLayers.Size(vw * 0.9, vh * 0.9)
                        );
                    }

                    if (self.widget.isMultiple == false)
                    {
                        self.addLayer(graphic);
                    }
                    else
                    {
                        self.imageLayer.addLayers([graphic, self.vectorLayer]);
                    }
                    self.imageLayer.updateSize();

                    if (callback && typeof(callback) == 'function')
                    {
                        callback(graphic);
                    }
                };

                i.src = data;
            },

            displayImageUsingKey: function(key, callback)
            {
                var self = this;

                var bfWidth = self.widget.getOption('bestFitWidth');

                if (! bfWidth)
                    bfWidth = 1500;

                var mm = new IMu.Request.Multimedia();
                mm.addModifier('format', 'jpeg');
                mm.addFilter('kind','resolution');
                mm.addFilter('width', 'bf',bfWidth);
                //mm.addModifier('width','4000')
                mm.setKey(key);
                
                var urlParams = "";
                var context = self.getOption('defaultContext');
                var port = self.getOption('defaultPort');

                if(context)
                    urlParams += "&context=" + context;
                if(port)
                    urlParams += "&port=" + port;
                
                mm.fetchInfo(function(info)
                {
                    var url = mm.getURL() + urlParams;
                   
                    if (info.width < (bfWidth-10))
                    {
                        var d = new IMu.App.Dialogue();
                        d.setMessage('Fetching new resolution for image ...');
                        d.show();

                        var mm2 = new IMu.Request.Multimedia();
                        mm2.addModifier('format', 'jpeg');
                        mm2.addModifier('width',bfWidth);
                        mm2.addModifier('allowEnlarge', 'no');

                        mm2.setKey(info.key);

                        mm2.fetchInfo(function(info)
                        {
                            var url = mm2.getURL() + urlParams;

                            var graphic = self.addMMImageToLayer(info,url);

                            d.hide();

                            // Update openlayers size in case image-control has 
                            // been resized since image load started.
                            self.imageLayer.updateSize();

                            if (callback && typeof(callback) == 'function')
                            {
                                callback(graphic);
                            }
                        });
                    }
                    else
                    {

                        var graphic = self.addMMImageToLayer(info,url);

                        // Update openlayers size in case image-control has 
                        // been resized since image load started.
                        self.imageLayer.updateSize();

                        if (callback && typeof(callback) == 'function')
                        {
                            callback(graphic);
                        }
                    }

                });
                
                // This happens when there is no resolution 
                // Just the master image and the thumbnail.
                mm.onError = function(response)
                {
                    var d = new IMu.App.Dialogue();
                    d.setMessage('Fetching thumbnail ...');
                    d.show();

                    var mmThumbnail = new IMu.Request.Multimedia();
                    mmThumbnail.addFilter('kind', 'thumbnail');

                    mmThumbnail.setKey(key);

                    mmThumbnail.fetchInfo(function(info)
                    {

                        var url = mmThumbnail.getURL() + urlParams;

                        var graphic = self.addMMImageToLayer(info,url);

                        d.hide();

                        // Update openlayers size in case image-control has 
                        // been resized since image load started.
                        self.imageLayer.updateSize();

                        if (callback && typeof(callback) == 'function')
                        {
                            callback(graphic);
                        }
                    });

                    // If a thumbnail can't be fetched, we remove the dialog
                    // overlay so the user can continue modifying/editing
                    // the record. Can happen for PDF's and broken multimedia
                    // images. JIRA IMu-338.
                    mmThumbnail.onError = function(response)
                    {
                        d.hide();
                        callback(undefined);
                    };
                };
            },

            addMMImageToLayer: function(info,url)
            {
                var self = this;

                var labelText = info.key;

                if (info.identifier)
                    labelText = info.identifier;

                var viewPort = self.imageLayer.getViewport();
                var vh = jQuery(viewPort).height();
                var vw = jQuery(viewPort).width();

                var aspectWidth = vw / info.width;
                var aspectHeight = vh / info.height;
                var scale = Math.min(aspectWidth, aspectHeight);

                var graphic = new OpenLayers.Layer.Image(
                    labelText,
                    url,
                    new OpenLayers.Bounds(0, 0, info.width, info.height),
                    new OpenLayers.Size(info.width * scale, info.height * scale)
                );

                if (self.widget.isMultiple ==  false)
                {
                    self.addLayer(graphic);
                }
                else
                {
                    self.imageLayer.addLayers([graphic, self.vectorLayer]);
                }

                return(graphic);
            },

            getPolygon: function()
            {
            },

            getPolygons: function()
            {
                var self = this;

                if (self.imageLayer && self.vectorLayer)
                {
                    var geoJson = new OpenLayers.Format.GeoJSON();
                    var str = geoJson.write(self.vectorLayer.features, true);
                    var obj = JSON.parse(str);
                    if (obj.features.length > 0)
                    {
                        var polygons = [];
                        for (var i = 0; i < obj.features.length; i++)
                        {
                            polygons.push(obj.features[i].geometry.coordinates[0]);
                        }
                    }

                    return polygons;
                }
            },

            getState: function()
            {
                var self = this;

                if (self.imageLayer)
                {
                    var state = new Object();
                    state.x = self.imageLayer.center.lon;
                    state.y = self.imageLayer.center.lat;
                    state.zoom = self.imageLayer.getZoom();
                }

                return state;
            },

            setImageLatLon: function(x, y)
            {
                var self = this;

                if (self.imageLayer)
                {
                    var lonlat = new OpenLayers.LonLat(x, y);
                    self.imageLayer.panTo(lonlat);
                }
            },

            setZoomLevel: function(level)
            {
                var self = this;

                if (self.imageLayer)
                {
                    self.imageLayer.zoomTo(level);
                }
            },

            setPolygon: function(coordinates)
            {
                var self = this;

                if (self.imageLayer && self.vectorLayer)
                {
                    //create a polygon feature from a linear ring of points
                    var pointList = [];

                    for (var i = 0; i < coordinates.length; i++)
                    {
                        var coordinate = coordinates[i];
                        //TODO 
                        //need to make sure that coordinates are of type float
                        //need to make sure that each array has two coordinates (x,y)
                        pointList.push(new OpenLayers.Geometry.Point(coordinate[0], coordinate[1]));
                    }
                    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
                    var polygonFeature = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Polygon([linearRing]));
                    self.vectorLayer.addFeatures(polygonFeature);
                }
            }


        }
    });
})(IMu.Themes.shared);
