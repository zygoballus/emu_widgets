<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/

require_once dirname(__FILE__) . '/Request.php';

$class = 'WebReport';
class WebReport extends WebRequest
{
	public function
	process($request)
	{
		parent::process($request);

        if (! isset($request['method']))
		{
			$e = new IMuException('WebReportNoMethod');
			$e->setCode(400);
            throw $e;
		}
		IMuTrace::write(3, 'WebReport: request %s', $request);

        $method = $this->getMethod($request);
        $params = $this->getParams($request);

        $result = $this->$method($params);
		header('Content-type: text/html');
        print $result;
	}

	protected function
	method_mapReport($params)
	{
		$relPath = '.';
		$j_DATA = json_encode($_POST);
		if (array_key_exists('emudata', $_GET))
			$j_DATA = json_encode($_GET);

		return <<<HTML
<!DOCTYPE html>
<html>
<!--
** Copyright (c) 2012-2013 KE Software Pty Ltd
-->
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>IMu Map Report</title>
<script src="http://maps.google.com/maps/api/js?v=3.7&sensor=false"></script>
<script type="text/javascript" src="$relPath/imu.php"></script>

<!-- THESE 2 NOT RIGHT BUT NEEDED FOR THE MOMENT -->
<script type="text/javascript" src="$relPath/dist/common/OpenLayers-2.12/OpenLayers.js"></script>
<script type="text/javascript" src="$relPath/dist/common/ScaleBar.js"></script>
<script type="text/javascript" src="$relPath/dist/common/jquery-ui-1.9.0.custom/js/jquery-ui-1.9.0.custom.min.js"></script>

<style>
    #table { width: 100%; }
    #table td { vertical-align: top; width: 50%; height: 40%; }
    td div { margin: auto; }
    td h1, td h2, td h3, td h4, td p { text-align: center; }
</style>

</head>
<body>
<h2>IMu Map Report</h2>

<hr/>

<table id="table">
    <tr>
        <td>
            <h4>EMu Data</h4>
            <div id="map-viewer-dynamic-image"> </div>
        </td>
		<td>
            <div id="map-viewer-dynamic-image-collator"> </div>
            <div id="map-viewer-dynamic-image-legend"> </div>
		</td>
    </tr>
</table>
<hr/>

<script type="text/javascript">

IMu.ready(function()
{

    var widgetHeight = 500;
    $('#language-selector').IMu('language-selector');

    //------------------------------------------------------------------------
    // Map with the works.  Turn on lots of options
    var imuMapWidget = $('#map-viewer-dynamic-image')
				.height(widgetHeight).width(widgetHeight).IMu(
        'map-viewer',
        {
            // turn on many options
            addZoomToShowAllControl:    true,
            anchorLegendOnMap:          false,
            clearSearchResults:         true,
			clusterPoints:              true,
            initialExtentLBRT:       [ -180, -50, 180, 50 ],
            pointHighlightOnClick:      true,
            pointHighlightOnHover:      true,
            showLayerSwitcher:          true,
            showMouseCoordinates:       true,
            showScalebar:               true,
            showStatusMessages:         true,
			useInternalMarkerMaker:		true,
			useSimpleDetailDisplay:		true,
            // Needed if mixing EPSG:900913 projected layers (eg
            // Google/Bing/Yahoo) with EPSG:4326 lat/long layers.
            useSphericalMercator:       true,
            zoomToAllInitially:         true
        }
    );

    // associate a legend and 'collator' div with map
    imuMapWidget.addLegend('map-viewer-dynamic-image-legend');
    imuMapWidget.addCollator('map-viewer-dynamic-image-collator');

    // add several base layers
    imuMapWidget.addLayer('google-physical');
    imuMapWidget.addLayer('google-streets');
    imuMapWidget.addLayer('google-satellite');
    imuMapWidget.addLayer('google-hybrid');
    imuMapWidget.addLayer('bing-aerial');
    imuMapWidget.addLayer('bing-aerial-labels');
    imuMapWidget.addLayer('bing-road');
    imuMapWidget.addLayer('openlayers-wms');


	var _DATA = $j_DATA;
	var emuData = jQuery.parseJSON(_DATA.emudata);

	jQuery.each(emuData, function(module, irnList)
	{

		var keys = [];
		jQuery.each(irnList, function(idx, irn)
		{
			irn = parseInt(irn);
			keys.push([module, irn]);
		});
		var hardSearch = new IMu.Request.Search();
		hardSearch.findKeys( keys, function(hits)
		{
			hardSearch.labelName = 'EMu Map Report';
			imuMapWidget.showSearch(hardSearch);
		});
	});

});
</script>

</body>
</html>
HTML;
	}

}
?>
