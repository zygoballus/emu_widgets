(function()
{
    IMu.Config =
    {
        /*!
        ** The top record used to populate the record-browser widget.
        ** The value should be specified as a string for the form:
        ** *module*:*irn*.
        */
        browseMaster: undefined,

        /*!
        */
        defaultDateFormat: undefined,

        /*!
        */
        preferredLanguage: undefined,

        /*!
        */
        preferredTheme: undefined,

        /*!
        ** The maximum frequency (in milliseconds) that resize events
        ** will be triggered. Larger values will be more efficient but
        ** make the application feel somewhat less responsive.
        */
        resizeInterval: 300,

        /*!
        ** Default value for ``onlyItemsWithImages`` setting for
        ** ``keyword-search`` and ``search-form`` widgets.
        */
        showOnlyItemsWithImages: undefined,

        /*!
        */
        showSelectionControls: undefined,

        /*!
        ** Update URL in browser address bar after search
        */
        updateURL: undefined,

        /*!
        ** The time (in days) until the cookie set as part of the 
        ** my collections code expires.
        **
        ** If undefined the cookie will be session based (expires when
        ** the browser is closed).
        */
        userCookieDuration: undefined,

        /*!
        */
        widgetOwnerHeight: undefined,

        /*!
        ** Configuration options for mapper widgets
        */
        Mapper:
        {
            /*!
            ** Add a zoom to show all mapped points control onto map 
            */
            addZoomToShowAllControl: undefined,

            /*!
            ** Restrict 'collation by' fields (if empty, allow all fields)
            */
            allowCollationBy: undefined,

            /*!
            ** Is legend forced to be displayed within map canvas
            */
            anchorLegendOnMap: undefined,

            /*!
            ** Bing Map key
            */
            bingKey: undefined,

            /*!
            ** Add a clear search control onto map 
            */
            clearSearchResults: undefined,

            /*!
            ** Define max ranges in x,y,z
            ** (eg for lat/longs -180-180, -90, 90, 0, very big)
            */
            coordRanges: {
                x : [undefined, undefined],
                y : [undefined, undefined],
                z : [undefined, undefined]
            },

            /*!
            ** In the absence of user preference, what should map data be
            ** collated by?
            */
            defaultCollation: undefined,
            

            /*!
            ** Google map key
            */
            googleKey: undefined,
    
            /*!
            ** If set, initially display map at this extent
            ** arguments are left, botton, right, top
            ** specify values in Lat/Longs EPSG:4326
            **
            ** @example
            **   To set lat/long initial extent to the whole world
            **
            ** @code
            **   initialExtentLBRT = [-180, -90, 90, 180];
            **
            */
            initialExtentLBRT: undefined,

            /*!
            ** Path to where image layer files are stored (if used).
            */
            layerPath: undefined,

            /*!
            ** Show more information dialog for point selected.
            */
            moreDetailsDialog: undefined,

            /*!
            ** Make behaviour to be highlight point on click
            */
            pointHighlightOnClick: undefined,

            /*!
            ** Make behaviour to be highlight point on hover
            */
            pointHighlightOnHover: undefined,

            /*!
            ** Display the layer switcher control
            */
            showLayerSwitcher: undefined,

            /*!
            ** Display mouse coordinates on screen
            */
            showMouseCoordinates: undefined,

            /*!
            ** Show small overview/status map
            */
            showOverviewMap: undefined,

            /*!
            ** Display a scale bar
            */
            showScalebar: undefined,

            /*!
            ** Display feedback messages on screen
            */
            showStatusMessages: undefined,

            /*!
            ** Do not open the collator dialog on search return
            */
            skipOpeningCollator: undefined,

            /*!
            ** Only display a single search - repeat searches will clear any
            ** previous searches
            */
            singleShot: undefined,

            /*!
            ** Use spherical mercator projection (typically for use with Google
            ** maps)
            */
            useSphericalMercator: undefined
        },

        /*!
        ** Configuration options for locator widgets
        */
        Locator:
        {
            /*!
            ** Add a zoom to show all mapped points control onto map 
            */
            addZoomToShowAllControl: undefined,

            /*!
            ** Restrict 'collation by' fields (if empty, allow all fields)
            */
            allowCollationBy: undefined,

            /*!
            ** Is legend forced to be displayed within map canvas
            */
            anchorLegendOnMap: undefined,

            /*!
            ** Bing Map key
            */
            bingKey: undefined,

            /*!
            ** Add a clear search control onto map 
            */
            clearSearchResults: undefined,

            /*!
            ** Define max ranges in x,y,z
            ** (eg for lat/longs -180-180, -90, 90, 0, very big)
            */
            coordRanges: {
                x : [undefined, undefined],
                y : [undefined, undefined],
                z : [undefined, undefined]
            },

            /*!
            ** in the absence of user preference, what should map data be
            ** collated by?
            */
            defaultCollation: undefined,
            

            /*!
            ** google map key
            */
            googleKey: undefined,
    
            /*!
            ** if set, initially display map at this extent
            ** arguments are left, botton, right, top
            ** specify values in Lat/Longs EPSG:4326
            ** @example to set lat/long initial extent to the whole world
            ** @code
            **  initialExtentLBRT = [-180, -90, 90, 180];
            **
            */
            initialExtentLBRT: undefined,

            /*!
            ** path to where image layer files are stored (if used)
            */
            layerPath: undefined,

            /*!
            ** definition of floor plan layers
            */
            layers: [],

            /*!
            ** show more information dialog for point selected
            */
            moreDetailsDialog: undefined,

            /*!
            ** make behaviour to be highlight point on click
            */
            pointHighlightOnClick: undefined,

            /*!
            ** make behaviour to be highlight point on hover
            */
            pointHighlightOnHover: undefined,

            /*!
            ** display the layer switcher control
            */
            showLayerSwitcher: undefined,

            /*!
            ** display mouse coordinates on screen
            */
            showMouseCoordinates: undefined,

            /*!
            ** show small overview/status map
            */
            showOverviewMap: undefined,

            /*!
            ** display a scale bar
            */
            showScalebar: undefined,

            /*!
            ** display feedback messages on screen
            */
            showStatusMessages: undefined,

            /*!
            ** Do not open the collator dialog on search return
            */
            skipOpeningCollator: undefined,

            /*!
            ** only display a single search - repeat searches will clear any
            ** previous searches
            */
            singleShot: undefined,

            /*!
            ** use spherical mercator projection (typically for use with Google
            ** maps)
            */
            useSphericalMercator: undefined
        }
    }
})();
