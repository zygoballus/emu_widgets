'use strict'
/*****************************************************************************
** This is a simple Nodejs script for generating IMu2.0 Locator configuration
** and API calls to move IPMv1 systems to IMu2.0.
**
** It generates new config values and suggested API calls and prints them to
** STDOUT
**
** Usage:
**    node ipm2_config_conversion.js
**
** The IPMv1 config.js file must be in the same directory as the script.
** Requires NodeJS with 'fs', 'util' and 'filepath' modules accessible.
******************************************************************************/

var fs = require('fs');
var util = require('util');

// if not installed get using: "npm install filepath"
var FP = require('filepath');


// declare the IPMv1 config object
var imu = {
    'ipm': {
        'sites': {
        }
    }
};

// read original IPMv1 config file
var file = __dirname + '/config.js';
var filedata = fs.readFileSync('./config.js','utf8');
eval(filedata);

// generate IMu2 locator config values
var locator = {};

// assumed settings...
locator.moreDetailsDialog = true;
locator.pointHighlightOnHover = true;
locator.showMouseCoordinates = true;
locator.singleShot = true;

// get max ranges
var maxX = undefined;
var minX = undefined;
var maxY = undefined;
var minY = undefined;
var maxZ = undefined;
var minZ = undefined;
var sites = imu.ipm.sites;
for (var group in sites) {

    maxX = checkMaxRange(maxX, 'sitemaxx', sites);
    maxX = checkMaxRange(maxX, 'maxx', sites);
    minX = checkMinRange(minX, 'siteminx', sites);

    maxY = checkMaxRange(maxY, 'sitemaxy', sites);
    maxY = checkMaxRange(maxY, 'maxy', sites);
    minY = checkMinRange(minY, 'siteminy', sites);

    maxZ = checkMaxRange(maxY, 'sitemaxz', sites);
    minZ = checkMinRange(minY, 'siteminz', sites);

}

// extract layers from IMuv1 config data
var groups = {};
for (var group in sites) {

    var layersPathExtent = processLayer(group, sites, minX, maxX, minY, maxY, minZ, maxZ);
    var layers = layersPathExtent[0];
    var path = layersPathExtent[1];
    locator.layerPath = path;

    groups[group] = layers;
    locator['layers'] = layers;

    var bounds = layersPathExtent[2];
    if (bounds[0] < minX)
        minX = bounds[0];
    if (bounds[1] < minY)
        minY = bounds[1];
    if (bounds[2] < minZ)
        minZ = bounds[2];
    if (bounds[3] > maxX)
        maxX = bounds[3];
    if (bounds[4] > maxY)
        maxY = bounds[4];
    if (bounds[5] > maxZ)
        maxZ = bounds[5];
}

locator['coordRanges'] = {
    x : [minX, maxX],
    y : [minY, maxY],
    z : [minZ, maxZ]
};


// dump new config structure
console.log('/*');
console.log('** IMu2.0 Locator Widget config file generated from IPMv1 config file.');
console.log('*/');
console.log(' IMu.Config.Locator = ' + util.inspect(locator, {depth:null}) + ';');


// generate suitable IMu2 Locator widget API calls
console.log("##");
console.log("## add the following calls to the widget to replicate IPMv1 setup using IMu2...");
console.log("##");
for (var group in groups) {
    var layers = groups[group];
    for (var i = 0; i < layers.length; i++){
        var layer = layers[i];
        console.log("myIpmWidget.addLayer('" + layer['name'] + "', '" + group + "');"  );
    }
}
console.log(
    'myIpmWidget.setCoordRanges(' +
            + minX + ',' + maxX +
            ',' + minY + ',' + maxY +
            ',' + minZ + ',' + maxZ +  ');'
           );

var colours = imu.ipm.MAP_OPTIONS['colourmap'];

var stdColours = ['#F1683C', '#2AD62A', '#DBDC25', '#8FBC8B', '#D2B48C',
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
                  '#F87114', '#9D53BB', '#02DE84', '#79053C'];

var oldLength = colours.length;                  
var minAcceptableColours = 40;                  
console.log('# Need at least: ', minAcceptableColours, 'colours.');
console.log('# Old configuration has:', oldLength, 'colours defined.');
if (oldLength < minAcceptableColours ) {
    console.log('# Adding extra colours to originals as original configured set' +
                ' too small.');
    colours = colours.concat(stdColours);
}
else
    console.log('# not adding any extra colours.');

var coloursUsed = {};
var coloursToUse = [];
for (var i = 0; i < colours.length; i++)
{
    var c = colours[i];
    if (! c.match(/#/))
        c = '#' + c;
    if (coloursUsed[c] == undefined) {
        coloursUsed[c]++;
        coloursToUse.push(c);
    }
}
console.log('myIpmWidget.setMarkerColours(' +  util.inspect(coloursToUse) + ');');

/**********  DONE  ************************/

function processLayer(group, sites, xMin, xMax, yMin, yMax, zMin, zMax)
{
    var newLayers = [];
    var path = undefined;
    var layers = sites[group]['layers'];
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        var scale = [1, 1, 1];
        var layerId = layer['id'];
        var name = layer['label'];
        var source = layer['src'];

        var size = layer['size'];
        var section = layer['section'];
        var bounds = layer['bounds'];
        var x0 = bounds[0];
        var y0 = bounds[1];
        var x1 = bounds[2];
        var y1 = bounds[3];

        var filePath = FP.newPath(source);
        var src = filePath.basename().toString();
        path = filePath.dirname().toString();

        var elevation = layer['elevation'];
        if (elevation == undefined)
            elevation = 'top';

        var z0 = layer['zmin'];
        var z1 = layer['zmax'];

        if (z0 == undefined)
            z0 = zMin;
        if (z1 == undefined)
            z1 = zMax;

        if (x0 < xMin )
            xMin = x0;
        if (y0 < yMin )
            yMin = y0;
        if (z0 < zMin )
            zMin = z0;
        if (x1 > xMax )
            xMax = x1;
        if (y1 > yMax )
            yMax = y1;
        if (z1 > zMax )
            zMax = z1;

        var newLayer = {
            name: name,
            layerId: layerId,
            src: src,
            size: size,
            bounds: [ x0, y0, z0, x1, y1, z1 ],
            scale: scale,
            elevation: elevation
        };
        newLayers.push(newLayer);
    }
    return [ newLayers, path, [ xMin, yMin, zMin, xMax, yMax, zMax ] ];
}


function checkMaxRange(currentMax, oldname, sites)
{
    var oldMax = sites[group]['opts'][oldname];
    if (currentMax == undefined)
        currentMax = oldMax
    else if (oldMax > currentMax)
        currentMax = oldMax;
    return currentMax;
}    

function checkMinRange(currentMin, oldname, sites)
{
    var oldMin = sites[group]['opts'][oldname];
    if (currentMin == undefined)
        currentMin = oldMin
    else if (oldMin < currentMin)
        currentMin = oldMin;
    return currentMin;
}    
