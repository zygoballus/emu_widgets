(function(theme)
{
    theme.views.register('map-viewer', 'viewer',
    {
        _source: 'shared/common/map-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.map = undefined;
                self.panel = undefined;
                self.statusHolder = undefined;
                self.clusterExtentLayers = {};
                self.clusterStrategy = 'default';
                self.clusteringOn = false;
                self.collatorHolder = undefined;
                self.detailHolder = undefined;
                self.detailDisplayer = undefined;
                self.layerSwitcherHolder = undefined;
                self.legendHolder = undefined;
                self.useShapeDrawer = false;
                self.options = {};

                self.clusterCache = {};
            },

            _create: function()
            {
                var self = this;

                self._super();

                self.holder = self.setHolderDimensions(self.widget.owner);

                self.statusHolder = self.widget.owner.child('div', 'status');
                var hid = IMu.Format.sprintf('imu-map-status-{0}', self.widget.uniqueId);
                self.statusHolder.attr('class', 'imu-map-statusHolder');
                self.statusHolder.attr('id', hid);
                self.statusHolder.hide();

                var mapOptions = {};
                if (self.widget.options['mapProjection'])
                    mapOptions['projection'] = self.widget.options['mapProjection'];
                if (self.widget.options['mapDisplayProjection'])
                    mapOptions['displayProjection'] = new OpenLayers.Projection(
                        self.widget.options['mapDisplayProjection']);

                // the OL map object is created here
                self.map = new OpenLayers.Map(self.holder.attr('id'), mapOptions);

                self.map.fractionalZoom = false;
                self.setDefaultDrawingParams();

                /* if an OL map object triggers an IMu widget method, the 'this'
                 * reference will be OL specific not the IMu map-view widget.
                 * For  this reason store the widget reference in the map
                 * object.
                 */
                self.map.ke = { widgetSelf : self.widget };

                IMu.Events.bind(self.widget.name + '-view-created', function(eventName, widget) {
                    if (widget == self.widget)
                    {
                        // do anything that requires the view to be completed
                        self.initialiseMap();
                        self.widget.checkConnection();
                    }
                });
                    

            },

            addBaseLayers: function(layers)
            {
                var self = this;

                if (layers.length == 0)
                {
                    var errMsg = 'map widget must have at least 1 layer defined!';
                    self.widget.showStatusMessage( 'Error! - ' + errMsg, true);
                    self.widget.setErrorState(errMsg);
                    return;
                }
                self.addLayers(layers);
                self.setBaseLayer(layers[0]);
            },

            /*
            ** addClearSearchResults
            ** draw control that clears all searches
            */
            addClearSearchResults: function()
            {
                var self = this;

                var displayClass = 'olControlClearFoundPoints';
                var clearPolyButton    = new OpenLayers.Control.Button(
                            {
                                title: IMu.string(
                                            'map-view-clear-all-found-points'),
                                displayClass: displayClass,
                                trigger: self.widget.clearSearchRegions
                            }
                );

                self.addControlToPanel(clearPolyButton,
                                    displayClass, 
                                    'mapicons/remove_point_on',
                                    'mapicons/remove_point_off');
            },

            /*
            ** addCollator
            ** associates collator control with passed onscreen element id
            */
            addCollator: function(collatorHolderId)
            {
                var self = this;
                if (jQuery('#' + collatorHolderId).length != 0)
                {
                    self.collatorHolder = jQuery('#' + collatorHolderId);
                    self.collatorHolder.attr('class', 'imu-collator-owner');
                    self.collatorHolder.hide('slow').draggable();
                    self.collatorHolder.offset(
                            jQuery(self.holder).offset()
                    );
                }
            },

            /*
            ** addControlBackgroundIcons.
            ** specify display style on control buttons to add suitable icon
            ** images.  The images may change depending on the applied class
            ** attribute.
            */
            addControlBackgroundIcons: function(displayClass, iconImageOn,
                                                                iconImageOff)
            {
                    var icon= IMu.Request.getURL('Image');

                    /* because the CSS rules we want to add will use selectors
                     * which do not initially have any matching elements (OL
                     * changes the element's class attributes based on user
                     * interactions), we can't simply apply the rules to matching
                     * elements via jQuery.css.  Instead add them as CSS rules to
                     * the document.
                     */

                    var cssToAdd = '';
                    var template = 'background-image: url(' + icon + '&name=';
                    if (iconImageOn)
                    {
                        var rule = template + iconImageOn + ')';
                        cssToAdd += '.' + displayClass + 'ItemActive' +
                                    '{' + rule + '}';
                    }
                    if (iconImageOff)
                    {
                        var rule = template + iconImageOff + ')';
                        cssToAdd += "\n" + '.' + displayClass + 'ItemInactive' +
                                    '{' + rule + '}';
                    }
                    jQuery('<style type="text/css">' +
                                cssToAdd +
                                '</style>').appendTo('head');
            },
            /*
            ** addControlToPanel.
            ** take an OL control object and add it to the map's "Control Panel".
            ** Use given icons for displaying button's active/inactive state.
            ** @example
            **  @code
            **      var myButton    = new OpenLayers.Control.Button(...);
            **      ...
            **      self.addControlToPanel(myButton,
            **                      'mySpecialButtonClass', 
            **                      'mapicons/button_off',
            **                      'mapicons/button_on');
            */
            addControlToPanel: function(control, displayClass, iconOn, iconOff)
            {
                var self = this;

                // if no control panel on map, make one
                if (typeof self.panel == 'undefined')
                {
                    self.panel = new OpenLayers.Control.Panel();
                    self.map.addControl(self.panel);
                }

                self.panel.addControls( [ control ] );
                self.addControlBackgroundIcons(displayClass, iconOn, iconOff);
                jQuery('.' + displayClass + 'ItemInactive').hide();
            },

            /*!
            **  Add OL layer switching to external div
            */
            addCustomLayerSwitcher: function(divId)
            {
                var self = this;
                self.layerSwitcherHolder = divId;
            },


            /*
            ** addDetailViewer
            ** Add a widget to display selected point details
            */
            addDetailViewer: function()
            {
                var self = this;

                // refer to specifiers in CSS
                var ownerClass = 'imu-map-detail-owner';
                var detailDisplayerClass = 'imu-map-detail-displayer';
                var holderId = IMu.Format.sprintf('imu-map-details-holder{0}',
                                                                self.widget.uniqueId);

                // need 'box' to hold 'displayer' and close button
                var jHolderId = '#' + holderId;
                if (jQuery(jHolderId).length == 0)
                {
                    // the passed holderId doesn't refer to an
                    // existing element, make one and put it in the
                    // map view holder
                    jQuery(self.holder).append('<div id="' +
                        holderId + '"></div>');
                }
                self.detailHolder = jQuery(jHolderId);
                self.detailHolder.attr('class', ownerClass);
                self.detailHolder.hide().draggable();

                // add header and 'close' icon
                var title = IMu.string('map-view-detail-title');
                self.detailHolder.append('<div id="' + holderId + '-header">' +
                                                              title + '</div>')
                jQuery(jHolderId + '-header').attr('class',
                                'imu-map-details-header')
                                .append('<div class="imu-map-closeX"></div>');

                var icon = IMu.Request.getURL('Image') + '&name=mapicons/close';
                jQuery(jHolderId + ' .imu-map-closeX').css( 
                                 { 'background-image': 'url(' + icon + ')' } );
                jQuery(jHolderId + ' .imu-map-closeX').click( 
                        function(evt) { self.detailHolder.hide(); });

                // need a 'displayer' to put in the box - first make an
                // element to hold it
                var id = IMu.Format.sprintf('imu-map-details-view{0}',
                                self.widget.uniqueId);
                var jId = '#' + id;
                jQuery(jHolderId).append('<div id="' + id + '"></div>');
                jQuery(jId).attr('class', detailDisplayerClass);

                // currently not sure how to best drive the record browser
                // then make and attach a record-browser
                if (! self.widget.options.useSimpleDetailDisplay)
                    self.detailDisplayer = jQuery(jId).IMu('record-browser',
                                { showSelectionControl: true });
            },

            /*
            ** addFeaturesToLayer.
            ** add point features to the given layer
            */
            addFeaturesToLayer: function(layer, features)
            {
                var self = this;
                layer.addFeatures(features);

                var cluster = self.widget.options.clusterPoints;

                self.clusterCache[layer.name] = {};
                self.refreshFeaturesUsingClusterSize(layer, cluster)
            },

            /*
            ** addKEControls.
            **
            ** Add wanted KE controls to the map.
            **
            */
            addKEControls: function()
            {
                var self = this;

                if (self.widget.options.showScalebar)
                    jQuery('.olControlScaleBar').draggable()
                        .mousedown(
                            function(evt) { evt.stopPropagation(); }
                        );

                if (self.widget.options.addZoomToShowAllControl)
                    self.addZoomToShowAll();
                if (self.widget.options.clearSearchResults)
                    self.addClearSearchResults();
                if (self.layerSwitcherHolder != undefined)
                    self.makeKELayerSwitcherControl();

                if (self.widget.options.moreDetailsDialog)
                     self.addDetailViewer();
            },


            /*
            ** addLegend
            ** associates legend control with passed onscreen element id
            */
            addLegend: function(legendHolderId)
            {
                var self = this;
                if (jQuery('#' + legendHolderId).length != 0)
                {
                    self.legendHolder = jQuery('#' + legendHolderId);
                    self.legendHolder.attr('class', 'imu-legend-owner');
                    self.legendHolder.css({ position: 'absolute' });
                    if (self.widget.options.anchorLegendOnMap)
                    {
                        var hideShowButton = self.addLegendHideControl();
                        hideShowButton.activate();
                        var offset = jQuery(self.holder).offset();
                        offset.top += 50;
                        offset.left += 50;

                        self.legendHolder.offset( offset );
                        self.legendHolder.draggable();
                    }
                    self.legendHolder.hide();
                }
            },

            /*
            ** addLegendHideControl
            **
            */
            addLegendHideControl: function()
            {
                var self = this;

                var displayClass = 'olControlLegend';
                var showLegendButton = new OpenLayers.Control(
                            {
                                'title': IMu.string(
                                            'map-view-show-legend'),
                                'displayClass': displayClass,
                                'type': OpenLayers.Control.TYPE_TOGGLE,
                                'eventListeners': {
                                    'activate' : self.showLegend,
                                    'deactivate': self.hideLegend
                                }
                            }
                );

                self.addControlToPanel(showLegendButton,
                                    displayClass, 
                                    'mapicons/legend_off',
                                    'mapicons/legend_on');

                return showLegendButton;
            },

            addLayer: function(layer)
            {
                var self = this;
                self.map.addLayer(layer);
            },

            addLayers: function(layers)
            {
                var self = this;
                self.map.addLayers(layers);
            },

            /*
            ** addOLControls.
            **
            ** Add wanted OL controls to the map.
            **
            */
            addOLControls: function()
            {
                var self = this;

                // standard OpenLayers controls
                var controls = [
                    // Allow for mobile devices
                    new OpenLayers.Control.Navigation
                    ({
                        dragPanOptions:
                        {
                            enableKinetic: true
                        }
                    })
                ];

                if (self.widget.options.showMouseCoordinates)
                    controls.push(new OpenLayers.Control.MousePosition());
                if (self.widget.options.showLayerSwitcher)
                    controls.push(new OpenLayers.Control.LayerSwitcher());
                if (self.widget.options.showOverviewMap)
                {
                    var ovBase = self.map.layers[0].clone();
                    var ovMapOptions = {
                        maximized: true,

                        mapOptions: OpenLayers.Util.extend(
                            self.map.options, {
                                /* any custom overlaymap config could go here */
                            }),
                        layers: [ovBase]
                    };
                    var ovMapControl = new OpenLayers.Control.OverviewMap(ovMapOptions);
                    controls.push(ovMapControl);

                    // bug in OL 2.12 causes Google overview maps to not be
                    // aligned with base map unless control maximized at time
                    // map drawn.  So we start with it maximised, then minimize
                    // it after a delay
                    var timeout = 1000;
                    window.setTimeout(function()
                    {
                        ovMapControl.minimizeControl();
                    }, timeout);

                }
                if (self.widget.options.showScalebar)
                    controls.push(self.makeScalebar());

                self.map.events.on(
                    {
                        "changebaselayer": self.widget.changeBaseLayerHandler,
                        "changelayer":     self.changeLayerHandler,
                        "addlayer":        self.widget.layerAddedHandler
                    }
                );
                self.map.addControls(controls);
            },

            /*
            ** catch any change of layer events and adjust bounds if necessary
            */
            changeLayerHandler: function(e)
            {
                var self = this
                    // NB if called by OL event handler 'this' = OL Map Object.
                    if ('CLASS_NAME' in self)
                        self = self.ke.widgetSelf.view;

                var layer = e.layer;
                if (layer.isBaseLayer)
                {
                    // Kludge. if the asked for viewport exceeds the base layer
                    // bounds, OL may try and pan/zoom the map beyond its
                    // bounds by 'extending' it, however, this may result in
                    // the feature layers disappearing because they are 'out of
                    // bounds'. See JIRA IMU-142.  Fix it by panning to centre
                    // and zooming in first and then let OL zoom back when it
                    // does the layer swap cleanup code
                    var askedForBox = layer.getExtent();
                    var availableBox = layer.maxExtent;
                    var spaceRight = availableBox.right - askedForBox.right;
                    var spaceLeft = askedForBox.left - availableBox.left;
                    var spaceTop = availableBox.top - askedForBox.bottom;
                    var spaceBottom = askedForBox.bottom - availableBox.top;

                    // are we outside layer range?
                    if ((spaceRight < 0) || (spaceLeft < 0) || (spaceTop < 0) || (spaceBottom < 0))
                    {
                        self.map.panTo(availableBox.getCenterLonLat());
                        self.map.zoomTo(3);
                    }
                }
            },

            /*
            ** make a clone of a layers features
            */
            cloneFeatures: function(features)
            {
                var self = this;
                var cFeatures = [];
                for (var i = 0; i < features.length; i++)
                {
                    var f = features[i].clone();
                    cFeatures.push(f);
                }
                return cFeatures;
            },

            /*
            ** activateKEControls
            */
            showKEControls: function(clearSearch,
                                     anchoredLegend,
                                     zoomToAll,
                                     visible)
            {
                var self = this;

                // show appropriate controls
                if (clearSearch)
                {
                    if (visible)
                        jQuery('.olControlClearFoundPointsItemInactive').show();
                    else    
                        jQuery('.olControlClearFoundPointsItemInactive').hide();
                }
                if (anchoredLegend)
                {
                    if (visible)
                        jQuery('.olControlLegendItemActive').show();
                    else
                        jQuery('.olControlLegendItemActive').hide();
                }
                if (zoomToAll)
                {
                    if (visible)
                        jQuery('.olControlZoomToShowAllItemInactive').show();
                    else
                        jQuery('.olControlZoomToShowAllItemInactive').hide();
                }
            },

            /*
             * Add hover/click on map point type functionality.
             */
            addSelectFeatureControl: function()
            {
                var self = this;

                /* remove old handler and add a new combined handler for all layers
                 * because otherwise underlying controls may not receive events
                 */
                var existingHandlers = self.map.getControlsByClass(
                                                'OpenLayers.Control.SelectFeature');
                jQuery.each(
                    existingHandlers,
                    function(idx, control)
                    {
                        control.deactivate();
                        self.map.removeControl(control);
                    }
                );

                var pointHandler = false;

                // make a hover handler
                if (self.widget.options.pointHighlightOnHover)
                {
                    var hoverCtrl = new OpenLayers.Control.SelectFeature(
                        self.getPointLayers(),
                        {
                            hover: true,
                            highlightOnly: true,
                            eventListeners: {
                                featurehighlighted: function(e)
                                {
                                    var fs = self.getRepresentativeFeatures(e.feature);
                                    self.highlightFeatures(fs, true, e);
                                    self.toggleFeatures(fs, true);
                                },
                                featureunhighlighted: function(e)
                                {
                                    var fs = self.getRepresentativeFeatures(e.feature);
                                    self.highlightFeatures(fs, false, e);
                                    self.toggleFeatures(fs, false);
                                }
                            }
                        }
                    );
                    self.map.addControl(hoverCtrl);
                    hoverCtrl.activate();
                    pointHandler = true;
                }

                // make a click handler
                if (self.widget.options.pointHighlightOnClick)
                {
                    var select = new OpenLayers.Control.SelectFeature(
                        self.getPointLayers(),
                        {
                            hover: false,
                            clickout: true,
                            highlightOnly: true,
                            eventListeners:
                            {
                                featurehighlighted: function(e)
                                {
                                    var fs = self.getRepresentativeFeatures(e.feature);
                                    self.highlightFeatures(fs, true, e);
                                    self.toggleFeatures(fs, true);
                                    //self.popupFeature(e.feature, true, e);
                                },
                                featureunhighlighted: function(e)
                                {
                                    var fs = self.getRepresentativeFeatures(e.feature);
                                    self.highlightFeatures(fs, false, e);
                                    self.toggleFeatures(fs, false);
                                    //self.popupFeature(e.feature, false, e);
                                }
                            }
                        }
                    );
                    self.map.addControl(select);
                    select.activate();
                    pointHandler = true;
                }

                // without a select feature control, points don't display
                // (not sure why)
                if (! pointHandler)
                {
                    var select = new OpenLayers.Control.SelectFeature(
                        self.getPointLayers(),
                        {
                            hover: false,
                            clickout: false,
                            highlightOnly: false
                        }
                    );
                    self.map.addControl(select);
                    select.activate();
                }

            },

            /*
            ** addZoomToShowAll
            ** adds a 'zoom to view all points' control
            */
            addZoomToShowAll : function()
            {
                var self = this;

                var displayClass = 'olControlZoomToShowAll';
                var zoomToAllButton = new OpenLayers.Control.Button(
                            {
                                title: IMu.string(
                                                'map-view-zoom-to-show-all-items'),
                                type: OpenLayers.Control.TYPE_BUTTON,
                                displayClass: displayClass,
                                trigger: self.zoomToShowAllPoints
                            }
                );
                zoomToAllButton.setMap(self.map);

                if (typeof self.panel == 'undefined')
                {
                    self.panel = new OpenLayers.Control.Panel({ });
                    self.map.addControl(self.panel);
                }

                var hasControl = false;
                for (var i = 0; i < self.panel.controls.length; i++)
                {
                    var c = self.panel.controls[i];
                    if (c.displayClass == "olControlZoomToShowAll")
                    {
                        hasControl = true;
                        break;
                    }
                }

                if (! hasControl)
                {
                    self.panel.addControls( [zoomToAllButton] );

                    self.addControlBackgroundIcons(
                            displayClass,
                            'mapicons/zoom_to_show_all_on',
                            'mapicons/zoom_to_show_all_off'
                    );

                    // do not show control initially - there is no data to control
                    jQuery('.' + displayClass + 'ItemInactive').hide();
                }
            },

            /*
            ** alertLegend
            ** notify legend that a feature is highlighted
            */
            alertLegend: function(feature, highlight)
            {
                var self = this;

                if (self.legendHolder == undefined)
                    return;

                var legendBackground = self.legendHolder.css('background-color');
                jQuery('.imu-legend-data-item').css({'background-color': legendBackground});

                if (! highlight)
                    return;

                var analysedData = self.widget.getData;
                if (analysedData != null)
                {

                    // for each search
                    jQuery.each(
                        analysedData,
                        function(searchName, searchDescription)
                        {
                            var collateBy = searchDescription.collateByCategory;
                            var highlightValue = feature.attributes.rawRow[collateBy];
                            var legendItems = searchDescription.categories[collateBy].distinctValues;
                            if (highlightValue in legendItems)
                            {
                                var legendItem = legendItems[highlightValue];
                                var key = searchName + ':' + collateBy + ':' + legendItem.value;
                                var legendElement = jQuery('div').find('[data-key="' + key + '"]');
                                legendElement.css({'background-color': '#c0c0c0'});
                            }
                        }
                    );
                }
            },

            /*
            ** changePointSymbols
            ** redraw all points using current collation field
            */
            changePointSymbols: function (analysedData)
            {
                var self = this;

                var searchNameLabel = IMu.string('map-view-search-name-label');

                jQuery.each(
                    analysedData,
                    function(searchKey, search)
                    {
                        var pointLayers = self.map.getLayersByName(searchKey);
                        if (pointLayers.length > 0)
                        {
                            var layer = pointLayers[0];
                            var field = search.collateByCategory;
                            var searchIdx = search.searchIndex;
                            var distinctValues =
                                        search.categories[field].distinctValues;

                            var allFeatures = self.getLayerFeatures(layer);
                            jQuery.each(
                                allFeatures,
                                function(idx, feature)
                                {
                                    var value = searchKey
                                    if (field != searchNameLabel)
                                        value = feature.attributes.rawRow[field];

                                    if ((value === undefined) || (value === null))
                                        value = IMu.string('map-unspecified-value');

                                        if (typeof(value) === 'object')
                                        {
                                            if (value['SummaryData'])
                                                value = value['SummaryData'];
                                        }

                                    var distinct = distinctValues[value];
                                    var valueIdx = distinct.valueIndex;
                                    var shape = self.getGroupPointShapeColour(
                                                searchIdx, valueIdx);
                                    feature.attributes.colour = shape.colour;
                                    feature.attributes.shape = search.symbolShape;
                                    feature.attributes.radius = search.symbolSize;
                                }
                            );
                            layer.redraw();
                        }
                    }
                );
            },

            /*
            ** closePopupBox.
            ** called by OL so 'this' = OL control not IMu
            */
            closePopupBox: function()
            {
                
                var feature = this.ke.feature;
                if (feature.layer != null)
                    feature.layer.drawFeature(feature);

                var self = this.map.ke.widgetSelf.view;
                self.toggleFeatures([feature], false);
                this.destroy();
            },

            /*
            ** detect if browser is IE - this a hack but caused by IE issues
            ** with SVG :(
            */
            detectIE: function()
            {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf('MSIE ');
                var trident = ua.indexOf('Trident/');
                if (msie > 0)
                    return true; // IE 10 or less
                else if (trident > 0)
                    return true; // IE 11

                return false;
            },

            /*
            ** drawCollator
            ** draws a dialog that allows user to describe how points will be
            ** displayed
            */
            drawCollator: function(searchDescription, searchName)
            {
                var self = this;
                if (self.collatorHolder !== undefined)
                {
                    self.collatorHolder.empty();

                    // sort category names for display
                    var categoryNames = [];
                    for (var category in searchDescription.categories)
                        categoryNames.push(category);
                    categoryNames.sort();

                    var collateByOptions = '';
                    var selected = '';

                    var previousCollate = searchDescription.collateByCategory;
                    for (var i = 0; i < categoryNames.length; i++)
                    {
                        category = categoryNames[i];
                        if ((self.widget.collateByOptions == undefined) ||
                            (self.widget.collateByOptions[category]))
                        {
                                if (category == previousCollate)
                                selected = ' selected="selected"';
                            else
                                selected = '';

                            collateByOptions += '   <option value="' +
                                category + '"' + selected + '>' +
                                category + '</option>';
                        }
                    }

                    var shapeOptions = '';
                    for (var i = 0; i < self.widget.markerShapes.length; i++)
                    {
                        var s = self.widget.markerShapes[i];
                        if (s == searchDescription.symbolShape)
                            selected = ' selected="selected"';
                        else
                            selected = '';
                        shapeOptions += '  <option value="' + s + '"' +
                                        selected +'>' +
                                            s +
                                        '  </option>';
                    }

                    var sizeOptions = '';
                    var r = self.options.defaultRadius;
                    var defaultRadiusOptions = {};
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-smallest')] = Math.floor(r * 0.5);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-small')] = Math.floor(r * 0.7);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-smaller')] = Math.floor(r * 0.9);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-default')] = r;
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-medium-large')] = Math.floor(r * 1.5);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-larger')] = Math.floor(r * 2);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-large')] = Math.floor(r * 2.5);
                    defaultRadiusOptions[
                        IMu.string('map-symbol-size-largest')] = Math.floor(r * 3);

                    if (searchDescription.symbolSize == undefined)
                        searchDescription.symbolSize = r;

                    jQuery.each(
                        defaultRadiusOptions,
                        function(name, value)
                        {
                            if (value == searchDescription.symbolSize)
                                selected = ' selected="selected"';
                            else
                                selected = '';
                            sizeOptions += '  <option value="' + value + '"' +
                                        selected +'>' +
                                            name +
                                        '  </option>';
                        }
                    );

                    var uniqId = IMu.Format.sprintf('-holder{0}', self.widget.uniqueId);

                    var okId = 'imu-map-collate-ok' + uniqId;
                    var dialogHtml =
                        '<fieldset id="imu-display-point-controls' + uniqId + '">' +
                            '<legend>' +
                                IMu.string('map-view-search-display-options') +
                            '</legend>' +
                                '  <label for="imu-map-search-name' + uniqId + '">' +
                                    IMu.string('map-view-search-name-label') +
                                '  </label>' +
                                '  <input id="imu-map-search-name' + uniqId + '" value="' +
                                        searchDescription.displayName + '" />' +
                                '  <label for="imu-map-collate-by' + uniqId + '">' +
                                    IMu.string('map-view-collate-choose') +
                                '  </label>' +
                                '  <select id="imu-map-collate-by' + uniqId + '">' +
                                    collateByOptions +
                                '  </select>' +
                                '  <label for="imu-map-collate-shape' + uniqId + '">' +
                                    IMu.string('map-view-collate-shape') +
                                '  </label>' +
                                '  <select id="imu-map-collate-shape' + uniqId + '">' +
                                    shapeOptions +
                                '  </select>' + 
                                '  <label for="imu-map-collate-size' + uniqId + '">' +
                                    IMu.string('map-view-collate-size') +
                                '  </label>' +
                                '  <select id="imu-map-collate-size' + uniqId + '">' +
                                    sizeOptions +
                                '  </select>' + 
                                '<button id="' + okId +
                                '" class="imu-map-collate-ok">OK</button>' +
                        '</fieldset>';

                    self.collatorHolder.html(dialogHtml);
                    self.collatorHolder.show('slow');

                    jQuery('#' + okId).click(
                        function()
                        {
                            var newName = jQuery('#imu-map-search-name' +
                                                            uniqId).val();
                            var collateBy = jQuery('#imu-map-collate-by' +
                                                            uniqId).val();
                            var shape = jQuery('#imu-map-collate-shape' +
                                                            uniqId).val();
                            var size = jQuery('#imu-map-collate-size' +
                                                            uniqId).val();

                            searchDescription.displayName = newName;
                            searchDescription.symbolShape = shape;
                            searchDescription.symbolSize = size;

                            var data = self.widget.setCollationCategory(
                                    searchName, collateBy);
                            self.drawLegend(data);
                            jQuery('#' + okId).unbind('click');
                            self.collatorHolder.hide('slow').empty();
                        }
                    );
                }
                else
                    self.drawLegend(null);
            },

            displayItemDetails: function(rid, context)
            {
                var self = this;

                var search = new IMu.Request.Search();
                var pos = jQuery(self.holder).position();
                var module = rid.replace(/\.[0-9]+/, '');

                if (self.widget.itemDisplayFunction != undefined)
                {
                    search.findKey(
                        rid, [ module ],
                        function(hits)
                        {
                            if (hits.total > 0)
                            {
                                    search.fetchMany( [{offset: 0, count: -1}], context, function(result)
                                        {
                                            var source = result.rows[0].source;
                                            var irn = result.rows[0].irn;
                                            self.widget.itemDisplayFunction(source, irn, result.rows);
                                        });
                            }
                            else
                            {
                                // this should not happen...
                            }
                        }
                    );
                    return;
                }

                search.findKey(
                    rid, [ module ],
                    function(hits)
                    {
                        if (hits.total > 0)
                        {
                            if (self.detailHolder !== undefined)
                            {
                                self.detailHolder.css(
                                    {
                                        'position': 'absolute',
                                        'top': pos.top + 'px',
                                        'left': pos.left + 'px',
                                        'height': '50%'
                                    }
                                );
                                search.fetchMany(
                                    [{offset: 0, count: -1}],
                                     context,
                                     function(result)
                                    {
                                        self.detailHolder.show(200);
                                        var source = result.rows[0].source;
                                        var irn = result.rows[0].irn;
                                        if (self.widget.options.useSimpleDetailDisplay)
                                        {
                                            var detailsArea = self.detailHolder.
                                                    find('.imu-map-detail-displayer');
                                            self.simpleDetailsDisplay(
                                                result.rows[0],
                                                detailsArea);
                                        }
                                        else
                                        {
                                            // BROKEN sometime prior to Nov
                                            // 2013 at some point this stopped
                                            // working - appears to be some
                                            // change to record browser widget
                                            // that has effected this.  (seems
                                            // to be caued by how record
                                            // browser widget's view component
                                            // not being created yet JK)
                                            self.detailDisplayer.showRecord(source, irn);
                                        }
                                    }
                                );
                                
                            }
                            else
                            {
                                // we found details about item but have nowhere
                                // to put it
                                self.triggerEvent('record-details-found', search);
                            }
                        }
                        else
                        {
                            // this should not happen...
                        }
                    }
                );

            },

            /*
            ** displayItemDetailsEvent
            ** a 'more details' element has been activated
            */
            displayItemDetailsEvent: function(evt)
            {
                var self = this;

                var dataIrn = evt.target.attributes['data-irn'].value;
                var dataSource = evt.target.attributes['data-source'].value;

                var key = dataSource + '.' + dataIrn;
                self.triggerEvent('record-details-selected', key);

                self.displayItemDetails(key, 'browse');
            },

            /*
            ** drawDetailsLink
            ** make an HTML link to a full details popup
            */
            drawDetailsLink: function(feature, stringLen)
            {
                var self = this;

                var html = feature.attributes.id;

                if (self.widget.options.moreDetailsDialog)
                {
                    if (stringLen > 0)
                        html = feature.attributes.id.substr(0, stringLen) + '... ';
                    html += '<div class="map-view-popup-specimenLink" data-irn="' +
                             feature.attributes.rawRow.irn + '" ' +
                            'data-source="' + feature.attributes.source + '"' +
                         '>';
                    html += IMu.string('map-view-show-more-details');
                    html += '</div>';
                }
                return html;
            },

            /*
            ** drawLegend
            ** draw legend on screen
            */
            drawLegend: function(analysedData)
            {
                var self = this;

                var searchNameLabel = IMu.string('map-view-search-name-label');
                var legendData = self.makeLegendData(searchNameLabel, analysedData);


                if (self.legendHolder !== undefined)
                {
                    self.legendHolder.empty();
                    var title = IMu.string('legend-heading');
                    self.legendHolder.append('<fieldset><legend>' +
                                                    title +
                                                    '</legend></fieldset>');

                    if (analysedData != null)
                    {
                        var categoryIdx = 0;
                        jQuery.each(legendData,
                            function(searchName, details) {
                                
                                var searchIdx = self.widget.uniqueId + '-' +
                                                    details.description.searchIndex;
                                var searchId = 'imu-legend-search-' + searchIdx;
                                self.legendHolder.find('legend').after(
                                            '<div id="' + searchId + '"' + ' class="imu-legend-subtitle">' +
                                            details.subTitle +
                                            ' <img class="imu-legend-configure-category" ' +
                                                   'id="imu-legend-configure-' +
                                                   searchIdx + '"' +
                                            ' />' +
                                            '</div>');

                                self.legendHolder.show('slow');

                                // add distinct values as legend entry
                                for (var i = 0; i < details.keys.length; i++)
                                {
                                    var key = details.keys[i];
                                    var uniqueValue = details.items[key];
                                    var entryId = 'imu-legend-item-' +
                                                            self.widget.uniqueId + '-' +
                                                            categoryIdx;
                                    var iconId = 'imu-legend-icon-' +
                                                            self.widget.uniqueId + '-' +
                                                            categoryIdx;
                                    var displayName = '';
                                    if (details.collateBy != searchNameLabel)
                                        displayName = uniqueValue.value;

                                    var uniqueItemKey = searchName + ':' +
                                                        details.collateBy + ':' +
                                                        displayName;

                                    self.legendHolder.find( '#' + searchId).append(
                                            '<div id="' + entryId + '"' + ' style="float:left" ' +
                                            '   class="imu-legend-data-item">' +
                                            ' <div id="' + iconId + '"' + 
                                            '   class="imu-legend-data-item-icon">' +
                                            ' </div>' +
                                            ' <div class="imu-legend-data-item-text">' +
                                            '   <span class="imu-legend-data-item-name">' +
                                                 displayName +
                                            '   </span>' +
                                            '   <span class="imu-legend-data-item-count">' +
                                            '    (' + uniqueValue.count + ')' +
                                            '   </span>' +
                                            ' </div>' +
                                            '</div>'
                                    );

                                    jQuery('#' + entryId).attr('data-key', uniqueItemKey);

                                    // make icon for distinct value
                                    var shape = self.getGroupPointShapeColour(details.description.searchIndex, uniqueValue.valueIndex);
                                    if (! self.useShapeDrawer)
                                    {
                                            // use OpenLayers to draw the icon
                                            self.makeLegendVector(
                                                        iconId,
                                                        //shape.shape,
                                                        shape.shape,
                                                        shape.colour,
                                                        6,
                                                        'black',
                                                        1
                                            );
                                    }
                                    else
                                    {
                                        // use a custom utility to draw the icon
                                        var url = self.makeClusteredMarkerUrl([{
                                                        'shape': details.description.symbolShape,
                                                        'colour': shape.colour,
                                                        'radius' : 10
                                        }]);
                                        jQuery('#' + iconId).html('<img src="' + url + '"/>');
                                    }
                                    categoryIdx++;
                                }
                            });
                        self.changePointSymbols(analysedData);
                    }
                    IMu.Events.trigger('map-viewer-legend-shown');
                }
                else if (self.widget.legendDisplayFunction)
                {
                    self.widget.legendDisplayFunction(self, legendData);
                    self.changePointSymbols(analysedData);
                }

                // set up collator triggering from legend
                if (analysedData)
                {
                    jQuery.each( analysedData, function(searchName, searchDescription) {
                                    self.makeCollatorControl(searchDescription, searchName); 
                    });
                }
            },

            getBaseLayer: function()
            {
                var self = this;
                return self.map.baseLayer;
            },

            /*
            ** getDefaultDisplayStyle
            ** return a default colour/shape (which changes for each new search)
            */
            getDefaultDisplayStyle: function()
            {
                var self = this;

                var idx = ((self.widget.getSearchCount() - 1) %
                                        self.widget.markerColours.length);
                var c = self.widget.markerColours[idx];

                idx = ((self.widget.getSearchCount() - 1) %
                                        self.widget.markerShapes.length);
                var s = self.widget.markerShapes[idx];
                return {
                    'colour': c,
                    'shape': s
                };
            },

            getCentroid: function(feature)
            {
                var self = this;
                var initial = feature;
                if (feature.cluster)
                    initial = feature.cluster[0];

                var iCoords = self.getFeatureCoordinates(initial);
                var xMid = iCoords.x;
                var yMid = iCoords.y;
                var zMid = iCoords.z;
                var xRange = [ iCoords.x, iCoords.x ];
                var yRange = [ iCoords.y, iCoords.y ];
                var zRange = [ iCoords.z, iCoords.z ];

                if (feature.cluster)
                {

                    jQuery.each(
                        feature.cluster,
                        function(idx, f)
                        {
                            var coords = self.getFeatureCoordinates(f);
                            var x = coords['x'];
                            var y = coords['y'];
                            var z = coords['z'];

                            if (xRange[0] > x)
                                xRange[0] = x;
                            if (yRange[0] > y)
                                yRange[0] = y;
                            if (zRange[0] > z)
                                zRange[0] = z;

                            if (xRange[1] < x)
                                xRange[1] = x;
                            if (yRange[1] < y)
                                yRange[1] = y;
                            if (zRange[1] < z)
                                zRange[1] = z;
                        }
                    );
                    xMid = xRange[0] + (xRange[1] - xRange[0])/2;
                    yMid = yRange[0] + (yRange[1] - yRange[0])/2;
                    zMid = zRange[0] + (zRange[1] - zRange[0])/2;
                }
                return {
                        x: xMid,
                        y: yMid,
                        z: zMid,
                        xRange: xRange,
                        yRange: yRange,
                        zRange: zRange
                    };
            },

            getFeatureCoordinates: function(feature)
            {
                var self = this;

                var f = feature
                if (feature.cluster)
                    f = feature.cluster[0];

                var coords = {
                     x: parseFloat(f.attributes.x), 
                     y: parseFloat(f.attributes.y), 
                     z: parseFloat(f.attributes.z) 
                }
                return coords;
            },

            getFeatureGraphicWidth: function(feature)
            {
                var self = this;

                var f = feature
                if (feature.cluster)
                    f = feature.cluster[0];

                var radius = self.options.defaultRadius;
                if (f.attributes.radius != undefined)
                    radius = f.attributes.radius;

                if (self.useShapeDrawer)
                    radius *= 2;

                if (self.widget.relevanceFiltering)
                {
                    if (f.attributes.relevanceDistance != undefined)
                    {
                        var denom = f.attributes.relevanceDistance;
                        if (denom > 1)
                            denom = 1.2;
                        if (denom < 0.3)
                            denom = 0.3;
                            radius *= (1 / denom);
                    }
                }

                if (feature.cluster)
                {
                    var cRadius = radius;
                    cRadius *= (1 + feature.cluster.length/5);
                    if (cRadius > (3 * radius))
                        cRadius = 3 * radius;
                    radius = cRadius;
                }
                return radius;
            },

            getFeatureMarkerLabel: function (feature)
            {
                var self = this;

                var label = '';
                if (feature.cluster)
                    label = feature.cluster.length;
                
                return label;
            },

            getFeatureMarkerLineStyle: function (feature)
            {
                var self = this;

                var style = 'solid';
                if (feature.cluster)
                    style = 'dashdot';
                
                return style;
            },

            getFeatureMarkerOpacity: function (feature)
            {
                var self = this;

                var opacity = 0.7;
                if (feature.cluster)
                {
                    // don't force transparency if using non OL point markers
                    if (! self.useShapeDrawer)
                        opacity = (1 / feature.cluster.length);
                }
                return opacity;
            },

            getFeatureMarkerRadius: function (feature)
            {
                var self = this;
                var radius = self.options.defaultRadius;

                var f = feature
                if (feature.cluster)
                    f = feature.cluster[0];

                if (f.attributes.radius != undefined)
                    radius = f.attributes.radius;

                if (self.widget.relevanceFiltering)
                {
                    if (f.attributes.relevanceDistance != undefined)
                    {
                        var denom = f.attributes.relevanceDistance;
                        if (denom > 1)
                            denom = 1;
                        if (denom < 0.3)
                            denom = 0.3;
                            radius *= (1 / denom);
                    }
                }

                if (! self.useShapeDrawer)
                {
                    if (feature.cluster)
                    {
                        var cRadius = radius;
                        cRadius *= (1 + feature.cluster.length/5);
                        if (cRadius > (3 * radius))
                            cRadius = 3 * radius;
                        radius = cRadius;    
                    }
                }

                return radius;
            },

            getFeatureMarkerShape: function (feature)
            {
                var self = this;

                var f = feature;
                if (feature.cluster)
                    f = feature.cluster[0];
                
                return f.attributes.shape;
            },

            getFeatureFillColour: function(feature)
            {
                var self = this;

                var f = feature;
                if (feature.cluster)
                    f = feature.cluster[0];
                
                return f.attributes.colour;
            },

            /*
            ** getFeatureMarkerDisplay.
            ** should feature be displayed
            */
            getFeatureMarkerDisplay: function (feature)
            {
                var self = this;
                return true;
            },

            getFeatureStrokeColour: function(feature)
            {
               var self = this;
               var strokeColour = self.options.iconStrokeColour;
               return strokeColour; 
            },

            getFeatureStrokeWidth: function(feature)
            {
               var self = this;
               var strokeWidth = self.options.iconStrokeWidth;
               return strokeWidth; 
            },

            getFeatureSymbolType: function(feature)
            {
                var self = this;

                var f = feature;
                if (feature.cluster)
                    f = feature.cluster[0];

                var sym =  f.attributes.shape;
               return sym; 
            },

            /*
            ** getFeatureMarkerUrl.
            ** generate a URL based on the feature's 
            ** properties that is a link to a suitable image to use when
            ** drawing it on the map
            **
            ** Return empty string if you want to use default internal KE
            ** symbols
            **
            ** Override this method to make fancy markers.
            */
            getFeatureMarkerUrl: function(feature)
            {
                var self = this;

                var url = '';
                if (self.useShapeDrawer)
                {
                    var fList = [];
                    if (! feature.cluster)
                        fList.push(feature);
                    else
                        fList = feature.cluster;

                    var pointList = [];
                    jQuery.each(
                        fList,
                        function(idx, f)
                        {
                            pointList.push(f.attributes);
                        }
                    );
                    url = self.makeClusteredMarkerUrl(pointList);
                }
                return url; 
            },

            getFeatureMarkerZIndex: function (feature)
            {
                var self = this;

                var f = feature;
                if (feature.cluster)
                    f = feature.cluster[0];

                var zIndex = 1;
                return zIndex;
            },

            /*
            ** getFeatureWobble.
            ** calculate a pixel offset of an external graphic to account for
            ** the way a cluster of points may be smeared out over some
            ** distance.  OL otherwise will draw the symbol at the location of
            ** the first point in the cluster.  Instead we find the centre
            ** point of the smear (ie an unweighted centroid)
            */
            getFeatureWobble: function(feature, coord)
            {
                var self = this;


                var offset = - (self.options.defaultRadius * 2);
                if (self.useShapeDrawer)
                    return offset;
                return 0;

                if (feature.cluster)
                {
                    var sphericalMerc = new OpenLayers.Projection("EPSG:900913");
                    var cartesianLatLong = new OpenLayers.Projection("EPSG:4326");

                    var centroid = self.getCentroid(feature);
                    var cPos = new OpenLayers.LonLat(
                                            centroid.x, centroid.y);

                    if (self.widget.options.useSphericalMercator)
                        cPos.transform(cartesianLatLong, sphericalMerc);
                    var cPixels = self.map.getPixelFromLonLat(cPos);

                    var blPos = new OpenLayers.LonLat(
                        centroid.xRange[0], centroid.yRange[0]
                    );

                    if (self.widget.options.useSphericalMercator)
                        blPos.transform(cartesianLatLong, sphericalMerc);
                    var blPixels = self.map.getPixelFromLonLat(blPos);

                    if (coord == 'x')
                        offset -= Math.abs(cPixels.x - blPixels.x);
                    else    
                        offset -= Math.abs(cPixels.y - blPixels.y);
                }

                return offset - (self.options.defaultRadius * 3) / 2;

            },

            /*
            ** getGroupPointShapeColour
            ** return a colour/shape based on the group point pointer number passed
            ** (typically groupIdx = search number and pointIdx = point's returned
            ** position in the search)
            */
            getGroupPointShapeColour: function(groupIdx, pointIdx)
            {
                var self = this;
                var s = self.widget.markerShapes[
                                groupIdx % self.widget.markerShapes.length
                ];
                var c = self.widget.markerColours[
                                (pointIdx + groupIdx) %
                                            self.widget.markerColours.length
                ];
                return {
                            'shape': s,
                            'colour': c
                };
            },

            getLayerFeatures: function(layer)
            {
                var self = this;
                
                var allFeatures = [];
                if (layer.features !== undefined)
                {
                    // NB layer.features may be clusters of features - we want
                    // to get a list of all atomic features (ie unclusteredd)
                    jQuery.each(
                        layer.features,
                        function(idx, f)
                        {
                            if (f.cluster)
                                jQuery.merge(allFeatures, f.cluster);
                            else
                                allFeatures.push(f);
                        }
                    )
                    return allFeatures;
                }
                else
                    return [];
            },

            getLayerName: function(layer)
            {
                var self = this;
                return layer.name;
            },


            /*
            **
            */
            getNeededDisplayDimensions: function(bits)
            {
                var self = this;

                var original = jQuery(bits).html();
                var temp = '<span>' + original + '</span>';
                jQuery(bits).html(temp);
                var width = jQuery(bits).find('span:first').width();
                var height = jQuery(bits).find('span:first').height();

                jQuery(bits).html(original);
                return { 'width': width, 'height': height };
            },

            getLayerExtent: function(layer)
            {
                var self = this;
                return layer.extent;
            },

            getPointLayers: function()
            {
                var self = this;

                var pLayers = [];
                var vLayers = self.map.getLayersByClass('OpenLayers.Layer.Vector');
                jQuery.each(vLayers, function(idx, vLayer)
                {
                    if (vLayer.ke != undefined)
                        pLayers.push(vLayer);
                });
                return pLayers;
            },

            /*
            ** a feature may be a cluster of features - get a 'typical' item
            ** from the cluster
            */
            getRepresentativeFeatures: function (feature)
            {
                var self = this;

                var features = [];
                if (feature.cluster)
                   features = feature.cluster;
                else
                   features.push(feature);
                
                return features;
            },

            /*
            ** get bounds of visible features in a layer
            */
            getVisibleBounds: function(layer)
            {
                var self = this;

                var bounds = new OpenLayers.Bounds();
                var features = self.getLayerFeatures(layer);
                jQuery.each(
                    features,
                    function(idx, f)
                    {
                        if (f.style != 'hidden')
                            bounds.extend(f.geometry.bounds);
                    }
                );
                return bounds;
            },

            hasClusterChanged: function(layer, features, cluster)
            {
                var self = this;
            
                if (! self.clusterCache[layer.name])
                    return true;
                
                var cDistKey = self.makeClusterSignature(layer, features, cluster);
                return (self.clusterCache[layer.name] != cDistKey);
            },


            /*
            ** hideLegend.
            */
            hideLegend: function(evt)
            {
                /* may be called as an event in which case 'this' will equal the OL
                 * control not the IMu view object :(
                 */
                var self = this;
                if ('CLASS_NAME' in self)
                {
                    if ('ke' in this.map)
                        self = this.map.ke.widgetSelf.view;
                    else
                        return;
                }

                self.legendHolder.hide(500);
            },

            /*
            **
            */
            hidePoint: function (feature)
            {
                var self = this;
                feature.style = 'hidden';
            },

            /*
            ** hideToolTip.
            */
            hideToolTip: function (features)
            {
                jQuery('#toolTip').empty();
                jQuery('#toolTip').remove();

                jQuery.each(
                    features, function(idx, feature)
                    {
                        if (feature.layer)
                        {
                            feature.layer.drawFeature(feature);
                        }
                    }
                );
            },

            highlightFeatures: function(features, highlight, triggeringEvent)
            {
                var self = this;
                if (highlight)
                {
                    features[0].renderIntent = "highlight";
                    self.showToolTip(features, triggeringEvent);
                }
                else
                {
                    features[0].renderIntent = "default";
                    self.hideToolTip(features);
                }
                self.alertLegend(features[0], highlight);
            },


            /*
            ** Do any initial map setup after the map holding div is in place
            */
            initialiseMap: function()
            {
                var self = this;

                self.widget.setWantedLayers(self.widget.getLayerGroup());

                // sanity check
                if (self.widget.layers.length == 0)
                {
                    var errMsg = 'map widget must have at least 1 layer defined!';
                    self.widget.showStatusMessage( 'Error! - ' + errMsg,
                            true);
                    self.widget.setErrorState(errMsg);
                }
                self.addLayers(self.widget.layers);

                // set up initial zoom size
                if (! self.map.getCenter())
                   self.map.zoomToMaxExtent();

                // adjust zoom size if option configured
                if (self.widget.options.initialExtentLBRT != undefined)
                {
                   var bounds = new OpenLayers.Bounds(
                           self.widget.options.initialExtentLBRT);
                   if (self.widget.options.useSphericalMercator)
                       bounds = self.transformBoundsLatLong2Mercator(bounds);
                   self.zoomToExtent(bounds, false);
                }    

                // add wanted controls to the map
                self.addOLControls();
                self.addKEControls();

                // if requested, change base layer
                if (self.widget.wantedBaseLayer != undefined)
                {
                    var layers = self.map.getLayersByName(self.widget.wantedBaseLayer);
                    self.setBaseLayer(layers[0]);
                }

                self.prepareMapToDisplayNewPoints();

                // if requesting shapedrawer, only allow if GD
                // extension is installed.  Test this first
                if (self.widget.options.useInternalMarkerMaker)
                {
                   jQuery.ajax({
                        type: 'GET',
                        url: IMu.path +
                            '/request.php?request=ShapeDraw' + '&useage=true',
                        success: function() { self.useShapeDrawer = true; }
                    });
                }
            },

            isDataPointLayer: function(layer)
            {
              var self = this;

              return ((layer != null) &&
                      (layer.CLASS_NAME == 'OpenLayers.Layer.Vector'));
            },

            /*
            ** make a layer that can represent the extent of clustering of
            ** features
            */
            makeClusterLayer: function(name)
            {
                var self = this;

                // remove existing cluster as we will replace it with a new one
                if (self.clusterExtentLayers[name] != undefined)
                {
                    var cLayers = self.map.getLayersByName(name);
                    for (var i = 0; i < cLayers.length; i++)
                    {
                        self.widget.clusterExtentLayerVisibility = cLayer.visibility;
                        var cLayer = cLayers[i];
                        self.map.removeLayer(cLayer);
                        cLayer.destroy();
                    }
                }
            
                // draw marker indicating clustering distance
                var clusterRenderContext = {
                    'clusterRadius': function(feature)
                        {
                            return self.widget.options.clusterDistance;
                        },
                    'labelYOffset': function(feature)
                        {
                            if (self.detectIE())
                                return -8
                            else
                                return 0;
                        }
                };
                var styleHash = {
                    'default': new OpenLayers.Style(
                        {
                            pointRadius: '${clusterRadius}',
                            fillColor: '#999999',
                            fillOpacity: 0.2,
                            label: 'X',
                            labelYOffset:    '${labelYOffset}',
                            strokeColor: '#000000',
                            strokeDashstyle: 'dot',
                            strokeOpacity: 0.9,
                            strokeWidth: 2
                        },
                        {
                            'context': clusterRenderContext
                        })
                };
                var clusterMarkerStyle = new OpenLayers.StyleMap(styleHash);

                var strategyMethod = OpenLayers.Strategy.Cluster;
                if (self.clusterStrategy == 'centred')
                    strategyMethod = OpenLayers.Strategy.CenteredCluster;

                var cluster = new strategyMethod(
                {
                        'distance': self.widget.options.clusterDistance,
                        'threshold': self.widget.options.clusterThreshold
                });

                var clusterLayer = new OpenLayers.Layer.Vector(
                    name,
                    {
                        strategies: [ cluster ],
                        styleMap: clusterMarkerStyle
                    });
                self.clusterExtentLayers[name] = clusterLayer;
                self.addLayer(clusterLayer);

                clusterLayer.setVisibility(self.widget.clusterExtentLayerVisibility);
                return clusterLayer;
            },

            makeClusterSignature: function(layer, features, cluster)
            {
                var self = this;
                var cDist = self.widget.getClusterDistance(false);
                var cDistKey = cDist + ':' + cluster + ':' + 
                    features.length + ':' + self.map.getResolution();
                return cDistKey;
            },

            makeClusteredMarkerUrl: function(pointList)
            {
                var self = this;

                var shapes = [];
                var colours = [];

                var c = pointList.length;
                if (c > 10)
                    c = 10;

                var radius = 50;
                for(var i = 0; i < c; i++)
                {
                    var point = pointList[i];
                    var colSt = point.colour;
                    colSt = colSt.replace(/#/, '');
                    colours.push(colSt);
                    shapes.push(point.shape);
                }

                var url = IMu.path + '/request.php?request=ShapeDraw' +
                    '&shapes='  + shapes.join(',') +
                    '&colours=' + colours.join(',') +
                    '&radius=' + radius;
                return url;
            },

            makeCollatorControl: function(searchDescription, searchName) 
            {
                var self = this;

                var searchIdx = self.widget.uniqueId + '-' +
                                searchDescription.searchIndex;
                if (self.widget.hasCollator)
                {
                    var icon = IMu.Request.getURL('Image') +
                        '&name=mapicons/configure_off';

                    jQuery('#imu-legend-configure-' + searchIdx).css({
                                    'background-image': 'url(' + icon + ')'
                                }).on('click', function() {
                                        self.drawCollator(searchDescription, searchName);
                                });
                }
                else
                {
                    // no collator open icon
                    jQuery('#imu-legend-configure-' + searchIdx).hide();
                }
            },

            /*
            ** make and add custom layer switcher (rather than OL default
            ** control)
            */
            makeKELayerSwitcherControl: function()
            {
                var self = this;

                var divId = self.layerSwitcherHolder;
                var lsHolder = jQuery('#' + divId);

                if (lsHolder != undefined)
                {

                    if (lsHolder.hasClass('olControlLayerSwitcher'))
                    {
                        // appears there already was an OL switcher control
                        // created at some point - remove it from the map
                        var switchers =
                            self.map.getControlsByClass('olControlLayerSwitcher');
                        for (var i = 0; i < switchers.length; i++)
                        {
                            var control = switchers[i];
                            control.deactivate();
                            self.map.removeControl(control);
                            control.destroy();

                        }
                    }

                    lsHolder.empty();
                    lsHolder.addClass('olControlLayerSwitcher');

                    var layerSwitcher = new OpenLayers.Control.LayerSwitcher( {
                        'div':OpenLayers.Util.getElement(divId) });
                    self.map.addControl(layerSwitcher);

                    // OL adds style to control - override it so designer can more
                    // easily set the style they want
                    var cssOverride = 'position: inherit; '+
                        'background-color: inherit; '+
                        'color: inherit; ' +
                        'font-style: inherit; ' +
                        'font-weight: inherit';
                    lsHolder.attr('style', cssOverride);
                    lsHolder.find('div').attr('style', cssOverride);
                    lsHolder.find('#OpenLayers_Control_MaximizeDiv_innerImage').hide();
                    lsHolder.find('.baseLbl').html(
                                    IMu.string('map-view-base-layers-heading'));
                    lsHolder.find('.dataLbl').html(
                                    IMu.string('map-view-overlay-layers-heading'));
                }
            },

            makeLayerBing: function(title, keyString, mapType)
            {
                var self = this;

                var layer = new OpenLayers.Layer.Bing
                ({
                    key: keyString,
                    type: mapType,
                    wrapDateLine: self.widget.options.dateLineWrap
                });
                return layer;
            },

            makeLayerGoogle: function(title, mapType)
            {
                var self = this;

                var layer = undefined;

                if (mapType != null)
                {
                    layer = new OpenLayers.Layer.Google
                    (
                        title,
                        {
                            type: mapType,
                            animationEnabled: true,
                            visibility: true,
                            // wrapDateLine seems to reverse meaning for Google
                            wrapDateLine: ! self.widget.options.dateLineWrap
                        }
                    );
                }
                else
                {
                    layer = new OpenLayers.Layer.Google
                    (
                        title,
                        {
                            animationEnabled: true,
                            visibility: true,
                            // wrapDateLine seems to reverse meaning for Google
                            wrapDateLine: ! self.widget.options.dateLineWrap
                        }
                    );
                }
                return layer;
            },

            makeLayerImage: function(title, imageSource, size, bounds, olConfig)
            {
                var self = this;
                
                var tileSize = self.holder.width();
                if (tileSize == 0)
                {
                    // this may happen if we are in a combined view widget and
                    // the div we are going to be placed in hasn't been set up
                    // yet by the combined view.
                    self.holder = self.setHolderDimensions(self.widget.owner);
                    tileSize = self.holder.width();

                }
                var boundsObj = new OpenLayers.Bounds(bounds);
                var maxRes = (boundsObj.getWidth() / tileSize);

                var config = {
                        maxResolution: maxRes,
                        transitionEffect: 'resize',
                        units: self.widget.options.rasterUnits
                };
                if (olConfig != undefined)
                    jQuery.extend(config, olConfig);

                var layer = new OpenLayers.Layer.Image(
                    title,
                    imageSource,
                    boundsObj,
                    new OpenLayers.Size(size[0], size[1]),
                    config
                );

                return layer;
            },

            makeLayerImageTiled: function(title, imageSource, size, bounds, olConfig)
            {
                var self = this;

                var boundsObj = new OpenLayers.Bounds(bounds);

                // make some initial guesses
                var tileSize = 256;
                var format = 'png';
                var maxRes = (boundsObj.getWidth() / tileSize); // estimation

                // read the tile service resolution and tile sizes etc
                imageSource = imageSource.replace(/TMS:./, '');
                jQuery.ajax({
                        type: 'GET',
                        cache: false,
                        dataType: 'xml',
                        async: false, // we need the request to complete
                        url: imageSource + '/tilemapresource.xml',
                        success: function(tileSpecXml) {
                            var xmlObj = jQuery(tileSpecXml);
                            var tileset0 = xmlObj.find('TileSet')[0];
                            maxRes = parseFloat(jQuery(tileset0).attr('units-per-pixel'));

                            var tileFormat = xmlObj.find('TileFormat')[0];
                            tileSize = parseInt(jQuery(tileFormat).attr('height'));
                            format = jQuery(tileFormat).attr('extension');
                        }
                 });

                 var config =   {
                        displayOutsideMaxExtent: false,
                        layername: '.',
                        isBaseLayer: true,
                        maxResolution: maxRes,
                        maxExtent: boundsObj,
                        serviceVersion: '',
                        tileOrigin: new OpenLayers.LonLat(boundsObj.left, boundsObj.bottom),
                        transitionEffect: 'resize',
                        type: format,
                        units: self.widget.options.rasterUnits,
                        wrapDateLine: false
                    };
                if (olConfig != undefined)
                    jQuery.extend(config, olConfig);

                var layer = new OpenLayers.Layer.TMS(
                    title,
                    imageSource,
                    config
                );
                return layer;
            },


            makeLayerOLWMS: function(title, useSphericalMercator, mapType)
            {
                var self = this;

                var projection =    new OpenLayers.Projection("EPSG:4326");
                if (useSphericalMercator)
                    projection =    new OpenLayers.Projection("EPSG:900913");
                
                var layer = new OpenLayers.Layer.WMS
                (
                    title,
                    'http://vmap0.tiles.osgeo.org/wms/vmap0',
                    {
                        layers: mapType
                    },
                    {
                        reproject:      true,
                        projection:     projection,
                        wrapDateLine:   self.widget.options.dateLineWrap
                    }
                );
                return layer;
            },

            makeLayerOSM: function(title, useSphericalMercator)
            {
                var self = this;

                var layer = new OpenLayers.Layer.OSM(title);
                return layer;
            },

            makeLegendData: function(label, analysedData)
            {
                var self = this;

                var legendData = {};
                var categoryIdx = 0;
                if  (! analysedData)
                    return undefined;
                // for each search
                jQuery.each(analysedData, function(searchName, searchDescription) {
                        var collateBy = searchDescription.collateByCategory;
                        var subTitle = searchDescription.displayName;
                        if (collateBy != label)
                            subTitle += ' ' + IMu.string('map-view-collate-prefix') + ' ' + collateBy;

                        // sort each set of distinct values in the collateby field
                        var legendItems = searchDescription.categories[collateBy].distinctValues;
                        var keys = [];
                        var icons = {};
                        for (var key in legendItems)
                        {
                            if (legendItems.hasOwnProperty(key))
                            {
                                var entryId = 'imu-legend-item-' + self.widget.uniqueId + '-' + categoryIdx;
                                var iconId = 'imu-legend-icon-' + self.widget.uniqueId + '-' + categoryIdx;
                                var shape = self.getGroupPointShapeColour( searchDescription.searchIndex, legendItems[key].valueIndex);
                                if (! self.useShapeDrawer)
                                {
                                    // use OpenLayers to draw the icon
                                    self.makeLegendVector( iconId, searchDescription.symbolShape, shape.colour, 6, 'black', 1);
                                    icons[key] = iconId;
                                }
                                else
                                {
                                    // use a custom utility to draw the icon
                                    var url = self.makeClusteredMarkerUrl([{ 'shape': searchDescription.symbolShape, 'colour': shape.colour, 'radius' : 10 }]);
                                    jQuery('#' + iconId).html('<img src="' + url + '"/>');
                                    icons[key] = url;
                                }
                                keys.push(key);
                            }
                            keys.sort();

                            legendData[searchName] = {
                                        name: searchName,
                                        description: searchDescription,      
                                        collateBy: collateBy,
                                        subTitle: subTitle,
                                        items: legendItems,
                                        keys: keys,
                                        icons: icons    
                                };
                        }
                });

                return legendData;
            },

            /*
            **
            */
            makeLegendIcon: function(shape, colour, radius)
            {
                var self = this;

                var url = IMu.path + '/request.php?request=ShapeDraw' +
                    '&shapes='  + shape +
                    '&colours=' + colour +
                    '&radius=' + radius;
                return url;

            },

            /*
            ** makeLegendVector
            **
            ** Use OpenLayers map object like a vector drawing canvas - a hack to
            ** allow us to draw vector symbols anywhere on our page.
            ** Draws symbol in the passed div.
            */
            makeLegendVector: function (divId, symbolName, colour, size,
                                                    strokeColour, strokeWidth)
            {
                var self = this;

                // make a 'map' with no controls we can use as a blank canvas to
                // draw on
                var div = jQuery('#' + divId);
                if (div.width() == 0)
                    div.width(2 * size);
                if (div.height() == 0)
                    div.height(2 * size);

                var canvas = new OpenLayers.Map( divId, { controls: [] });

                if (symbolName == null)
                    symbolName = 'circle';


                var features = Array(1);
                features[0] = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(0, 0),
                    { 
                        type: symbolName
                    }
                );

                var styles = new OpenLayers.StyleMap({
                    "default": {
                        graphicName: "${type}",
                        pointRadius: size,
                        fillColor: colour,
                        strokeColor: strokeColour,
                        strokeWidth: strokeWidth,
                        fillOpacity: self.options.iconfillOpacity
                    }
                });


                var layer = new OpenLayers.Layer.Vector(
                    "Graphics", {
                        styleMap: styles,
                        isBaseLayer: true
                    }
                );
                layer.addFeatures(features);
                canvas.addLayer(layer);

                canvas.zoomToMaxExtent();
            },

            makePointFeature: function(x, y, z, info, useSphericalMercator)
            {
                var self = this;

                var point = new OpenLayers.Geometry.Point(x, y);
                if (useSphericalMercator)
                {
                    var sphericalMerc = new OpenLayers.Projection("EPSG:900913");
                    var cartesianLatLong = new OpenLayers.Projection("EPSG:4326");
                    point.transform(cartesianLatLong, sphericalMerc);
                }

                var feature = new OpenLayers.Feature.Vector(point);
                // set feature properties
                feature.attributes.x = x;
                feature.attributes.y = y;
                feature.attributes.z = z;
                feature.attributes.rawRow = info.rawRow;

                if (info.id)
                    feature.attributes.id = info.id;
                if (info.source)
                    feature.attributes.source = info.source;
                if (info.source)
                    feature.attributes.source = info.source;
                if (info.searchLabel)
                    feature.attributes.searchLabel = info.searchLabel;
                if (info.searchName)
                    feature.attributes.searchName = info.searchName;
                if (info.displayStyle)
                    self.setPointDisplayStyle(feature, info);

                return feature;

            },

            /*
            ** makePointLayer.
            */
            makePointLayer: function(name, nocluster)
            {
                var self = this;

                // display properties can be dynamically calculated
                // depending upon the 'contexts'
                var defaultContext = {
                        'display':
                            function(feature)
                            {
                                return self.getFeatureMarkerDisplay(feature);
                            },
                        'fillColour':
                            function(feature)
                            {
                                return self.getFeatureFillColour(feature);
                            },
                        'graphicWidth':
                            function(feature)
                            {
                                return self.getFeatureGraphicWidth(feature);
                            },
                        'xWobble':
                            function(feature)
                            {
                                return self.getFeatureWobble(feature, 'x');
                            },
                        'yWobble':
                            function(feature)
                            {
                                return self.getFeatureWobble(feature, 'y');
                            },
                        'hiRadius':
                            function(feature)
                            {
                                return 1.5 * self.getFeatureMarkerRadius(feature);
                            },
                        'label': function(feature)
                            {
                                return self.getFeatureMarkerLabel(feature);
                            },
                        'labelYOffset': function(feature)
                            {
                                if (self.detectIE())
                                    return -8
                                else
                                    return 0;
                            },
                        'legend':
                            function(feature)
                            {
                                self.updateDynamicLegend(feature);
                            },
                        'lineStyle': function(feature)
                            {
                                return self.getFeatureMarkerLineStyle(feature);
                            },
                        'opacity':
                            function(feature)
                            {
                                return self.getFeatureMarkerOpacity(feature);
                            },
                        'radius':
                            function(feature)
                            {
                                return self.getFeatureMarkerRadius(feature);
                            },
                        'strokeColour':
                            function(feature)
                            {
                                return self.getFeatureStrokeColour(feature);
                            },
                        'strokeWidth':
                            function(feature)
                            {
                                return self.getFeatureStrokeWidth(feature);
                            },
                        'symType':
                            function(feature)
                            {
                                return self.getFeatureSymbolType(feature);
                            },
                        'url':
                            function(feature)
                            {
                                return self.getFeatureMarkerUrl(feature);
                            },
                        'zIndex':
                            function(feature)
                            {
                                return self.getFeatureMarkerZIndex(feature);
                            }
                };
                var styleHash = {
                    'default': new OpenLayers.Style(
                        {
                            display:         '${display}',
                            externalGraphic: '${url}',
                            fillColor:       '${fillColour}',
                            fillOpacity:     '0.70',
                            fontColor:       '#000033',
                            fontFamily:      '"Comic Sans MS", cursive, sans-serif',
                            fontSize:        '1.5em',
                            fontWeight:      'normal',
                            graphicName:     '${symType}',
                            graphicOpacity:  '${opacity}',
                            graphicHeight:   '${graphicWidth}',
                            graphicWidth:    '${graphicWidth}',
                            graphicXOffset:  '${xWobble}',
                            graphicYOffset:  '${yWobble}',
                            graphicZIndex:   '${zIndex}',
                            label:           '${label}',
                            labelAlign:      'cm',
                            labelYOffset:    '${labelYOffset}',
                            legend:          '${legend}', // NB not a real OL
                                                          // style property
                            pointRadius:     '${radius}',
                            strokeColor:     '${strokeColour}',
                            strokeDashstyle: '${lineStyle}',
                            strokeWidth:     '${strokeWidth}'
                        },
                        {
                            'context': defaultContext
                        }
                    ),
                    'highlight': new OpenLayers.Style(
                        {
                            pointRadius:     '${hiRadius}',
                            graphicOpacity:  1
                        },
                        {
                            'context': defaultContext
                        }
                    ),
                    "hidden": new OpenLayers.Style(
                        {
                            display: false,
                            pointRadius: 0,
                            fillColor: '#ff0000'
                        }
                    )
                };

                var style = new OpenLayers.StyleMap(styleHash);

                var vectorConfig = {
                        reportError:  true,
                        styleMap:     style,
                        wrapDateLine: self.widget.options.dateLineWrap,
                        isFixed:      true
                };

                if (nocluster == undefined)
                    nocluster = false;
                if (self.widget.options.clusterPoints && (! nocluster))
                {
                    var strategyMethod = OpenLayers.Strategy.Cluster;
                    if (self.clusterStrategy == 'centred')
                        strategyMethod = OpenLayers.Strategy.CenteredCluster;

                    var cluster = new strategyMethod(
                    {
                            'distance': self.widget.options.clusterDistance,
                            'threshold': self.widget.options.clusterThreshold

                    });
                    vectorConfig['strategies'] = [ cluster ];
                }

                var vector = new OpenLayers.Layer.Vector(
                    name,
                    vectorConfig
                );

                if (self.widget.options.useSphericalMercator)
                    vector.addOptions( {
                            projection: new OpenLayers.Projection("EPSG:900913"),
                            units: 'm'
                    });
                else
                    vector.addOptions( {
                            projection: new OpenLayers.Projection("EPSG:4326"),
                            units: 'degrees'
                    });

                vector.ke = 'ke point layer';
                return vector;
            },


            /*
            ** makeScalebar
            ** create OL scalebar control
            */
            makeScalebar : function()
            {
                    var scalebar = new OpenLayers.Control.ScaleBar(
                    {
                        minWidth: 200,
                        maxWidth: 300,
                        allowSelection: true
                    });
                    scalebar.activate();
                    return scalebar;
            },

            markClusterAsDone: function(layer, features, cluster)
            {
                var self = this;
                self.clusterCache[layer.name] = self.makeClusterSignature(layer, features, cluster);
            },

            /*
            ** popupFeature.
            */
            popupFeature: function(feature, popup, triggeringEvent)
            {
                var self = this;

                var fs = self.getRepresentativeFeatures(feature);
                var features = [];
                if (feature.cluster)
                    features = feature.cluster;
                else
                    features.push(feature);
                
                if (popup)
                {
                    feature.renderIntent = "highlight";
                    self.showPopup(fs, triggeringEvent);
                    self.hideToolTip(fs);
                    self.toggleFeatures(fs, true);
                }
                else
                {
                    feature.renderIntent = "default";
                    self.hideToolTip(fs);
                    self.toggleFeatures(fs, false);
                }
                self.alertLegend(feature, popup);
            },

            /*
            ** prepareMapToDisplayNewPoints.  Do anything necessary on display
            ** prior to adding new features.
            */
            prepareMapToDisplayNewPoints: function()
            {
                var self = this;

                /*
                 * Hack to force resize events to get around issues showing
                 * layers in a div that was hidden at map creation time.
                 * This a problem when using a map widget in an IMu combined
                 * viewer if the map-view is not the first view in the
                 * combination.  May not be required in future OL (2.12+)
                 * but currently is an issue.
                */

                // we need some realistic heights and widths of the element the
                // mapper is going into at this point...
                var h = self.widget.owner[0].clientHeight;
                var w = self.widget.owner[0].clientWidth;

                if ((' ' + w).match(/\d+$/))
                    w += 'px';
                if ((' ' + h).match(/\d+$/))
                    h += 'px';

                var m = self.map.div.style;
                m.height = h;
                m.width = w;
                self.map.updateSize();
            },

            /*
            ** recalculateFeatureBounds.
            ** set the details about the feature's geometry/bounds etc
            ** (call ithis method if the feature's coordinates are changed)
            */
            recalculateFeatureBounds: function(feature)
            {
                var self = this;
                feature.geometry.calculateBounds();
                return feature;
            },

            /*
            ** redrawLayer.
            ** redraws the given map layer
            */
            redrawLayer: function(layer)
            {
                var self = this;
                layer.redraw();
            },

            /*
            ** force all vector layers to redraw (perhaps as a result of
            ** filtering etc in Pest Management Tool)
            */
            redrawPoints: function()
            {
                var self = this;

                var pointLayers = self.getPointLayers();
                jQuery.each(
                    pointLayers,
                    function(idx, layer)
                    {
                        layer.redraw()
                    }
                );
            },

            /*
            ** Removes existing map and recreates a new one using new base
            ** layers etc.  Useful when changing the set of base layers the map
            ** refers to (eg when changing the 'map group' values.  Simply
            ** dropping and adding base layers of an OL map object is
            ** problematic as the map sets a number of internal properties of
            ** itself (and the base layers) when it is constructed, using
            ** properties of the base layers it is initially provided with.
            */
            recreateMap: function()
            {
                var self = this;

                var baseName = self.getBaseLayer().name;

                var mapOptions = jQuery.extend(true, {}, self.map.options);
                var holderId = self.map.div;

                for (var i = 0; i < self.map.controls.length; i++)
                {
                    var c = self.map.controls[i];
                    self.map.removeControl(c);
                    c.destroy();
                }

                // remove old map as we will make a new one
                self.map.destroy();
                self.map = undefined;
                self.panel = undefined;

                jQuery.each(self.clusterExtentLayers, function(name, cLayer)
                {
                        cLayer.destroy();
                });

                self.map = new OpenLayers.Map(holderId, mapOptions);
                self.map.ke = { widgetSelf : self.widget };
                self.map.fractionalZoom = false;
                self.setDefaultDrawingParams();

                self.clusterExtentLayers = {};
                self.initialiseMap();

                var newBaseName = self.getBaseLayer().name;
                if (newBaseName != baseName)
                    self.widget.changeBaseLayer(baseName);

            },

            /*
            ** change the features in a layer
            */
            refreshFeaturesInLayer: function(layer, features, cluster)
            {
                var self = this;

                // re-clustering is expensive - only do it if really need to.
                if (self.hasClusterChanged(layer, features, cluster))
                {
                    if (layer.strategies.length > 0)
                    {

                        var clusterStrategy = layer.strategies[0];
                        clusterStrategy.distance = self.widget.getClusterDistance(false);
                        clusterStrategy.deactivate();
                        layer.removeAllFeatures();

                        if (cluster)
                            clusterStrategy.activate();
                        layer.addFeatures(features);

                    }
                    self.markClusterAsDone(layer, features, cluster);
                    self.redrawLayer(layer);
                }
            },

            /*
            ** This method adjusts the clustering of a layer
            ** OL clustering behavior is only triggered when features
            ** added, not when the cluster size is adjusted.  To refresh
            ** clusters, renmove all features and re-add them.
            ** cluster: boolean - do we cluster or not?
            ** NB 'cluster' is different from 'hasClusterExtentLayers' property.
            ** 'hasClusterExtentLayers' indicates if a cluster extent layer is
            ** used (it shows the user how big the cluster extent is).
            */
            refreshFeaturesUsingClusterSize: function(layer, cluster)
            {
                var self = this

                if (layer != undefined && self.clusterExtentLayers[layer.name] == undefined)
                {
                    if ((layer.strategies != undefined) && (layer.strategies.length > 0))
                    {
                        var features = self.getLayerFeatures(layer);
                        self.refreshFeaturesInLayer(layer, features, cluster);

                        // refresh the associated cluster extent layer if one
                        // used
                        if (self.widget.hasClusterExtentLayers)
                        {
                            var clusterLayerName = layer.name + ' ' + IMu.string('map-view-cluster-size-overlay') ;
                            var cLayer = self.clusterExtentLayers[clusterLayerName];
                            if (cLayer == undefined)
                            {
                                cLayer = self.makeClusterLayer(clusterLayerName);
                            }
                            else
                            {
                                self.widget.clusterExtentLayerVisibility = cLayer.visibility;
                            }
                            var cFeatures = self.cloneFeatures(features);
                            self.refreshFeaturesInLayer(cLayer, cFeatures, cluster);
                            cLayer.display(self.widget.clusterExtentLayerVisibility);
                        }
                    }
                }
            },

            removeAllLayerFeatures: function(layer)
            {
                var self = this;
                layer.removeAllFeatures();
                layer.refresh();
            },


            removeLayer: function(layer)
            {
                var self = this;
                self.map.removeLayer(layer);
            },

            /*
            ** remove all legend elements
            */
            removeLegend: function()
            {
                var self = this;

                // clean up legend
                if (self.legendHolder !== undefined)
                {
                    self.legendHolder.hide('slow');
                    self.legendHolder.empty();
                }
            },

            resize: function()
            {
                var self = this;
                self.holder.height(self.map.div.clientHeight);
                self.holder.width(self.map.div.clientWidth);
                self.map.updateSize();
            },

            setBaseLayer: function(layer)
            {
                var self = this;
                self.map.setBaseLayer(layer);
            },

            /*
            ** changes the clustering strategy and redraws the map to reflect
            ** the changes
            */
            setClusterStrategy: function(strategy)
            {
                    var self = this;
                    var redraw =  (strategy != self.clusterStrategy);
                    switch(strategy)
                    {
                        case 'centred':
                        case 'centered':
                            self.clusterStrategy = 'centred';
                            break;
                        default:
                            self.clusterStrategy = 'default';
                            break;
                    }
                    if (redraw)
                    {
                        jQuery.each(self.clusterExtentLayers, function(name, cLayer) {
                                self.map.removeLayer(cLayer);
                        });
                        self.clusterExtentLayers = {};
                        self.clusterCache = {};
                        if (strategy != 'none')
                        {
                            self.setClustering(true);
                            self.widget.redisplaySearches();
                        }
                        else
                            self.setClustering(false);
                    }
            },


            /*
            ** turns clustering on/off
            */
            setClustering: function(cluster)
            {
                var self = this;

                var pointLayers = self.getPointLayers();
                for (var i = 0; i < pointLayers.length; i++)
                {
                    var pointLayer = pointLayers[i];
                    self.refreshFeaturesUsingClusterSize(pointLayer, cluster)
                }

                jQuery.each(self.clusterExtentLayers, function(name, cLayer) {
                    cLayer.setVisibility(self.widget.clusterExtentLayerVisibility);
                });
                self.clusteringOn = cluster;
            },    

            /*
            ** setDefaultDrawingParams
            **
            ** point drawing properties
            */
            setDefaultDrawingParams: function ()
            {
                var self = this;

                self.options.defaultRadius = 6;

                // design some custom shapes
                OpenLayers.Renderer.symbol.lightning = [
                        0,0, 4,2, 6,0, 10,5, 6,3, 4,5, 0,0
                    ];
                OpenLayers.Renderer.symbol.rectangle = [
                        0,0, 4,0, 4,10, 0,10, 0,0
                    ];
                OpenLayers.Renderer.symbol.upTriangle = [
                        0,0, 5,10, 10,0, 0,0
                    ];
                OpenLayers.Renderer.symbol.I = [
                        0,0, 0,2, 4,2, 4,8, 0,8, 0,10, 10,10, 10,8, 6,8,
                        6,2, 10,2, 10,0, 0,0 
                    ];
                OpenLayers.Renderer.symbol.T = [
                        4,10, 4,2, 0,2, 0,0, 10,0, 10,2, 6,2, 6,10, 4,10
                    ];
                OpenLayers.Renderer.symbol.bowTie = [
                        0,0, 10,10, 10,0, 0,10, 0,0 
                    ];


                if (self.widget.markerShapes.length == 0)
                    self.widget.setMarkerShapes([
                        'circle', 'square', 'triangle',
                        'upTriangle', 'star', 'cross',
                        'bowTie', 'x', 'lightning',
                        'rectangle', 'I', 'T'
                    ]);

                if (self.widget.markerColours.length == 0)
                    self.widget.setMarkerColours(
                        [
                            '#F1683C', '#2AD62A', '#DBDC25', '#8FBC8B', '#D2B48C',
                            '#FAF0E6', '#20B2AA', '#B0C4DE', '#DDA0DD', '#9C9AFF',
                            '#9C3063', '#FFFFCE', '#CEFFFF', '#630063', '#FF8284',
                            '#0065CE', '#CECFFF', '#000084', '#FF00FF', '#FFFF00',
                            '#00FFFF', '#840084', '#840000', '#008284', '#0000FF',
                            '#00CFFF', '#CEFFCE', '#FFFF9C', '#9CCFFF', '#FF9ACE',
                            '#CE9AFF', '#FFCF9C', '#3165FF', '#31CFCE', '#9CCF00',
                            '#FFCF00', '#FF9A00', '#FF6500', '#80F31F', '#D5078E',
                            '#01BECA', '#E49C03', '#6917ED', '#FA2E48', '#0F79F5',
                            '#ABDA09', '#B001B9', '#0CE0A2', '#F97014', '#4036FC',
                            '#E71273', '#02A5DE', '#D1B601', '#850ADC', '#FE4531',
                            '#1E5EFD', '#91EB15', '#C8039F', '#04CCBB', '#EE8B08',
                            '#5922F4', '#F52258', '#088AEE', '#BBCD04', '#A002C7',
                            '#15EA91', '#FD5F1E', '#3245FE', '#DD0A84', '#01B5D2',
                            '#DEA601', '#7411E7', '#FC373F', '#146FF9', '#A1E10D',
                            '#B901AF', '#08D9AC', '#F57A0E', '#492EFA', '#ED1769',
                            '#039BE5', '#808080', '#FEBA40', '#6718EE', '#AF07ED',
                            '#F0D740', '#3B5B7F', '#1C68C0', '#D7CE11', '#D30CFE',
                            '#4011BE', '#F3C581', '#A9733F', '#0451EE', '#6DDF01',
                            '#FE04ED', '#021F7E', '#9DB0C1', '#F88B11', '#4B3CFE',
                            '#12ED13', '#C901BD', '#24303E', '#3199EF', '#EAA201',
                            '#BA29EC', '#5C027C', '#FCE8C2', '#8C4410', '#0181FE',
                            '#8CB813', '#FC19BC', '#0A073D', '#BAD9EF', '#EA5A01',
                            '#3169EB', '#24CC44', '#DF0D7B', '#12100F', '#4BC6FE',
                            '#F87114', '#9D53BB', '#02DE84', '#79053C'
                        ]
                );

                self.options.iconStrokeColour = '#000000';
                self.options.iconStrokeWidth = 1;
            },

            /*
            ** setFeatureScreenCoordinates.
            ** adjust the x,y coordinates used to display the feature
            */
            setFeatureScreenCoordinates: function(feature, x, y)
            {
                var self = this;
                feature.geometry.x = x;
                feature.geometry.y = y;
            },


            /*
            ** setPointDisplayStyle
            ** set point display properties
            */
            setPointDisplayStyle: function(feature, info)
            {
                var self = this;
                
                feature.attributes.colour = info.displayStyle.colour;
                feature.attributes.shape = info.displayStyle.shape;
                feature.renderIntent = 'default';
            },

            setHolderDimensions: function(owner)
            {
                var self = this;

                var holder = owner.find('.holder');

                // make uniq id for map holder
                var id = IMu.Format.sprintf('imu-map-{0}', self.widget.uniqueId);
                holder.attr('id', id);

                // kludge - need an initial size for OL Map object.  This is
                // awkward when mapper is added to a combined view as the
                // holder is not yet sized.  If no height, look up parent
                // heights
                var p = holder.parent();
                while ((p.length > 0) && (holder.width() == 0))   
                {
                    var pWidth = jQuery(p).width();
                    if (pWidth > 0)
                        holder.width(pWidth);
                    p = p.parent();
                }

                var p = holder.parent();
                while ((p.length > 0) && (holder.height() == 0))   
                {
                    var pHeight = jQuery(p).height();
                    if (pHeight > 0)
                        holder.height(pHeight);
                    p = p.parent();
                }

                // last resort
                if (holder.width() == 0)
                    holder.width(256);
                if (holder.height() == 0)
                    holder.height(256);

                if (self.widget.options.autoAdjustAspectRatio)
                {
                    if (self.widget.options.useSphericalMercator)
                    {
                        // spherical mercator maps should be square
                        holder.height(holder.width());
                    }
                    else
                    {
                        if (self.widget.options.initialExtentLBRT != undefined)
                        {
                            var bounds = new OpenLayers.Bounds(
                                    self.widget.options.initialExtentLBRT);
                            var aspectRatio = bounds.getWidth() / bounds.getHeight();
                            holder.height(holder.width() / aspectRatio);
                        }
                    }
                }
                return holder;
            },


            /*
            ** showLegend.
            */
            showLegend: function(evt)
            {
                /* may be called as an event in which case 'this' will equal the OL
                 * control not the IMu view object :(
                 */
                var self = this;
                if ('CLASS_NAME' in self)
                {
                    if ('ke' in this.map)
                        self = this.map.ke.widgetSelf.view;
                    else
                        return;
                }

                self.legendHolder.show(500);
            },

            /*
            ** showPoint.
            */
            showPoint: function (feature)
            {
                var self = this;
                feature.style = null;
            },


            /*
            ** showPopup.
            ** generate a popup that describes a feature
            */
            showPopup: function(features, triggeringEvent)
            {
                var self = this;

                /* The OpenLayers Popup object creates all the popup elements
                 * and expects a string of HTML to be provided that it will
                 * display in the popup.  We cannot easily manipulate the
                 * DOM contents of the popup using typical IMu methods (eg
                 * newElement).  For this reason we have to make a string of
                 * the HTML contents.
                 * It may be worth looking at creating a KE popup method to
                 * use instead if we want more control (eg see tooltip stuff
                 * in this widget)
                 */

                var attr = features[0].attributes;

                var id = 'popup_' + attr.source + '_' + attr.rawRow.irn;
                var position = features[0].geometry.getBounds().getCenterLonLat();

                var label = '';
                if (features.length == 1)
                {
                    label = self.drawDetailsLink(features[0], 0);
                }
                else
                {
                    jQuery.each(features,
                        function(idx, f)
                        {
                            label += '#' + (idx+1) + ': ' + self.drawDetailsLink(f, 45) +  '<br/>' ;
                        }
                    );
                }

                // need an HTML string for OL popup...
                var html = '';
                html += '<div class="map-view-popup-contents">';
                html += '<div class="map-view-popup-description">' + label + "</div>";
                html += '</div>';
                var popup = new OpenLayers.Popup.FramedCloud
                (
                    id,
                    position,
                    null,
                    html,
                    null,
                    true,
                    self.closePopupBox
                );

                jQuery.each(
                    features, function(idx, feature)
                    {
                        if (feature.lonlat == null)
                        {
                            feature.lonlat = new OpenLayers.LonLat(
                                feature.geometry.x,
                                feature.geometry.y);
                        }
                        feature.popup = popup;
                        popup.ke = {
                            feature: feature
                        };
                    }
                );
                self.map.addPopup(popup);

                jQuery('.map-view-popup-specimenLink').click(
                    function(evt)
                    {
                        self.displayItemDetailsEvent(evt);
                    }
                );
            },

            /*
            ** display message on screen
            ** currently message will fade away in a second or two.
            */
            showStatusMessage: function(msg, keep)
            {
                var self = this;

                if (self.widget.options.showStatusMessages)
                {

                    self.statusHolder.empty().html('<span>' + msg + '</span>')
                                                .show();
                    if (! keep)
                    {
                        self.statusHolder.fadeOut(500);
                    }
                    else
                    {
                        var img = self.statusHolder.find('span')
                                            .child('img', 'loading');
                        var src = IMu.Request.getURL('Image');
                        src += '&name=spinner';
                        img.attr('src', src);
                    }

                    var dim = self.getNeededDisplayDimensions(self.statusHolder);
                    self.statusHolder.css(
                        {
                            'width': dim.width * 1.5,
                            'height': dim.height * 1.5
                        });
                }
            },

            /*
            ** displays EMu data details in a simple way without using one of
            ** the other IMu widgets
            */
            simpleDetailsDisplay: function(data, holder)
            {
                var self = this;

                var t = self.simpleDetailsHeader(data);

                var fields = [];
                for (var field in data)
                {
                  fields.push(field);
                }

                t += '<table class="imu-map-simpledetails-details">';
                for (field in fields.sort())
                {
                  var f = fields[field];
                  var value = self.simpleDetailsValueToString(data[f]);
                  var fName = IMu.string(f);
                  if (value != '')
                      t += '<tr><td class="imu-map-details-emu-field-name">' +
                            fName +
                        '</td><td class="imu-map-details-emu-field-value">' +
                            value +
                        '</td></tr>' + "\n";
                }
                t += '</table>';
                holder.html(t);

            },

            /*
            ** displays EMu data header details in a simple way without using
            ** one of the other IMu widgets
            */
            simpleDetailsHeader: function (data)
            {
                var self = this;

                var t = '<table class="imu-map-simpledetails-header">' + "\n";
                if (data['irn'] != undefined)
                {
                    t += '<tr><td class="imu-map-simpledetails-irn">' +
                             IMu.string('irn') +
                        '</td><td class="imu-map-details-emu-field-value">' +
                            data['irn'] +
                        '</td></tr>' + "\n";
                }
                if (data['SummaryData'] != undefined)
                {
                    t += '<tr><td class="imu-map-simpledetails-summary">' +
                            IMu.string('SummaryData') +
                        '</td><td  class="imu-map-details-emu-field-value">' +
                            data['SummaryData'] +
                        '</td></tr>' + "\n";
                }
                if (data['multimedia'] != undefined)
                {
                    if ( data['multimedia'].length > 0)
                    {
                        var mmObj = data['multimedia'][0];
                        if (mmObj['type'] == 'image')
                        {
                            var key = mmObj['irn'];
                            var url = IMu.path + '/request.php?request=Multimedia&method=fetch&filter=kind:eq:thumbnail&key=' + key;
                            t += '<tr><td colspan="2" class="imu-map-simpledetails-thumbnail"><img src="' +
                                url + '"/></td></tr>' + "\n";
                        }
                    }
                }
                t += '</table>' + "\n";
                return t;
            },

            /*
            ** try and generate a string for display EMu field data
            ** 
            */
            simpleDetailsValueToString: function(value)
            {
                var self = this;

                if (value == null)
                    return '';

                switch (jQuery.type(value))
                {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        return value;
                        break;
                    case 'array':
                        if (value.length == 0)
                            return '';
                        var v = '<table>';
                        for (var i = 0; i < value.length; i++)
                        {
                            var subValue = self.simpleDetailsValueToString(value[i]);
                            v += '<tr><td class="imu-map-details-emu-field-value">' +
                                                    subValue +
                                '</td></tr>' + "\n";
                        }
                        v += '</table>';
                        return v;
                        break;
                    case 'object':
                        var v = '<table>';
                        for (var field in value)
                        {
                            var subValue = self.simpleDetailsValueToString(value[field]);
                            var fName = IMu.string(field);
                            if (subValue != '')
                                v += '<tr><td class="imu-map-details-emu-field-name">' +
                                        fName +
                                    '</td><td class="imu-map-details-emu-field-value">' +
                                        subValue +
                                    '</td></tr>' + "\n";
                        }
                        v += '</table>';
                        return v;
                    default:
                        return '"' + value + '"';
                        break;
                }
            },

            /*
            ** showToolTip.
            ** show a tooltip for a point (eg when hovering over it)
            */
            showToolTip: function (features, triggeringEvent)
            {
                var self = this;

                if (self.widget.markerDisplayFunction !== undefined)
                    return self.widget.markerDisplayFunction(self, features, triggeringEvent);

                var representativeFeature = features[0];
                var attr = representativeFeature.attributes;

                if (representativeFeature.lonlat == null)
                {
                    representativeFeature.lonlat = new OpenLayers.LonLat(
                            representativeFeature.geometry.x,
                            representativeFeature.geometry.y
                            );
                }

                // make sure any previous toolTip is gone
                jQuery('#toolTip').empty();
                jQuery('#toolTip').remove();

                var label = '';
                if (features.length == 1)
                    label = self.drawDetailsLink(features[0], 0);
                else
                {
                    jQuery.each(features,
                        function(idx, f)
                        {
                            label += '#' + (idx+1) + ': ' + self.drawDetailsLink(f, 45) +  '<br/><br/>' ;
                        }
                    );
                }

                var mapElement = jQuery('#imu-map-' + self.widget.uniqueId);
                var toolTip = mapElement.child(
                            'span',
                            'toolTip'
                            ).html(label);
                toolTip.attr('id', 'toolTip');
                toolTip.attr('class', 'imu-map-toolTip');

                var pixels = self.map.getPixelFromLonLat(representativeFeature.lonlat);
                pixels.x += mapElement.position().left;
                pixels.y += mapElement.position().top
                var left = pixels.x + 'px';
                var top = pixels.y + 'px';
                toolTip.css(
                    {
                        'left': left,
                        'top': top
                    }
                );

                //representativeFeature.layer.drawFeature(representativeFeature);

                jQuery('.map-view-popup-specimenLink').click(
                    function(evt)
                    {
                        self.displayItemDetailsEvent(evt);
                    }
                );
            },

            toggleFeatures: function(features, state)
            {
                var self = this;
                for (var i = 0; i < features.length; i++)
                {
                    var emuData = features[i].attributes.rawRow;
                    if (state)
                        self.triggerEvent('record-selected', emuData.rid);
                    else
                        self.triggerEvent('record-deselected', emuData.rid);
                }
            },

            transformBoundsLatLong2Mercator: function(bounds)
            {
                var self = this;
                bounds.transform(
                                new OpenLayers.Projection('EPSG:4326'),
                                new OpenLayers.Projection('EPSG:900913')
                        );
                if (bounds.bottom < -20037508.34)
                    bounds.bottom = -20037508.34
                if (bounds.top > 20037508.34)
                    bounds.top = 20037508.34
                return bounds;    
            },

            triggerEvent: function(localEventName, data)
            {
                IMu.Events.trigger('map-viewer-' + localEventName, data);
            },

            /*
            ** updateDynamicLegend.
            **
            ** Used when making a 'dynamic' layer (eg Pest Locator)
            **
            ** If we need to adjust the legend dynamically to account for how
            ** points are being displayed, do any logic here.  It will be
            ** called with each feature to be displayed.
            ** 
            */
            updateDynamicLegend: function(feature)
            {
                var self = this;
            },

            /*
            ** zoomToExtent.
            ** Zoom map to given bounds
            */
            zoomToExtent: function(bounds, closest)
            {
                var self = this;
                self.map.zoomToExtent(bounds, closest);
            },

            zoomToInitialExtent: function()
            {
                var self = this;

                var base = self.getBaseLayer();
                           
                var bounds = base.getExtent();
                if (self.widget.options.initialExtentLBRT != undefined)
                {
                    bounds = new OpenLayers.Bounds(
                            self.widget.options.initialExtentLBRT);

                    if (self.widget.options.useSphericalMercator)
                    {
                        bounds = self.transformBoundsLatLong2Mercator(bounds);
                    }
                }
                else if ((bounds.getWidth() == 0) || (bounds.getHeight() == 0))
                {
                    // kludge - if used in a combined viewer, it may not have shown
                    // layer yet and the bounds may not be properly set - check for
                    // this and try zooming out to max extent
                    self.map.zoomTo(1);
                    return;
                }
                self.zoomToExtent(bounds, false);
            },

            /*
            ** zoomToShowAllPoints.
            ** Zoom in or out sufficiently to display all mapped points
            */
            zoomToShowAllPoints: function()
            {
                /* may be called as an event in which case 'this' will equal the OL
                 * control not the widget object
                 */
                var self = this;
                if ('CLASS_NAME' in self)
                    self = this.map.ke.widgetSelf.view;

                var bounds = new OpenLayers.Bounds();
                var pointLayers = self.getPointLayers();
                jQuery.each(
                    pointLayers,
                    function(idx, layer)
                    {
                        // only extend bounds of visible points
                        bounds.extend(self.getVisibleBounds(layer));
                    }
                );

                self.map.panTo(bounds.getCenterLonLat());
                /* avoid zoom in if a small physical distribution, in that case
                ** just pan to show the points on screen rather than needlessly
                ** magnify the screen */
                if (bounds.getWidth() * bounds.getHeight() >= 2)
                    self.zoomToExtent(bounds, false);
            }
        }
    });
})(IMu.Themes.shared);
