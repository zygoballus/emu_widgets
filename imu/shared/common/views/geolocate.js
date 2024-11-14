(function(theme)
{
    theme.views.register('geolocate', 'base',
    {
        _source: 'shared/common/geolocate',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                this.sourceInput = undefined;
                this.searchTerm = undefined;
                self.recordSummary = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                // var owner = self.widget.owner;
                var owner = self.widget.owner.child('div','owner');

                if (!self.widget.destination)
                    self.widget.destination = {};

                if (!self.widget.source)
                    self.widget.source = {};

                self.widget.destination.holder = owner.child('div', 'imu-destination-owner section');;
                if (self.widget.options.method == 'external')
                {
                    self.createInput();
                }

                var destination = self.widget.destination.holder;
                var label = destination.child('div');
                label.text(IMu.string('records-from-emu'));

                var destMap = destination.child('div', 'map');

                var map = destMap.IMu('map-viewer', {
                                        addZoomToShowAllControl: true,
                                        zoomToAllInitially: true,
                                        anchorLegendOnMap: true,
                                        singleShot: true
                });
                self.widget.destination.mapWidget = map; 
                map.addLayer('osm');
                var selection = destination.child('select', 'select');
                selection.attr('size', 10);
                selection.attr('multiple', 'multiple');
                self.widget.destination.selection = selection;
                var update = self.widget.getOption('showUpdate', 'true');
                if (update)
                {
                    var buttons = destination.child('div');
                    buttons.addClass('buttons');
                    var holder = buttons.child('div', 'holder');

                    if (update)
                    {
                        var button = self.update = holder.child('span',
                            'update').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('update-from-emu') + ':'
                            },
                            onClick: function()
                            {
                                var selection = self.widget.destination.selection;
                                self.widget.irn = selection.val();
                                self.recordSummary.text(selection.selectedOptions[0].text);
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();
                    }
                }

                self.widget.source.holder = owner.child('div', 'imu-source-owner section');;
                var source = self.widget.source.holder;
                var label = source.child('div');
                label.text(IMu.string('points-from-tulane'));

                var mapper = owner.child('div', 'imu-mapper section');
                var map = mapper.IMu('map-viewer', {
                                        addZoomToShowAllControl: true,
                                        zoomToAllInitially: true,
                                        anchorLegendOnMap: true,
                                        singleShot: true
                });
                self.widget.source.mapWidget = map; 
                IMu.Events.bind('map-viewer-record-selected', function(evt,data)
                {
                    // This filters out points from EMu
                    if (data.x && data.y)
                        self.widget.pointSelected = data;
                    else
                    {
                        var search = self.widget.destination.mapWidget.searchResults['EMu Data Search'].result.rows;
                        for (var i =0 ; i < search.length; i++)
                        {
                            if (search[i].rid == data)
                            {
                                self.widget.destination.selection.val(search[i].irn);
                            }
                        }
                    }
                });
                map.addLayer('osm');
                map.addLayer('google-satellite');

                var options = self.widget.getOption('editorOptions')
                if (options)
                    self.widget.configure(options);

                // Cancel and Save
                //
                var update = self.widget.getOption('showUpdate', 'true');
                if (update)
                {
                    var buttons = self.widget.owner.child('div');
                    buttons.addClass('buttons');
                    var holder = buttons.child('div', 'holder');

                    if (update)
                    {
                        var button = self.update = holder.child('div',
                            'update').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('update-emu-record')
                            },
                            onClick: function()
                            {
                                self.widget.validate(function(info)
                                {
                                    self.widget.doUpdate(function(result)
                                    {
                                        if (self.widget.options.onlyEmpty == true)
                                        {                                    
                                            self.clearSource();
                                            self.clearDestination();

                                            var val = self.sourceInput.IMu().value;
                                            self.searchTerm = val;
                            
                                            self.widget.doFetchSource(val,function(result)
                                            {
                                                self.postSearch(result, self.widget.source.selection);
                                            });
                                        }
                                    });
                                });
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();

                        var button = self.createNew = holder.child('div',
                            'update').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('create-new-with-coords')
                            },
                            onClick: function()
                            {
                                self.widget.validate(function(info)
                                {
                                    self.widget.createNew(function(result)
                                    {
                                        self.widget.irn = result.irn;
                                        self.recordSummary = result.SummaryData;
                                    });
                                });
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();

                    }
                }
            },

            clearDestination: function()
            {
                if (this.widget.destination.selection)
                    this.widget.destination.selection.empty();
            },
            clearSource: function()
            {
                if (this.widget.source.selection)
                    this.widget.source.selection.empty();
            },

            createInput: function()
            {
                var self = this;

                var destination = this.widget.destination.holder;
                var input = destination.child('div', 'input');

                var field = input.IMu('text-control',
                {
                    hint: 'City, [State], Country',
                    onEnter: function()
                    {
                        self.clearDestination();
                        self.clearSource();
                        var data = {};
                        data.url = self.widget.source.url;
                        var textValue = this.value.replace(', ',',');
                        var res = textValue.split(',');
                        data.locality = res[0];
                        if (res.length == 3)
                        {
                            data.State = res[1];
                            data.Country = res[2];
                        }
                        else
                            data.Country = res[1];

                        self.searchTerm = this.value;
                        self.widget.doFetchDestination(data, function(result)
                        {
                            self.postFetchDestination(result,self.widget.destination.selection);
                        });
                        self.widget.doFetchSource(data, function(result)
                        {
                            self.postSearch(result, self.widget.destination.selection);
                        }); 
                        
                    }
                });
                if (!field.view)
                    field.createView();

                var selected = destination.child('div','selected-record');
                var label = selected.child('span','label');
                label.text(IMu.string('record-selected'));
                self.recordSummary = selected.child('span','record');
            },
            postFetchDestination: function(data, selector)
            {
                var self = this;
                self.updateMapSearch(data.search);    
                self.updateSelect(data.summaries, selector);
            },
            postSearch: function(data, selector)
            {
                var self = this;
                
                self.updateMap(data.points);

            },
            updateMapSearch: function(data)
            {
                var self = this;
                var map = self.widget.destination.mapWidget;
                map.setSearch(data);
            },
            updateMap: function(data)
            {
                var self = this;
                var pointsToAdd = {};
                pointsToAdd.points = [];
                var map = self.widget.source.mapWidget;

                if (map.options.singleShot)
                {
                    map.clearSearchRegions();
                    map.searches = [];
                }

                // Set map.analysedData
                map.makeSearchName(self.searchTerm);
                map.analysedData[self.searchTerm] = {
                    'categories': {},
                    'collateByCategory': 'x',
                    'displayName': self.searchTerm,
                    'rawData': data.points,
                    'searchIndex': '0',
                    'symbolShape': 'square',
                    'symbolSize': '6'
                };
                for (var i = 0; i < data.length; i++)
                {
                    var point = data[i];
                    point.rid = data[i];
                    map.analyseRecord(map.analysedData[self.searchTerm].categories, point, self.searchTerm);
                    var info = map.setPointInformation(point,self.searchTerm,self.searchTerm);
                    var f = map.makeFeature(point.x, point.y, undefined, info);
                    pointsToAdd.points.push(f);
                }
                map.addPointsToMap(pointsToAdd,self.searchTerm,
                        'x',
                        true,false);
            },
            updateSelect: function(data, selector)
            {
                var self = this;
                if (selector)
                    selector.empty();

                for (var i = 0; i < data.length; i++)
                {
                    var option = selector.child('option');
                    var text = data[i].value;
                    var string = "";

                    if (text)
                        string = text;
                    else if (text == "")
                        string = "NULL";
                    if (data[i].irns)
                    {
                        string += ' (' + data[i].irns.length + ')';
                        //option.val(data[i].count);
                    }
                    if (data[i].irns)
                        option.val(data[i].irns);
                    else if (data[i].val)
                        option.val(data[i].val);

                    option.text(string);
                }
            }
        }
    });
})(IMu.Themes.shared);
