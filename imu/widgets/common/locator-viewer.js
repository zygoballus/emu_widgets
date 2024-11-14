/*!
** Displays a specialised location map showing plotting locations of each
** record in a result set.
**
** extends `map-viewer <./map-viewer.html>`_.
**
** A locator widget is typically used for displaying locations of features on
** site plans.
**
** It extends the map-widget and adds data filtering methods that allow the
** ability to dynamically show or hide displayed EMu features on the map based
** on their field values.
**
**
** @since 2.0
*/


/*!
** @example Create a Locator widget.
** @code
** var locator = $('#locator-viewer').height(600).
**      IMu('locator-viewer',
**          {
**              layerPath: '../../../../shared/client/images/layers',
**              searchContext: 'locator'
**          }
**      );
** locator.addLayer('Site Plan');
** locator.addLayer('Basement');
** @endcode
**
** @example  get a list of potential values that could be used when specifying
**           a filter for a particular field
** @code
** var choices = myLocatorWidget.getFilterChoices('ScientificName')
** // choices might now be an object something like:
** {
**    Anthrenus sarnicus: {
**            count: 510
**            inFilter: true
**            verbatimValue: "Anthrenus sarnicus"
**    },
**    Attagenus smirnovi: {
**            count: 313
**            inFilter: true
**            verbatimValue: "Attagenus smirnovi"
**    },
**    Lepisma saccharina: {
**            count: 245
**            inFilter: true
**            verbatimValue: "Lepisma saccharina"
**    }
** }
** @endcode
** @example  Add filters - restrict display to features with:
**   Scientific Name = Anthrenus sarnicus OR Lepisma saccharina AND Locality = 'Blue Hills'
** @code
**  ...
**  myLocatorWidget.addFilterTerm('ScientificName', 'Anthrenus sarnicus');
**  myLocatorWidget.addFilterTerm('ScientificName', 'Lepisma saccharina');
**  myLocatorWidget.addFilterTerm('Locality', 'Blue Hills');
**  ...
** @endcode
**
** @example  Return the current filtering settings
** @code
**   var filters = myWidget.getCurrentFilters();
**
** // filters will be an object something like:
** {
**   ScientificName: ['Anthrenus sarnicus', 'Lepisma saccharina'],
**   Locality: [ 'Blue Hills' ]
** }
** @endcode
**
** @example  Return the current filtering settings as a string
** @code
**   var st = myWidget.getCurrentFiltersAsString();
**  // st == "ScientificName (Anthrenus sarnicus or Lepisma saccharina) and Locality (Blue Hills)"
** @endcode
**
**
** @example  Removes a specific filtering term.  Drop 'Anthrenus sarnicus' from the filter
** @code
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "ScientificName (Anthrenus sarnicus or Lepisma saccharina) and Locality (Blue Hills)"
**  clearFilterTerm('ScientificName', 'Anthrenus sarnicus');
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "ScientificName (Lepisma saccharina) and Locality (Blue Hills)"
** @endcode

** @example  Remove 'ScientificName' field from the filtering (this will remove
** all filters for that field meaning it will display features irrespective of
** values in the ScientificName field).
** @code
**  ...
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "ScientificName (Anthrenus sarnicus or Lepisma saccharina) and Locality (Blue Hills)"
**  myWidget.clearFilterField('ScientificName');
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "Locality (Blue Hills)"
**  ...
** @endcode
**
** @example  Remove all filtering on all fields
** @code
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "ScientificName (Anthrenus sarnicus or Lepisma saccharina) and Locality (Blue Hills)"
**  myWidget.clearFilterFields();
**  var st = myWidget.getCurrentFiltersAsString();
**  // st == "*"
**  ...
** @endcode
**
** @example  Apply the filter and redisplay the data
** @code
**      myWidget.filterDisplayedData:();
**      // the map will redisplay showing only features that match the
**      // filtering criteria
** @endcode
**
**
*/


IMu.Widgets.add('locator-viewer', 'map-viewer',
{
   /*!
   ** Constructor
   */
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-locator-viewer');

        this.currentFilterTerms = {};
        this.choices = {};

    },

    /*!
    **  Adds a filter to the current set. 
    ** @param field string
    **   the field that will be examined when using the filter
    ** @param value string
    **   the value that the field must have to pass the filtering criteria
    ** @returns null
    */
    addFilterTerm: function(field, value)
    {
        var self = this;
        if (self.currentFilterTerms[field] === undefined) 
            self.currentFilterTerms[field] = {};

        if (value == '\\*')
        {
            if (self.currentFilterTerms[field] !== undefined)
                delete self.currentFilterTerms[field];
            return;
        }

        if (self.choices[field])
            self.choices[field] = undefined;

        self.currentFilterTerms[field][value] = true;
    },

    /*!
    ** Remove a field from the filtering (this will remove all filters for that
    ** field)
    ** @param field string
    **  the field to remove from the current filtering criteria
    ** @returns null
    */
    clearFilterField: function(field)
    {
        var self = this;
        if (self.currentFilterTerms[field] != undefined)
            delete self.currentFilterTerms[field];

        if (self.choices[field])
            self.choices[field] = undefined;
        //self.view.resetFiltering();
    },

    /*!
    ** Remove all filtering.
    ** @returns null
    */
    clearFilterFields: function()
    {
        var self = this;
        self.currentFilterTerms = {};

        self.choices = {};
        //self.view.resetFiltering();
    },


    /*!
    ** Removes a specific filtering term.
    ** If there is no matching filter, do nothing.
    ** @param field string
    **  the field to examine
    ** @param value string
    **  the value for that field to remove from the filters
    ** @returns null
    */
    clearFilterTerm: function(field, value)
    {
        var self = this;

        // cannot drop if none set
        if (self.currentFilterTerms[field] == undefined)
            return;

        // do not drop if set to 'all' (because having no terms is equivalent
        // to  '\\*', so dropping '\\*' is tautology)
        if (value == '\\*')
            return;

        // drop the given filter
        if (self.currentFilterTerms[field][value] != undefined)
            delete self.currentFilterTerms[field][value];

        // if nothing else filtered on this field, drop the field
        if (Object.keys(self.currentFilterTerms[field]).length == 0)
            delete self.currentFilterTerms[field];

        if (self.choices[field])
            self.choices[field] = undefined;
    },

    /*
    ** Apply the filter and redisplay the map
    ** @returns null
    */
    filterDisplayedData: function()
    {
        var self = this;
        self.redisplaySearches();
    },


    /*!
    ** Returns the current filtering description object
    ** @returns object
    */
    getCurrentFilters: function()
    {
        var self = this;
        return self.currentFilterTerms;
    },

    /*!
    ** Returns the current filtering description as a string
    ** @returns string
    */
    getCurrentFiltersAsString: function()
    {
        var self = this;

        var OR = ' ' + IMu.string('common-boolean-OR') + ' ';
        var AND = ' ' + IMu.string('common-boolean-AND') + ' ';
        var filters = self.getCurrentFilters();
        var filterDescription = [];
        jQuery.each(filters, function(field, values)
        {
            var valueKeys = values;
            var valueSt = [];
            jQuery.each(valueKeys, function(key, status)
            {
                valueSt.push(key);
            });
            filterDescription.push(field + ' (' + valueSt.join(OR) + ' )');
        });
        var st = filterDescription.join(AND);
        return st;
    },

    /*!
    ** get a list of potential values that could be filtered by, for a
    ** particular field
    ** @param field string
    **  the field to examine
    ** @returns object
    */
    getFilterChoices: function(field)
    {
        var self = this;

        if (self.choices[field])
            return self.choices[field];

        var groups = {};
        jQuery.each(self.analysedData, function(searchName, data)
        {

            var filteredTrapEventData = data.rawData.rows;
            var inData = {};
            var outData = {};
            var analysedAllData = {};
            for (var i = 0; i < filteredTrapEventData.length; i++)
            {
                var row = filteredTrapEventData[i];
                if (self.rowInFilter(row))
                {
                    self.analyseRecord(inData, row, 'filtered data');
                }
                else
                {
                    self.analyseRecord(outData, row, 'rejected data');
                }
            }

            // set matching values
            var category = inData[field];
            if (category != undefined)
            {
                jQuery.each(category.distinctValues, function(value, description)
                {
                    groups[value] = {
                            'verbatimValue' : value,
                            'count': description.totalTrapCount,
                            'inFilter': true
                        };
                });
            }

            // set non-matching values
            category = outData[field];
            if (category != undefined)
            {
                jQuery.each(category.distinctValues, function(value, description)
                {
                    // only add if this value not set
                    if (! groups[value])
                        groups[value] = {
                            'verbatimValue' : value,
                            'count': description.totalTrapCount,
                            'inFilter': false
                        };
                });
            }
        });
        self.choices[field] = groups;
        return groups;
    },


    //----------------------------------------------
    // All below here considered protected methods 
    //----------------------------------------------

    /*
    ** Return a list of fields currenty participating in the applied filter
    */
    getFilterUsedFields: function()
    {
        var self = this;

        var terms = [];
        jQuery.each(self.currentFilterTerms, function(field, criteria)
        {
            terms.push(field);
        });
        return terms;
    },

    /*
    ** overridden from map widget
    */
    pointInBaseLayerRange: function(x, y, z)
    {
        var self = this;

        var baseLayer = self.getBaseLayer();
        var layerProperties = baseLayer.ke;
        if (layerProperties == undefined)
            return true;

        var projectedCoords = self.changeElevationCoordinates(
                       layerProperties, x, y, z);
        
        var vertCoord = projectedCoords.z;
        return (vertCoord >= layerProperties.zmin) &&
                        (vertCoord <= layerProperties.zmax);
    },


    /*
    ** overridden from map widget
    **
    */
    rowInFilter: function(row)
    {
        var self = this;

        // if no filter terms, do not filter
        if (jQuery.isEmptyObject(self.currentFilterTerms))
            return true;

        // do not filter non-trap event records
        if (row.source != 'etrapevents')
            return true;

       var rowMatches = true;

       var filterFields = self.getFilterUsedFields();
       // for each specified field filter
       jQuery.each(self.currentFilterTerms, function(field, criteria)
       {
            var fieldValue = row[field];
            if ((fieldValue === null) || (fieldValue === undefined))
                fieldValue = IMu.string('map-unspecified-value');

            if (! jQuery.isArray(fieldValue))
                fieldValue = [ fieldValue ];
            var columnMatches = false;
            for (var i = 0; i < fieldValue.length; i++)
            {
                if ((criteria == undefined) || (criteria[fieldValue[i]]))
                {
                    columnMatches = true;
                    break;
                }
            }
            if (! columnMatches)
            {
                rowMatches = false;
                return false; // (break jQuery.each loop)
            }
        });
        return rowMatches;
    },


    setWidgetOptions: function()
    {
        var self = this;
            
        self.whoami = 'Locator';
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

            searchContext: 'locator',

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
    ** this a hack to control how map displayed - done for a demo
    */
    showSearch: function(search, offset)
    {
        var self = this;

        if (self.options.resetZoomOnSearch)
        {
            if (self.layers.length > 0)
            {
                var initialLayer = self.layers[0];
                self.setBaseLayer(initialLayer);
            }
        }

        self._super(search, offset);
    }
});


