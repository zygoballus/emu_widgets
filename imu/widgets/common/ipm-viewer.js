/*!
** Displays a specialised location map that deals with plotting trap event type
** records for use with Pest Management Tools
**
** extends `locator <./locator-viewer.html>`_.
**
** An IPM widget is specifically used to display trap event data for use with
** Pest Management applications.  It is not generally useful outside of this
** role and is tied closely to the trapevent data structure in EMu.
**
** It extends the locator viewer widget and adds specific functionality to turn
** trap event records into captured specimen data that can be collated and
** plotted on site plans, it also adds the ability to count and analyse trap
** contents and automatically assign marker sizes etc.
** 
** It also includes some date parsing methods to assist applications that use
** this widget to interpret dates in the same way that the widget does.
**
** @since 2.0
*/


/*!
** @example Make an IPM widget
** @code
** 
**     var ipm = $('#ipm-viewer').width(850).height(600).
**                 IMu('ipm-viewer',
**                      {
**                          layerPath: '../../../../shared/client/images/layers',
**                      }
**                 );
**                 ipm.addLayer('Site Plan');
**                 ipm.addLayer('Basement');
**                 ipm.addLayer('Ground Floor');
**
**                 ipm.setCoordRanges(0, 4000, 0, 4000, -5000, 5000);
** 
** @endcode
**
** @example Get total counts of items currently displayed.
** The returned object includes info on the total number of features and the
** features in the largest displayed marker.
** @code
**  var counts = myIpmWidget.getTotalCounts
**
**  // counts == { totalAll: 500, largestSingleMarker: 238 };
** @endcode
**
** @example Handle dates.  If you need to process dates (eg sorting), both the
** IPM widget and your code needs to interpret the date values the same way.
** These methods expose the methods used internally by the IPM when handling
** dates.
** @code
**  myIPMWidget.setDateFormat('dmy', '/');
**  var dSt = '13/01/2013';
**  var dObject = myIPMWidget.parseStringToDate(dSt);
**  // dObject is a Javascript Date Object
**  var year = dObject.getFullYear();
**  // year == 2013
**
**  var d = new Date('Jan 13, 2013');
**  var st = myIPMWidget.parseDateToString(d);
**  // st == '13/01/2013';
** @endcode
**
*/



IMu.Widgets.add('ipm-viewer', 'locator-viewer',
{
    /*!
    ** constructor
    */
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-ipm-viewer');

        this.dateSeparator = '/';
        this.dateOrder = 'dmy';

        this.maximumMarkerSize = 100;
        this.maxCount = undefined;
        this.minCount = undefined;
        this.minimumMarkerSize = 20;
        this.trapCountField = 'TrapCount';
    },

    /*!
    ** Gets information on the number of trapped specimens being displayed,
    ** including the total number of specimens and the largest number of
    ** specimens associated with any single displayed marker.
    ** @returns null
    */
    getTotalCounts: function()
    {
        var self = this;
        var data = self.analysedData;

        return {
            largestSingleMarker: self.maxCount,
            smallestSingleMarker: self.minCount,
            totalAll: self.view.getTotalsCount()                         
        };
    },


    /*!
    **  Gets the count of specimens in the smallest displayed marker
    ** @param name string
    ** @returns number
    */
    getMinCount: function()
    {
        var self = this;

        if (self.view !== undefined)
            return self.view.getMinCount(name);
        else
        {
            IMu.Events.bind('imu-show', function()
            {
                return self.view.getMinCount(name);
            });
        }
    },

    /*!
    **  Gets the count of specimens in the largest displayed marker
    ** @returns number
    */
    getMaxCount: function()
    {
        if (self.view !== undefined)
            return self.view.getMaxCount(name);
        else
        {
            IMu.Events.bind('imu-show', function()
            {
                return self.view.getMaxCount(name);
            });
        }
    },


    /*!
    ** Convert a JS date object to a string in the format specified in the
    ** widget configuration.
    ** Available to applications to make sure they interpret dates the same was
    ** as the widget does.  Date format is set in the widget configuration.
    ** @param dateObj
    **  a JS date object
    ** @returns string
    */
    parseDateToString: function(dateObj)
    {
        var self = this;

        var y = dateObj.getFullYear();
        var m = dateObj.getMonth() + 1;
        var d = dateObj.getDate();
        var ds = self.dateSeparator;

        if (d < 10)
            d = '0' + d;
        if (m < 10)
            m = '0' + m;

        switch(self.dateOrder)
        {
            case 'dmy':
                return d + ds + m + ds + y;
                break;
            case 'mdy':
                return m + ds + d + ds + y;
                break;
            case 'ymd':
            default:
                return y + ds + m + ds + d;
                break;
        }
    },

    /*!
    ** Convert dd/mm/yyyy dates into javascript date objects.
    ** Available to applications to make sure they interpret dates the same was
    ** as the widget does.  Date format is set in the widget configuration.
    ** @param dString
    **  a date string (eg '25/12/2011')
    ** @returns object (a JS Date object)
    */
    parseStringToDate: function(dString)
    {
        var self = this;

        var d = new Date(dString);
        var ds = self.dateSeparator;
        if ((ds != undefined) && (ds != ''))
        {
            var dParts = dString.split(self.dateSeparator);
            switch(self.dateOrder)
            {
                case 'dmy':
                    d = new Date(dParts[2], dParts[1] - 1, dParts[0]);
                    break;
                case 'mdy':
                    d = new Date(dParts[1], dParts[2] - 1, dParts[0]);
                    break;
                case 'ymd':
                default:
                    d = new Date(dParts[0], dParts[1] - 1, dParts[2]);
                    break;
            }
        }
        return d;
    },

    /*
    ** Overridden from map widget.
    ** Turn clustering functionality on or off
    ** @param clustering boolean
    **      turn clustering on or off
    ** @returns null
    */
    setClustering: function(clustering)
    {
        var self = this;

        self._super.apply(self, arguments);

        // after clustering, record new max and min counts
        self.maxCount = self.view.getMaxCount();
        self.minCount = self.view.getMinCount();

        return;
    },

    /*!
    ** Sets details on the date format to be used
    ** @param order string
    **  a format string.  Currently accepted values are: 'dmy', 'mdy', 'ymd'
    ** @param separator string
    **  the symbol used to separate date components (eg '-', '/' etc)
    ** @returns null
    */
    setDateFormat: function(order, separator)
    {
        var self = this;
        self.dateSeparator = separator;
        self.dateOrder = order;
    },


    /*!
    ** Set the style of marker to use when displaying features
    ** @param type string
    **      currently 2 values accepted, 'pie' and 'bar'
    ** @returns null
    */
    setMarkerType: function(type)
    {
        var self = this;
        switch (type)
        {
            case 'bar':
                self.view.setMarkerType('bar');
                break;
            case 'pie':
            default:
                self.view.setMarkerType('pie');
                break;
        }
    },

    /*!
    **  Set the largest radius marker to display
    ** @param radius number
    **      the radius (in pixels)
    ** @returns null
    */
    setMaximumMarkerSize: function(radius)
    {
        var self = this;

        self.maximumMarkerSize = radius;
        if (radius < self.minimumMarkerSize)
            self.minimumMarkerSize = radius;

        self.view.clusterCache = {};
        self.setClustering(true);
    },


    /*!
    ** Sets the smallest size to display markers
    ** @param radius number
    **      set the size to use to display the smallest marker
    ** @returns null
    */
    setMinimumMarkerSize: function(radius)
    {
        var self = this;

        self.minimumMarkerSize = radius;
        if (radius > self.maximumMarkerSize)
            self.maximumMarkerSize = radius;

        self.view.clusterCache = {};
        self.setClustering(true);
    },


    //-------------------------------------------------
    // All below here considered protected methods
    //-------------------------------------------------

    /*
     * Look at record (row) data and extract and collate info on field names and
     * distinct field values encountered etc for use by components like legends.
     * Overridden from map widget.
     */
    analyseRecord: function(fields, dataRow, searchName)
    {
        var self = this;
        if (dataRow.source != 'etrapevents')
            self._super.apply(self, arguments);
            

        var trapCount = dataRow['TrapCount'];

        var searchNameLabel = IMu.string('map-view-search-name-label');
        jQuery.each(
            dataRow,
            function(field, value)
            {
                if ((value === undefined) || (value === null))
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

                if (field != '' )
                {
                    if (! (field in fields))
                    {
                        fields[field] = {
                            fieldName: field,
                            distinctValues: {}
                        }
                    }

                    // field value may be a table of values.  Treat each row in
                    // table as a different value.
                    var values = new Array();

                    if (jQuery.isArray(value))
                        values = value;
                    else
                        values.push(value);

                    if (values.length == 0)
                        values.push('NO VALUE');

                    jQuery.each(values, function(idx, v)
                    {
                        if (jQuery.type(v) == 'object')
                        {
                            for (var key in v)
                            {
                                if (jQuery.type(v[key]) != 'object')
                                {
                                    v = v[key];
                                    break;
                                }
                            }
                        }

                        /* track how many times this distinct value occurs
                           for all rows */
                        if (v in fields[field].distinctValues)
                        {
                            fields[field].distinctValues[v].count++;
                            fields[field].distinctValues[v].totalTrapCount += trapCount;
                        }
                        else
                        {
                            /* assign an index # for this value depending on
                               how many other distinct values already are
                               recorded (ie this is the Nth distinct value
                               recorded for this field) */
                            var valueIndex = 0;
                            for (var k in fields[field].distinctValues)
                                valueIndex++;

                            fields[field].distinctValues[v] = {
                                'value': v,
                                'count': 1,
                                'totalTrapCount': trapCount,
                                'valueIndex': valueIndex
                            };
                        }
                    });
                }
            });
    },


    /*
    ** Overridden from map widget.  We need to turn trap event data into
    ** multiple trap content items.
    */
    preProcessEMuData: function(emuResultSet)
    {
        var self = this;

        var initialSet = self._super.apply(self, arguments);

        var processedSet = { 'count': 0, 'rows': [] };
        if (initialSet.rows.length > 0)
        {
            if (initialSet.rows[0]['source'] != 'etrapevents')
                return initialSet;

            var trappedItems = [];
            var fields = self.getRowFields(initialSet.rows[0]);
            for (var i = 0; i < initialSet.rows.length; i++)
            {
                var row = initialSet.rows[i];
                var contents = self.rowToContents(row, fields);
                for (var j = 0; j < contents.length; j++)
                    trappedItems.push(contents[j]);
            };
            processedSet['rows'] = trappedItems;
            processedSet['count'] = processedSet['rows'].length;
        }
        return processedSet;
    },


    /*
    ** turn a trap event record into an array of trapped items
    */
    rowToContents: function(row, fields)
    {
        var self = this;
        var contents = {};
        var maxRows = 0;
        var fieldType = {};

        // this bit assumes that all arrays are columns from of the same nested
        // table.  Code may need changing to instead use a configuration
        // setting that specifies the data structure of the raw record and how
        // it translates to individual content rows.
        jQuery.each(fields, function(idx, field)
        {
            fieldType[field] = 'undefined';
            if (row[field] != undefined)
            {
                fieldType[field] = 'scalar';
                var values = row[field];
                contents[field] = [];
                if (jQuery.isArray(values))
                {
                    fieldType[field] = 'array';
                    if (values.length > maxRows)
                        maxRows = values.length;
                    for (var i = 0; i < values.length; i++)
                        contents[field].push(values[i]); 
                }
                else
                {
                        contents[field].push(values); 
                }
            }
        });

        var trappedItems = [];
        // we will make maxRow content items...
        for (var i = 0; i < maxRows; i++)
        {
            var trappedItem = {};
            jQuery.each(contents, function(field, values)
            {
                var rowValue = 'UNKNOWN';
                switch (fieldType[field])
                {
                    case 'array':
                        var rowValue = values[i];
                        break;
                    case 'scalar':
                        var rowValue = values[0];
                        break;
                    case 'undefined':
                    default:
                        var rowValue = 'not specified';
                        break;
                }
                trappedItem[field] = rowValue;
            });
            trappedItems.push(trappedItem);
        }
        return trappedItems;
    },

    /*
    ** Overridden from Map widget
    */
    setSearch: function(search)
    {
        var self = this;

        if (search.symbol == undefined)
        {
            // If search is etrapevents, force symboltype to be a pie

            // NB the search object comes from a retrieved search, the data
            // structure is different than if coming from a search.  We need to
            // look at retrieved data to set what modules the data belongs to.
            if (search.trapevents == undefined)
            {
                var modules = {};
                for (var i = 0; i < search.hits.modules.length; i++)
                {
                    var module = search.hits.modules[i];
                    if (module.hits > 0)
                        modules[module.name]++;
                }
                if (modules['etrapevents'] != undefined)
                        search.symbol = 'pie';
            }
            else if (search.trapevents)
                    search.symbol = 'pie';
        }

        // now we can carry on exactly the same as if the data came from a
        // standard search object
        self._super.apply(self, arguments);
    },

    /*
    ** do all the option setting here
    */
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

            searchContext: 'ipm',

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
            useInternalMarkerMaker: true,

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
    ** add any special actions to occur after a search returns
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

        self._super.apply(self, arguments);
    }
});


