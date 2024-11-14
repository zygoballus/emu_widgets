/*!
** This widget displays a map of the locations of each record in a result set.
**
** extends `viewer <./viewer.html>`_.
**
**
** Notes on conceptual model of a map, terminology etc:
** 
** A Map consists of various 'LAYERS' and various 'CONTROLS'
**
** -. A map has a BASE LAYER, which is a layer that always shows (eg a map of
** the world).
**
** -. There can be several base layers available - only one is shown at a time.
**
** -. The base layer currently being used can be changed by the user to an
**      alternative one.
**
** -. "NON-BASE LAYERS" are layers that can be optionally overlaid over the base
**      layer (eg EMu search results). 
**
** -. Unlike base layers, many non-base layers can be displayed on the map at
**      the same time.
**
** -. EMu Search data is turned into one or more non-base layers.
**
** -. EMu data layers are called 'VECTOR' layers (because they have multiple
**      FEATURES (eg an EMu item) that make up the layer).
**
** -. Vector layers consist of one or more FEATURES.
**
** -. Each feature has its own set of attributes (eg EMu field values, map
**      coordinates, visibility, colour, shape, highlight status etc).
**
** -. FEATURES are represented by a MARKER on the map.
**
** -. Each feature has an associated POINT (or potentially a POLYGON) that is
**      drawn when the layer or feature is displayed on the map
**
** -. Clustering can be used to group FEATURES in close proximity.
**
** -. A single FEATURE may be made up of several items (eg several EMu records)
**      if they are CLUSTERED.  This means a single MARKER may be used to represent
**      multiple items.
**
** -. Other vector layers (non EMu) can potentially be displayed as well on the
**      map.
**
** @since 2.0
**
*/

/*!
** @example  adding a collator
** @code
**   <html>
**     ...
**     <div id="my_collator_div"/>
**     ...
**     <script>
**       ...
**       ...
**       myMapWidget.addCollator('my_collator_div');
**       ...
** @endcode
**
** @example Adding an external layer switcher rather than using the OL
** default
** @code
**   <span>Map Overlays<div id='layer-switcher></div></span>
**   ...
**   ...
**   myMapWidget.addCustomLayerSwitcher('layer-switcher');
**   ...
** @endcode
**
** @example Add layer to internally recorded list of layers.
** @code
**   // add a Google Maps Physical Terrain Map
**   myMapWidget.addLayer('google-physical');
**
**   // add a locator layer
**   IMu.Config.Locator.layers[0] =    {
**       'name'  : 'Basement',
**       'src'   : 'Basement.gif',
**       'size'  : [588, 550],
**       'bounds': [-50, -360, 4030, 2975, -1000, -1],
**       'elevation': 'top'
**   }
**   ...
**   ...
**   myMapWidget.addLayer('Basement', 'Storage Areas');
**
**   // add an Open Layers layer
**   var layer = new OpenLayers.Layer.Vector("My Special Layer", {});
**   ...
**   ...
**   myMapWidget.addLayer(layer);
** @endcode
**
**   The id attribute of the element to hold the legend.
** @example  Add a 'legend' control
** @code
**   <html>
**     ...
**     <div id="my_legend_div"/>
**     ...
**     <script>
**       ...
**       ...
**       myMapWidget.addLegend('my_legend_div');
**       ...
** @endcode
**
** @example Change the base layer
**  @code
**      changeBaseLayer('First Floor');
**  @endcode
**
** @example Return current connection status
**  @code
**      if (! mapWidget.checkConnection)
**          alert('system unavailable, please try later');
**  @endcode
** NB currently this always returns true - reserved for future use.
**
** @example turn clustering on and off
**  @code
**     <input id="clusterOn" type="checkbox"
**                     checked="1">Draw Points as Clusters</input>
**     ...
**     <script>
**       ...
**       jQuery("#clusterOn").on("click", function()
**       {
**           if (jQuery(this).prop('checked'))
**              mapWidget.setClustering(true);
**           else
**              mapWidget.setClustering(false);
**      });
**       ...
**  @endcode
**
** @example  override the default colours used for markers
**  @code
**      setMarkerColours(
**          [ '#ff0000', '#00ff00', '#336699' ]
**      );
** @endcode
**
** @example override the default set of symbols used for drawing markers
**  @code
**      setMarkerShapes(
**          [ 'upTriangle', 'star', 'cross', circle' ]
**      );
** @endcode
**
** @example adjust relevance of features
**  @code
**  ...
**  var dateBounds = jQuery("#date-filter").dateRangeSlider('values');
**  var minDate = new Date(dateBounds.min);
**  var maxDate = new Date(dateBounds.max);
**  mapWidget.setRelevanceByDateRange('Inserted Points', 'DateInserted', minDate, maxDate);
**  ...
**  @endcode
**
** @example turn relevance filtering on/off
**  @code
**     <input id="filterOn" type="checkbox" checked="1">Filter Points by Date</input>
**     ...
**     <script>
**      ...
**      minDate = newDate('01/01/1999');
**      maxDate = newDate('01/02/1999');
**      mapWidget.setRelevanceByDateRange('Inserted Points', 'DateInserted', minDate, maxDate);
**      ...
**      ...
**      jQuery("#filterOn").on("click", function()
**      {
**          if (jQuery(this).prop('checked'))
**            mapWidget.setRelevanceFiltering(true);
**          else
**            mapWidget.setRelevanceFiltering(false);
**      });
**      ...
**  @endcode
**
** @example display a status message on screen
**  @code
**    showStatusMessage( IMu.string('danger-danger-danger'), true);
**    
**    showStatusMessage( IMu.string('it-is-10am'), false);
** @endcode
**
** @example  Set a custom function that will be called when requests for data
** on an item are requested
** @code
** ...
** function myDetailViewer(source, irn, data)
** {
**      // clever code to display details about an item
**      ...
** }
** ...
** ...
**   myMapWidget.setItemDetailsDisplay(myDetailViewer);
** ...
** @endcode
**
** @example  Set a custom function that will be called when requests for data
** on a marker are requested (a marker may represent several items)
** @code
** ...
** function myItemsListViewer(source, irn, data)
** {
**      // clever code to display details about one or more items
**      ...
** }
** ...
**    myMapWidget.setMarkerDetailsDisplay(myItemsListViewer);
** ...
** @endcode
**
** @example  Change the clustering strategy.  This will affect how closely
** located features are grouped together into a cluster of features.
** @code
** ..
** <input type="radio" name="strategy" value="default" checked="checked"/> Default
** <input type="radio" name="strategy" value="centred" /> Centred
** <input type="radio" name="strategy" value="none" /> None
** ...
** ...
** jQuery("input[name='strategy']").bind('change', function() {
**      var strategy = jQuery(this).val();
**      mapWidget.setClusterStrategy(strategy);
** });
** @endcode
*/



IMu.Widgets.add('map-viewer', 'viewer',
{
    /*!
    ** _constructor.
    */
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-map-viewer');

        this.setWidgetOptions();

        this.defaultLayerGroup = 'Common';
        // internally used properties
        this.analysedData = {};
        this.clusterExtentLayerVisibility = false;
        this.clustering = false;
        this.collateByOptions = undefined;
        this.currentGroup = this.defaultLayerGroup;
        this.distinctValues = [];
        this.errorState = false;    
        this.hasClusterExtentLayers = false;
        this.hasCollator = false;
        this.hasLegend = false;
        this.itemDisplayFunction = undefined;
        this.lastSearch = {};
        this.layerGroups = { };
        this.layers = [];
        this.legendDisplayFunction = undefined;
        this.markerDisplayFunction = undefined;
        this.overlays = {};
        this.relevanceFiltering = false;
        this.searches = [];
        this.searchResults = {};
        this.markerColours = [];
        this.markerShapes = [];
        this.wantedBaseLayer = undefined;
        this.uniqueId = this.makeUniqId();
        this.layerGroups[this.defaultLayerGroup] = {};

    },

    _ready: function()
    {
        var self = this;

        self._super.apply(self, arguments);

        if (self.options.allowCollationBy !== undefined)
        {
            self.collateByOptions = {};
            for (var i = 0; i < self.options.allowCollationBy.length; i++)
                self.collateByOptions[self.options.allowCollationBy[i]] = true;
        }    
    },

    /*!
    ** Adds a layer that indicates the clustering extent of a marker.
    ** 
    ** @param visibility boolean
    **   specifies if the cluster layer is to be turned on, on initial map
    **   display
    */
    addClusterRangeLayer: function(visibility)
    {
        var self = this;
        self.hasClusterExtentLayers = true;
        self.clusterExtentLayerVisibility = visibility;
    },

    /*!
    ** Add a 'collator' control that will use the passed element id.
    **
    ** @param id string
    **   The id attribute of the element to hold the collator.
    **   If the HTML element with the given id does not exist, the widget will
    **   not display a collator.
    **   A collator allows the user to change what symbols are used to display
    **   points and how they are grouped on a legend.
    **
    ** @returns null
    **/
    addCollator: function(id)
    {
         var self = this;

         self.hasCollator = true;
         // The view will not exist yet.
         IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                 if (widget == self)
                     self.view.addCollator(id);
         });
    },

    /*!
    **  Add OL layer switching to an external div.
    **  This removes the layer switcher from the map so it can be placed
    **  elsewhere on the page.
    **
    ** @param id string
    **   the ID of the element that will hold the layer switcher
    **
    */
    addCustomLayerSwitcher: function(divId)
    {
        var self = this;

        if (jQuery('#' + divId).length > 0)
        {
            // do not allow OL and custom layer switcher to both exist
            self.options.showLayerSwitcher = false;

            if (self.view !== undefined)
                self.view.addCustomLayerSwitcher(divId);
            else
                IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                    if (widget == self)
                        self.view.addCustomLayerSwitcher(divId);
                });
        }
    },

    /*!
    ** Adds layer to internally recorded list of layers.
    **
    ** @param layer mixed
    **   The name of the layer to add _or_ an OpenLayers
    **   layer object.
    **
    ** @param group string
    **   The name of the group (or site) that the layer belongs to.  Optional.
    **   If not specified the layer will only belong to the 'common' group.
    **/
    addLayer: function(layer, group)
    {
        var self = this;

        // We need view to exist before we can add layers
        if (self.view !== undefined)
            self.addLayerInternal(layer, group)
        else
            IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                if (widget == self)
                    self.addLayerInternal(layer, group);
            });
    },



    /*!
    ** Add a 'legend' control that will use the passed element id.
    **
    ** @param id string
    **/
    addLegend: function(id)
    {
        var self = this;

        self.hasLegend = true;
        // The view will not exist yet.
        IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
            if (widget == self)
                    self.view.addLegend(id);
            });
    },

    /*!
    ** Change the base layer to be the layer with the given name.
    **
    ** @param layerName string
    **   The name of the layer. Assumes a layer with that name exists.
    **   If not no change is made
    */
    changeBaseLayer: function(layerName)
    {
        var self = this;
        self.wantedBaseLayer = layerName;
        if (self.view !== undefined)
        {
            var layers = self.view.map.getLayersByName(self.wantedBaseLayer);
            self.setBaseLayer(layers[0]);
        }
    },

    /*!
    ** Returns current connection status to the IMu server.
    ** NB currently this always returns true - reserved for future use.
    */
    checkConnection: function()
    {
        var self = this;
        return true;
    },

    /*!
    ** Displays a dialog with details on a given rid.
    ** @param rid string
    **    the wanted resource id (eg 'ecatalogue.12345')
    ** @param context string
    **    a fetch-set (eg 'map')
    **
    */
    displayItemDetails: function(rid, context)
    {
        var self = this;
        if (self.view !== undefined)
        {
            self.view.displayItemDetails(rid, context);
        }
    },

    /*!
    ** Returns the current cluster distance setting.
    ** @param useWorldCoords boolean
    **      specify if the value should be in world coordinates or pixels
    **      if true it uses the map's pixels/unit resolution to calculate the
    **      setting in map units.  Normally this would only make sense when
    **      used in Mercator or non-lat/long based projections.
    ** @returns number
    */
    getClusterDistance: function(useWorldCoords)
    {
        var self = this;

        var d = self.options.clusterDistance;
        if (useWorldCoords)
            d *= self.view.map.getResolution();
        return d;
    },

    /*!
    ** Gets the current layer group being used by the Map widget.
    ** @returns string
    **
    */
    getLayerGroup: function()
    {
        var self = this;
        return self.currentGroup;
    },

    /*!
    ** Gets the list of all the known layerGroups.
    ** @returns array of string
    **
    */
    getLayerGroups: function()
    {
        var self = this;

        var groups = [];
        jQuery.each(
            self.layerGroups, function(group, data)
            {
                if (group != self.defaultLayerGroup)
                    groups.push(group);
            }
        );
        return groups;
    },

    /*!
    ** Returns an object describing details on all the currently plotted
    ** searches.
    ** @returns object
    **   the object will be something like:
    **    {
    **      My Search #1: { 
    **          searchName: 'My Search #1',
    **          collateByCategory: 'ScientificName',
    **          categories: [
    **              'irn'
    **              'SummaryData',
    **              'ScientificName',
    **              'CommonName',
    **              'Collector',
    **              'Locality'
    **          ],
    **      },
    **      Site Search: { 
    **          searchName: 'Site Search',
    **          collateByCategory: 'SummaryData',
    **          categories: [
    **              'irn'
    **              'SummaryData',
    **              'Collector',
    **              'DateVisited'
    **          ],
    **      }
    **    }
    **  @endcode
    */
    getSearchDescriptions: function()
    {
        var self = this;
        var descriptions = {};
        jQuery.each(self.analysedData, function(searchName, details)
        {
            var description = {};
            description['searchName'] = searchName;
            description['collateByCategory'] = details['collateByCategory'];
            description['categories'] = [];
            jQuery.each(details['categories'], function(category, values)
            {
                // keep only wanted options - if no wanted options were set
                // assume everything is wanted
                if ((self.collateByOptions != undefined) &&
                    (self.collateByOptions[category] == undefined))
                      category = false;  

                if (category)      
                    description['categories'].push(category);
            });
            descriptions[searchName] = description;
        });
        return descriptions;
    },

    /*!
    ** Makes an icon using the same mechanism as the map legend and map marker does.
    ** This can be used to draw custom legends or item details etc
    */
    makeLegendIcon: function(shape, colour, radius)
    {
        var self = this;
            
        if (self.view !== undefined)
            return self.view.makeLegendIcon(shape, colour, radius);
        else
        {
            return '';
        }
    },

    /*!
    ** Re-displays the current search.  As point layers may have changed
    ** (including clustering behaviour) they need to be rebuilt from scratch
    ** and added to the map to trigger the clustering logic properly.
    ** @returns null
    */
    redisplaySearches: function()
    {
        var self = this;
        self.showStatusMessage(IMu.string(
                 'map-view-redrawing-map'), true);

        // remove point layers
        var pointLayers = self.getPointLayers();
        jQuery.each(
            pointLayers,
            function(idx, layer)
            {
                self.view.removeAllLayerFeatures(layer);
                self.removeLayer(layer);
            }
        );

        jQuery.each(self.view.clusterExtentLayers, function(name, cLayer) {
                self.clusterExtentLayerVisibility = cLayer.visibility;
                self.view.removeAllLayerFeatures(cLayer);
                self.removeLayer(cLayer);
        });
        self.view.clusterExtentLayers = {};

        jQuery.each(self.analysedData, function(searchName, data) {
                if (self.searchResults[searchName])
                {
                    var searchResult = self.searchResults[searchName];
                    if (data.symbolShape)
                        searchResult['currentSymbol'] = data.symbolShape;
                    if (data.symbolSize)
                        searchResult['currentSize'] = data.symbolSize;
                }
        });
                
        self.analysedData = {};

        if (! self.searchResults.length)
        {
            self.showStatusMessage('', false);
        }

        // re-add layers
        jQuery.each(self.searchResults, function(searchName, searchResult)
        {
            var labelName = searchResult['labelName'];

            var collateBy = searchResult['currentCollationBy'];
            if (collateBy == undefined)
            {
                if (self.options.defaultCollation != undefined)
                    collateBy = self.options.defaultCollation;
                else
                    collateBy = 'Name of Search';
            }

            var symbolShape = searchResult['currentSymbol'];
            if (symbolShape == undefined)
                symbolShape = 'square';

            var symbolSize = searchResult['currentSize'];
            if (symbolSize == undefined)
            {
                if (self.view.options.defaultRadius)
                    symbolSize = self.view.options.defaultRadius;
                else
                    symbolSize = 6;
            }

            var pointsToAdd = self.extractPointsToDisplay(searchResult.result,
                    searchName,
                    labelName,
                    collateBy,
                    symbolShape,
                    symbolSize);
            IMu.log('setSearch: points total {0} added {1}',
                pointsToAdd.total, pointsToAdd.added);

            // make sure map is in a fit state to have points drawn on it
            self.prepareMapToDisplayNewPoints();

            if (pointsToAdd.added == 0)
            {
                self.showStatusMessage(IMu.string(
                            'map-view-no-mappable-points'), false);
                IMu.Events.trigger('ipm-viewer-no-points-to-display');
            }
            else    
            {
                var noCluster = false;
                if (searchResult['nocluster'] != undefined)
                    noCluster =  searchResult['nocluster'];

                self.addPointsToMap(pointsToAdd,
                                     searchName,
                                     collateBy,
                                     noCluster,
                                     true);
            }
        });
    },

    /*!
    ** Set the cluster distance.
    ** @param distance number
    **   set the pixel distance within which mapped features will be merged
    **   into a cluster
    ** @returns null
    */
    setClusterDistance: function(distance)
    {
        var self = this;

        if (distance < 1)
            distance = 1;
        self.options.clusterDistance = distance;
        self.setClustering(true);
    },

    /*!
    ** Selects the clustering strategy to use when clustering.
    ** Currently only 3 strategies can be chosen.
    **
    ** The default strategy is fast and always clusters about an actual
    ** location where there is data.  This may sometimes appear odd however to
    ** users if they are expecting the clusters to be centrally placed.
    **
    ** The 'centred' strategy is slower and draws clusters positioned central
    ** to the distribution of the component features (often this will mean
    ** clusters are not on an actual feature locations).
    ** The groupings this strategy produces may appear more intuitive to users.
    **
    **  The 'none' strategy will disable clustering.
    **
    ** @param strategy string
    ** currently the supported options are:
    **  'default', 'centred' and 'none'
    ** @returns null
    */
    setClusterStrategy: function(strategy)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.setClusterStrategy(strategy);
        else
            IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                if (widget == self)
                    self.view.setClusterStrategy(strategy);
            });
    },

    /*!
    ** Turn clustering functionality on or off
    ** @param cluster boolean 
    **  Specify if clustering is to be used when drawing the point markers.
    **  The clustering can be turned on or off programmatically.
    ** @returns null
    */
    setClustering: function(cluster)
    {
        var self = this;
            
        self.clustering = cluster;
        if (self.view !== undefined)
            self.view.setClustering(cluster);
        else
            IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                if (widget == self)
                    self.view.setClustering(cluster);
            });
    },

    /*!
    ** Specify the property by which a search should be
    ** collated.
    **
    ** @param searchName string
    **   The name of the search.
    **
    ** @param collateBy string
    **   The property to collate this search by.
    **
    ** @returns array
    **   The widgets processed search data.
    **
    ** @example set the collation property
    ** @code
    **   setCollationCategory('Search #2', 'Scientific Name');
    ** @endcode
    */
    setCollationCategory: function(searchName, collateBy)
    {
        var self = this;

        var analysedData = self.analysedData[searchName];
        // if the category doesn't exist in our data, don't change it!
        if (analysedData.categories[collateBy] != undefined)
        {
            analysedData.collateByCategory = collateBy;
            if (self.searchResults[searchName] != undefined)
                self.searchResults[searchName]['currentCollationBy'] = collateBy;
        }
        return  self.analysedData;
    },

    /*!
    ** Specify the symbol to be used to draw markers
    **
    ** @param symbol string
    **   The name of the symbol.
    **
    ** @returns null
    **
    */
    setCollationSymbol: function(searchName, symbol)
    {
        var self = this;

        var analysedData = self.analysedData[searchName];
        // if the category doesn't exist in our data, don't change it!
        if (analysedData)
        {
            analysedData.symbolShape = symbol;
        }
    },

    /*!
    ** Specify the size to be used to draw markers
    **
    ** @interger size string
    **   The radius in pixels of the symbol.
    **
    ** @returns null
    **
    */
    setCollationSymbolSize: function(searchName, size)
    {
        var self = this;

        var analysedData = self.analysedData[searchName];
        // if the category doesn't exist in our data, don't change it!
        if (analysedData)
        {
            analysedData.symbolSize = size;
        }
    },

    /*!
    ** Set a function that will be called when requests for data on an item
    ** is requested
    ** @param functionName string
    **  the name of the function that will be called when the user requests
    **  information on an item.  The function will be passed 3 parameters:
    **  source, item irn and a data object describing the item.
    ** @returns null
    */
    setItemDetailsDisplay: function(functionName)
    {
        var self = this;
        self.itemDisplayFunction = functionName;
    },


    /*!
    ** Sets the current layer group
    **
    ** @param layer string
    **  The name of the group.  If the group is not defined, creates an empty
    **  group
    */
    setLayerGroup: function(group)
    {
        var self = this;

        self.currentGroup = group;
        if (self.layerGroups[group] == undefined)
            self.layerGroups[group] == {};

        self.recreateMap();
        self.redisplaySearches();
    },

    addCustomLegend: function(functionName)
    {
        var self = this;
        self.legendDisplayFunction = functionName;
    },


    /*!
    ** Override the default list of colours chosen when displaying a point
    ** marker.
    **
    ** @param colours string[]
    **   An array of RGB colour definitions.
    */
    setMarkerColours: function(colourArray)
    {
        var self = this;
        self.markerColours = colourArray;
    },

    /*!
    ** Set a function that will be called when requests for data on a marker
    ** are requested
    ** @param functionName string
    **  the name of the function that will be called when the user requests
    **  information on a marker.  The function will be passed 3 parameters:
    **  the map widget, an array of features and an event object describing how
    **  the marker was selected.
    ** @returns null
    */
    setMarkerDetailsDisplay: function(functionName)
    {
        var self = this;
        self.markerDisplayFunction = functionName;
    },

    /*!
    ** Override the default list of shapes chosen when displaying a point
    ** marker.
    **
    ** @param shapes string[]
    **   An array of shape names (must be a known shape, currently
    **   these are: 'circle', 'square', 'triangle', 'upTriangle', 'star', 
    **   'cross', 'bowTie', 'x', 'lightning', 'rectangle', 'I', 'T'
    */
    setMarkerShapes: function(shapeNameArray)
    {
        var self = this;
        self.markerShapes = shapeNameArray;
    },

    /*!
    ** Adjusts relevance of features in layer(s) based on date ranges.
    ** 
    **
    ** @param layerName string - name of the layer to act on.  layername can be
    **                           '*' indicating all vector layers.
    ** @param dateField string - name of the field in each points data that
    **                           contains the date values to test against.
    ** @param minDate Date - minimum matching date of the range to look for
    ** @param maxDate Date - minimum matching date of the range to look for
    */
    setRelevanceByDateRange: function(layerName, dateField, minDate, maxDate)
    {
        var self = this;
        var pointLayers = self.getPointLayers();
        var baseLayer = self.getBaseLayer();
        jQuery.each(
                pointLayers, function(idx, pointLayer)
                {
                    if ((layerName == '*') || (pointLayer.name == layerName))
                    {
                        var features = self.getLayerFeatures(pointLayer);
                        jQuery.each(features, function(idx, feature)
                        {
                            var atomicFeatures = [];
                            if (feature.cluster)
                               atomicFeatures = feature.cluster;
                            else
                                atomicFeatures.push(feature);

                            jQuery.each(atomicFeatures, function(idx, f)
                            {
                                var value = f.attributes.rawRow[dateField];
                            
                            
                                var dateSt = self.getRepresentativeDateString(value);
                                if (dateSt != '')
                                {
                                    var dateBits = dateSt.split('/');

                                    var featureDate = new Date(dateBits[2],
                                        dateBits[1],
                                        dateBits[0]
                                        );
                                    f.attributes.relevanceDistance = 
                                    self.getDistanceFromMedian(
                                        minDate.valueOf(),
                                        maxDate.valueOf(),
                                        featureDate.valueOf()
                                        );
                                }
                                else
                                {
                                    // cannot rate so give a large value to distance
                                    feature.attributes.relevanceDistance = 100;
                                }
                            });
                        });
                        self.view.redrawLayer(pointLayer);
                    }
                }
        );
    },

    /*!
    ** Turn relevance filtering functionality on or off
    ** @param filtering boolean 
    **  Specify if points should be filtered by their 'relevance' value.
    **  The filtering can be turned on or off programatically.
    **
    **  The relevance value of points in a layer is calculated each time the
    **  setRelevanceByDateRange method is called for that layer.
    **
    **  If the filtering is on, each point's display properties will change in
    **  depending on its current relevance value.
    */
    setRelevanceFiltering: function(filtering)
    {
        var self = this;
        if (filtering)
            self.relevanceFiltering = true;
        else
            self.relevanceFiltering = false;

        var pointLayers = self.getPointLayers();
        jQuery.each(
                pointLayers, function(idx, pointLayer)
                {
                        self.view.redrawLayer(pointLayer);
                }
        );
    },



    /*!
    ** Display a status message on screen.
    **
    ** @param msg string
    **   The message to display.
    **
    ** @param keep boolean 
    **   If keep == true, the message remains until another call is made
    **   If keep == false, message will fade away and disappear over short period
    **   of time
    */
    showStatusMessage: function(msg, keep)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.showStatusMessage(msg, keep);
        else
            IMu.Events.bind(self.name + '-view-created', function(eventName, widget) {
                if (widget == self)
                    self.view.showStatusMessage(msg, keep);
            });
    },


    //**********************************************************************
    // all below here are protected methods, not part of Widget API
    //**********************************************************************

    /*
    ** Add features to layer and adjust their visibility so only the
    ** appropriate ones are visible (eg hide points that are outside the base
    ** layer's vertical extent) Returns count of features visible on the
    ** current base layer.
    */
    addFeaturesAndSetVisibility: function(features, pointLayer, baseLayer)
    {
        var self = this;

        if ((baseLayer == null) || (pointLayer == null))
            return 0;

        var visibleCount = features.length;
        // only filter if there is a base layer with required properties to
        // compare with
        if (baseLayer.ke != undefined)
        {
            /* NB currently we are only filtering based on vertical coordinates
            ** however there may be other filtering functionality that can be
            ** added in the future
            */

            visibleCount = 0;

            var layerProperties = baseLayer.ke;
            var scaling   = [1, 1, 1];

            // translate features and establish visibility
            for (var i = 0; i < features.length; i++)
            {
                var feature = features[i];
                // manipulate display coordinates of feature based on direction
                // of view
                feature = self.changeFeatureElevationCoordinates(
                                                layerProperties, feature);

                // hide feature if outside of vertical extent of this layer
                self.displayFeature(feature, false);
                if (! self.featureOutsideVerticalRange(feature, layerProperties))
                {
                    self.displayFeature(feature, true);
                    visibleCount++;
                }
            }
        }

        // add features (clustering will be triggered)
        self.addFeaturesToLayer(pointLayer, features);
        self.view.redrawLayer(pointLayer);
        if (features.length > 0)
        {
            if (visibleCount == 0)
                self.showStatusMessage('no points visible in ' +
                                                baseLayer.name, false);
            else
                self.showStatusMessage(visibleCount +
                            ' points visible in ' + baseLayer.name, false);
        }
        return visibleCount;
    },



    /*
    ** addLayerInternal.
    ** convenience function for internal use.
    ** Assumes view exists
    */
    addLayerInternal: function(layer, group)
    {
        var self = this;

        var layerName = 'unknown name';
        if (typeof(layer) == 'string')
        {
          layerName = layer;
          layer = self.getLayerFromName(layer);
        }
        else
        {
            if (layer.name != undefined)
                layerName = layer.name;
        }

        if (layer)
        {
            // add layer to common layers
            var uniqId = layerName;
            if (layer.ke != undefined)
                uniqId = layer.ke.layerId;

            var type = jQuery.type(layer);

            // treat OL layer objects as special case
            if (type == 'object')
            {
                self.overlays[layerName] = layer;
            }

            if (self.layerGroups[self.defaultLayerGroup] == undefined)
                self.layerGroups[self.defaultLayerGroup] = {};
            self.layerGroups[self.defaultLayerGroup][uniqId] = layerName;

            if (group != undefined)
            {
                if (self.layerGroups[group] == undefined)
                    self.layerGroups[group] = {};
                self.layerGroups[group][uniqId] = layerName;
            }    
        }
    },

    /*
    **  Takes point features and adds them to a point layer and adds that to
    **  the map.
    */
    addPointsToMap: function(pointsToAdd, searchName, collateBy, noCluster, skipCollator)
    {
        var self = this;

        self.showStatusMessage(pointsToAdd.added +
                ' ' + IMu.string(
                    'map-view-mappable-points-found'), false);

        // add layer first then features to get clustering to work in OL
        var layer = self.makePointLayer(searchName, noCluster);
        self.addLayerToMap(layer);

        var visibleCount = self.addFeaturesAndSetVisibility(pointsToAdd.points, layer, self.getBaseLayer());

        self.displayKEControls(true);
        if (skipCollator)
        {
            var data = self.setCollationCategory(searchName, collateBy);
            self.view.drawLegend(data);
        }
        else
            self.triggerCollator(searchName, self.analysedData[searchName]);
        if (self.options.zoomToAllInitially && (visibleCount > 0))
            self.zoomToShowAllPoints();

        IMu.Events.trigger('map-view-features-added', pointsToAdd.added, searchName);
    },

    /*
     * Look at record (row) data and extract and collate info on field names and
     * distinct field values encountered etc for use by components like legends.
     */
    analyseRecord: function(fields, dataRow, searchName)
    {
        var self = this;

        var searchNameLabel = IMu.string('map-view-search-name-label');
        jQuery.each(
            dataRow,
            function(field, value)
            {
                if (! value)
                    value = IMu.string('map-unspecified-value');

                switch(field)
                {
                    // ignore these fields when analysing
                    case 'offset':
                    case 'rid':
                    case 'index':
                        field = '';
                        break;
                    
                    /* a hack to hold 'search name' as if it were a data
                       property.  NB Nothing special about rownum other than it
                       occurs once per record */
                    case 'rownum':
                        field = searchNameLabel;
                        value = searchName;
                        break;

                    default:
                        break;
                }
                
                if (typeof(value) === 'object')
                {
                    if (value['SummaryData'])
                        value = value['SummaryData'];
                }

                if (field != '')
                {
                    if (! (field in fields))
                    {
                        fields[field] = {
                            fieldName: field,
                            distinctValues: {}
                        }
                    }

                    if (value in fields[field].distinctValues)
                        /* track how many times this distinct value occurs
                        for all rows */
                        fields[field].distinctValues[value].count++;
                    else
                    {
                        /* assign an index # for this value depending on
                         how many other distinct values already are
                         recorded (ie this is the Nth distinct value
                         recorded for this field) */
                        var valueIndex = 0;
                        for (var k in fields[field].distinctValues)
                            valueIndex++;
                        
                        fields[field].distinctValues[value] = {
                            'value': value,
                            'count': 1,
                            'valueIndex': valueIndex
                        };
                    }
                }
            });
    },


    /*
     * changeBaseLayerHandler.  Typically called as an event handler by OL.
     * When base layer changes, dimensions, viewpoint, scale may differ from
     * previous display.  Adjust map based on new * base layer extent.
     */
    changeBaseLayerHandler: function(e)
    {
        // NB if called by OL event handler 'this' = OL Map Object.
        var self = this
            if ('CLASS_NAME' in self)
                self = self.ke.widgetSelf;

        self.redisplaySearches();

        var layer = e.layer;
        if (layer != null)
        {
            var layerBounds = self.getLayerExtent(layer);
            if (layerBounds != null)
                self.zoomToExtent(layerBounds);
        }
        return true;
    },

    changeElevationCoordinates: function(layerProperties, x, y, z)
    {
        var self = this;

        var projectedCoordinates = {
            'x' : x,
            'y' : y,
            'z' : z
        };

        var scaling = layerProperties.scale;

        if (layerProperties.elevation == 'top')
        {
                // make x screen <- x world
                // and y screen <- y world
                projectedCoordinates.x * scaling[0];
                projectedCoordinates.y * scaling[1];
        }
        else if (layerProperties.elevation == 'north')
        {
                // make y screen <- z world
                // and x screen <- -x world
                var max = layerProperties.xmax + layerProperties.xmin;
                projectedCoordinates.x = max - x * scaling[0];
                projectedCoordinates.z = z * scaling[2];
        }
        else if (layerProperties.elevation == 'south')
        {
                // make y screen <- z world
                // and x screen <- x world
                projectedCoordinates.x = x * scaling[0];
                projectedCoordinates.z = z * scaling[2];
        }
        else if (layerProperties.elevation == 'east')
        {
                // make x screen <- y world
                // and y screen <- z world
                projectedCoordinates.y = y * scaling[1]
                projectedCoordinates.z = z * scaling[2];
        }
        else if (layerProperties.elevation == 'west')
        {
                // make x screen <- -y world
                // and y screen <- z world
                var max = layerProperties.ymax + layerProperties.ymin;
                projectedCoordinates.y = max - (y * scaling[1]);
                projectedCoordinates.z = z * scaling[2];
        }
        else if (layerProperties.elevation == 'bottom')
        {
                // make x screen <- x world
                // and y screen <- -y world
                var max = layerProperties.ymax;
                projectedCoordinates.x = x * scaling[0]
                projectedCoordinates.y = max - y * scaling[1];
        }
        return projectedCoordinates;
    },

    /*
     * changeFeatureElevationCoordinates.
     * adjust the coords of the point feature to draw by scaling and
     * translating  coordinates based on the orientation of the view (are
     * we looking side on, top down etc) eg if we are displaying on a side
     * view, we swap the z coordinate for an x or y
     */
    changeFeatureElevationCoordinates: function(layerProperties, feature)
    {
        var self = this;
        var scaling   = layerProperties.scale;

        var coords = self.getFeatureCoordinates(feature);
        var x = coords.x;
        var y = coords.y;
        var z = coords.z;

        var newCoords = self.changeElevationCoordinates(layerProperties, x, y, z);

        switch(layerProperties.elevation)
        {
            // look through x,y plane
            case 'top':
            case 'bottom':
                self.setFeatureScreenCoordinates(feature, newCoords.x, newCoords.y);
                break;
            // look through x,z plane
            case 'north':
            case 'south':
                self.setFeatureScreenCoordinates(feature, newCoords.x, newCoords.z);
                break;
            // look through y,z plane
            case 'east':
            case 'west':
                self.setFeatureScreenCoordinates(feature, newCoords.y, newCoords.z);
                break;
            // assume through x,y plane
            default:
                self.setFeatureScreenCoordinates(feature, newCoords.x, newCoords.y);
                break;
        }
        feature = self.recalculateFeatureBounds(feature);
        return feature;
    },

    /*
    ** Remove all point features from map.
    */
    clearSearchRegions: function()
    {
        /* may be called as an event in which case 'this' will equal the OL
         * control not the widget object :(
         */
        var self = this;
        if ('CLASS_NAME' in self)
            self = this.map.ke.widgetSelf;

        var pointLayers = self.getPointLayers();
        jQuery.each(
            pointLayers,
            function(idx, layer)
            {
                self.view.removeAllLayerFeatures(layer);
                self.removeLayer(layer);
            }
        );
        self.analysedData = {};

        self.removeLegend();
        self.displayKEControls(false);
    },

    /*
    ** Extract a set of points from a result set
    */
    extractPoints: function(resultSet, searchName, labelName)
    {
        var self = this;

        var total = 0;
        var added = 0;
        var pointsToAdd = [];
        for (var i = 0; i < resultSet.rows.length; i++)
        {
            total++;

            var row = resultSet.rows[i];
            self.analyseRecord(
                    self.analysedData[searchName].categories,
                    row,
                    searchName);

            if (self.rowInFilter(row) 
                    && self.pointInBaseLayerRange(row.x, row.y, row.z))
            {
                var info = self.setPointInformation(row,
                        searchName,
                        labelName);

                var pointData = {
                    'x': row.x,
                    'y': row.y,
                    'z': row.z,
                    'info': info
                }
                var f = self.makeFeature(row.x, row.y, row.z, info);
                pointsToAdd.push(f);
                added++;
            }
        }
        return {
            'points': pointsToAdd,
            'total': total,
            'added': added
        };
    },


    /*
    ** Establish if this feature is within the given layers vertical coverage
    */
    featureOutsideVerticalRange: function(feature, layerProperties)
    {
        var self = this;

        var coords = self.getFeatureCoordinates(feature);
        return (coords.z < layerProperties.zmin) || (coords.z > layerProperties.zmax);
    },

    /*
    ** getCoordinateValues.
    ** Attempt to find coordinate values in the passed structure.
    **
    ** We assume we are passed something that represents a coordinate
    ** however it may be a simple number/string or it may be a structured
    ** object (depending on how it is represented in the raw data).
    **
    ** We need to be flexible in recognising what could be a
    ** coordinate to make it easy to map various data objects.
    **
    ** eg we may be passed '151.123E' or { 'longitude': 151.123 }
    **    or { 'longitude': '151 12 3 E' } etc
    */
    getCoordinateValues: function(obj)
    {
        var self = this;

        var val = obj;
        if (jQuery.isPlainObject(obj))
        {
            for (var property in obj)
            {
                var type = jQuery.type(obj[property]);
                if (type === 'string')
                {
                    if (obj[property].match(/^\s*[0-9NESW ]+\s*$/i))
                    {
                        val = obj[property];
                        continue;
                    }
                }   
                else if (type === 'number')
                {
                    val = obj[property];
                    continue;
                }
                else if (type === 'date')
                {
                    val = obj[property];
                    continue;
                }
            }
        }
        else if (jQuery.isArray(obj))
        {
            if (obj.length > 0)
                return self.getCoordinateValues(obj[0]);
        }

        val = self.massageCoordinates(val);
        return val;
    },

    /*
    ** How far is a value from the midpoint of 2 points (as a ratio of
    ** the total spread distance)?
    **
    ** used for evaluating how close a point is to the middle of a
    ** range of values. 
    ** 0 = middle, 1 = at range, 1 > outside range
    **                  Mid
    **     Min<----------|---------->Max
    **  ^   ^     ^      ^     ^      ^    ^
    **  |   |     |      |     |      |    |
    **  |   |     |      |     |      |    |
    **  |   |     |      |     |      |    |
    ** 1.1 1.0   0.5     0    0.5    1.0  1.1 
    **
    **
    */
    getDistanceFromMedian: function(min, max, value)
    {
        var self = this;

        if (min > max)
        {
            var tmp = max;
            max = min;
            min = tmp;
        }
        var spread = max - min;
        if (spread == 0)
        {
            if (value == min)
                return 1;

            return 1.1;
        }
        var mid = min + spread/2;
        return Math.abs((value - mid) / (spread / 2));
    },

    /*
    **
    */
    getFeatureCoordinates: function(feature)
    {
        var self = this;
        return self.view.getFeatureCoordinates(feature);
    },

    /*
    **
    */
    getLayerExtent: function(layer)
    {
        var self = this;
        return self.view.getLayerExtent(layer);
    },


    /*
    ** Convenience function to convert names to standard layers.
    */
    getLayerFromName: function(name)
    {
        var self = this;

        var title = IMu.string('map-layer-' + name);

        var layer = undefined;

        if ('layers' in IMu.Config[self.whoami]) 
        {
            jQuery.each(IMu.Config[self.whoami].layers,
                    function(idx, knownLayer)
                    {
                        if (name == knownLayer.name)
                            layer = self.makeImageLayer(knownLayer);
                    }
            );
            if (layer != undefined)
                return layer;
        }

       if (self.overlays[name] != undefined)
            return self.overlays[name].clone();

        switch (name)
        {

            /* Bing */
            case 'bing-aerial':
                if (self.options.bingKey)
                {
                    layer = self.makeLayerBing(
                        title, self.options.bingKey, 'Aerial');
                }
                break;
            case 'bing-aerial-labels':
                if (self.options.bingKey)
                {
                    layer = self.makeLayerBing(
                        title, self.options.bingKey, 'AerialWithLabels');
                }
                break;
            case 'bing-road':
                if (self.options.bingKey)
                {
                    layer = self.makeLayerBing(
                        title, self.options.bingKey, 'Road');
                }
                break;

            /* Google */
            case 'google-hybrid':
                if (window.google)
                {
                    layer = self.makeLayerGoogle(
                            title, window.google.maps.MapTypeId.HYBRID);
                }
                else
                {
                    var errMsg = 'google library not loaded: ' + name;
                    self.showStatusMessage('Error - ' + errMsg, true);
                    self.setErrorState(errMsg);
                }
                break;
            case 'google-physical':
                if (window.google)
                {
                    layer = self.makeLayerGoogle(
                            title, window.google.maps.MapTypeId.TERRAIN);
                }
                else
                {
                    var errMsg = 'google library not loaded: ' + name;
                    self.showStatusMessage('Error - ' + errMsg, true);
                    self.setErrorState(errMsg);
                }
                break;
            case 'google-satellite':
                if (window.google)
                {
                    layer = self.makeLayerGoogle(
                            title, window.google.maps.MapTypeId.SATELLITE);
                }
                else
                {
                    var errMsg = 'google library not loaded: ' + name;
                    self.showStatusMessage('Error - ' + errMsg, true);
                    self.setErrorState(errMsg);
                }
                break;
            case 'google-streets':
                if (window.google)
                {
                    layer = self.makeLayerGoogle(title, null);
                }
                else
                {
                    var errMsg = 'google library not loaded: ' + name;
                    self.showStatusMessage('Error - ' + errMsg, true);
                    self.setErrorState(errMsg);
                }
                break;
            /* Open Street Map */
            case 'osm':
                layer = self.makeLayerOSM(
                    title, self.options.useSphericalMercator);
                break;
            /* OpenLayers */
            case 'openlayers-wms':
                layer = self.makeLayerOLWMS(
                    title, self.options.useSphericalMercator, 'basic');
                break;

            default:
                var errMsg = 'unknown layer name: ' + name;
                self.showStatusMessage('Error - ' + errMsg);
                self.setErrorState(errMsg);
                break;
        }
        return layer;
    },


    /*
    ** getData.  Returns the searched data that has been processed and collated
    ** @returns Array SearchResults
    */
    getData: function()
    {
        var self = this;
        return self.analysedData;
    },

    /*
    ** attempt to get a date string from passed variable
    */
    getRepresentativeDateString: function(value)
    {
        var self = this;

        var st = '';
        switch (jQuery.type(value))
        {
            case 'string':
                if (value.match(/\d+\/.+\/\d+/))
                    st = value;
                else if (value.match(/^\d+$/))    
                    st = '30/6/' + value;
                break;
            case 'number':
                st = '30/6/' + value;
                break;
            case 'array':
                if (value.length > 0)
                    st = self.getRepresentativeDateString(value[0]);
                break;
            case 'date':
                st = value.toString();
                break;
            case 'undefined':
            case 'object':
                break;
        }
        return st;
    },

    /*
    ** getSearchCount.  Return count of how many searches are available to be
    ** plotted
    */
    getSearchCount: function()
    {
        var self = this;
        return self.searches.length;
    },

    pointInBaseLayerRange: function(x, y, z)
    {
        var self = this;
        return true;
    },

    rowInFilter: function(row)
    {
        var self = this;
        return true;
    },

    /*
    **
    */
    setWantedLayers: function(group)
     {
         var self = this;

         var layerGroup = self.layerGroups[group];
         self.layers = [];
         jQuery.each(layerGroup, function(layerId, layerName)
         {
             var layer = self.getLayerFromName(layerName);
             self.layers.push(layer); 
         });
     },

    /*
    ** test if passed coordinates are usable
    */
    invalidCoordinates: function(x, y, z)
    {
        var self = this;

        if (x == '')
        {
            IMu.log('setSearch: bad longitude {0} (blank)', x);
            return true;
        }
        if (y == '')
        {
            IMu.log('setSearch: bad latitude {0} (blank)', y);
            return true;
        }

        if (isNaN(x))
        {
            IMu.log('setSearch: bad longitude {0} (NaN)', x);
            return true;
        }
        if (isNaN(y))
        {
            IMu.log('setSearch: bad latitude {0} (NaN)', y);
            return true;
        }
        if (isNaN(z))
        {
            IMu.log('setSearch: bad altitude {0} (NaN)', z);
            return true;
        }

        if ( x < this.options.coordRanges.x[0]  ||
                        x >  this.options.coordRanges.x[1] )
        {
            IMu.log('setSearch: bad longitude {0} (range)', x);
            return true;
        }
        if ( y < this.options.coordRanges.y[0]  || 
                        y >  this.options.coordRanges.y[1] )
        {
            IMu.log('setSearch: bad latitude {0} (range)', y);
            return true;
        }
        if ( z < this.options.coordRanges.z[0]  || 
                        z >  this.options.coordRanges.z[1] )
        {
            IMu.log('setSearch: bad altitude {0} (range)', z);
            return true;
        }
        return false;
   },


    /*
    ** Customised behaviours for when we add a new point layer.
    ** (eg filter points based on vertical extent of layer)
    **
    ** Protected Interface
    ** @param layerAddedEvent event
    **   OL map event that will include details on the new layer.
    */
    layerAddedHandler: function(layerAddedEvent)
    {
        // NB if called by OL event handler 'this' = OL Map Object.
        var self = this;
        if ('CLASS_NAME' in self)
                self = this.ke.widgetSelf;

        var layer = layerAddedEvent.layer;
        if (self.view.isDataPointLayer(layer))
        {
            var features = self.getLayerFeatures(layer);
            self.view.removeAllLayerFeatures(layer);
            self.addFeaturesAndSetVisibility(features, layer, self.getBaseLayer());
        }
    },


    /*
    ** Extract an image file and associated data from an
    ** object describing it and create an OL Image Layer from that.
    **
    ** @param config object
    **   Defines the layer.
    **
    ** @example create an image (raster based) layer
    ** @code
    ** var layerDef = {
    **  'name'  : 'Basement',
    **  'src'   : 'Basement.gif',
    **  'size'  : [588, 550],
    **  'bounds': [-50, -360, -1000, 4030, 2975, -1],
    **  'scale' : [1, 1, 1],
    **  'elevation': 'top'
    ** };
    ** ...
    ** ...
    ** widget.makeImageLayer(layerDef);
    ** @endcode
    ** 
    */
    makeImageLayer: function(config)
    {
        var self = this;

        // determine coordinate indices
        var x0 = 0;
        var y0 = 1;
        var z0 = 2;
        var x1 = 3;
        var y1 = 4;
        var z1 = 5;
        switch(config.elevation)
        {
            case 'east':
            case 'west':
                x0 = 1;
                y0 = 2;
                z0 = 0;
                x1 = 4;
                y1 = 5;
                z1 = 3;
                break;
            case 'north':
            case 'south':
                x0 = 0;
                y0 = 2;
                z0 = 1;
                x1 = 3;
                y1 = 5;
                z1 = 4;
                break;
            case 'top':
            case 'bottom':
            default :
                x0 = 0;
                y0 = 1;
                z0 = 2;
                x1 = 3;
                y1 = 4;
                z1 = 5;
                break;
        }

        var projectedBounds = [
            config.bounds[x0],
            config.bounds[y0],
            config.bounds[x1],
            config.bounds[y1]
        ];

        var layer = undefined;
        var rasterSrc = self.options.layerPath + '/' + config.src;
        if (config.src.match(/^TMS:/))
             layer = self.view.makeLayerImageTiled(
                config.name,
                rasterSrc,
                config.size,
                projectedBounds,
                config['olConfig']);
        else
        {
             layer = self.view.makeLayerImage(
                config.name,
                rasterSrc,
                config.size,
                projectedBounds,
                config['olConfig']);
        }

        var scale = config.scale
        if (scale === 'undefined')
            scale = [1, 1, 1];
        layer.ke = {
            'elevation': config.elevation,
            'layerId': config.layerId,
            'scale': scale,
            'xmin': config.bounds[0],
            'xmax': config.bounds[3],
            'ymin': config.bounds[1],
            'ymax': config.bounds[4],
            'zmin': config.bounds[2],
            'zmax': config.bounds[5]
        }
        return layer;
    },
    
    /*
    ** Syntactic sugar to interface with view object.
    */
    makeLayerBing: function (title, key, type)
    {
        var self = this;
        return self.view.makeLayerBing(title, key, type);
    },

    /*
    ** Syntactic sugar to interface with view object.
    */
    makeLayerGoogle: function (title, type)
    {
        var self = this;
        return self.view.makeLayerGoogle(title, type);
    },

    /*
    ** Syntactic sugar to interface with view object.
    */
    makeLayerOLWMS: function (title, useSphericalMercator, type)
    {
        var self = this;
        return self.view.makeLayerOLWMS(title, useSphericalMercator, type);
    },

    /*
    ** Syntactic sugar to interface with view object.
    */
    makeLayerOSM: function (title, useSphericalMercator)
    {
        var self = this;
        return self.view.makeLayerOSM(title, useSphericalMercator);
    },

    /*
    ** For each search, give it a default 'human' name that can be used to
    ** identify it in the layer switcher control.
    ** eg
    **  Search #2
    */
    makeSearchName: function(searchLabel)
    {
        var self = this;

        if (searchLabel == undefined)
            searchLabel = 'EMu Data Search';

        var name = searchLabel;
        var extra = '';
        var i = 1;
        while (self.searchResults[name] != undefined)
        {
            i++;
            name = searchLabel + ' #' + i;
        }

        self.searches.push(name);
        return name;
    },

    makeUniqId: function()
    {
        var self = this;
        var x = Math.floor(Math.random() * 10).toString();
        var id = (Math.random() * 10000).toString().replace(/\./, x);
        return id;
    },

    /*
    ** Turn lat/longs formats into floats.
    **
    ** @param val string
    **   lat/long value in various forms
    **
    ** @code
    ** examples:
    **   '151 20 20 W'
    **   '151 20 20W'
    **   '151 20.33 W'
    **   -151.3333
    ** @endcode
    ** etc
    */
    massageCoordinates: function(val)
    {
        if (val == undefined)
            return '';

        if (jQuery.isArray(val) && val.length == 0)
            return '';

        if (typeof val == 'number')
            return val;

        if (! val.match(/^[\-0-9. NSEW]+$/))
            return val;

        var terms = val.split(' ');
        var negate = false;
            var value = 0;
        jQuery.each(
            terms,
            function(idx, term)
            {
                if (term.match(/W|S/i))
                    negate = true;    
                else if (! term.match(/N|E/i))
                {
                    var divisor = Math.pow(60, idx);
                    value += term/divisor;
                }
            }
        );
        if (negate)
            value = - value;
        return value;
    },

    /*
    ** Do any manipulation of EMu result set.  Override this method if the
    ** points to be mapped do not correspond 1:1 with EMu data rows.  An
    ** example might be where a nested table in an EMu record contains the
    ** points to be mapped rather than the record itself.
    */
    preProcessEMuData: function(emuResultSet)
    {
        var self = this;
        var processedSet = { 'count': 0, 'rows': [] };

        // base method removes items that cannot be mapped
        if (emuResultSet.rows.length > 0)
        {
            var trappedItems = [];
            var fields = self.getRowFields(emuResultSet.rows[0]);
            for (var i = 0; i < emuResultSet.rows.length; i++)
            {
                var row = emuResultSet.rows[i];
                if (row.x === undefined || row.x === null)
                    continue;
                if (row.y === undefined || row.y === null)
                    continue;

                var x = self.getCoordinateValues(row.x);
                var y = self.getCoordinateValues(row.y);
                var z = self.getCoordinateValues(row.z);

                if (self.invalidCoordinates(x, y, z))
                    continue;

                row.x = x;    
                row.y = y;    
                row.z = z;    

                trappedItems.push(row);
            };
            processedSet['rows'] = trappedItems;
            processedSet['count'] = processedSet['rows'].length;
        }
        return processedSet;
    },

    extractPointsToDisplay: function(results, searchName, labelName, collateBy, symbolShape, symbolSize)
    {
        var self = this;
        self.analysedData[searchName] = {
                    'categories': {},
                    'collateByCategory': collateBy,
                    'displayName': searchName,
                    'rawData': results,
                    'searchIndex': self.searches.length,
                    'symbolShape': symbolShape,
                    'symbolSize': symbolSize
        };

        var pointsToAdd = self.extractPoints(results, searchName, labelName);
        return pointsToAdd;
    },

    /*
    ** extract a list of column names from a row
    */
    getRowFields: function(row)
    {
        var self = this;
        var fields = [];
        jQuery.each(row, function(column, value)
        {
            fields.push(column);
        });
        return fields;
    },





    /*
    ** Sets max cood values that will be displayed on map.
    ** Points outside of this are considered unplottable.
    **
    */
    setCoordRanges: function(x0, x1, y0, y1, z0, z1)
    {
        var self = this;
        self.options.coordRanges.x = [x0, x1];
        self.options.coordRanges.y = [y0, y1];
        self.options.coordRanges.z = [z0, z1];
    },

    /*
    **
    */
    setErrorState: function(state)    
    {
        var self = this;
        self.errorState = state;
    },


    /*
    **
    */
    setFeatureScreenCoordinates: function(feature, x, y)
    {
        var self = this;
        self.view.setFeatureScreenCoordinates(feature, x, y);
    },


    /*
    ** Create an object that represents what we know about a point (ie not just
    ** coordinates but wahat the point represents).
    **
    ** @param row object
    **   A row object fetched from IMu Server.
    **
    ** @param searchName string
    **   The 'name' of the search that the row came from.
    */
    setPointInformation: function(row, searchName, searchLabel)
    {
        var self = this;

        var info = {};
        info.id = row.SummaryData;
        info.source = row.source;
        info.irn = row.irn;
        info.searchName = searchName;
        info.searchLabel = searchLabel;
        info.displayStyle = self.getDefaultDisplayStyle();
        info.rawRow = row;
        return info;
    },


    /*
    ** Process search results.
    */
    setSearch: function(search)
    {
        var self = this;

        if (self.errorState)
        {
            self.showStatusMessage('cannot search - map is in broken state: ' +
                                    self.errorState, true);
            return;
        }

        if (search == undefined)
            return;
        if (self.options.singleShot)
        {
            if (search == self.lastSearch)
                return;
            self.clearSearchRegions();
            self.searches = [];
        }

        self.showStatusMessage( IMu.string('map-view-getting-points'), true);
        search.fetchMany([{offset: 0, count: -1}], self.options.searchContext, function(result)
        {
            self.showStatusMessage( IMu.string('map-view-drawing-points'), true);

            var collateBy = 'Name of Search';
            if (search.collateBy != undefined)
                collateBy = search.collateBy;
            else if (self.options.defaultCollation != undefined)
                collateBy = self.options.defaultCollation;

            var symbolShape = 'square';
            if (search.symbol != undefined)
                symbolShape = search.symbol;

            var noCluster = false;
            if (search.nocluster != undefined)
                noCluster = search.nocluster;

            var symbolSize = search.size;
            if (symbolSize == undefined)
            {
                if (self.view.options.defaultRadius)
                    symbolSize = self.view.options.defaultRadius;
                else
                    symbolSize = 6;
            }

            var searchName = self.makeSearchName(search.labelName);

            var processedResult = self.preProcessEMuData(result);
            self.searchResults[searchName] = {
                        'currentCollationBy': collateBy,
                        'currentSymbol': symbolShape,
                        'currentSize': symbolSize,
                        'nocluster': noCluster,
                        'labelName': search.labelName,
                        'result': processedResult
                    };
            self.lastSearch = search;

            var pointsToAdd = self.extractPointsToDisplay(processedResult, searchName, search.labelName, collateBy, symbolShape, symbolSize);

            IMu.log('setSearch: points total {0} added {1}',
                pointsToAdd.total, pointsToAdd.added);

            // make sure map is in a fit state to have points drawn on it
            self.prepareMapToDisplayNewPoints();
            
            if (pointsToAdd.added == 0)
            {
                // (search was added by makeSearchName method)
                self.searches.pop();
                delete self.analysedData[searchName];
                self.showStatusMessage(IMu.string(
                            'map-view-no-mappable-points'), false);
            }
            else    
            {
                self.addPointsToMap(pointsToAdd,
                                     searchName,
                                     collateBy,
                                     noCluster,
                                     self.options.skipOpeningCollator);
            }
        });
    },


    /*
    **
    */
    setWidgetOptions: function()
    {
        var self = this;
            
        this.whoami = 'Mapper';
        var context = self.whoami;

        self.registerOptions
        ({
            /*!
            ** If true, add a control that lets user user zoom in/out to best
            ** show all points.
            */
            addZoomToShowAllControl: IMu.Config[context].addZoomToShowAllControl,

            /*!
            ** If set, the collation options avaialble to be used for
            ** generating distinct markers will be restricted to the given
            ** array of strings (each representing a field name in the mapped
            ** data).  If none set, all fields in the mapped data can be used
            */
            allowCollationBy: IMu.Config[context].allowCollationBy,

            /*!
            ** If true, the legend will be initially be displayed on the map as
            ** a floating, draggable element and with a control to allow it to
            ** be shown/hidden.  If set to false, the legend is permanently
            ** placed in the div on the HTML page specified by the id passed in
            ** the 'addLegend' method.
            */
            anchorLegendOnMap:  IMu.Config[context].anchorLegendOnMap,

            /*!
            ** If true and the div owning the widget does not have both a width
            ** and height specified, the owning div will have its width or
            ** height adjusted to best display the map aspect ratio.
            */
            autoAdjustAspectRatio:  IMu.Config[context].autoAdjustAspectRatio,

            /*
            ** If using bing map layers, the Bing Map key associated with the
            ** site.
            */
            bingKey:  IMu.Config[context].bingKey,

            /*!
            ** If true, add a button that clears all the currently mapped
            ** search results.
            */
            clearSearchResults:  IMu.Config[context].clearSearchResults,

            /*!
            ** Specifies the maximum distance (in pixels) that is used when
            ** determing if points should be clustered together.
            */
            clusterDistance: IMu.Config[context].clusterDistance,

            /*!
            ** If true, draw suitably close points as a single representative
            ** marker rather than as individual points.
            */
            clusterPoints: IMu.Config[context].clusterPoints,

            /*!
            ** If clusterPoints is set to true, the minimum number of feature
            ** points that can belong to a single cluster.  If the number of
            ** closely positioned points is less than the threshold, they will
            ** be drawn is individual markers, otherwise they will be
            ** clustered.
            */
            clusterThreshold: IMu.Config[context].clusterThreshold,

            /*!
            ** Specifies the maximum geographic coordinates that the map will
            ** allow to be displayed.
            */
            coordRanges:  IMu.Config[context].coordRanges,

            /*!
            ** Specifies if the map attempt to display layers and points across
            ** the date line.
            */
            dateLineWrap: IMu.Config[context].dateLineWrap,

            /*!
            ** Specifies the feature property that is used as the default
            ** property to collate search data by.
            */
            defaultCollation: IMu.Config[context].defaultCollation,

            /*!
            **  If using Google map layers, the appropriate Google Map API key
            **  for the site.  Only required for high volume use.
            */
            googleKey:  IMu.Config[context].googleKey,

            /*!
            ** Sets the initial range of the map (specified in map coordinates
            ** as [Left, Bottom, Right, Top].
            */
            initialExtentLBRT: IMu.Config[context].initialExtentLBRT,

            /*!
            ** When using raster map layers (eg site plans etc), specifies the
            ** path to the image files used.
            */
            layerPath:  IMu.Config[context].layerPath,

            /*!
            ** Used to specify the projection used when displaying map controls
            ** etc.
            ** Particularly needed when using TMS layer
            */
            mapDisplayProjection: IMu.Config[context].mapDisplayProjection,

            /*!
            ** Used to specify the projection used on the map.
            ** Particularly needed when using TMS layers
            */
            mapProjection: IMu.Config[context].mapProjection,

            /*!
            ** Specifies if point 'popup' dialogs should display a 'more
            ** details' link.
            */
            moreDetailsDialog:  IMu.Config[context].moreDetailsDialog,

            /*!
            ** Specifies if points can be selected by clicking on them.
            */
            pointHighlightOnClick:  IMu.Config[context].pointHighlightOnClick,

            /*!
            ** Specifies if points can be selected by 'mouse-over-ing' them.
            */
            pointHighlightOnHover:  IMu.Config[context].pointHighlightOnHover,

            /*!
            ** The units used when specifying raster layer dimensions (eg
            ** latlongs, miles, kilometers, inches etc)
            */
            rasterUnits:  IMu.Config[context].rasterUnits,

            /*!
            ** Specifies if the map widget should zoom back out to the initial
            ** zoom level on each search rather than stay at the existing zoom
            ** level.
            */
            resetZoomOnSearch:  IMu.Config[context].resetZoomOnSearch,

            searchContext: 'map',

            /*!
            **  Specifies if a 'layer switching' control should be displayed on
            **  the map.
            */
            showLayerSwitcher:  IMu.Config[context].showLayerSwitcher,

            /*!
            ** Specifies if mouse position on the map is displayed (if so it
            ** will be in map coordinates).
            */
            showMouseCoordinates:  IMu.Config[context].showMouseCoordinates,

            /*!
            ** Specifies if the map should show a small overview map.
            */
            showOverviewMap:  IMu.Config[context].showOverviewMap,

            /*!
            ** Specifies if the map widget should display a scale-bar
            */
            showScalebar:  IMu.Config[context].showScalebar,

            /*!
            ** Specifies if the map widget should display messages to the user
            ** about what it is doing.
            */
            showStatusMessages:  IMu.Config[context].showStatusMessages,

            /*!
            ** If true, any new search will clear and remove previously shown
            ** searches.  If false, any new search is displayed as additional
            ** layer on the map without removing existing search layers.
            */
            singleShot:  IMu.Config[context].singleShot,

            /*!
            ** If true, do not automatically display the collation dialog after
            ** a search returns, instead use default collation values.
            */
            skipOpeningCollator: IMu.Config[context].skipOpeningCollator,

            /*!
            ** If true, the map widget will attempt to use the KE custom marker
            ** drawing mechanism rather than the default OpenLayers markers.
            */
            useInternalMarkerMaker: IMu.Config[context].useInternalMarkerMaker,

            /*!
            **  If true, when a user clicks on the 'more-details' link, it will
            **  use the map widget's simple feature details display window.
            */
            useSimpleDetailDisplay: IMu.Config[context].useSimpleDetailDisplay,

            /*!
            **  Set to true if using map layers that use the Spherical Mercator
            **  projection (eg Google/Bing/OSM Map Layers).
            */
            useSphericalMercator:  IMu.Config[context].useSphericalMercator,

            /*!
            ** If true, zoom the map in or out to best display all points after
            ** each search.
            */
            zoomToAllInitially:  IMu.Config[context].zoomToAllInitially
        });
    },

    /*
    ** Called whenever a map is to be drawn.
    ** This a hack to control how map displayed - done for a demo
    */
    showSearch: function(search, offset)
    {
        var self = this;
        self._super(search, offset);

        if (self.options.resetZoomOnSearch)
        {
            self.zoomToInitialExtent();
            if (self.options.zoomToAllInitially)
                self.zoomToShowAllPoints();
        }
        self.prepareMapToDisplayNewPoints();
    },


    //*************************************************************************
    // methods that interact directly with view object

    addBaseLayers: function(layers)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.addBaseLayers(layers);
        else
            self.showStatusMessage('error adding base layers', true);
    },

    /*
    **
    */
    addFeaturesToLayer: function(layer, features)
    {
        var self = this;
        self.view.addFeaturesToLayer(layer, features);
    },

    /*
    ** Adds (typically point) layer to the OL Map 
    **
    ** Syntactic sugar to interface with view object
    */
    addLayerToMap: function(layer)
    {
        var self = this;
        if (self.view !== undefined)
        {
            self.view.addLayer(layer);
            self.view.addSelectFeatureControl();
        }
        else
            self.showStatusMessage('error adding search results layer', true);
    },

    /*
    ** Show or hide passed OL feature (typically a data point) on the map
    **
    ** Syntactic sugar to interface with view object.
    **
    ** @param feature object
    **   OL feature object.
    **
    ** @param visible bool
    **   If true, show it else hide it.
    */
    displayFeature : function(feature, visible)
    {
        var self = this;

        if (self.view !== undefined)
        {
            if (visible)
                self.view.showPoint(feature);
            else    
                self.view.hidePoint(feature);
        }
        else
            self.showStatusMessage('error showing/hiding point', true);
    },

    /*
    ** Show or hide KE controls on the control Panel (controls that are only
    ** relevant if there is data mapped).
    **
    ** Syntactic sugar to interface with view object.
    */
    displayKEControls: function(visible)
    {
        var self = this;
        if (self.view !== undefined)
        {
            self.view.showKEControls(
                self.options.clearSearchResults,
                self.options.anchorLegendOnMap,
                self.options.addZoomToShowAllControl,
                visible);
        }
        else
            self.showStatusMessage('error displaying controls', true);
    },


    /*
    ** Return the map's currently used base layer.  
    ** This may contain data we need to use when filtering points.
    **
    ** Syntactic sugar to interface with view object.
    */
    getBaseLayer: function()
    {
        var self = this;
        if (self.view !== undefined)
            return self.view.getBaseLayer();
        self.showStatusMessage('error getting base layer', true);
        return {};
    },

    /*
    ** When creating objects representing a feature we may need to include
    ** display information that comes from view object.
    **
    ** Syntactic sugar to interface with view object.
    */
    getDefaultDisplayStyle: function()
    {
        var self = this;

        if (self.view !== undefined)
            return self.view.getDefaultDisplayStyle();

        self.showStatusMessage('error getting style', true);
        return {};
    },

    /*
    **
    */
    getLayerFeatures: function(pointLayer)
    {
        var self = this;
        return  self.view.getLayerFeatures(pointLayer);
    },

    /*
    **
    */
    getLayerName: function(layer)
    {
        var self = this;
        return  self.view.getLayerName(layer);
    },

    /*
    ** Get from OL map object, all the point feature layers.
    ** We may need to process or filter the point data.
    **
    ** Syntactic sugar to interface with view object
    */
    getPointLayers: function()
    {
        var self = this;

        if (self.view !== undefined)
            return self.view.getPointLayers();

        self.showStatusMessage('error getting point layers', true);
        return {};
    },

    /*
    ** Create a feature to represent an item to plot on the map
    ** 
    ** @param x float
    **   Point's x coordinate.
    ** 
    ** @param y float
    **   Point's y coordinate.
    ** 
    ** @param z float
    **   Point's z coordinate.
    ** 
    ** @param info object.
    **   Object representing information about the object.
    */
    makeFeature: function(x, y, z, info)
    {
        var self = this;

        var feature = self.view.makePointFeature(
                x, y, z, info, self.options.useSphericalMercator);
        return feature;
    },


    /*
    ** Create an OL point layer.
    ** This involves adding screen display properties.
    **
    ** Syntactic sugar to interface with view object.
    */
    makePointLayer: function(searchName, noCluster)
    {
        var self = this;

        if (self.view !== undefined)
            return self.view.makePointLayer(searchName, noCluster);

        self.showStatusMessage('error making point layer', true);
        return {};
    },

    /*
    ** Do anything on screen that is needed before new data points are added.
    **
    ** Syntactic sugar to interface with view object.
    */
    prepareMapToDisplayNewPoints: function()
    {
        var self = this;

        if (self.view !== undefined)
            self.view.prepareMapToDisplayNewPoints();
        else    
            self.showStatusMessage('error preparing map for display', true);
    },

    /*
    **
    */
    setBaseLayer: function(layer)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.setBaseLayer(layer);
        else    
            self.showStatusMessage('error changing base layer', true);
    },

    /*
    **
    */
    recalculateFeatureBounds: function(feature)
    {
        var self = this;

        feature = self.view.recalculateFeatureBounds(feature);
        return feature;
    },

    /*
    **
    */
    recreateMap: function()
    {
        var self = this;

        if (self.view !== undefined)
            self.view.recreateMap();
        else    
            self.showStatusMessage('error removing base layers', true);

    },

    /*
    ** Remove a layer altogether, this will involve display changes.
    **
    ** Syntactic sugar to interface with view object.
    */
    removeLayer: function(layer)
    {
        var self = this;

        if (self.view !== undefined)
            self.view.removeLayer(layer);
        else    
            self.showStatusMessage('error removing layer', true);
    },

    /*
    ** Remove the legend from display. 
    ** Includes wiping any information in it so the legend container can be 
    ** re-used later with new data.
    **
    ** Syntactic sugar to interface with view object.
    */
    removeLegend: function()
    {
        var self = this;

        if (self.view !== undefined)
            self.view.removeLegend();
        else    
            self.showStatusMessage('error removing legend', true);
    },

    /*
    ** Trigger display of the collation mechanism.
    **
    ** Syntactic sugar to interface with view object.
    */
    triggerCollator: function(searchName, data)
    {
        var self = this;

        if (self.view !== undefined)
        {
            if (self.hasCollator)
                self.view.drawCollator(data, searchName);
            else    
            {
                var collateBy = 'Name of Search';
                if (data.collateByCategory != undefined)
                     collateBy = data.collateByCategory;
                 else if (self.options.defaultCollation != undefined)
                    collateBy = self.options.defaultCollation;
                else
                    self.options.defaultCollation = collateBy;

                var data = self.setCollationCategory(
                        searchName,
                        collateBy 
                        );
                self.view.drawLegend(data);
            }
        }
        else
            self.showStatusMessage('error triggering collator', true);
    },

    /*
    ** Zoom to the 'starting' zoom level.
    */
    zoomToInitialExtent: function()
    {
        var self = this;
        if (self.view !== undefined)
            self.view.zoomToInitialExtent();
        else
            self.showStatusMessage('error zooming to normal extent', true);
    },


    /*
    ** Zoom map to extent given.
    **
    ** Syntactic sugar to interface with view object.
    */
    zoomToExtent: function(bounds)
    {
        var self = this;
        if (self.view !== undefined)
            self.view.zoomToExtent(bounds);
        else
            self.showStatusMessage('error zooming to extent', true);
    },

    /*
    ** Zoom enough to show all mapped points.
    */
    zoomToShowAllPoints: function()
    {
        var self = this;
        if (self.view !== undefined)
            self.view.zoomToShowAllPoints();
        else
            self.showStatusMessage('error zooming to show all', true);
    }
    //*************************************************************************

});
