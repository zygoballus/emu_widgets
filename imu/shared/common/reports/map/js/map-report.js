var mapUtilities = MapUtility;

// define fields that will be displayed on details view
mapUtilities.setDetailFields([
    'Title',
    'ScientificName',
    'Type',
    'Category',
    'Location',
    'Condition',
    'DateCollected',
    'AccessionDate'
]);

// largest cluster radius allowed
mapUtilities.maxClusterPixels = 500;
var defaultSearchName = 'Search Report';

mapUtilities.floatingPanelPositions = {
    'marker-info': function(el, child, draggable, resizable) {
        openPos = {
            my: 'left top',
            at: 'right top',
            of: jQuery('#map-viewer')
        };
        var closePos = {
            my: 'left top',
            at: 'right top',
            of: jQuery('#map-viewer')
        };
        var h = (2/3) * jQuery('#map-viewer').height();
        var w = 0.9 * (jQuery(window).width() - jQuery('#map-viewer').width());
        mapUtilities.registerPosition(el, w, h, openPos, closePos, child, draggable, resizable);
    },
    'legend-panel': function(el, child, draggable, resizable) {
        openPos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#map-viewer')
        };
        var closePos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#map-viewer')
        };
        var h = 1.33 * jQuery('#map-viewer').height()/3;
        var w = 0.85 * jQuery('#map-viewer').width();
        mapUtilities.registerPosition(el, w, h, openPos, closePos, child, draggable, resizable);
    },
    'feature-details': function(el, child, draggable, resizable) {
        var openPos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#marker-info')
        };
        var closePos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#marker-info')
        };
        var h = (2/3) * jQuery('#map-viewer').height();
        var w = jQuery('#marker-info').width();
        mapUtilities.registerPosition(el, w, h, openPos, closePos, child, draggable, resizable);
    }
}

IMu.Importer.add('OpenLayers');

IMu.ready(function()
{
    var w = window.innerWidth;
    var map = $('#map-viewer').height(w/3).width(w/1.5).
            IMu('map-viewer',
            {
                'allowCollationBy'        : [ 
                                        'ScientificName',
                                        'Category',
                                        'Condition',
                                        'Type',
                                        'Type',
                                        'Location',
                                        'DateCollected' ],
                'anchorLegendOnMap'       : false,
                'addZoomToShowAllControl' : true,
                'clearSearchResults'      : false,
                'clusterDistance'         : 1,
                'clusterPoints'           : true,
                'defaultCollation'        : 'ScientificName',
                'initialExtentLBRT'       : [ -180, -50, 180, 50 ],
                'moreDetailsDialog'       : false,
                'pointHighlightOnHover'   : false,
                'pointHighlightOnClick'   : true,
                'searchContext'           : 'map',
                'showLayerSwitcher'       : true,
                'showMouseCoordinates'    : true,
                'showScalebar'            : true,
                'showStatusMessages'      : true,
                'skipOpeningCollator'     : true,
                'useInternalMarkerMaker'  : true,
                // Needed if mixing EPSG:900913 projected layers (eg
                // Google/Bing/Yahoo) with EPSG:4326 lat/long layers.
                'useSphericalMercator'    : true,
                'zoomToAllInitially'      : true
            }
    );

    // add several base layers
    map.addLayer('osm');
    map.addLayer('google-physical');
    map.addLayer('google-streets');
    map.addLayer('google-satellite');
    map.addLayer('google-hybrid');
    map.setClusterStrategy('centred');
    //map.setClusterStrategy('default');

     var bounds = new OpenLayers.Bounds(
             -20037508.3428, -15496570.7397, 20037508.3428, 15764656.2314
             );
     var tileSize = 256;
    mapUtilities.setMapWidget(map, false); 
    mapUtilities.addLegendPanel('legend-panel');
    mapUtilities.addMarkerInfoPanel('marker-info');
    mapUtilities.addFeatureDetailsPanel('feature-details');
    mapUtilities.addMapControlsItem('menu-controls');
    mapUtilities.addLayerSelector('layer-selector');
    mapUtilities.addGroupSelector('site-selector');
    mapUtilities.setMenuBar('menu-bar');
    mapUtilities.addClusterDistanceControl('cluster-distance', 600);

    IMu.Events.bind('imu-show', function() {
        runStandardSearch(map, defaultSearchName);
        jQuery('#cluster-distance').slider('value', 70);
    });

});
