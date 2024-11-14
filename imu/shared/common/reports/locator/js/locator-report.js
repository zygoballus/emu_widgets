var defaultSearchName = 'Location Report';
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
        'AccessionDate' ]);


//mapUtilities.menuBarId = 'menu-bar';

// define screen layout of panels
mapUtilities.floatingPanelPositions = {
    'legend-panel': function(el, child, draggable, resizable) {
        openPos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#map-panel')
        };
        var closePos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#map-panel')
        };
        var h = 1.33 * jQuery('#map-panel').height()/3;
        var w = jQuery(window).width() / 2.1;
        var sizeOnRoll = 0.3;
        mapUtilities.registerPosition(el, w, h, openPos, closePos, sizeOnRoll, child, draggable, resizable);
    },
    'marker-info': function(el, child, draggable, resizable) {
        openPos = {
            my: 'right top',
            at: 'right bottom',
            of: jQuery('#menu-bar')
        };
        var closePos = {
            my: 'left top',
            at: 'right top',
            of: jQuery('#map-panel')
        };
        var h = jQuery('#map-panel').height();
        var w = 0.9 * (jQuery(window).width() -  jQuery('#map-panel').width());
        if (w < 650)
            w = 650;
        var sizeOnRoll = 1;
        mapUtilities.registerPosition(el, w, h, openPos, closePos, sizeOnRoll, child, draggable, resizable);
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
        var h = el.height();
        var w = jQuery('#marker-info').width();
        var sizeOnRoll = 1;
        mapUtilities.registerPosition(el, w, h, openPos, closePos, sizeOnRoll, child, draggable, resizable);
    }
}

<!-- make a Locator widget -->
IMu.Importer.add('OpenLayers');

IMu.ready(function()
{

    var w = window.innerWidth;
    // setup an IPM widget
    var locator = jQuery('#locator-viewer').width(w/2).height(w/3).
            IMu('locator-viewer',
            {
                'allowCollationBy'          : [ 'Name of Search',
                                                 'Title',
                                                 'Category',
                                                 'Condition',
                                                 'Location'],
                'anchorLegendOnMap'         : false,
                'clusterDistance'           : 1,
                'clusterPoints'             : true,
                'clusterThreshold'          : 1,
                'defaultCollation'          : 'Category',
                'layerPath'                 : '../../../../shared/client/images/layers',
                'moreDetailsDialog'         : false,
                'pointHighlightOnHover'     : true,
                'pointHighlightOnClick'     : true,
                'searchContext'             : 'locator',
                'showLayerSwitcher'         : true,
                'showStatusMessages'        : true,
                'skipOpeningCollator'       : true,
                'useInternalMarkerMaker'    : true,
                'useSimpleDetailDisplay'    : true

            }
    );

    // add main site layers
    locator.addLayer('Site Plan', 'Main Site');
    locator.addLayer('Ground Floor', 'Main Site');
    locator.addLayer('First Floor', 'Main Site');
    locator.addLayer('South Elevation', 'Main Site');
    locator.addLayer('West Elevation', 'Main Site');

    // add storage section layers
    locator.addLayer('Basement', 'Storage Section');
    locator.addLayer('Ground Floor', 'Storage Section');

    locator.setCoordRanges(0, 4000, 0, 4000, -5000, 5000);

    mapUtilities.setMapWidget(locator, false); 
    mapUtilities.addLegendPanel('legend-panel');
    mapUtilities.addMarkerInfoPanel('marker-info');
    mapUtilities.addFeatureDetailsPanel('feature-details');
    mapUtilities.addMapControlsItem('menu-controls');
    mapUtilities.addLayerSelector('layer-selector');
    mapUtilities.addGroupSelector('site-selector');
    mapUtilities.setMenuBar('menu-bar');
    mapUtilities.addClusterDistanceControl('cluster-distance', 600);

    IMu.Events.bind('imu-show', function()
    {
        runStandardSearch(locator, defaultSearchName);
    });


});
