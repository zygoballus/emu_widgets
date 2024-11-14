var MapUtility = {

    activeSearchName: undefined,
    clusterDistanceId: undefined,
    collapseIcon: './images/blue_arrow_up.png',
    context: '',
    detailFields: [],
    floatingOpacity: 0.9,
    floatingPanelPositions: {},
    layerSelectorId: undefined,
    legendPanelId: undefined,
    mapControlsId: undefined,
    mapWidget: undefined,
    markerInfoPanelId: undefined,
    maxClusterPixels: 500,
    menuBarId: undefined,
    rollablePanels: {},
    settingsIcon: './images/settings.png',
    uncollapseIcon: './images/blue_arrow_down.png',
    useResizablePanels: false,

    addClusterDistanceControl: function(id, maxPixels)
    {
        var self = this;

        self.maxClusterPixels = maxPixels;
        self.clusterDistanceId = id;
    },

    addFeatureDetailsPanel: function(id)
    {
        var self = this;
        self.featureDetailsId = id;
    },

    addGroupSelector: function(id)
    {
        var self = this;
        IMu.Events.bind('imu-show', function() {
            self.makeGroupSelector(id);
        });
    },

    addLayerSelector: function(id)
    {
        self = this;
        jQuery('#' + id).addClass('olControlLayerSwitcher');
        self.layerSelectorId = id;
        self.mapWidget.addCustomLayerSwitcher(self.layerSelectorId);
    },

    addLegendPanel: function(id)
    {
        self = this;
        self.legendPanelId = id;
    },

    addMapControlsItem: function(id)
    {
        self = this;
        self.mapControlsId = id;
    },

    addMarkerInfoPanel: function(id)
    {
        var self = this;
        self.markerInfoPanelId = id;
    },

    /*
    ** Make a toolbar where information or control panels can be docked into or out.
    */
    addPanelToToolBar: function(divId, heading, menuBarId)
    {
        var self = this;

        jQuery('#' + divId).prepend('<div class="menu-header-bar"><span>' + heading + '</span></div>'); 

        // add the collapse icon to panel
        var header = jQuery('#' + divId + ' .menu-header-bar');

        if (header.find('.collapse-icon').length == 0)
        {
            // collapse panels to toolbox
            header.append(
                 '<img class="collapse-icon" src="' + self.collapseIcon + '"/>');

            // add behaviour to toggle panel display
            header.find('img').click(function(evt) {
                    self.togglePanelAndToolBar(divId);
            });
        }

        var expanderId = 'expander-' + divId;
        if (jQuery('#' + expanderId).length == 0)
        {
            // add spot for each panel in the toolbox            
            var expanderId = 'expander-' + divId;
            jQuery('#' + menuBarId).append( '<span class="expander" id="' +
                    expanderId + '"><span class="menu-heading">' +
                    heading +
                    '</span>' +
                    '<img class="collapse-icon" src="' + self.uncollapseIcon + '"/>' +
                    '</span>');

            // add behaviour to toggle panel display
            jQuery('#' + expanderId + ' img').click(function(evt) {
                    self.togglePanelAndToolBar(divId);
            });
            jQuery('#' + divId).addClass('collapsed').hide();
        
            // make panel sit near menu bar position
            jQuery('#' + divId).position({
                my: "left top",
                at: "left bottom",
                of: jQuery('#' +  expanderId + ' .menu-heading')
            });

        }
    },

    /*
    **
    */
    addRollableBehaviour: function(id, draggable, resizable, child)
    {
        var self = this;

        var el = jQuery('#' + id);
        el.find('.header-bar').append(
            '<span><img class="roller" src="' + self.collapseIcon + '"/></span>'
                );
        el.css({ opacity: self.floatingOpacity
                });

        // read in panel positioning settings
        if (self.floatingPanelPositions[id])
        {
            self.floatingPanelPositions[id](el, child, draggable, resizable);
        }

        if (self.rollablePanels[id])
        {
            if (resizable)
                el.resizable({
                    stop: function( event, ui ) {
                        var h = el.height();
                        var w = el.width();
                        self.rollablePanels[id].w = w;
                        self.rollablePanels[id].h = h;
                    }
                });
            if (draggable)
                el.draggable({
                    handle: '.header-bar',
                    stop: function( event, ui ) {
                        var coords = el.position();
                        var oPos = {
                            my: 'left top',
                            at: 'left+' + coords.left + ' top+' + coords.top,
                            of: jQuery(window)
                        }
                        self.rollablePanels[id].openPosition = oPos;
                        self.rollablePanels[id].collapsedPosition = oPos;
                    }
                });
        }
        el.find('.roller').click(function() { self.toggleRollable(id) });
    },


    /*
    ** display details on a specific feature
    */
    displayFeatureDetails: function(feature)
    {
        var self = this;


        var rollablePanelId = 'feature-details';

        var data = feature.attributes.rawRow;
        var content = '<dl>';

        // summary data
        if (data['irn'])
            content += self.makeFieldDetail(data, 'irn');
        if (data['SummaryData'])
            content += self.makeFieldDetail(data, 'SummaryData');
        else if (data['Description'])
            content += self.makeFieldDetail(data, 'Description');
        content += '</dl>';

        // MM image
        var url = self.getMMUrl(data);
        if (url)
        {
            content += '<img class="item-thumb-details" src="' + url + '"/>';
        }

        // Legend Icon
        var colour = feature.attributes.colour.replace(/#/,'');
        var icon = self.mapWidget.makeLegendIcon(feature.attributes.shape, colour, 15);
        content += '<img class="legend-icon" src="' + icon + '"/>';

        // Other record details
        content += '<dl>';
        for (var i = 0; i < self.detailFields.length; i++)
        {
            var f = self.detailFields[i];
            if (! f.match(/^(irn|SummaryData|Description)$/))
                if (data[f])
                    content += self.makeFieldDetail(data, f);
        }
        content += '</dl>';

        self.displayRollablePanel(
                rollablePanelId,
                IMu.string('map-report-item-details'),
                content,
                true,
                self.useResizablePanels,
                undefined);
    },

    /*
    **
    */
    displayRollablePanel: function(id, heading, content, draggable, resizable, child)
    {
        var self = this;

        var el = jQuery('#' + id);
        var initialisePosition = false;
        if (! self.rollablePanelExists(id))
        {
            self.makeRollablePanel(id, heading);
            initialisePosition = true;
        }

        self.setRollablePanelContent(id, content);
        if (! el.find('.panel-footer').length)
        {
            el.append('<div class="panel-footer">&nbsp;</div>');
        }
        el.css({visibility:'visible'});

        if (initialisePosition)
            self.addRollableBehaviour(id, draggable, resizable, child);
        else if (self.rollablePanelClosed(id))
            self.toggleRollable(id);
    },


    /*
    **
    */
    getMMUrl: function(rowData)
    {
        var self = this;

        var url = undefined;
        if (rowData['multimedia'] !== undefined)
        {
            if ( rowData['multimedia'].length > 0)
            {
                var mmObj = rowData['multimedia'][0];
                if (mmObj['type'] == 'image')
                {
                    var key = mmObj['irn'];
                    url = IMu.path + '/request.php' +
                        '?request=Multimedia&method=fetch&' +
                        'filter=kind:eq:thumbnail&key=' + key;
                    
                }
            }
        }
        return url;
    },



    /*
    ** Make a control that allows the user to adjust the clustering width.
    */
    makeClusterWidthControl: function(selector, min, max, start)
    {
        var self = this;

        var clusterSlider = jQuery('#' + selector).slider({
                    min: min,
                    max: max,
                    value: start,
                    change: function (ev, ui)
                    {
                        self.mapWidget.setClusterDistance(ui.value);
                        IMu.Events.trigger('cluster-size-change');
                    },
                    slide: function (ev, ui)
                    {
                        self.mapWidget.setClusterDistance(ui.value);
                        IMu.Events.trigger('cluster-size-change');
                    }
        });
    },

    /*
    **
    */
    makeCollateBy: function(divId)
    {
        var self = this;

        var select = jQuery('#' + divId + ' select');
        select.empty();
        var description = self.mapWidget.getSearchDescriptions()[
                self.activeSearchName];
        if (description)
        {
            var categories = description.categories;
            for (var i = 0; i < categories.length; i++)
            {
                var option = categories[i];
                select.append('<option value="' + option + '">' +
                        IMu.string(option) + '</option>');

                if (description['collateByCategory'] == option)
                {
                    select.find(':last-child').attr('selected', 'selected');
                    oneSelected = true;
                }
            }
            select.unbind('change').change(function() { 
                var value = this.value;
                if (value)
                {
                    self.mapWidget.setCollationCategory(
                        self.activeSearchName, value);
                    self.mapWidget.redisplaySearches();
                }
            });
        }
    },


    /*
    **  Display details about a particular field of a feature
    */
    makeFieldDetail: function(record, field)
    {
        var self = this;

        var st = '';
        if (record[field] != undefined)
        {
            var subField = false;
            var displayValue = '-';

            var item = record[field];
            var itemType = jQuery.type(item);
            if (itemType == 'object')
            {
                subField = true;
                displayValue = '<dl class="sub-field">';
                jQuery.each(item, function(fieldName, data)
                {
                    displayValue +=  self.makeFieldDetail(item, fieldName);
                });
                displayValue += '</dl>';
            }
            else if (itemType == 'array')
            {
                displayValue = item.join('-');
            }
            else
            {
                displayValue  = item;
            }
            if (displayValue == '')
                displayValue = '-';

            var cssClass = 'class="record-field"';
            if (subField)
                cssClass = 'class="sub-field"';
            st += '<dt ' + cssClass + '>' + IMu.string(field) + '</dt>';
            st += '<dd>' + displayValue + "</dd>\n";
        }
        return st;
    },

    /*
    ** Make a SELECT element to allow selection of layer groups (eg campus/building
    ** groups);
    */
    makeGroupSelector: function(divId)
    {
        var self = this;

        var groupNames = self.mapWidget.getLayerGroups();
        if (groupNames.length > 1)
        {
            var holder = jQuery('#' + divId);
            holder.append('<select></select>');
            var select = jQuery('#' + divId + ' select');
            for (var i = 0; i < groupNames.length; i++)
            {
                var name = groupNames[i];
                select.append('<option value="' + name + '">' + name + '</option>'); 
            }
            select.change(function()
                          {
                              self.mapWidget.setLayerGroup(this.value);
                          });
        }
        else
        {
            jQuery('#' + divId).hide();
        }
    },

    /*
    **
    */
    makeRollablePanel: function(id, heading)
    {
        var self = this;

        var el = jQuery('#' + id);
        content = '<div class="header-bar">' + heading + '</div>' +
                  '<div class="rollable-body"></div>';

        el.empty().html(content);
        el.css({visibility:'visible'});
        var h = el.height();
        var w = el.width();
        self.rollablePanels[id] = { h: h, w: w };
    },

    /*
    **
    */
    makeShapeSelector: function(divId)
    {
        var self = this;

        var select = jQuery('#' + divId + ' select');
        select.empty();

        var description = self.mapWidget.searchResults[
                self.activeSearchName];
        if (description)
        {
            for (var i = 0; i < self.mapWidget.markerShapes.length; i++)
            {
                var s = self.mapWidget.markerShapes[i];
                select.append('<option>' + s + '  </option>');
                if (description['currentSymbol'] == s)
                    select.find(':last-child').attr('selected', 'selected');
            }
            select.unbind('change').change(function() {
                    var value = this.value;
                    if (value)
                    {
                        self.mapWidget.setCollationSymbol(
                            self.activeSearchName, value);
                        self.mapWidget.redisplaySearches();
                    }
            });
        }
    },

    /*
    **
    */
    makeSimpleFeatureDetails: function(feature, i)
    {
        var self = this;

        var data = feature.rawRow;
        var colour = feature.colour.replace(/#/,'');
        var icon = self.mapWidget.makeLegendIcon(feature.shape, colour, 15);
        var url = self.getMMUrl(data);

        var text = '';
        if (url)
            text += '<div class="item-image"><img class="item-thumb" src="' + url + '"/></div>';
        text += '<img class="legend-icon" src="' + icon + '"/>';
        text += '<div class="item-summary">' + data['SummaryData'] + '</div>';
        return text;
    },                


    /*
    **
    */
    makeSizeSelector: function(divId)
    {
        var self = this;

        var select = jQuery('#' + divId + ' select');
        select.empty();

        var description = self.mapWidget.searchResults[
            self.activeSearchName];
        if (description)
        {
            var r = self.mapWidget.view.options.defaultRadius;
            if (! r)
                r = 5;
            var sizes = {};
            sizes[IMu.string('map-symbol-size-smallest')] = Math.floor(r * 0.5);
            sizes[IMu.string('map-symbol-size-small')] = Math.floor(r * 0.7);
            sizes[IMu.string('map-symbol-size-smaller')] = Math.floor(r * 0.9);
            sizes[IMu.string('map-symbol-size-default')] = r;
            sizes[IMu.string('map-symbol-size-medium-large')] = Math.floor(r * 1.5);
            sizes[IMu.string('map-symbol-size-larger')] = Math.floor(r * 2);
            sizes[IMu.string('map-symbol-size-large')] = Math.floor(r * 2.5);
            sizes[IMu.string('map-symbol-size-largest')] = Math.floor(r * 3);
            jQuery.each(sizes, function(name, size) {
                select.append('<option value="' + size + '">' + name + '  </option>');
                if (description['currentSize'] == size)
                    select.find(':last-child').attr('selected', 'selected');
            });

            select.unbind('change').change(function() {
                    var value = this.value;
                    if (value)
                    {
                        self.mapWidget.setCollationSymbolSize(
                                self.activeSearchName, value);
                        self.mapWidget.redisplaySearches();
                    }
            });
        }
    },

    /*
    **
    */
    registerPosition: function(el, w, h, openPos, closePos, sizeOnRoll, child, draggable, resizable)
    {
        var self = this;

        var id = jQuery(el).attr('id');
        if (self.rollablePanels[id])
        {
            self.rollablePanels[id] = {
                w: w,
                h: h,
                openPosition: openPos,
                collapsedPosition: closePos,
                sizeOnRoll: sizeOnRoll,
                child: child,
                draggable: draggable,
                resizable: resizable
            };
        }
        self.adjustControlPositions();
    },

    adjustControlPositions: function()
    {
        var self = this;

        jQuery.each(self.rollablePanels, function(id, data) {
            var el = jQuery('#' + id);
            if (el.length)
            {
                el.width(data.w);
                el.height(data.h);
                el.position(data.openPosition);
            }
        });
    },


    /*
    ** check if rollablePanel is collapsed or open
    */
    rollablePanelClosed: function(rollablePanelId)
    {
        var self = this;

        var el = jQuery('#' + rollablePanelId);
        if (el)
        {
            var holder = el.find('.roller');
            if (holder && holder.hasClass('rolled'))
            {
                return true;
            }
        }
        return false;
    },

    /*
    ** Check if rollablePanel has been created
    */
    rollablePanelExists: function(id)
    {
        var self = this;

        if (self.rollablePanels[id])
            return true;
        return false;
    },

    /*
    **
    */
    showHighlighted: function(widget, features, event)
    {
        var self = MapUtility;

        if (! self.markerInfoPanelId)
            return;

        var rollablePanelId = self.markerInfoPanelId;

        var text = '';
        for (var i = 0; i < features.length; i++)
        {
            text += '<div class="simple-item-details" ' +
                        'data-index="' + i + '">';

            var feature = features[i].attributes;
            text += self.makeSimpleFeatureDetails(feature, i);
            text += '</div>';
        }

        self.displayRollablePanel(
                rollablePanelId,
                IMu.string('map-report-selected-markers'),
                text,
                true,
                self.useResizablePanels,
                'feature-details');

        jQuery('.simple-item-details').click(function() {
                var index = jQuery(this).data('index');
                var feature = features[index];
                self.displayFeatureDetails(features[index]);
        });

    },

    /*
    **
    */
    showLegend: function(widget, data)
    {
        var self = MapUtility;

        if (! self.legendPanelId)
            return;

        var rollablePanelId = self.legendPanelId;

        var legendBody = '';
        if (self.context == 'ipm')
        {
            legendBody = '<span>total count:<div id="total-count"></div><span>';
        }

        jQuery.each(data, function(searchName, items) {
            var searchIdx = self.mapWidget.uniqueId + '-' + items.description.searchIndex;
            legendBody += ' <div class="legend-item-group">' + items.subTitle +
                            ' <img class="legend-settings" ' +
                            '      data-search-name="' + searchName + '"' +
                            '      src="' + self.settingsIcon + '" />' +
                            '</div>';
            
            var field = self.mapWidget.analysedData[searchName]['collateByCategory'];
            var count = 0;                                    
            jQuery.each(items.items, function(itemName, details){
                var legClass = 'legend-item';
                if (self.mapWidget.getFilterChoices)
                {
                    var filteredCategories = self.mapWidget.getFilterChoices(field);
                    if (filteredCategories != undefined)
                    {
                        if (filteredCategories[itemName] != undefined)
                        {
                            if (filteredCategories[itemName].inFilter)
                                legClass += ' filter-matches-true';
                            else    
                                legClass += ' filter-matches-false';
                        }
                    }
                }

                var icon = items.icons[itemName];
                if (self.mapWidget.view.sliceColours)
                {
                    var colour = self.mapWidget.view.sliceColours[itemName];
                    var icon = self.mapWidget.makeLegendIcon('pie', colour, 15);
                }
                legendBody += '<span class="' + legClass + '"><img class="legend-icon" src="' + icon + '"/>';
                legendBody += '<div class="legend-text">' + itemName + '</div>';
                legendBody += '</span>';
            });
        });

        self.displayRollablePanel(
                rollablePanelId,
                IMu.string('map-report-legend-heading'),
                legendBody,
                true,
                self.useResizablePanels,
                undefined);

        jQuery('.legend-settings').unbind('click').bind('click', function() {
                var searchName = jQuery(this).data('search-name');
                if (searchName)
                {
                    self.activeSearchName = searchName;
                    jQuery('#active-search').html('show "' + self.activeSearchName + '" by');
                    self.makeCollateBy('collate-by');
                    self.makeShapeSelector('marker-shape');
                    self.makeSizeSelector('marker-size');
                    self.togglePanelAndToolBar('menu-controls');
                }
        });
    },


    /*
    **
    */
    setDetailFields: function(fieldNameArray)
    {
        var self = this;

        self.detailFields = fieldNameArray;
    },

    /*
    **
    */
    setMapWidget: function(mapWidget, clusterOn)
    {
        var self = this;

        var floatingPanels = jQuery('.dockable-panel');
        for (var i = 0; i < floatingPanels.length; i++)
        {
            var id = jQuery(floatingPanels[i]).attr('id');
            if (! self.floatingPanelPositions[id])
                alert('need to set floating panel position property for: ' + id);
        }

        self.mapWidget = mapWidget;

        mapWidget.addCustomLegend(self.showLegend);
        mapWidget.addClusterRangeLayer(clusterOn);
        mapWidget.setMarkerDetailsDisplay(self.showHighlighted);

        IMu.Events.bind('imu-show', function() {
            if (self.mapControlsId)    
                self.addPanelToToolBar(self.mapControlsId,
                                         IMu.string('map-controls'),
                                         self.menuBarId,
                                         mapWidget);

            self.addPanelToToolBar('menu-help',
                                         IMu.string('help'),
                                         self.menuBarId,
                                         mapWidget);

            if (self.clusterDistanceId)
                self.makeClusterWidthControl(self.clusterDistanceId,
                                         1,
                                         self.maxClusterPixels,
                                         1,
                                         mapWidget);
        });
        self.context = mapWidget.options.searchContext;

        IMu.Events.bind('map-view-features-added', function() {
            self.activeSearchName = mapWidget.lastSearch.labelName;
            jQuery('#active-search').html('show "' + self.activeSearchName + '" by');
            self.makeCollateBy('collate-by', mapWidget);
            self.makeShapeSelector('marker-shape', mapWidget);
            self.makeSizeSelector('marker-size', mapWidget);
        });
    },


    /*
    **
    */
    setRollablePanelContent: function(id, content)
    {
        var self = this;

        var el = jQuery('#' + id);
        if (el)
        {
            var holder = el.find('.rollable-body');
            if (holder)
            {
                holder.empty();
                holder.html(content);
            }
        }
    },


    /*
    ** if a panel is asked to be collapsed/expanded, move it appropriately and
    ** adjust screen layout as required
    */
    togglePanelAndToolBar: function(holderId)
    {
        var self = this;


        var holder = jQuery('#' + holderId);


        // container
        holder.toggleClass('collapsed');
        holder.toggleClass('uncollapsed');
        holder.toggle('slow');

        // toolbox spot
        var toolHolderId = 'expander-' + holderId;
        jQuery('#' + toolHolderId).toggleClass('disabled');

        if (holder.hasClass('uncollapsed'))
            holder.draggable({ handle: '.header-bar' });
    },

    setMenuBar: function(id)
    {
        var self = this;
        self.menuBarId = id;
    },

    setRollablePosition: function(id)
    {
        var self = this;

        var properties = self.rollablePanels[id];
        if (! properties)
            return;

        var el = jQuery('#' + id);
        var roller = el.find('.roller');
        if (roller.hasClass('rolled'))
        {
            roller.attr({src : self.uncollapseIcon});
            if (properties.resizable)
                el.resizable('disable');
            el.height(el.find('.header-bar').height());    
            el.width(el.width() * properties.sizeOnRoll);
            el.position(properties.collapsedPosition);
            el.css({ opacity: 1
                    });
        }
        else
        {
            roller.attr({src : self.collapseIcon});
            if (properties.resizable)
                el.resizable('enable');
            el.height(properties.h);    
            el.width(properties.w);
            el.height(properties.h);
            el.position(properties.openPosition);
            el.css({ opacity: self.floatingOpacity });
        }
        self.registerPosition(el,
                properties.w,
                properties.h,
                properties.openPosition,
                properties.closePosition,
                properties.sizeOnRoll,
                properties.child,
                properties.draggable,
                properties.resizable);

        // move child in response to parent move
        if (properties.child)
        {
            self.setRollablePosition(properties.child);
        }
    },

    /*
    **
    */
    toggleRollable: function(id)
    {
        var self = this;

        var properties = self.rollablePanels[id];
        if (! properties)
            return;

        var el = jQuery('#' + id);
        var roller = el.find('.roller');
        roller.toggleClass('rolled');
        el.find('.rollable-body').toggle();
        self.setRollablePosition(id);

    }


};
