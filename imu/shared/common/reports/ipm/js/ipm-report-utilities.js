var IPMUtility = {

    animator: undefined,
    absMinSize: 20,
    absMaxSize: 300,
    animationState: 'off',
    clusterSize: 0,
    filterControls: {},
    initialMinSize: 20,
    initialMaxSize: 80,
    loopPlaying: false,
    mapUtilities: undefined,
    mapWidget: undefined,
    markerMax: 0,
    markerMin: 0,

    playingSteps: false,
    searchProcessed: false,
    filterSelectors: {},
    filterShowState: {},
    settingCategories: false,
    stALL: '*',
    stepping: false,
    useResizablePanels: false,

    filterResetId: undefined,
    markerSizeId: undefined,
    //totalCountId: undefined,
    sizesId: undefined,

    animateStopButtonId: undefined,

    /*
    ** do anything required if the filtering criteria changed
    */
    actOnChangedFilter: function(changedField, ipm)
    {
        var self = this;

        // tell widget to adjust filtering and draw the map 
        ipm.showStatusMessage('filtering...', true);
        self.setMapFilters(ipm);
        ipm.filterDisplayedData();

        // update screen display to show filter info
        self.adjustSelectDisplay(ipm);
        self.showCurrentFilter(ipm);
        ipm.showStatusMessage('done...', true);
    },

    addFilterClearAll: function(holderId, label)
    {
        var self = this;

        self.filterResetId = 'filter-reset';
        if (! jQuery('#' + holderId).find('#' + self.filterResetId).length)
        {
            jQuery('#' + holderId).append(
                        '<button id="' + self.filterResetId + '" ' +
                        ' class="animate-control">' + 
                        label + '</button>');
        }

    },

    addFilterSelect: function(holderId, filterField)
    {
        var self = this;

        var selectId = holderId + '-select';
        if (! jQuery('#' + holderId).find('#' + selectId).length)
        {
            jQuery('#' + holderId).append('<div id="' + selectId + '"/>');
        }
        self.filterSelectors[selectId] = filterField;
    },

    addFilterSwitcher: function(holderId, filters)
    {
        var self = this;
        var initialSet = false;
        jQuery.each(filters, function(field, filterId) {
            var selected = '';
            self.filterShowState[filterId] = false;
            if (! initialSet)
            {
                selected = 'checked="1"';
                initialSet = true;
                self.filterShowState[filterId] = true;
            }
            jQuery('#' + holderId).append(
                    '<span><input type="radio" name="filter-category" value="' +
                        field + '" ' + selected + '/>' + IMu.string(field) + '</span>'
            );
        });

    },

    addFilteringPanel: function()
    {
        var self = this;

        var ipm = self.mapWidget;

        // whenever points are added, re-populate filtering controls
        IMu.Events.bind('map-view-features-added', function(evt, added, name) {

            // only redo setup if a new search    
            if (self.searchProcessed)
                return;
            self.searchProcessed = true;

            // show wanted filter selectors and hide rest
            jQuery.each(self.filterShowState, function(filterId, show) {
                if (show)
                    jQuery('#' + filterId).show();
                else    
                    jQuery('#' + filterId).hide();
            });

            // make filter select boxes
            jQuery.each(self.filterSelectors, function(id, field) {
                self.makeFilterSelector(field, id, ipm);
            });

            if (self.filterResetId)
                self.makeClearFilterControl('#' + self.filterResetId, ipm);

            // add animation behaviour
            self.makeAnimationControls(ipm);


            // display wanted set of controls
            jQuery('input[type=radio][name=filter-category]').change(function() {
                
                    var wantedField = jQuery(this).val();
                    jQuery.each(self.filterSelectors, function(id, field) {
                        var holderId = id.replace(/-select$/, '');
                        if (self.filterShowState[holderId] != undefined)
                        {
                            if (field == wantedField)
                            {
                                self.filterShowState[holderId] = true;
                                jQuery('#' + holderId).show();
                            }
                            else
                            {
                                self.filterShowState[holderId] = false;
                                jQuery('#' + holderId).hide();
                            }
                        }
                    });
            });
        });


        // make filter panel a rollable floating panel
        var rollablePanelId = self.filterPanelId;
        var filteringBody = jQuery('#' + rollablePanelId).html();
        self.mapUtilities.displayRollablePanel(
                    rollablePanelId,
                    IMu.string('ipm-report-filtering-heading'),
                    filteringBody,
                    true,
                    self.useResizablePanels,
                    self.mapUtilities.markerInfoPanelId);

    },

    addAnimationButton: function(buttonId, selectId, state)
    {
        var self = this;

        var button = jQuery('#' + buttonId);
        button.addClass('animate-control');
        button.click(function(ev)
            {
                self.enableAnimateButtons(false);
                self.animationState = state;
                self.startAnimation(self.mapWidget, selectId);
            });
    },

    addAnimationSpeedInput: function(id, mSecs)
    {
            var self = this;
            var input = jQuery('#' + id);
            input.addClass('animate-control');
            input.attr({ name: 'step-time', value: mSecs });
    },

    addAnimationStopButton: function(buttonId)
    {
        var self = this;

        self.animateStopButtonId = buttonId;

        var button = jQuery('#' + buttonId);
        button.addClass('animate-control');
        button.click(function(ev)
            {
                if (self.animator)
                    clearInterval(self.animator);
                self.animationState = 'off';
                self.stepping = false;
                self.enableAnimateButtons(true);
            });
    },

    addMarkerSizeControl: function(ctlId, initMin, initMax, absMin, absMax)
    {
        var self = this;

         self.absMinSize = absMin;
         self.absMaxSize = absMax;
         self.initialMinSize = initMin;
         self.initialMaxSize = initMax;
         self.initialMaxSize = initMax;
         self.markerSizeId = ctlId;
    },

    addMarkerSizeDisplay: function(id)
    {
        var self = this;
        self.sizesId = id;
    },

    /*
    ** reset display of all filter controls.  They need to show how many matching
    ** items in each select control match the chosen filter values
    */
    adjustSelectDisplay: function(ipm)
    {
        var self = this;

        jQuery.each(self.filterControls, function(divId, field)
            {
                var categories = ipm.getFilterChoices(field);
                var select = jQuery('#' + divId + ' ul');
                var options = select.find('li');
                for (var i = 0; i < options.length; i++)
                {
                    var optionElement = jQuery(options[i]); 
                    var option = optionElement.data('value');
                    if (option != self.stALL)
                    {

                        // reset text of option
                        optionElement.removeClass('in-filter');
                        optionElement.text(option);

                        if (categories[option] != undefined)
                        {
                                var count = categories[option].count;
                                var infilter = categories[option].inFilter;
                                if (infilter)
                                {
                                    optionElement.addClass('in-filter');
                                    if (count != undefined)
                                        optionElement.text(option + ' (' + count + ' shown)');
                                }
                        }
                    }
                }
            });
    },

    /*
    ** Detect that all images in the legend have loaded.  This helpful to know
    ** when animation step can continue.
    */
    allImagesLoaded: function()
    {
        var count = jQuery('#legend-panel img').length;
        var loaded = 0;
        jQuery('#legend-panel').find('img').each(function() {
                var src = jQuery(this).attr('src');
                jQuery('<img/>').attr('src', src).
                        css('display', 'none').load(function() {
                            if (++loaded >= count)
                                setTimeout(function() {
                                    IMu.Events.trigger('all-icons-loaded');
                                    }, 100);
                });
        });
    },

    /*
    **  Add potential options to a 'select' control
    */
    populateSelectFilters: function(field, divId, ipm)
    {
        var self = this;

        self.settingCategories = true;

        var select = jQuery('#' + divId + ' ul');

        // save currently recorded selections before re-populating
        var currentSelection = self.getSelectedOptions(divId);

        select.empty();

        select.append('<li data-value="' + self.stALL +
                            '" class="value-selected">ALL</li>')
                .addClass('filter-select-control');

        var categories = ipm.getFilterChoices(field);
        var options = Object.keys(categories);
        if (field != 'DateChecked')
            options.sort();
        else
            options.sort(function(a, b)
            {
                return self.dateStringSort(ipm, a, b)
            });

        for (var i = 0; i < options.length; i++)
        {
            var name = options[i];
            var displayName = name;
            select.append('<li data-value="' + name + '">' + displayName + '</li>'); 
        }
        self.setFilterOptionClickBehaviour(field, divId, ipm);
        self.settingCategories = false;
    },


    /*
    ** Is this field already being filtered by the IPM?
    */
    alreadyInFilter: function(ipm, field, value)
    {
        var self = this;

        var filters = ipm.getCurrentFilters();
        var filterFieldValues = filters[field];
        if (filterFieldValues == undefined)
            return false;
        if (filterFieldValues[value])
            return true;
        else
            return false;
    },


    /*
    ** Sort slash separated date strings in the same way the map widget does.
    */
    dateStringSort: function(ipm, a, b)
    {
        var self = this;

        var aParts = a.split('/');
        var bParts = b.split('/');
        dA = ipm.parseStringToDate(a);
        dB = ipm.parseStringToDate(b);
        return  dA < dB ? -1 : dA > dB ? 1 : 0;
    },



    /*
    ** Enable or disable the animation buttons
    */
    enableAnimateButtons: function(enable)
    {
        var self = this;

        if (enable)
        {
            setTimeout(function() {  
                jQuery('.animate-control').attr("disabled", false);
                jQuery('#' + self.animateStopButtonId).hide();
            }, 400);
        }
        else
        {
            jQuery('.animate-control').attr("disabled", true);
            jQuery('#' + self.animateStopButtonId).attr("disabled", false);
            jQuery('#' + self.animateStopButtonId).show();
        }
    },


    /*
    ** what options has the user selected in a select control
    */
    getSelectedOptions: function(divId)
    {
        var self = this;

        var options = jQuery('#' + divId + ' ul li.value-selected');
        var selected = {};
        for (var i = 0; i < options.length; i++)
        {
            var value = jQuery(options[i]).data('value');
            selected[value] = true;
        }
        return selected;
    },


    /*
    ** This makes the buttons that control the date selection/display stuff
    */
    makeAnimationControls: function(ipm)
    {
        var self = this;

        IMu.Events.bind('ipm-viewer-legend-icons-loaded', function()
        {
            // do not do change screen until icons loaded
            self.stepping = false;
        });
        IMu.Events.bind('all-icons-loaded', function()
        {
            // if nothing to display, assume map is drawn and ready
            self.stepping = false;
        });

        self.enableAnimateButtons(true);
    },

    /*
    ** make a button that clears all the current filter settings
    */
    makeClearFilterControl: function(selector, ipm)
    {
        var self = this;

        jQuery(selector).click(function(ev)
            {
                ipm.clearFilterFields();
                ipm.filterDisplayedData();
                jQuery.each(self.filterControls, function(filterId, field)
                    {
                        self.setSelectToAll(filterId)
                    });
                self.adjustSelectDisplay(ipm);
                self.showCurrentFilter(ipm);
            });
    },


    /*
    ** create a 'select' control for the data filter mechanism
    */
    makeFilterSelector: function(field, divId, ipm)
    {
        var self = this;

        var el = jQuery('#' + divId);
        var select = el.find('ul');
        if (select.length)
        {
            select.empty();
        }
        else
        {
            el.append('<ul></ul>'); 
            select = el.find('ul');
        }
        select.addClass('selector-control')
        // get all the options
        self.populateSelectFilters(field, divId, ipm);
        self.filterControls[divId] = field;
        self.adjustSelectDisplay(ipm);
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
            holder.append('select');
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
    ** make a control that allows the user to set max/min size of markers
    */
    makeMarkerSizingControl: function(selector, min, max, minStart, maxStart, ipm)
    {
        var self = this;

        self.markerMax = maxStart;
        self.markerMin = minStart;
        var markerSlider = jQuery(selector).slider(
            {
                    range: 'true',
                    min: min,
                    max: max,
                    values: [minStart, maxStart],
                    change: function (ev, ui)
                    {
                        if (ui.values[0] >= ui.values[1])
                        {
                            if (ui.values[1] > self.absMinSize)
                                jQuery(this).slider("values", 0, ui.values[1]-1);
                            if (ui.values[1] < self.absMaxSize)
                                jQuery(this).slider("values", 1, ui.values[1]+1);
                        }
                        jQuery('#marker-size-amounts').val(
                                ui.values[0] +
                                ' - ' +
                                ui.values[1]
                        );
                        ipm.setMinimumMarkerSize(ui.values[0]);
                        ipm.setMaximumMarkerSize(ui.values[1]);
                        if ((ui.values[0] != self.markerMin) || (ui.values[1] != self.markerMax))
                            IMu.Events.trigger('marker-size-change', ui.values);
                        self.markerMin = ui.values[0];
                        self.markerMax = ui.values[1];
                    },
                    slide: function (ev, ui)
                    {
                        if (ui.values[0] > ui.values[1])
                        {
                            if (ui.values[1] > self.absMinSize)
                                jQuery(this).slider("values", 0, ui.values[1]-1);
                            if (ui.values[1] < self.absMaxSize)
                                jQuery(this).slider("values", 1, ui.values[1]+1);
                        }

                        jQuery('#marker-size-amounts').val(
                                ui.values[0] +
                                ' - ' +
                                ui.values[1]
                        );
                        ipm.setMinimumMarkerSize(ui.values[0]);
                        ipm.setMaximumMarkerSize(ui.values[1]);
                        if ((ui.values[0] != self.markerMin) || (ui.values[1] != self.markerMax))
                            IMu.Events.trigger('marker-size-change', ui.values);
                        self.markerMin = ui.values[0];
                        self.markerMax = ui.values[1];
                    }
            });
    },


    /*
    ** Turn trap event data from a specific field into a suitable display form
    */
    makeTrapEventFieldDetail: function(record, field)
    {
        var self = this;

        var text = '';
        if (record[field] != undefined)
        {
            text += '<div class="definition-item">';
            text += '<span class="term">' + IMu.string(field) + ':</span>';
            text += '<span class="definition">';

            var item = record[field];
            if (jQuery.type(item) == 'object')
            {
                text += '<div class="definition-item">';
                jQuery.each(item, function(fieldName, data)
                {
                    text +=  self.makeTrapEventFieldDetail(item, fieldName);
                });
                text += '</div>';
            }
            else
                text += item;

            text += "</span></div>\n";
        }
        return text;
    },


    /*
    ** makes a 'link' that holds enough info to allow us to find the associated
    ** trap event when clicked
    */
    makeTrapEventLink: function(rid, eventDate)
    {
        var self = this;

        var irn = rid.replace(/etrapevents\./, '');
        var link = '<span ' + 
                        '" data-edate="' + eventDate + 
                        '" data-rid="' + rid +
                        '" class="trapevent-link">#' +
                        irn +
                        '</span>';


        return link;
    },

    /*
    ** turn trap events record data into an array of links to specific trap events
    */
    makeTrapEventLinks: function(details, ipm)
    {
        var self = this;

        var events = [];
        var trapEventRids = Object.keys(details['trapEvents']);
        // sort trap events by date
        trapEventRids.sort(function(a, b)
               {
                   dA = details['trapEvents'][a];
                   dB = details['trapEvents'][b];
                   return self.dateStringSort(ipm, dA, dB);
               });
       // turn each trap event irn into a link to a trap event dialog
       for (var j = 0; j < trapEventRids.length; j++)
       {
           var rid = trapEventRids[j];
           var eventDate = details['trapEvents'][rid];
           events.push(self.makeTrapEventLink(rid, eventDate));
       }
       return events;
    },



    /*
    ** collate nested table rows/columns into a HTML table display
    */
    makeTrapEventTableDetail: function(record, columns)
    {
        var self = this;

        var rows = {};
        var maxRows = 0;
        for (var i = 0; i < columns.length; i++)
        {
            var colName = columns[i];
            var values = record[colName];
            rows[colName] = [];
            if (jQuery.type(values) == 'array')
            {
                for (var j = 0; j < values.length; j++)
                    rows[colName].push(values[j]);
            }
            else
                rows[colName].push(values);

            if (rows[colName].length > maxRows)
                maxRows = rows[colName].length;
        }

        var t = '<table><tr>';
        for (var i = 0; i < columns.length; i++)
            t += '<th>' + IMu.string(columns[i])  + '</th>';
        t += '</tr>';

        for (var i = 0; i < maxRows; i++)
        {
            t += '<tr>';
            for (var j = 0; j < columns.length; j++)
            {
                var column = rows[columns[j]];
                if (column[i] != undefined)
                    t += '<td>' + column[i] + '</td>';
                else
                    t += '<td>&nbsp;</td>';
            }
            t += '</tr>';
        }
        t += '</table>';
        return t;
    },

    /*
    **  tells the ipm widget to change its filter criteria based on the values
    **  selected our filter controls
    */
    setMapFilters: function(ipm)
    {
        var self = this;

        jQuery.each(self.filterControls, function(filterId, field)
            {
                ipm.clearFilterField(field);

                var currentOptions = self.getSelectedOptions(filterId);
                // if 'all' selected, leave filter empty
                if (currentOptions[self.stALL] == undefined)
                {
                    var values = Object.keys(currentOptions);
                    for (var i = 0; i < values.length; i++)
                    {
                        var value = values[i];
                        if (! self.alreadyInFilter(ipm, field, value))
                            ipm.addFilterTerm(field, value);
                        else
                            ipm.clearFilterTerm(field, value);
                    }
                }
            });
    },


    /*
    ** set date control to first date
    */
    setToFirstDate: function(ipm, selectId)
    {
        var self = this;

        var select = jQuery('#' + selectId + ' ul');
        var options = select.find('li');
        for (var i=0; i < options.length; i++)
        {
            jQuery(options[i]).removeClass('value-selected');
        }
        var next = jQuery(options[0]).next();
        next.addClass('value-selected');

        // scroll to that position
        select.scrollTop(0);

        self.actOnChangedFilter('DateChecked', ipm);
    },

    showClusterWidth: function(ipm, selector, factor)
    {
        var self = this;

        var d = ipm.getClusterDistance(true);
        jQuery(selector).html(Math.round(d/factor));
    },

    /*
    ** display a summary of the current filter criteria on screen
    */
    showCurrentFilter: function(ipm)
    {
        var self = this;

        var st = ipm.getCurrentFiltersAsString();
        if (st == '')
            st = 'ALL';
        jQuery('#current-filter').html('trap events having contents: ' + st);
    },

    /*
    ** graphically show the item count that a given min or max pie chart
    ** represents.
    */
    showMarkerScale: function(ipm)
    {
        var self = this;

        var sizes = jQuery('#' + self.markerSizeId).slider('values');
        var minCount = ipm.minCount;
        var maxCount = ipm.maxCount;

        var minDisplay = '';
        if (minCount < maxCount)
        {
            var minMarker = ipm.view.makeLegendIcon('pie', 'ffffce', sizes[0]/2);
            minDisplay = '<img src="' + minMarker + '">' + minCount + 'items<br/>';
        }
        var maxMarker = ipm.view.makeLegendIcon('pie', 'ffffce', sizes[1]/2);
        maxDisplay = '<img src="' + maxMarker + '">' + maxCount + 'items';

        jQuery('#' + self.sizesId).html(minDisplay + maxDisplay);
    },

    stepAll: function(ipm, forward, selectId)
    {
        var self = this;

        var stepTime = parseInt(jQuery('[name=step-time]:checked').val());
        var watchDog = 0;
        if (self.animationState == 'off')
        {
            self.stepping = false;
            return;
        }
        self.animator = setInterval(function() {
            if (self.animationState != 'off') {
                if (! self.stepping) {
                    watchDog = 0;
                    self.stepping = true;
                    var canStepAgain = self.stepDate(ipm, forward, selectId);
                    self.allImagesLoaded();
                    if (! canStepAgain) {
                        if (self.animationState == 'forwardLoop') {
                            self.setToFirstDate(ipm, selectId);
                        }
                        else {
                            // we have hit the last/first date and are not
                            // looping
                            clearInterval(self.animator);
                            self.animationState = 'off';
                            self.stepping = false;
                            self.enableAnimateButtons(true);
                        }
                    }
                }
                else
                    {
                        // catch failure to load images from causing infinite
                        // loop
                        if (watchDog++ > 1)
                        {
                            self.stepping = false;
                        }
                    }
            }
            else {
                clearInterval(self.animator);
                self.animationState = 'off';
                self.stepping = false;
                self.enableAnimateButtons(true);
            }
        }, stepTime);
    },

    startAnimation: function(ipm, selectId)
    {
        var self = this;

        switch(self.animationState)
        {
            case 'forwardOne':
                    self.enableAnimateButtons(false);
                    self.animationState = 'off';
                    self.stepDate(ipm, true, selectId);
                    self.enableAnimateButtons(true);
                    break;
            case 'backwardOne':
                    self.enableAnimateButtons(false);
                    self.animationState = 'off';
                    self.stepDate(ipm, false, selectId);
                    self.enableAnimateButtons(true);
                    break;
            case 'forwardAll':
                    self.enableAnimateButtons(false);
                    self.stepAll(ipm, true, selectId);
                    break;
            case 'backwardAll':
                    self.enableAnimateButtons(false);
                    self.stepAll(ipm, false, selectId);
                    break;
            case 'forwardLoop':
                    self.stepAll(ipm, true, selectId);
                    break;
            default:        
                alert('cannot do this yet');
                self.enableAnimateButtons(true);
                break;
        }
    },

    /*
    ** select the next (or previous) date value
    */
    stepDate: function(ipm, forward, selectId)
    {
        var self = this;

            var select = jQuery('#' + selectId + ' ul');
            var options = select.find('li');
            var count = options.size();
            var current = select.find('li.value-selected').first();
            var next = current.next();
            if (forward)
            {
                if ((count <= 1) || (next.length == 0))
                    return false;
            }
            else
            {
                next = current.prev();
                if ((count <= 1) || (jQuery(next).data('value') == self.stALL))
                    return false;
            }
            current.removeClass('value-selected');
            next.addClass('value-selected');

            // scroll to that position
            var lineNo = next.index();
            if (lineNo > 3) {
                var lineHeight = Math.abs(next.offset().top - current.offset().top);
                select.scrollTop((lineNo - 1) * lineHeight);
            }

            self.actOnChangedFilter('DateChecked', ipm);
            return true;
    },

    /*
    ** add behaviour for user clicking on a filter option value
    */
    setFilterOptionClickBehaviour: function(field, divId, ipm)
    {
        var self = this;

        var select = jQuery('#' + divId + ' ul');
        select.find('li').unbind('click').click(function()
            {
                var currentOptions = self.getSelectedOptions(divId);

                clickedElement = jQuery(this);

                var valueClicked = clickedElement.data('value');

                // if 'all' was clicked, remove selected visual markings from
                // everything else as it is assumed 'all' means they are all
                // clicked
                if (valueClicked == self.stALL)
                    select.find('li').removeClass('value-selected');
                else
                {
                    // remove 'all' from selection
                    select.find('li:first').removeClass('value-selected');
                    // if a previously selected option clicked - unselect it
                    // otherwise select the clicked one
                    if (currentOptions[valueClicked])
                        clickedElement.removeClass('value-selected');
                    else
                        clickedElement.addClass('value-selected');
                }

                // if no options now selected, select 'All'
                currentOptions = self.getSelectedOptions(divId);
                var selectedCount = Object.keys(currentOptions).length;
                if (selectedCount == 0)
                    select.find('li:first').addClass('value-selected');

                // if a non 'all' value selected, make sure 'all' is not selected
                if (selectedCount > 1 && currentOptions[self.stALL] != undefined)
                    select.find('li:first').removeClass('value-selected');

                self.actOnChangedFilter(field, ipm);
            });
    },

    setMapWidget: function(mapWidget, mapUtilities)
    {
        var self = this;

        self.mapWidget = mapWidget;
        self.mapUtilities = mapUtilities;

        // do not set method for display (will instead rely on event trigger)
        mapWidget.setMarkerDetailsDisplay(undefined);

        IMu.Events.bind('map-view-features-added', function(evt, added, name) {
            // controls for adjusting marker sizing
            self.mapWidget.setMinimumMarkerSize(self.initialMinSize);
            self.mapWidget.setMaximumMarkerSize(self.initialMaxSize);
            if (self.markerSizeId)
                self.makeMarkerSizingControl('#' + self.markerSizeId,
                     self.absMinSize,
                     self.absMaxSize,
                     self.initialMinSize,
                     self.initialMaxSize,
                     self.mapWidget
             );

            self.showTotalSize('#total-count', self.mapWidget);
            if (self.sizesId)
                    self.showMarkerScale(self.mapWidget); 
        });
        IMu.Events.bind('map-view-redisplay-searches', function() { 
            self.showTotalSize('#total-count', mapWidget);
            self.showMarkerScale(mapWidget); });
        IMu.Events.bind('marker-size-change', function() {
            self.showMarkerScale(mapWidget); });
        IMu.Events.bind('cluster-size-change', function() {
            self.showTotalSize('#total-count', mapWidget);
            self.showMarkerScale(mapWidget); });
        IMu.Events.bind('map-view-features-added', function() { 
            self.showTotalSize('#total-count', mapWidget);
            self.showMarkerScale(mapWidget); });

        IMu.Events.bind('ipm-viewer-marker-selected', function(evt, markerDetails, mouseEvt) { 
            self.showMarkerDetails(markerDetails, mouseEvt);
        });

        IMu.Events.bind('ipm-viewer-record-details-found', function(evt, searchObj) { 
            self.showTrapEventDetails(searchObj);
        });

        IMu.Events.bind('ipm-viewer-no-points-to-display', function(evt) {
            mapWidget.view.drawLegend(mapWidget.analysedData);
        });
    },


    /*
    ** set the 'all' option for a filter
    */
    setSelectToAll: function(divId)
    {
        var self = this;

        var options = jQuery('#' + divId + ' ul li');
        var optionElement = jQuery(options[0]);
        optionElement.addClass('value-selected');
        for (var i = 1; i < options.length; i++)
        {
            var optionElement = jQuery(options[i]);
            optionElement.removeClass('value-selected');
        }
    },

    setupFilterPanel: function(panelId)
    {
        var self = this;

        self.filterPanelId = panelId;
        self.addFilteringPanel();
    },

    showMarkerDetails: function(markerDetails, mouseEvt)
    {
        var self = this;

        var text = '';
        // make a summary of all trap events involved in this marker
        var dateRange = markerDetails['dateRange'];
        var count = markerDetails['trapEvents'];
        var text = '<div class="definition-item">' +
                    '<span class="term">' +
                    '<img class="field-icon" src="./images/event_icon.png"/>' +
                            'Events:</span>';

        if (markerDetails['trapEvents'] > 1)
        {
            text += '<span class="definition">' + count + ' trap events.</span>' +
                    '</div>' +
                    '<div class="definition-item">' +
                    '<span class="term">' +
                    '<img class="field-icon" src="./images/checkdates_icon.png"/>' +
                    'Check dates:</span>' +
                    '<span class="definition"> from: ' +
                        dateRange[0] + ' to ' + dateRange[1] + '</span></div>';
        }
        else
        {
            text += '<span class="definition">1 trap event.</span>' +
                    '</div>' +
                    '<div class="definition-item">' +
                    '<span class="term">' +
                    '<img class="field-icon" src="./images/checkdates_icon.png"/>' +
                    'Check date:</span>' +
                    '<span class="definition">' +
                        dateRange[0] + '</span></div>';
        }


        // now display trapped items 
        text += '<div  class="definition-item"><span class="term">' +
                '<img class="field-icon" src="./images/trapped_icon.png"/>' +
                    'Trapped Items</span>';

        text += '<table class="definition">' +
                '<tr><th>Key</th><th>Item</th><th>Count</th><th>Event #</th>';

        // sort on item count values
        var items = Object.keys(markerDetails['fieldValues']);
        items.sort(function(a, b)
        {
            var x = markerDetails['fieldValues'][a]['count'];
            var y = markerDetails['fieldValues'][b]['count'];
            return  x < y ? 1 : x > y ? -1 : 0;
        });

        // make table of items
        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            var details = markerDetails['fieldValues'][item];

            // make a list of trap events applicable to the item on the current row.
            events = self.makeTrapEventLinks(details, self.mapUtilities.mapWidget);
            var eventList = events.join(', ');
        
            // display the item in a row
            text += '<tr>';
            text += '<td><img class="legend-icon" src="' + details.icon + '"/></td>';
            text += '<td>' + item + '</td>';
            text += '<td>' + details.count + '</td>';
            text += '<td>' + eventList + '</td>';
            text += '</tr>';
        }
        text += '</table>';
        text += '</div>';

        // make trapped items panel a rollable floating panel
        var rollablePanelId = self.mapUtilities.markerInfoPanelId;
        var filteringBody = jQuery('#' + rollablePanelId).html();
        self.mapUtilities.displayRollablePanel(
                    rollablePanelId,
                    IMu.string('ipm-report-trapped-items-heading'),
                    text,
                    true,
                    self.useResizablePanels,
                    self.mapUtilities.featureDetailsId);

        // add behaviour for trap event links
        jQuery('.trapevent-link').click(function(ev) {
                var rid = jQuery(this).data('rid');
                self.mapUtilities.mapWidget.displayItemDetails(rid, 'ipm');
            }).tooltip({
                items: "[data-edate]",
                content: function()
                {
                    return 'check date: ' + jQuery(this).data('edate');
                }
        });


    },

    showTotalSize: function(id, ipm)
    {
        var self = this;
        var counts = ipm.getTotalCounts();
        jQuery(id).html('<b style="font-size: larger">' +
                    counts.totalAll + '</b><br/>(largest marker: ' +
                        counts.largestSingleMarker + ')');

    },

    showTrapEventDetails: function(searchObj)
    {
        var self = this;

        if (! mapUtilities.featureDetailsId)
            return;

        searchObj.fetchMany(
                [{offset: 0, count: -1}],
                self.mapUtilities.context,
                function(result) {
                    var text = '';
                    var data = result.rows;
                    for (var i = 0; i < data.length; i++)
                    {
                        // record header summary
                        var record = data[i];
                        text += self.makeTrapEventFieldDetail(record, 'irn');
                        text += self.makeTrapEventFieldDetail(record, 'SummaryData');
                        text += self.makeTrapEventFieldDetail(record, 'Trap');

                        // MM image
                        if (record['multimedia'] != undefined)
                        {
                            if ( record['multimedia'].length > 0)
                            {
                                var mmObj = record['multimedia'][0];
                                if (mmObj['type'] == 'image')
                                {
                                    var key = mmObj['irn'];
                                    var url = IMu.path + '/request.php' +
                                        '?request=Multimedia&method=fetch&' +
                                        'filter=kind:eq:thumbnail&key=' + key;

                                    text += '<div class="definition-item">' +
                                            '<span class="term">' +
                                            IMu.string('multimedia') +
                                            '</span>' +
                                            '<span class="definition">' +
                                            '<img src="' + url + '"/></span></div>';
                                }
                            }
                        }

                        // trap contents nested table
                        text += '<div class="definition-item">';
                        text += '<span class="term">Trap Contents</span>' +
                            '<span class="definition">' + self.makeTrapEventTableDetail(
                                    record, [
                                    'EcologicalType',
                                    'CommonName',
                                    'Species',
                                    'TrapCount'
                                    ]
                                    ) + '</span>';
                        text += '</div>';

                        // general trap event details
                        text += self.makeTrapEventFieldDetail(record, 'DateChecked');
                        text += self.makeTrapEventFieldDetail(record, 'TotalCount');
                        text += self.makeTrapEventFieldDetail(record, 'TotalNonPestCount');


                        // less important details
                        text += self.makeTrapEventFieldDetail(record, 'DateInserted');
                        text += self.makeTrapEventFieldDetail(record, 'DateModified');
                    }
                    // make trapped items panel a rollable floating panel
                    var rollablePanelId = self.mapUtilities.featureDetailsId;
                    var filteringBody = jQuery('#' + rollablePanelId).html();
                    self.mapUtilities.displayRollablePanel(
                            rollablePanelId,
                            IMu.string('ipm-report-trap-event-heading'),
                            text,
                            true,
                            self.useResizablePanels,
                            undefined);
            });
    }
};
