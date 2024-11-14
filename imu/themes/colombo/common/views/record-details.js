(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for record-details should go in the
    ** appropriate file in the record-details directory. For example,
    ** specific code for the Parties module should go in
    ** record-details/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
	theme.views.register('record-details', 'paged-viewer',
	{
		_source: 'colombo/common/record-details',

		all:
		{
			_construct: function()
			{
				var self = this;

				self._super.apply(self, arguments);

				self.showSaveMultimedia = undefined;
                self.pendingSection = undefined;
			},

			_create: function()
			{
				var self = this;

				self._super();
			},

			resize: function()
			{
				var self = this;

				self._super();
			},

			/* Show the multimedia, title &, possibly, the selector checkbox
			 * associated with a record from another database, i.e. the 'data'
			 * parameter contains the column values for a non-multimedia
			 * record.
			 */
			showMultimedia: function(owner, data)
			{
				var self = this;
                    
                // TODO: make buttons functional.
                //  * only display if view and data exists
                //  * clicking button changes view
                var tbody = owner.child('table').child('tbody');
                var tab = tbody.child('tr').child('td');
                tab.addClass('mm-tab');
                var holder = tab.child('div');
                holder.css('display', 'inline-block');
                var tr = tbody.child('tr');

                var buttons = [];
                var cells = [];

                var showMM = false;
                if ((data.multimedia && data.multimedia.length > 0))
                {
                    showMM = true;

                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/object-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/object-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            mmCell.css('display', 'table-cell');
                        }
                    });
                    button.createView();
                    buttons.push(button);

                    var mmCell = tr.child('td');
                    mmCell.addClass('multimedia-cell');
                    cells.push(mmCell);
                    self.showMedia(mmCell, data.multimedia);
                }

                if (false) //TODO: i have no idea how this works
                {
                    showMM = true;

                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/museum-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/museum-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            museumCell.css('display', 'table-cell');
                        }
                    });
                    button.createView();
                    buttons.push(button);

                    var museumCell = tr.child('td');
                    museumCell.addClass('museum-cell');
                    cells.push(museumCell);
                    self.showMuseum(museumCell, data);
                }
                
                // TODO: need criterior for map view
                if ((data.x && data.x[0] && data.x[0].val !== undefined) &&
                    (data.y && data.y[0] && data.y[0].val !== undefined)) 
                {
                    showMM = true;

                    var mapCell = tr.child('td');
                    mapCell.addClass('map-cell');
                    cells.push(mapCell);
                    self.createMap(mapCell, data.rid);//, pointsToAdd);
                    
                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/map-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/map-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            mapCell.css('display', 'table-cell');

                            mapCell.find('.owner .olMap').each(function()
                            {
                                jQuery(this).css('height', '100%');
                            });
                            mapCell.children('.owner').each(function()
                            {
                                jQuery(this).css('position', 'relative');
                                var map = jQuery(this).IMu();
                                map.view.resize();
                            });
                        }
                    });
                    button.createView();
                    buttons.push(button);
                }

                if (showMM)
                {
                    // Trigger onClick event
                    buttons[0].setState('off');
                    buttons[0].onClick();
                }
                else
                    owner.css('display', 'none');
			},

			showMedia: function(owner, multimedia)
			{
				var self = this;
                

				if (! multimedia || multimedia.length < 1)
					return;
                
                var base = owner.child('div', 'multimedia');
                base.css(
                {
                    overflow: 'visible',
                    width: '100%'
                });
				for (var i = 0; i < multimedia.length; i++)
				{
                    var holder = base.child('div', 'holder');
                    holder.css('display', 'inline-block');

                    var mmPlugin = holder.IMuMultimedia();

                    mmPlugin.setOptions(
                    {
                        autoMargin: false,
                        onClick: undefined
                    });
                    mmPlugin.addResourceByKey(multimedia[i].irn);
				}

                // base has a slightly smaller height set in css so that we can
                // read this value and pass it to the slides constructor. We
                // then give base the correct height.
                var height = base.outerHeight();
                var width = base.outerWidth();
                base.slidesjs(
                {
                    height: height,
                    width: width
                });

                var height = owner.outerHeight();
                base.css('height', '100%');

                return;
			},

            showMuseum: function(owner)
            {
                var self = this;

                owner.text("TODO: Museum view");
            },

            //TODO: change to construct or make
			createMap: function(owner, rid)//, pointsToAdd)
            {
                var self = this;
                var div = owner.child('div', 'map');
                div.css('position', 'absolute');
                var map = div.IMu('map-viewer',
                {
                    autoAdjustAspectRatio: false,
                    addZoomToShowAllControl: true,
                    anchorLegendOnMap: false,
                    clusterPoints: false,
                    dateLineWrap: false,
                    moreDetailsDialogue: false,
                    showLayerSwitcher: true,
                    showMouseCoordinates: false,
                    showStatusMessages: false,
                    singleShot: true,
                    useInternationalMarkerMaker: true,
                    useSimpleDetailDisplay: false,
                    useSphericalMercator: true,
                    zoomToAllInitially: true
                });
                
                map.addLayer('google-physical');
                map.addLayer('google-streets');
                map.addLayer('osm');
                map.createView();

                var a = rid.split(/[.:]/);
                if (a.length < 2)
                    return;
                var module = a[0];
                var key = a[1];
                
                var search = new IMu.Request.Search();
                search.search(['irn', key], [module], function(hits)
                {
                    if (hits.total > 0)
                        map.showSearch(search);
                });
            },

			showSection: function(owner, items, name, table)
			{
				var self = this;
/*
				if (! items || items.length < 1)
					return;

				var section = owner.child('div', 'section ' + name);
				var label = IMu.string('section-' + name + '-label');

				self.showSectionHeader(section, label);
				self.showSectionItems(section, table, items);
*/                
			},

			showSectionHeader: function(owner, heading)
			{
				var self = this;
/*
 
				var tr = owner.child('table').child('tr');
				var td = tr.child('td');
				div = td.child('div', 'section-buttons');

				var button = div.child('button', 'hide');

				button.text(IMu.string('section-hide-label'));
				button.bind('click', function()
				{
					owner.find('.items').hide();
				});

				button = div.child('button', 'show');
				button.text(IMu.string('section-show-label'));
				button.bind('click', function()
				{
					owner.find('.items').show();
				});

				td = tr.child('td');
				var div = td.child('div', 'section-heading');
				div.text(heading);
*/                
			},

			showSectionItems: function(owner, tableName, items)
			{
				var self = this;
/*
				var div = owner.child('div', 'items');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];

					var show = (function(irn)
					{
						return function()
						{
							self.widget.showRecord(tableName, irn);
						}
					})(item.irn);

					var elem = div.child('div', 'item');
					elem.bind('click', show);

					if (item.image)
					{
						var tr = elem.child('table').child('tr');
						elem = tr.child('td');

						var mm = new IMu.Request.Multimedia();
						mm.setKey(item.image.irn);
						mm.addFilter('kind', 'thumbnail');

						var mmPlugin =
							elem.child('div').IMuMultimedia({onClick: false});
						mmPlugin.addResource(mm);

						elem = tr.child('td');
					}
					elem.child('div').IMuEllipsis(item.title);
				}
*/                
			},
			
            collectionChanged: function()
            {
                var self = this;

/*
                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
*/                
            },

			/* Luca
			*/
			showTableRow: function(element, stringsId, value)
			{
				var self = this;

/*
				if (! value)
					return;
				if (value instanceof Array)
				{
					if (value.length == 1)
					{
						value = value[0];
					}
					else
					{
						self.showTableRows(element, stringsId, value);
						return;
					}
				}
				var tr = element.child('tr');
				var td = tr.child('td');
				td.text(IMu.string(stringsId) + ':');
				td = tr.child('td');
				td.text(value);
*/                
			},

			showTableRows: function(element, stringsId, values)
			{
/*            
				if (! values || values.length < 1)
					return;

				if (values.length > 1)
				{
					var pluralId = stringsId + 's';
					if (IMu.string(pluralId) != pluralId)
						stringsId = pluralId;
				}
				var tr = element.child('tr');
				var td = tr.child('td');
				td.text(IMu.string(stringsId) + ':');
				td = tr.child('td');
				for (var i = 0; i < values.length; i++)
				{
					tr = td.child('tr');
				 	tr.text(values[i] || '');
				}
*/                
			},

			/* Phil
			*/
            makeRefData: function(data, column, module)
            {
                var self = this;
                
                var value = null;

                if (!data || ! column)
                    return null;

                if (data instanceof Array)
                {
                    /* Process array
                    */
                    value = new Array();
                    for (var i = 0; i < data.length; i++)
                    {
                        if (data[i] && data[i].length)
                        {
                            /* Is multi-dimensional structure
                            */
                            value[i] = self.makeRefData(data[i],
                                column, module);
                        }
                        else if (data[i] && data[i][column])
                        {
                            /* Create appropriate data structure for cell
                            */
                            if (module && data[i].irn)
                            {
                                var newValue = new Object();
                                newValue.data = data[i][column];
                                newValue.irn = data[i].irn;
                                newValue.refModule = module;

                                value[i] = newValue;
                            }
                            else
                                value[i] = data[i][column];
                        }
                    }
                }
                else if (data[column])
                {
                    // Process cell
                    if (module && data['irn'])
                    {
                        var newValue = new Object();
                        newValue.data = data[column];
                        newValue.irn = data['irn'];
                        newValue.refModule = module;

                        value = newValue;
                    }
                    else
                        value = data[column];
                }
                else
                {
                    // This might not be reference data and the developer used
                    // the wrong function. Do nothing.
                }

                return value;
            },

            addDetail: function(prompt, value)
            {
                var self = this;

                if (! value)
                    return undefined;

                if (self.pendingSection === undefined)
                    self.newSection();
                    

                function add()
                {
                    var tr = jQuery('<tr>');
                    if (prompt !== undefined)
                    {
                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string(prompt) + ':');
                        td = tr.child('td', 'value');
                    }
                    else
                    {
                        var td = tr.child('td', 'value');
                        td.attr('colSpan', '2');
                    }
                    self.pendingSection.push(tr);

                    return td;
                }

                var td;

                var type = IMu.Type.get(value);
                if (type == 'array')
                {
                    if (value.length < 1)
                        return undefined;

                    td = add();

                    var valueTable = td.child('table');
                    for (var i = 0; i < value.length; i++)
                        self.addDetailRow(valueTable, value[i]);
                }
                else if (type == 'object')
                {
                    if (! value.refModule)
                        return undefined;

                    td = add();
                    td.text(value.data);
                    td.bind('click', function()
                    {
                        self.widget.showRecord(value.refModule, value.irn);
                    });
                    td.attr('class', 'link');
                }
                else
                {
                    td = add();
                    td.text(value);
                }

                return td;
            },

            addDetailRow: function(table, value)
            {
                var self = this;

                if (! value)
                    return;

                var tr = table.child('tr');
                var td = tr.child('td');

                // mo - if array contain object
                var type = IMu.Type.get(value);

                if(type == 'object')
                    td.text(value.data);
                else                                             
                    td.text(value);
                if (value.refModule)
                {
                    td.attr('class', 'link');
                    td.bind('click', function()
                    {
                        self.widget.showRecord(value.refModule, value.irn);
                    });
                }
            },

            // Creates a new row and a cell that spans multiple columns
            addMultiColumnDetail: function(columns, value)
            {
                var self = this;

                var td = self.addDetail(undefined, value);
                if (td === undefined)
                    return;

                jQuery(td).attr
                (
                    'style',
                    "-webkit-column-count: " + columns + "; " +
                    "-moz-column-count: " + columns + "; " +
                    "column-count: " + columns + ";"
                );
                return td;
            },

            /*  addTableDetails
                tblHead[i][j]
                    where 'i' is the header type (i = 0 horizontal, i = 1 vertical)
                    where 'j' is the header index
                tblData[i][j]
                    where 'i' is the column
                    where 'j' is the row
                owner is the parent element of the table being added
            */
            addTableDetails: function(tblHead, tblData, owner, level)
            {
                var self = this;

                if (level == undefined && owner == undefined)
                {
                    level = 0;
                    owner = jQuery('<tr>');
                }

                var rows = 0;
                var columns = 0;
                var dataWritten = false;

                /* Sizing up table
                */
                for (var i = 0; i < tblData.length; i++)
                {
                    if (tblData[i] && tblData[i].length)
                    {
                        if (tblData[i].length > rows)
                            rows = tblData[i].length;
                    }
                    else if (tblData[i] && tblData[i].nesttabColumns)
                        for (var n = 0; n < tblData[i].nesttabColumns; n++)
                            if (tblData[i][n] && tblData[i][n].length > rows)
                                rows = tblData[i][n].length;
                }

                if (rows == 0)
                    return false;

                columns = tblData.length;

                if (tblHead)
                {
                    if (tblHead[1] && tblHead[1].length > rows)
                        rows = tblHead[1].length;

                    if (tblHead[0] && tblHead[0].length > columns)
                        columns = tblHead[0].length;
                }

                // Write table
                var table = owner.child('table');
                var tr;
                var td;
                var th;

                // Write column headers
                if (tblHead)
                {
                    if (tblHead[0] && tblHead[0].length > 0)
                    {
                        tr = table.child('thead').child('tr');

                        if (tblHead[1] && tblHead[1].length > 0)
                            th = tr.child('th'); // leave top left header blank

                        for (var i = 0; i < tblHead[0].length; i++)
                        {
                            th = tr.child('th');
                            if (tblHead[0][i])
                                th.text(IMu.string(tblHead[0][i]));
                        }
                    }
                }

                for (var i = 0; i < rows; i++)
                {
                    tr = table.child('tr');

                    // Write row headers
                    if (tblHead && tblHead[1] && tblHead[1].length > 0)
                    {
                        td = tr.child('td', 'header');
                        if (tblHead[1][i])
                            td.text(IMu.string(tblHead[1][i]));
                    }

                    // Write data
                    for (var j = 0; j < columns; j++)
                        if (self.writeTableData(tblData, j, i, tr))
                            dataWritten = true;
                }
                
                if (level != 0)
                    return dataWritten;
                else if (dataWritten)
                {
                    if (self.pendingSection === undefined)
                        self.newSection();
                    self.pendingSection.push(owner);
                    return table;
                }
                else
                    return undefined;
            },

            writeTableData: function(tblData, columnNum, rowNum, owner)
            {
                var self = this;

                var dataWritten = false;
                var td = owner.child('td');

                if (! tblData[columnNum])
                    td.text = '';
                else if (tblData[columnNum].nesttabColumns)
                {
                    // Write nesttab data
                    td.attr('class', 'nesttab');

                    var cellData = new Array();

                    for (var nestColNum = 0; nestColNum < tblData[columnNum].nesttabColumns; nestColNum++)
                    {
                        if(tblData[columnNum][nestColNum])
                            cellData[nestColNum] = tblData[columnNum][nestColNum][rowNum];
                    }
                    if (self.addTableDetails(null, cellData, td))
                        dataWritten = true;
                }
                else if (tblData[columnNum][rowNum])
                {
                    if (tblData[columnNum][rowNum].refModule)
                    {
                        // Reference to another record
                        td.text(tblData[columnNum][rowNum].data);
                        td.bind('click', function()
                        {
                            self.widget.showRecord(
                                tblData[columnNum][rowNum].refModule,
                                tblData[columnNum][rowNum].irn);
                        });
                        td.attr('class', 'link');
                    }
                    else
                        td.text(tblData[columnNum][rowNum]);

                    dataWritten = true;
                }
                else
                    td.text = '';

                return dataWritten;
            },

            addSection: function(owner, header)
            {
                var self = this;
                var section = [];

                if (!owner || !header)
                    return null;

                var cell = self.addMultiColumnCell(jQuery(), 2);
                cell.text(IMu.string(header));
                cell.addClass('sub-header');
                cell.attr('id', header);
            },

            newSection: function(header)
            {
                var self = this;
                
                self.appendSection();

                self.pendingSection = [];
                self.pendingSection.header = false;
                if (header && header != "")
                {
                    var row = jQuery('<tr>');
                    var cell = row.child('td', 'sub-header');
                    cell.attr
                    ({
                        'colSpan': '2',
                        'id': header
                    });
                    cell.text(IMu.string(header));
                    self.pendingSection.push(row);
                    self.pendingSection.header = true;
                }
            },
            appendSection: function()
            {
                var self = this;

                if (! self.pendingSection || 
                    (self.pendingSection.length == 1 && 
                    self.pendingSection.header))
                    return;
                
                self.pendingSection[0].addClass('section-first-row');
                var last = self.pendingSection.length -1;
                self.pendingSection[last].addClass('section-last-row');

                self.contentTable.append(self.pendingSection);
            }
		},

        desktop:
        {
            makeHeader: function(image, data, subject)
            {
                var self = this;

                var holder = self.record.header.child('div', 'holder');
                holder.addClass('bg-colour-1 ' +
                                'colour-4 ' +
                                'font-1');
            
                // TODO: overflows. fix this
                var table = holder.child('table');
                var tr = table.child('tbody').child('tr');

                var td = tr.child('td', 'image');
//                td.css('width', '1%');

                var div = td.child('div');

                if (image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(image.irn);
                    mm.addFilter('kind', 'thumbnail');

                    var mmPlugin = div.IMuMultimedia(
                    {
                        autoMargin: false,
                        onCLick: false
                    });
                    mmPlugin.addResource(mm);
                }

                var td = tr.child('td', 'summary');
                if (data !== undefined)
                {
                    if (IMu.Type.isArray(data))
                    {
                        var ul = td.child('ul');
                        for (var i = 0; i < data.length; i++)
                            ul.child('li').text(data[i]);
                    }
                    else if (data)
                        td.text(data)
                }

                var td = tr.child('td', 'final');
                td.css(
                {
                    'text-align': IMu.Languages.current.far,
                    width: '1%'
                });

                var div = td.child('div', 'subject');
                if (subject)
                    div.text(subject);

                // TODO
                var fav = td.child('div', 'favorite');
/*                
                fav.css(
                {
                    'background-color': 'transparent',
                    height: '2em',
                    width: '2em'
                });
*/              

                var button = fav.IMu('button-control');
                button.addState(
                {
                    name: 'default',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=share/fav_outline'
                    }
                });
                button.addState(
                {
                    name: 'selected',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=share/fav_fill'
                    }
                });
                button.createView();
                fav.css('position', 'absolute');
                fav.css(IMu.Languages.current.far, '0.5em');
            }
        }
	});
})(IMu.Themes.get('colombo'));
