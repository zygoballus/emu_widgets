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
		_source: 'prague/common/record-details',

		all:
		{
			_construct: function()
			{
				var self = this;

				self._super.apply(self, arguments);

				self.showSaveMultimedia = undefined;
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

				var table = owner.child('table');
				var tr = table.child('tr');

				if (data.multimedia && data.multimedia.length > 0)
				{
					var td = tr.child('td', 'multimedia-cell');
					self.showMedia(td, data.multimedia);
				}
				var details = tr.child('td', 'details-cell').child('div', 'details');
				var titleRow = details.child('table', 'title').child('tr');
				titleRow.child('td').text(data.title);

				if (self.widget.options.showSelectionControl)
				{
                    // Hack
                    td = tr.child('td');
                    td.css('width', '1%');
                    // End

                    td = titleRow.child('td', 'select-cell');
					td.css('width', '1%');

					self.showSelectionControl(td, data);
				}

				return details;
			},

			showMedia: function(owner, multimedia)
			{
				var self = this;

				if (! multimedia || multimedia.length < 1)
					return;

                owner.addClass('multimedia-cell');
				var base = owner.child('div', 'multimedia');
				var mainPlugin = base.IMuMultimedia();
				for (var i = 0; i < multimedia.length; i++)
				{
					mainPlugin.addResourceByKey(multimedia[i].irn);
				}

				if (self.showSaveMultimedia)
				{
					var saveMultimediaDiv = owner.child('div', 'multimedia-show-save');
					var saveMultimediaTr = saveMultimediaDiv.child('table').child('tr');
					saveMultimediaTr.child('td', 'multimedia-count').text('1/' + multimedia.length);

					var mm = new IMu.Request.Multimedia();
					mm.setKey(multimedia[0].irn)
					mm.setDisposition('attachment');
					var url = mm.getURL();
					var a = saveMultimediaTr.child('td').child('a', 'multimedia-save');
					a.text(IMu.string(self.showSaveMultimedia));
					a.attr('href', url);
				}

				if (multimedia.length < 2)
					return;

				var scrollerDiv = owner.child('div', 'multimedia-scroller');
				var tr = scrollerDiv.child('table').child('tr');

				for (var i = 0; i < multimedia.length; i++)
				{
					var irn = multimedia[i].irn;
					var mimeType = multimedia[i].type;

					/* add the multimedia to the secondary multimedia plugin.
					 * Note the closure in loop issue.
					*/
					var show = (function(index, irn)
					{
						return function()
						{
							mainPlugin.show(index);

							if (self.showSaveMultimedia)
							{
								saveMultimediaDiv.find('.multimedia-count').text(
									(index + 1) + '/' + multimedia.length);
								var mm = new IMu.Request.Multimedia();
								mm.setKey(irn)
								mm.setDisposition('attachment');
								var url = mm.getURL();
								saveMultimediaDiv.find('.multimedia-save').attr('href', url);
							}
						}
					})(i, irn);

					var td = tr.child('td');
					var plugin = td.child('div').IMuMultimedia({ onClick:
						show });

					if (mimeType == 'image')
					{
						var mm = new IMu.Request.Multimedia();
						mm.setKey(irn);
						mm.addFilter('kind', 'thumbnail');
						plugin.addResource(mm);
					}
					else
					{
						td.find('div').attr('class', 'imu-plugin imu-multimedia-plugin imu-multimedia-icon');
						var src = IMu.Request.getURL('Image') + '&name=multimedia-' + mimeType;
						plugin.addImage(src);
					}
				}
				var options =
				{
					scrollType: 'horizontal',
					horizontalPager: true,
                    onResize: function()
                    {
                        if (this.content.fullWidth() > this.view.fullWidth())
                        {
                            this.left.css('visibility', 'visible');
                            this.right.css('visibility', 'visible');
                        }
                        else
                        {
                            this.left.css('visibility', 'hidden');
                            this.right.css('visibility', 'hidden');
                        }
                    }
				};
				var scroller = scrollerDiv.IMuScroller(options);
				var content = scroller.getContent();
				var parts = content.find('td');
				var offsetOne = jQuery(parts[0]).offset();
				var offsetTwo = jQuery(parts[1]).offset();
				var snap = offsetTwo.left - offsetOne.left;
				scroller.setOptions({ horizontalSnap: snap });
			},

			showSection: function(owner, items, name, tableName)
			{
				if (! items || items.length < 1)
					return;

				var section = owner.child('div', 'section ' + name);
				var label = IMu.string('section-' + name + '-label');

				this.showSectionHeader(section, label);
				this.showSectionItems(section, tableName, items);
			},

			showSectionHeader: function(owner, heading)
			{
				var self = this;

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
			},

			showSectionItems: function(owner, tableName, items)
			{
				var self = this;

				var div = owner.child('div', 'items');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];
					if (item)
					{
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
				}
			},
			
            collectionChanged: function()
            {
                var self = this;

                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            },

			/* Luca
			*/
			showTableRow: function(element, stringsId, value)
			{
				var self = this;

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
			},

			showTableRows: function(element, stringsId, values)
			{
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
			},

			/* Phil
			*/
            makeRefData: function(data, column, module)
            {
                var self = this;
                var value = null;

                if (!data || ! column)
                    return null;

                if (data.length)
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

                return value;
            },

            makeHitsData: function(data, column, module)
            {
                var self = this;
                var value = null;

                if (!data || ! column)
                    return null;

                if (data.length)
                {
                    /* Process array
                    */
                    value = new Array();

                    if (data instanceof Array)
                    {
                        for (var i = 0; i < data.length; i++)
                        {
                            /* Create appropriate data structure for cell
                            */
                            if (data[i] && module)
                            {
                                    var newValue = new Object();
                                    if (data[i][column])
                                        newValue.data = data[i][column];
                                    else
                                        newValue.data = data[i];
                                    newValue.refModule = module;
                                    newValue.column = column;
                                    newValue.getHits = true;

                                    value[i] = newValue;
                            }
                        }
                    }
                    else
                    {
                        var newValue = new Object();
                        newValue.data = data;
                        newValue.refModule = module;
                        newValue.column = column;
                        newValue.getHits = true;

                        value = newValue;
                    }
                }

                return value;
            },

            addDetail: function(prompt, value, owner)
            {
                var self = this;

                if (! value)
                    return undefined;

                function add()
                {
                    var tr = owner.child('tr');

                    var td = tr.child('td', 'prompt');
                    td.text(IMu.string(prompt) + ':');

                    td = tr.child('td', 'value');

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

                    if (value.getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([value.column, value.data],
                                [value.refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                
                                if (widget.name == 'tabbed-display')
                                {
                                    for (var i = 0; i < widget.pages.length; i++)
                                    {
                                        var page = widget.pages[i];
                                        if (page.title != 'combined-viewer')
                                            continue;
                                        
                                        widget.select(i);
                                        widget = widget.pages[i].widget;

                                        break;
                                    }
                                }

                                widget.addState(search);
                                widget.select(0);
                             });
                        });

                        var module = new IMu.Request.Module(value.refModule);
                        module.findTerms([value.column, value.data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(value.data + ' (' + hits + ')');
                            }
                        });
                    }
                    else
                    {
                        td.bind('click', function()
                        {
                            self.widget.showRecord(value.refModule, value.irn);
                        });
                        td.attr('class', 'link');
                    }
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
                if (value.getHits)
                {
                    td.bind('click', function()
                    {
                       var search = new IMu.Request.Search();
                        search.search([value.column, value.data],
                            [value.refModule], function(hits)
                        {
                            if (hits < 1)
                                return;
                            var widget = self.widget;
                            
                            if (widget.controller)
                                widget = widget.controller;
                            
                            if (widget.name == 'tabbed-display')
                            {
                                for (var i = 0; i < widget.pages.length; i++)
                                {
                                    var page = widget.pages[i];

                                    if (page.title != 'combined-viewer')
                                        continue;

                                    widget.select(i);
                                    widget = widget.pages[i].widget;

                                    break;
                                }
                            }
                            
                            widget.addState(search);
                            widget.select(0);
                         });
                    });

                    var module = new IMu.Request.Module(value.refModule);
                    module.findTerms([value.column, value.data], function(hits)
                    {
                        if (hits > 0)
                        {
                            td.addClass('link');
                            td.text(value.data + ' (' + hits + ')');
                        }
                    });
                }
                else if (value.refModule)
                {
                    td.attr('class', 'link');
                    td.bind('click', function()
                    {
                        self.widget.showRecord(value.refModule, value.irn);
                    });
                }
            },

            // Creates a new row and a cell that spans multiple columns
            addMultiColumnCell: function(owner, span)
            {
                var self = this;

                var tr = owner.child('tr');
                var td = tr.child('td');
                td.attr('colSpan', span);

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
            addTableDetails: function(tblHead, tblData, owner)
            {
                var self = this;
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

                return dataWritten;
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
                    if (tblData[columnNum][rowNum].getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([tblData[columnNum][rowNum].column, 
                                tblData[columnNum][rowNum].data], 
                                [tblData[columnNum][rowNum].refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                widget.addState(search);
                             });
                        });

                        var module = new IMu.Request.Module(
                            tblData[columnNum][rowNum].refModule);
                        module.findTerms([tblData[columnNum][rowNum].column, 
                            tblData[columnNum][rowNum].data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(tblData[columnNum][rowNum].data + ' (' 
                                    + hits + ')');
                            }
                        });
                    }
                    else if (tblData[columnNum][rowNum].refModule)
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

                if (! owner)
                    return null;

                var div = owner.child('div', 'info');

                if (header)
                {
                    var head = div.child('div', 'record-section-header');
                    head.text(IMu.string(header));
                    head.text(IMu.string(header));
                }

                var table = div.child('table', 'details');
                table.css('clear', 'both');
                table.css('width', '100%');
                table.attr('id', header);

                return table;
            },

			removeEmptySections: function(owner)
            {
                var self = this;

                owner.children('.info').each(function()
                {
                    jQuery(this).find('.details').each(function()
                    {
                        var size = jQuery(this).children('tbody').children().length;

                        if (size == 0)
                            jQuery(this).parent().remove(); //TODO: add trace?
                    });
                });
            }
		},

        phone:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            // This function has been copied except for the
            // add() mechanic which now places the value
            // on the line below the prompt.
            addDetail: function(prompt, value, owner)
            {
                var self = this;

                if (! value)
                    return undefined;

                function add()
                {
                    var tr = owner.child('tr');
                    var td = tr.child('td', 'prompt');
                    td.text(IMu.string(prompt) + ':');

                    tr = owner.child('tr');
                    td = tr.child('td', 'value');

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

                    if (value.getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([value.column, value.data],
                                [value.refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                
                                if (widget.name == 'tabbed-display')
                                {
                                    for (var i = 0; i < widget.pages.length; i++)
                                    {
                                        var page = widget.pages[i];
                                        if (page.title != 'combined-viewer')
                                            continue;
                                        
                                        widget.select(i);
                                        widget = widget.pages[i].widget;

                                        break;
                                    }
                                }

                                widget.addState(search);
                                widget.select(0);
                             });
                        });

                        var module = new IMu.Request.Module(value.refModule);
                        module.findTerms([value.column, value.data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(value.data + ' (' + hits + ')');
                            }
                        });
                    }
                    else
                    {
                        td.bind('click', function()
                        {
                            self.widget.showRecord(value.refModule, value.irn);
                        });
                        td.attr('class', 'link');
                    }
                }
                else
                {
                    td = add();
                    td.text(value);
                }

                return td;
            },

            showMultimedia: function(owner, data)
            {
                var table = owner.child('table');
                var tr = table.child('tr');
                
                var td = tr.child('td', 'titlerow');
                
                td.child('div', 'title').IMuEllipsis(data.title || '');
                
                if (this.widget.options.showSelectionControl)
                {
                    this.showSelectionControl(
                        td.child('div', 'select-cell'), data);
                }

                if (data.multimedia && data.multimedia.length > 0)
                {
                    tr = table.child('tr');
                    td = tr.child('td', 'multimedia-cell');
                    
                    if (this.widget.options.showSelectionControl)
                        td.attr('colspan', '2');

                    this.showMedia(td, data.multimedia);
                }

                tr = table.child('tr');
                
                var details = tr.child('td', 'details-cell').child('div', 'details');
                
                if (this.widget.options.showSelectionControl)
                    td.attr('collspan', '2');
                
                return details;
            }
        }
	});
})(IMu.Themes.get('prague'));
