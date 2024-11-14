(function(theme)
{
    theme.views.register('ipm-viewer', 'locator-viewer',
    {
        _source: 'shared/common/ipm-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.markerType = 'pie';
                self.sliceColourIndex = 0;
                self.sliceColours = {};
            },

            /*
            ** overrides map view widget method - main change is to not make
            ** the collator a floating dialog.
            */
            addCollator: function(collatorHolderId)
            {
                var self = this;
                if (jQuery('#' + collatorHolderId).length != 0)
                {
                    self.collatorHolder = jQuery('#' + collatorHolderId);
                    self.collatorHolder.attr('class', 'imu-collator-owner');
                }
            },

            /*
            ** overrides map view widget method - main change is to not make
            ** the legend a floating dialog
            */
            addLegend: function(legendHolderId)
            {
                var self = this;
                if (jQuery('#' + legendHolderId).length != 0)
                {
                    self.legendHolder = jQuery('#' + legendHolderId);
                    self.legendHolder.attr('class', 'imu-legend-owner');
                    self.legendHolder.draggable();
                    self.legendHolder.show();
                }
            },

            /*
            ** changePointSymbols
            ** redraw all points using current collation field.
            ** overrides map-view method
            */
            changePointSymbols: function (analysedData)
            {
                var self = this;

                var searchNameLabel = IMu.string('ipm-view-search-name-label');

                jQuery.each(
                    analysedData,
                    function(searchKey, search)
                    {
                        var pointLayers = self.map.getLayersByName(searchKey);
                        if (pointLayers.length > 0)
                        {
                            var layer = pointLayers[0];
                            var name = layer.name;
                            var data = analysedData[name];
                            if (data != undefined)
                            {
                                self.widget.setClustering(true);
                            }
                            layer.redraw();
                        }
                    }
                );
            },

            /*
            ** drawCollator
            ** draws a dialog that allows user to describe how points will be
            ** displayed.  Overrides map-view method.
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
                        if (self.widget.collateByOptions[category])
                        {
                            if (category == previousCollate)
                                selected = ' selected="selected"';
                            else
                                selected = '';

                            collateByOptions += '   <option value="' + category + '"' +
                                selected + '>' +
                                category + '</option>';
                        }
                    }

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
                                '<button id="' + okId +
                                '" class="imu-map-collate-ok">APPLY</button>' +
                        '</fieldset>';

                    self.collatorHolder.html(dialogHtml);
                    self.collatorHolder.show('slow');

                    jQuery('#' + okId).unbind('click').click(
                        function()
                        {
                            var newName = jQuery('#imu-map-search-name' +
                                                            uniqId).val();
                            var collateBy = jQuery('#imu-map-collate-by' +
                                                            uniqId).val();

                            searchDescription.displayName = newName;

                            var data = self.widget.setCollationCategory(
                                    searchName, collateBy);
                            self.drawLegend(data);
                            //self.collatorHolder.hide('slow').empty();
                        }
                    );
                }
                else
                    self.drawLegend(null);
            },


            /*
            ** drawLegend
            ** draw legend on screen
            ** overridden from map widget
            */
            drawLegend: function(analysedData)
            {
                var self = this;

                var searchNameLabel = IMu.string('ipm-view-search-name-label');
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
                        self.changePointSymbols(analysedData);

                        var searchNameLabel = IMu.string('ipm-view-search-name-label');
                        var categoryIdx = 0;
                        // for each search
                        jQuery.each(
                            analysedData,
                            function(searchName, searchDescription)
                            {
                                var collateBy = searchDescription.collateByCategory;

                                var subTitle = searchDescription.displayName;
                                if (collateBy != searchNameLabel)
                                    subTitle += ' ' +
                                    IMu.string('ipm-view-collate-prefix') + ' ' +
                                    collateBy;

                                var filter = self.widget.getCurrentFiltersAsString();
                                if (filter != '')
                                    subTitle += ', ' +
                                    IMu.string('ipm-view-filter-prefix') + ' ' +
                                        filter;

                                var searchIdx = self.widget.uniqueId + '-' +
                                                searchDescription.searchIndex;
                                var searchId = 'imu-legend-search-' + searchIdx;

                                self.legendHolder.find('legend').after(
                                    '<div id="' + searchId + '"' +
                                            ' class="imu-legend-subtitle">' +
                                            subTitle +
                                            ' <img class="imu-legend-configure-category" ' +
                                                   'id="imu-legend-configure-' +
                                                   searchIdx + '"' +
                                            ' />' +
                                            '</div>');

                                
                                if (self.widget.hasCollator)
                                {
                                    var icon = IMu.Request.getURL('Image') +
                                                '&name=mapicons/configure_off';
                                    jQuery('#imu-legend-configure-' + searchIdx).css(
                                            {
                                                'background-image': 'url(' + icon + ')'
                                            }
                                    ).click(
                                        function()
                                        {
                                            self.drawCollator(
                                                searchDescription, searchName
                                            );
                                        }
                                    );
                                }
                                else
                                {
                                    // no collator open icon
                                    jQuery('#imu-legend-configure-' + searchIdx).hide();
                                }

                                self.legendHolder.show('slow');

                                // sort each set of distinct values in the collateby field
                                var legendItems = searchDescription.categories[collateBy].distinctValues;
                                var keys = [];
                                for (var key in legendItems)
                                {
                                    if (legendItems.hasOwnProperty(key))
                                        keys.push(key);
                                }
                                keys.sort();

                                var outstandingIcons = 0;
                                // add distinct values as legend entry
                                for (var i = 0; i < keys.length; i++)
                                {
                                    var key = keys[i];
                                    var collateBy = searchDescription.collateByCategory;
                                    var category = searchDescription.categories[collateBy];
                                    var uniqueValue = legendItems[key];


                                    var entryId = 'imu-legend-item-' +
                                        self.widget.uniqueId + '-' +
                                        categoryIdx;
                                    var iconId = 'imu-legend-icon-' +
                                        self.widget.uniqueId + '-' +
                                        categoryIdx;
                                    var displayName = '';
                                    if (collateBy != searchNameLabel)
                                        displayName = uniqueValue.value;

                                    var uniqueItemKey = searchName + ':' +
                                        collateBy + ':' +
                                        displayName;


                                    // set class of legend item if concept is filtered
                                    var legDIClass = 'imu-legend-data-item';
                                    var field = category.fieldName;
                                    var filteredCategories = self.widget.getFilterChoices(field);
                                    if (filteredCategories != undefined)
                                    {
                                        if (filteredCategories[displayName] != undefined)
                                        {
                                            if (filteredCategories[displayName].inFilter)
                                                legDIClass += ' ipm-filter-matches-true';
                                            else    
                                                legDIClass += ' ipm-filter-matches-false';
                                        }
                                    }


                                    self.legendHolder.find( '#' + searchId).
                                        append(
                                                '<div id="' + entryId + '"' + ' style="float:left" ' +
                                                '   class="' + legDIClass + '">' +

                                                ' <div id="' + iconId + '"' + 
                                                '   class="imu-legend-data-item-icon">' +
                                                ' </div>' +
                                                ' <div' +
                                                '   class="imu-legend-data-item-text">' +
                                                '   <span class="imu-legend-data-item-name">' +
                                                displayName +
                                                '   </span>' +
                                                ' </div>' +
                                                '</div>');
                                                jQuery('#' + entryId).attr('data-key', uniqueItemKey);

                                    var shape = {
                                        'colour': self.getSliceColour(key), 
                                        'shape': 'pie'
                                    };
                                    if (searchDescription['symbolShape'] != undefined)
                                        shape.shape = searchDescription['symbolShape'];

                                    if (! self.useShapeDrawer)
                                    {
                                        // use OpenLayers to draw the icon
                                        self.makeLegendVector(
                                                iconId,
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
                                        outstandingIcons++;
                                        var url = self.makeLegendIcon(shape.shape, shape.colour, 20);
                                        jQuery('#' + iconId).html('<img src="' + url + '"/>');

                                        // alert that the last icon has been
                                        // loaded (useful for screen
                                        // animations)
                                        if (i >= (keys.length - 1))
                                        {
                                           jQuery('#' + iconId + ' img').load(function()
                                           {
                                               setTimeout( function() {
                                                IMu.Events.trigger('ipm-viewer-legend-icons-loaded');
                                               }, 10);
                                           });
                                        }
                                    }
                                    categoryIdx++;
                                }
                            }
                        );
                    }
                }
                else if (self.widget.legendDisplayFunction)
                {
                    self.widget.legendDisplayFunction(self, legendData);
                    self.changePointSymbols(analysedData);
                }

                // set up collator triggering from legend
                jQuery.each( analysedData, function(searchName, searchDescription) {
                                self.makeCollatorControl(searchDescription, searchName); 
                });
            },

            /*
            ** Check if a given feature is outside the current base layer
            ** extent (including vertical range).
            */
            featureOutsideBaseLayer: function(feature, baseLayer)
            {
                var self = this;

                var baseLayer = self.getBaseLayer();
                var layerProperties = baseLayer.ke;
                if (layerProperties == undefined)
                {
                        return false;
                }

                // manipulate display coordinates of feature based on direction
                // of view
                var projectedFeature = self.widget.changeFeatureElevationCoordinates(
                    layerProperties, feature);

                var outside = self.widget.featureOutsideVerticalRange(
                            projectedFeature, layerProperties);

                return outside;
            },

            /*
            ** Return the currently used collation category used to group data
            */
            getCollateByCategory: function(searchName)
            {
                var self = this;

                var collateBy = 'Name of Search';
                if (self.widget.analysedData[searchName] != undefined)
                    collateBy = self.widget.analysedData[searchName]['collateByCategory'];
                else if (self.options.defaultCollation != undefined)
                    collateBy = self.options.defaultCollation;
                return collateBy;
            },

            /*
            ** get a suitable radius of marker to use when drawing a given
            ** feature.
            */
            getFeatureGraphicWidth: function (feature)
            {
                var self = this;

                var count = self.getFeatureTotalCount(feature);
                return self.mapCountToRadius(count);
            },

            /*
            **  return a list of features that have been clustered together
            **  into a single feature.  (If not clustered returns the given
            **  feature).
            */
            getFeaturePointList: function(feature)
            {
                var self = this;

                var fList = [];
                if (! feature.cluster)
                    fList.push(feature);
                else
                    fList = feature.cluster;

                var pointList = [];
                jQuery.each( fList, function(idx, f)
                {
                    pointList.push(f.attributes);
                });
                return pointList;
            },

            /*
            **  The label to draw with the feature
            */
            getFeatureMarkerLabel: function (feature)
            {
                var self = this;

                return '';
            },

            /*
            ** find the total count of items in a given feature by looking at
            ** the recorded count for all features in the cluster.
            */
            getFeatureTotalCount: function(feature)
            {
                var self = this;

                var pointList = self.getFeaturePointList(feature);
                if (pointList.length < 1)
                    return 0;
                if ((pointList[0].source == 'etrapevents'))
                {
                    var count = 0;
                    jQuery.each(
                        pointList, function(idx, trapEvent)
                        {
                            var data = trapEvent.rawRow;
                            var trapCount = data['TrapCount'];
                            if (trapCount != undefined)
                            count += trapCount;
                        }
                    );
                    return count;
                }
                else if (! feature.cluster)
                    return 1;
                else    
                    return feature.cluster.length;
            },

            /*
            **  Overridden from map view method.  
            */
            getFeatureWobble: function(feature, coord)
            {
                var self = this;
                var width = self.getFeatureGraphicWidth(feature);
                return width / -2 ;
            },

            /*
            ** find the maximum item count of any clustered feature.
            */
            getMaxCount: function()
            {
                var self = this;

                var maxCount = 0;
                var layers = self.getPointLayers();
                for (var i = 0; i < layers.length; i++)
                {
                    var layer = layers[i];
                    if (! self.isLayerTrapEventData(layer))
                        continue;
                    for (var j = 0; j < layer.features.length; j++)
                    {
                        var feature = layer.features[j];
                        var count = self.getFeatureTotalCount(feature);
                        if ((maxCount == 0) || (count > maxCount))
                            maxCount = count;
                    }
                }
                self.widget.maxCount = maxCount;
                return maxCount;
            },

            /*
            ** find the minimum item count of any clustered feature.
            */
            getMinCount: function()
            {
                var self = this;

                var minCount = undefined;
                var layers = self.getPointLayers();
                for (var i = 0; i < layers.length; i++)
                {
                    var layer = layers[i];
                    if (! self.isLayerTrapEventData(layer))
                        continue;
                    for (var j = 0; j < layer.features.length; j++)
                    {
                        var feature = layer.features[j];
                        var count = self.getFeatureTotalCount(feature);
                        if ((minCount == undefined) || (count < minCount))
                            minCount = count;
                    }
                }
                self.widget.minCount = minCount;
                return minCount;

            },

            /*
            ** get a count of all items displayed (by looking at all features
            ** within clusters and adding the recorded count for each one)
            */
            getTotalsCount: function()
            {
                var self = this;

                var total = 0;
                var layers = self.getPointLayers();
                for (var i = 0; i < layers.length; i++)
                {
                    var layer = layers[i];
                    if (! self.isLayerTrapEventData(layer))
                        continue;
                    for (var j = 0; j < layer.features.length; j++)
                    {
                        var feature = layer.features[j];
                        var count = self.getFeatureTotalCount(feature);
                        total += count;
                    }
                }
                return total;
            },

            /*
            ** Return the colour to draw a particular slice (described by a key
            ** string).  If the 'key' hasn't yet been assigned a colour, pick a
            ** suitable colour.
            */
            getSliceColour: function (key)
            {
                var self = this;
                if (self.sliceColours[key] == undefined)
                {
                    var idx = self.sliceColourIndex % self.widget.markerColours.length;
                    var colourHex = self.widget.markerColours[idx];
                    colourHex = colourHex.replace(/^#/, '');
                    self.sliceColours[key] = colourHex;
                    self.sliceColourIndex++;
                }
                return self.sliceColours[key];
            },

            /*
            ** Detect if a layer is data from etrapevents because we need to
            ** treat this data in a special way.
            */
            isLayerTrapEventData: function(layer)
            {
                    var self = this;
                    var features = self.getLayerFeatures(layer);
                    for (var i = 0; i < features.length; i++)
                    {
                        var f = features[i]; 
                        if (f.attributes.source == 'etrapevents')
                            return true;
                    }
                    return false;
            },

            /*
            ** Overridden from map-view.  Make a suitable pie chart symbol to
            ** represent the list of points (if it is trapevent data).
            ** Otherwise use the standard map/locator marker drawing mechanism.
            */
            makeClusteredMarkerUrl: function(pointList)
            {
                var self = this;
                var url = 'brokenimage';

                if (pointList.length < 1)
                {
                    url = self._super.apply(self, arguments);
                    return url;
                }

                var collateBy = 'Name of Search';
                if (self.options.defaultCollation != undefined)
                    collateBy = self.options.defaultCollation;
                
                if (pointList[0].source == 'etrapevents')
                {
                    var counts = [];
                    var colours = [];
                    var countCategory = {};
                    for (var i = 0; i < pointList.length; i++)
                    {
                        var contentItem = pointList[i];
                        var searchName = contentItem['searchName'];
                        if (self.widget.analysedData[searchName] != undefined)
                            collateBy = self.widget.analysedData[searchName]['collateByCategory'];

                        var collateValue = IMu.string('map-unspecified-value');
                        if (contentItem.rawRow[collateBy] != undefined)
                            collateValue = contentItem.rawRow[collateBy];
                        if (countCategory[collateValue] == undefined)
                            countCategory[collateValue] = 0;
                        countCategory[collateValue] += contentItem.rawRow['TrapCount'];
                    } 

                    var maxCount = 0;
                    jQuery.each(countCategory, function(collateValue, count)
                    {
                        var colour = self.getSliceColour(collateValue);
                        colours.push(colour);
                        counts.push(count);
                        if (count > maxCount)
                            maxCount = count;
                    });
                    if (counts.length > 0)
                    {
                        url = IMu.path + '/request.php?request=ChartDraw' +
                            '&type=' + self.markerType +
                            '&values=' + counts.join(',') +
                            '&colours=' + colours.join(',') +
                            '&radius=';

                        if (self.markerType == 'bar')
                            url += '500&denom='+ maxCount;
                        else
                            url += '250';
                    }
                    else
                    {
                        url = self._super.apply(self, arguments);
                    }
                }
                else
                {
                    // drawing non trap event data
                    for (var i = 0; i < pointList.length; i++)
                    {
                        var contentItem = pointList[i];
                        if (contentItem.rawRow != undefined)
                        {
                            var symbol = undefined;
                            var searchName = contentItem['searchName'];
                            if (self.widget.analysedData[searchName] != undefined)
                            {
                                collateBy = self.widget.analysedData[searchName]['collateByCategory'];
                                symbol = self.widget.analysedData[searchName]['symbolShape'];
                            }
                            // this should't happen...
                            if (symbol == undefined)
                                symbol = 'x';

                            var collateValue = searchName;
                            if (contentItem.rawRow[collateBy] != undefined)
                                collateValue = contentItem.rawRow[collateBy];
                            var colour = self.getSliceColour(collateValue);
                            contentItem.colour = colour;
                            contentItem.shape = symbol;
                        }
                    }
                    url = self._super.apply(self, arguments);
                }

                return url;

            },

            /*
            **  turn raw count data into a suitable radius to draw markers with.
            */
            mapCountToRadius: function(count)
            {
                var self = this;
                var method = 'Linear';

                var maxRad = self.widget.maximumMarkerSize;
                var minRad = self.widget.minimumMarkerSize;

                var maxCount = self.widget.maxCount;
                if ((maxCount == 0) || (maxCount == undefined))
                    maxCount = self.getMaxCount();

                if (maxCount == 0)
                    return minRad;

                var radius = maxRad;
                switch (method)
                {
                    case 'ExpGrowth':
                            radius = maxRad * (1 - Math.pow(Math.E, (-2*count/maxCount)));
                            break;
                    case 'Log':        
                            radius = maxRad * (1 + Math.log(count/maxCount));
                            break;
                    case 'Linear':        
                            radius = maxRad * count / maxCount;
                            break;
                    case 'Fixed' :
                    default:
                            radius = count;
                            break;
                }
                
                if (radius < minRad)
                    return minRad;
                if (radius > maxRad)
                    return maxRad;
                
                return radius;
            },

            /*
            ** record the wanted marker type (typically 'pie' or 'bar')
            */
            setMarkerType: function(type)
            {
                var self = this;
                self.markerType = type;
            },

            /*
            **  Draw a suitable dialog to describe a marker.
            */
            showToolTip: function (features, triggeringEvent)
            {
                var self = this;

                if (self.widget.markerDisplayFunction !== undefined)
                    return self.widget.markerDisplayFunction(self, features, triggeringEvent);

                // make a structure representing the marker data and trigger an
                // event saying the marker has been selected and pass the
                // created object

                // we have to jump thru a few hoops to get the mouse coords...
                var triggeringControl = triggeringEvent.object;
                var mouseEvent = triggeringControl.handlers.feature.evt;

                var events = {};
                for (var i = 0; i < features.length; i++)
                {
                    var rid = features[i].attributes.rawRow['rid'];
                    events[rid] = true;
                }

                var markerDetails = {
                    'fieldValues': {},
                    'trapEvents': Object.keys(events).length,
                    'trapEventDetails' : {},
                    'markerElement': jQuery(mouseEvent.toElement),
                    'mouseEvent': mouseEvent
                };

                var minDate = self.widget.parseStringToDate('01/01/2099');
                var maxDate = self.widget.parseStringToDate('01/01/1900');

                for (var i = 0; i < features.length; i++)
                {
                    var feature = features[i];
                    var searchName = feature.attributes['searchName'];
                    var collateBy = self.getCollateByCategory(searchName);
                    var collateValue = feature.attributes.rawRow[collateBy];
                    if ((! collateValue) || (collateValue == 'undefined'))
                        collateValue = 'not specified';

                    if (markerDetails['fieldValues'][collateValue] == undefined)
                        markerDetails['fieldValues'][collateValue] = {
                            'count': 0,
                            'datesChecked': {},
                            'dateRange': [],
                            'trapEvents': {}
                        };
                    var trapCount = feature.attributes.rawRow['TrapCount'];
                    var trapRid = feature.attributes.rawRow['rid'];

                    var trapDate = feature.attributes.rawRow['DateChecked'];
                    var trapDateObj = self.widget.parseStringToDate(trapDate);

                    if (trapDateObj < minDate)
                        minDate = trapDateObj;
                    if (trapDateObj > maxDate)
                        maxDate = trapDateObj;

                    if (markerDetails['trapEventDetails'][trapRid] == undefined)
                        markerDetails['trapEventDetails'][trapRid] = trapDate;

                    markerDetails['fieldValues'][collateValue]['count'] += trapCount;

                    if (markerDetails['fieldValues'][collateValue]['trapEvents'][trapRid] == undefined)
                        markerDetails['fieldValues'][collateValue]['trapEvents'][trapRid] = trapDate;

                    if (markerDetails['fieldValues'][collateValue]['datesChecked'][trapDate] == undefined)
                        markerDetails['fieldValues'][collateValue]['datesChecked'][trapDate] = 0;
                    markerDetails['fieldValues'][collateValue]['datesChecked'][trapDate]++;

                    var colour = self.getSliceColour(collateValue);
                    markerDetails['fieldValues'][collateValue]['colour'] = colour;

                    // where should these come from?
                    var shape = 'pie';
                    var radius = 20;
                    markerDetails['fieldValues'][collateValue]['icon'] = self.makeLegendIcon(shape, colour, radius)
                } 
                if (features.length > 0)
                    markerDetails['dateRange'] = [ 
                        self.widget.parseDateToString(minDate),
                        self.widget.parseDateToString(maxDate) ];

                self.triggerEvent('marker-selected', markerDetails, mouseEvent);
            },

            triggerEvent: function(localEventName, data)
            {
                IMu.Events.trigger('ipm-viewer-' + localEventName, data);
            }
        }

    });
})(IMu.Themes.shared);
