var defaultSearchName = 'Pest Report';
//define marker size parameters
var initialMinSize = 20;
var initialMaxSize = 80;
var absMinSize = 20;
var absMaxSize = 300;


var mapUtilities = MapUtility;
var ipmUtilities = IPMUtility;

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
    'filter-panel': function(el, child, draggable, resizable) {
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
        var h = (2/3) * jQuery('#map-panel').height();
        var w = 0.9 * (jQuery(window).width() -  jQuery('#map-panel').width());
        if (w < 650)
            w = 650;
        var sizeOnRoll = 1;
        mapUtilities.registerPosition(el, w, h, openPos, closePos, sizeOnRoll, child, draggable, resizable);
    },
    'marker-info': function(el, child, draggable, resizable) {
        var openPos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#filter-panel')
        };
        var closePos = {
            my: 'left top',
            at: 'left bottom',
            of: jQuery('#filter-panel')
        };
        var h = el.height();
        var w = jQuery('#filter-panel').width();
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

function makeDataFilteringPanel(ipm)
{
    ipmUtilities.setupFilterPanel('filter-panel');
    ipmUtilities.addFilterSwitcher(
                    'category-selector',
                    {
                        EcologicalType: 'filter-ecological-type-wrapper',
                        CommonName: 'filter-common-name-wrapper',
                        Species: 'filter-species-wrapper'
                    }
    );
    ipmUtilities.addFilterSelect('filter-ecological-type-wrapper', 'EcologicalType');
    ipmUtilities.addFilterSelect('filter-common-name-wrapper', 'CommonName');
    ipmUtilities.addFilterSelect('filter-species-wrapper', 'Species');
    ipmUtilities.addFilterSelect('filter-life-stage-wrapper', 'LifeStage');
    ipmUtilities.addFilterSelect('filter-date-checked-wrapper', 'DateChecked');
    ipmUtilities.addFilterClearAll('clear-all-holder', 'Clear All');
    ipmUtilities.addAnimationButton('step-time-forward',
                                     'filter-date-checked-wrapper',
                                     'forwardOne');
    ipmUtilities.addAnimationButton('step-time-backward',
                                     'filter-date-checked-wrapper',
                                     'backwardOne');
    ipmUtilities.addAnimationButton('animate-time-forward',
                                     'filter-date-checked-wrapper',
                                     'forwardAll');
    ipmUtilities.addAnimationButton('animate-time-backward',
                                     'filter-date-checked-wrapper',
                                     'backwardAll');
    ipmUtilities.addAnimationButton('animate-loop',
                                     'filter-date-checked-wrapper',
                                     'forwardLoop');
    ipmUtilities.addAnimationStopButton('animate-stop');
    ipmUtilities.addAnimationSpeedInput('step-speed-1', 500);
    ipmUtilities.addAnimationSpeedInput('step-speed-2', 1500);
    ipmUtilities.addAnimationSpeedInput('step-speed-3', 3500);
    ipmUtilities.addAnimationSpeedInput('step-speed-4', 4500);
}


<!-- make an IPM widget -->
IMu.Importer.add('OpenLayers');

IMu.ready(function()
{

    var w = window.innerWidth;
    // setup an IPM widget
    var ipm = jQuery('#ipm-viewer').width(w/2).height(w/3).
            IMu('ipm-viewer',
            {
                'allowCollationBy'          : [ 'EcologicalType',
                                                 'CommonName',
                                                 'Species',
                                                 'LifeStage' ],
                'anchorLegendOnMap'         : false,
                'clusterDistance'           : 1,
                'clusterPoints'             : true,
                'clusterThreshold'          : 1,
                'defaultCollation'          : 'CommonName',
                'layerPath'                 : '../../../../shared/client/images/layers',
                'moreDetailsDialog'         : false,
                'pointHighlightOnHover'     : false,
                'pointHighlightOnClick'     : true,
                'searchContext'             : 'ipm',
                'showLayerSwitcher'         : true,
                'showStatusMessages'        : true,
                'skipOpeningCollator'       : true,
                'useInternalMarkerMaker'    : true,
                'useSimpleDetailDisplay'    : true

            }
    );

    // add main site layers
    ipm.addLayer('Site Plan', 'Main Site');
    ipm.addLayer('Ground Floor', 'Main Site');
    ipm.addLayer('First Floor', 'Main Site');
    ipm.addLayer('South Elevation', 'Main Site');
    ipm.addLayer('West Elevation', 'Main Site');

    // add storage section layers
    ipm.addLayer('Basement', 'Storage Section');
    ipm.addLayer('Ground Floor', 'Storage Section');

    ipm.setCoordRanges(0, 4000, 0, 4000, -5000, 5000);

    mapUtilities.setMapWidget(ipm, true); 
    mapUtilities.addLegendPanel('legend-panel');
    mapUtilities.addMarkerInfoPanel('marker-info');
    mapUtilities.addFeatureDetailsPanel('feature-details');
    mapUtilities.addMapControlsItem('menu-controls');
    mapUtilities.addLayerSelector('layer-selector');
    mapUtilities.addGroupSelector('site-selector');
    mapUtilities.setMenuBar('menu-bar');
    mapUtilities.addClusterDistanceControl('cluster-distance', 600);

    ipmUtilities.setMapWidget(ipm, mapUtilities); 
    ipmUtilities.addMarkerSizeControl('marker-size',
                                         initialMinSize,
                                         initialMaxSize,
                                         absMinSize,
                                         absMaxSize);

    ipmUtilities.addMarkerSizeDisplay('sizes');
    makeDataFilteringPanel(ipm);

    IMu.Events.bind('imu-show', function()
    {
        runStandardSearch(ipm, defaultSearchName);
    });


});
