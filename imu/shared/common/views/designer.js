(function(theme)
{
    theme.views.register('designer', 'base',
    {
        _source: 'shared/common/designer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.holder = undefined;

                this.title = undefined;
                this.details = undefined;
                this.permissions = undefined;
                this.description = undefined;   // A brief description of the 
                                                // use of the final product

                this.tables = undefined;
                this.table = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);
                var self = this;

                var holder = self.holder = self.widget.owner.child('div', 'holder');
                holder.addClass('txt-colour-3');
                
                var title = self.title = holder.child('div', 'title');
                title.addClass('txt-colour-2');
            },

            addCollapsibleElement: function(owner, options)
            {
                if (! owner)
                    return;
                return _addCollapsibleElement(owner, options);
            },

            // private
            // 
            /*!
            ** Adds a new filter to an element in the designer.
            **
            ** Creates a form containing input fields for a column name and
            ** column value relating to conseptual element such as an attachment
            ** field or search.
            ** 
            ** When the page is built using either the `form-builder` or
            ** `editor-builder` any queries run by the element must also match 
            ** **all** of the filter terms added.
            **
            ** The column field will suggest values based on the table
            ** specified at the top of the designer.
            **
            ** @param owner
            **   The jQuery element in which to create the filter.
            **
            ** @param info
            **   An array containing two elements: column and value.
            **   If this parameter is specified, the column and value input
            **   fields will be filled in on creation.
            */
            addFilter: function(owner, info)
            {
                if (! owner)
                    return;
                var self = this;

                var table = self.details.getValue('table');
                var terms = undefined;
                if (info)
                {
                    if (info.table != undefined)
                        table = info.table;
                    terms = info.terms;
                }

                var holder = owner.children('.holder');
                var filter = holder.child('div', 'filter');
                var form = filter.IMu('form',
                {
                    rows: 1
                });
                form.addField('text',
                {
                    name: 'column',
                    label: 'designer-filter-column',
                    suggest: function(suggest, prefix, callback)
                    {
                        if (! table)
                        {
                            callback([]);
                            return;
                        }
                        var request = new IMu.Request.Schema();
                        request.getColumns(table, prefix, function(list)
                        {
                            callback(list);
                        });
                    }
                });
                form.addField('text',
                {
                    name: 'value',
                    label: 'designer-filter-value'
                });
                form.addField('empty');
                form.createView();

                form.view.table.find('td:nth-last-child(1)').each(function()
                {
                    jQuery(this).addClass('column-remove');
                    var remove = jQuery(this).child('div', 'filter-remove');
                    var button = remove.IMu('button-control');
                    button.addState(
                    {
                        layout:
                        [
                            {
                                type: 'image',
                                value: IMu.Request.getURL('Image')
                                    + '&name=cross'
                            }
                        ],
                        onClick: function()
                        {
                            filter.remove()
                        }
                    });
                    button.createView();
                });

                if (terms)
                {
                    var values =
                    {
                        'column': terms[0],
                        'value': terms[1]
                    };
                    form.setValues(values);
                }

                return filter;
            },

            /*!
            ** Adds additional user or group specific permissions.
            **
            ** @param level
            **   Either **user** or **group**.
            **
            ** @param name
            **   The name of the user or group that the permission applies to.
            **
            ** @param permission
            **   What permission the user or group has for the form or editor.
            **   This can be either:
            **   * edit
            **   * use
            **   * none
            */
            addPermission: function(level, name, permission)
            {
                var self = this;
                
                var additional = 
                    self.permissions.content.children('.additional')
                additional.css('display', 'block');

                var grid = 
                    self.permissions.content.find('.additional > .grid');
                var widget = grid.IMu();

                var values = {};
                if (level)
                    values.level = level;
                if (name)
                    values.name = name;
                if (permission)
                    values.permission = permission;
                values.remove = 1;

                var row = widget.appendRow(values);
                var remove = row.getCellByName('remove');
                var image = jQuery(remove.widget.view.icon);
                image.on('click', function()
                {
                    row.remove();
                    if (widget.rows.length == 0)
                        additional.css('display', 'none');
                });
            },

            /*!
            ** Creates a section of grouped elements.
            **
            ** Creates a div containing a title area, field area and filter area.
            ** The section can be rearranged with other sections via drag and
            ** drop, toggled open/closed and removed entirely.
            **
            ** @param sectionHeading
            **   The label for the section when it is built or toggled closed.
            **   If this parameter is passed, the label will be filled on
            **   creation.
            **
            ** @returns section
            **   The div created to represent the section.
            */
            // Kept for statistics-designer, which has not been converted to using
            // collapsible groups yet.
            addSection: function(sectionHeading)
            {
                var self = this;

                var section = self.sections.child('div', 'section');
                section.addClass('border-2');

                var title = section.child('div', 'title');
                title.addClass('bg-colour-2');
                var tr = title.child('table').child('tbody').child('tr');

                var label = tr.child('td', 'label');
                label.css('width', '99%');
                label.text(IMu.string(sectionHeading));

                tr.child('td', 'padding');

                var toggle = tr.child('td', 'toggle');
                toggle.css('width', '1%');
                var sectionToggle = toggle.child('div', 'section-toggle');
                section.add = undefined;
                section.holder = undefined;
                var button = sectionToggle.IMu('button-control');
                button.addState(
                {
                    name: 'opened',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=arrow_u'
                    },
                    onClick: function()
                    {
                        if (holder !== undefined )
                        {
                            holder.css('display', 'none');
                            this.setState('closed');
                        }
                    }
                });
                button.addState(
                {
                    name: 'closed',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=arrow_d'
                    },
                    onClick: function()
                    {
                        if (holder !== undefined)
                        {
                            holder.css('display', 'block');
                            this.setState('opened');
                        }
                    }
                });
                button.createView();

                var holder = section.child('div', 'holder');
                holder.addClass('bg-colour-1');

                var details = section.holder = holder.child('div', 'details');
                details.addClass('bg-colour-2');

                /* Section terms
                */
                var filters = self.makeFilters(holder);
                section[0].filters = filters;

                return section;
            },

            /*!
            ** Checks that a valid table has been set for the designer.
            **
            ** If the table is invalid or a new value, table specific values
            ** such as column names are cleared.
            */
            checkTable: function()
            {
                var self = this;

                self.loadTables(function(tables)
                {
                    var table = undefined;
                    var check = self.details.getValue('table');
                    if (check)
                    {
                        check = check.toLowerCase();
                        for (var i in tables)
                        {
                            if (tables[i].toLowerCase() == check)
                            {
                                table = tables[i];
                                break;
                            }
                        }
                    }
                    if (table)
                    {
                        self.details.setValue('table', table);
                        if (self.table && self.table != table)
                            self.clearColumns();
                        self.enableColumns(true);
                    }
                    else
                    {
                        self.details.setValue('table', '');
                        self.clearColumns();
                        self.enableColumns(false);
                    }
                    self.table = table;
                });
            },

            /*!
            ** Clears all input relating to field columns.
            */
            clearColumns: function()
            {
                var fields = this.getColumns();
                for (var i in fields)
                    fields[i].widget.setValue('');
            },

            /*!
            ** Clears all input in the details section.
            */
            clearDetails: function()
            {
                this.details.clearForm();
            },

            /*!
            ** Removes all filters in a jQuery element.
            **
            ** @param owner
            **   The jQuery element in which to find filters.
            */
            clearFilters: function(owner)
            {
                if (! owner)
                    return;

                var filterElems = owner.find('.filter').each(function()
                {
                    var filterElem = jQuery(this);
                    filterElem.remove();
                });
            },

            /*!
            ** Resets the designer permission to default.
            */
            clearPermissions: function()
            {
                var holder = this.permissions.content;

                var everyone = holder.children('.everyone').IMu();
                var permission = 'none';
                everyone.setValue('permission', permission);

                var additional = holder.find('.additional > .grid').IMu();
                additional.clearGrid();
                holder.children('.additional').css('display', 'none');
            },

            /*!
            ** Toggles write access on columns.
            */
            enableColumns: function(enable)
            {
                var fields = this.getColumns();
                for (var i in fields)
                    fields[i].widget.setOption('readonly', ! enable);
            },
            
            /*!
            ** Gets all filters in a jQuery element.
            **
            ** Extracts filter information for a conceptual element in the
            ** designer and adds the results to ``info``.
            ** 
            ** @param owner
            **   The jQuery element in which to find filters.
            **
            ** @param info
            **   A hash representing the structure of the designer.
            **
            ** @returns terms
            **   An array of column and value pairs, each representing a filter
            **   term.
            */
            getFilters: function(owner, info)
            {
                var terms = [];
                var filterElems = owner.find('.filter').each(function()
                {
                    var filterElem = jQuery(this);
                    var filter = filterElem.IMu().getValues();
                    if (filter.column != null && filter.value != null)
                        terms.push([filter.column, filter.value, null]);
                });
                if (terms.length > 0 && info)
                    info.filter = { "terms": terms };

                return terms;
            },

            /*!
            ** Gets the permmissions for a designer and stores it in ``form``.
            **
            ** @param form
            **   A hash representation of the designer.
            */
            getPermissions: function(form)
            {
                form.permissions = {};

                var holder = this.permissions.content;

                var everyone = holder.children('.everyone').IMu();
                var permission = everyone.getValue('permission');
                form.permissions.everyone = permission;
                
                var additional = holder.find('.additional > .grid').IMu();
                var values = additional.getValues();
                for (var i in values)
                {
                    var additional = {};

                    var row = values[i];

                    additional.level = row.level;
                    additional.name = row.name;
                    if (! additional.name)
                        continue;
                    additional.permission = row.permission;

                    if (! form.permissions.additional)
                        form.permissions.additional = [];
                    form.permissions.additional.push(additional);
                }
            },

            /*!
            ** Loads a list of table names from the schema.
            **
            ** @param callback function
            **  The function to be called once tables are loaded.
            **  Takes a list of tables as a parameter.
            */
            loadTables: function(callback)
            {
                if (self.tables)
                {
                    callback(self.tables);
                    return;
                }
                var request = new IMu.Request.Schema();
                request.getTables(function(tables)
                {
                    self.tables = tables;
                    callback(self.tables);
                });
            },

            /*!
            ** Creates a set of buttons at the bottom of the page.
            **
            ** Creates save, cancel and exit buttons at the bottom of the page 
            ** based on the `designer` widget's options. 
            */
            makeButtons: function()
            {
                var self = this;

                // Cancel and Save
                //
                var save = self.widget.getOption('showSave', true);
                var cancel = self.widget.getOption('showCancel', true);
                var exit = self.widget.getOption('showExit', true);

                if (save || cancel || exit)
                {
                    var buttons = self.widget.owner.child('div');
                    buttons.addClass('buttons');

                    if (save)
                    {
                        var button = self.cancel = buttons.child('div', 
                            'save').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('designer-save')
                            },
                            onClick: function()
                            {
                                self.widget.validate(function(info)
                                {
                                    self.widget.doSave(self.widget.getDesigner());
                                });
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();
                    }
                    if (cancel)
                    {
                        var button = self. cancel = buttons.child('div', 
                            'cancel').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('designer-cancel')
                            },
                            onClick: function()
                            {
                                self.widget.doCancel();
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();
                    }
                    if (exit)
                    {
                        var button = self.exit = buttons.child('div',
                            'exit').IMu('button-control');
                        button.addState(
                        {
                            layout:
                            {
                                type: 'text',
                                value: IMu.string('designer-exit')
                            },
                            onClick: function()
                            {
                                self.widget.doExit();
                            },
                            classes: 'bg-colour-3 txt-colour-1'
                        });
                        button.createView();
                    }
                }
            },

            /*!
            ** Creates an area for filters to be added.
            **
            ** @param owner
            **   The element in which to create the filter area.
            */
            makeFilters: function(owner)
            {
                var self = this;

                if (! owner)
                    var owner = self.holder;

                var filters = owner.child('div', 'filters');

                var title = filters.child('div', 'title');
                title.addClass('txt-colour-3');
                var tr = title.child('table').child('tbody').child('tr');

                var label = tr.child('td', 'label');
                label.css('width', '99%');
                label.text(IMu.string('designer-filters'));
                
                var holder = filters.child('div', 'holder');
                var add = owner.child('div', 'holder').child('div', 'add');
                add.on('click', function()
                {
                    var form  =  owner.children('.form').IMu();
                    if (form && form.getValue('table') != undefined)
                        self.addFilter(filters, {table: form.getValue('table')});
                    else
                        self.addFilter(filters);
                });
                filters.addButton = add;

                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);

                var text = add.child('div', 'text');
                text.text(IMu.string('designer-add-filter-term'));

                // helps with having multiple filter sections
                filters.clearFilters = function()
                {
                    self.clearFilters(filters);
                };
                filters.getFilters = function(info)
                {
                    return self.getFilters(filters, info);
                };
                filters.setFilters = function(info)
                {
                    if (! info)
                        return;
                    
                    if (info.terms == undefined && IMu.Type.isArray(info))
                        self.setFilters(filters, info);
                    else
                        self.setFilters(filters, info.terms, info.table);
                };

                return filters;
            },
            
            /*!
            ** Creates the permissions section.
            **
            ** Creates a selection box to control the most basic permissions for
            ** the form/editor. This is the fallback permission level for users 
            ** and groups that do not have permissions specified.
            **
            ** Creates a button to add additional user or group permissions.
            */
            makePermissions: function(info)
            {
                var self = this;

                var permissions = self.permissions =
                    self.addCollapsibleElement(self.holder,
                {
                    "class": 'permissions bg-colour-1 border-3',
                    header:
                    {
                        icon: 'app/permissions_white',
                        label: 'designer-permissions',
                        "class": 'bg-colour-3 txt-colour-1'
                    },
                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d'
                    }
                });

                var everyone = permissions.content.child('div', 
                    'everyone bg-colour-1');
                everyone = everyone.IMu('form');
                everyone.addField('selection',
                {
                    name: 'permission',
                    label: 'designer-permissions-everyone',
                    list:
                    [
                        'edit',
                        'none',
                        'use'
                    ]
                });
                everyone.createView();

                var additional = permissions.content.child('div', 'additional');
                additional.addClass('bg-colour-2');

                var title = additional.child('div', 'title bg-colour-3 txt-colour-1');
                var tr = title.child('table').child('tbody').child('tr');
                var label = tr.child('td', 'label');
                label.text(IMu.string('designer-permissions-additional'));
                tr.child('td', 'padding');

                // TODO: these are really lame column names
                var grid = additional.child('div', 'grid');
                var widget = grid.IMu('grid');
                widget.addColumn('selection',
                {
                    name: 'level',
                    list:
                    [
                        'user',
                        'group'
                    ],
                    onChange: function(cell, value)
                    {
                        var name = cell.row.getCellByName('name');
                        name.setValue('');
                    }
                });
                widget.addColumn('text',
                {
                    name: 'name',
                    suggest: function(suggest, prefix, callback)
                    {
                        var row = this.cell.row;
                        var values = row.getValues();
                        var level = values.level;

                        var request = new IMu.Request.Access();
                        if (level == 'group')
                            request.getGroups(prefix, callback);
                        else if (level == 'user')
                            request.getUsers(prefix, callback);
                        else
                            callback([]);
                    }
                });
                widget.addColumn('selection',
                {
                    name: 'permission',
                    list:
                    [
                        'edit',
                        'none',
                        'use'
                    ]
                });
                widget.addColumn('icon',
                {
                    name: 'remove',
                    icons:
                    {
                        1: 'cross'
                    }
                });
                widget.createView();

                var add = permissions.content.child('div', 'add');
                add.on('click', function()
                {
                    self.addPermission();
                });

                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);

                var text = add.child('div', 'text');
                text.text(IMu.string('designer-add-permission'));

                return permissions;
            },

            /*!
            ** Sets filters for a section.
            **
            ** This function serves two purposes:
            ** 1) Loading filters into a designer
            ** 2) Creating a new filter that uses an alternate table to the
            ** designer.
            **
            ** @param owner
            **   The jQuery element which to add filters to.
            **
            ** @param terms
            **   An array of column names and values to be loaded.
            **   If this parameter is passed, filters created will have values
            **   set upon creation.
            **
            ** @param table
            **   The name of the table to get column name suggestions from.
            **   If this parameter is passed, filter column names will auto
            **   suggest columns from this table.
            */
            setFilters: function(owner, terms, table)
            {
                for (var i in terms)
                {
                    if (terms[i].length == 2);
                        this.addFilter(owner, {terms: terms[i], table: table});
                }
            },
            
            /*!
            ** Loads permissions from the designer information.
            **
            ** @param form
            **   A hash representation of the designer.
            */
            setPermissions: function(form)
            {
                var holder = this.permissions.content;

                var everyone = holder.children('.everyone').IMu();
                var permission = 'none';
                if (form.permissions && form.permissions.everyone)
                    permission = form.permissions.everyone;
                everyone.setValue('permission', permission);

                if (form.permissions && form.permissions.additional)
                    for (var i in form.permissions.additional)
                    {
                        var additional = form.permissions.additional[i];
                        var level = additional.level;
                        var name = additional.name;
                        var permission = additional.permission;
                        this.addPermission(level, name, permission);
                    }
            }
        }
    });

    /* Private functions
    */
    var _addCollapsibleElement = function(owner, options)
    {
        var element = owner.child('div', 'collapsible-group');
        var header = element.child('div', 'title');
        var content = element.child('div', 'holder');

        if (options)
        {
            if (options["class"])
                element.addClass(options["class"]);
            if (options.id)
                element.attr('id', options.id);

            if (options.content)
            {
                if (options.content["class"])
                    content.addClass(options.content["class"]);
                if (options.content.id)
                    content.attr('id', options.content.id);
            }
        }

        _makeCollapsibleHeader(element, header, content, options);
        var details = _makeCollapsibleDetails(content, options);

        return {
            element: element,
            header: header,
            details: details,
            content: content
        };
    };

    var _makeCollapsibleHeader = function(owner, header, content, options)
    {
        var tr = header.child('table').child('tbody').child('tr');

        var icon = tr.child('td', 'icon');
        var label = tr.child('td', 'label');
        var remove = tr.child('td', 'remove');
        remove.css('width', '1%');
        var toggle = tr.child('td', 'toggle');
        toggle.css('width', '1%');

        if (options)
        {
            if (options.header)
            {
                if (options.header["class"])
                    header.addClass(options.header["class"]);
                if (options.header.id)
                    header.attr('id', options.header.id);

                if (options.header.icon)
                {
                    var img = icon.child('img');
                    var src = IMu.Request.getURL('Image') + '&name=';
                    src += options.header.icon;
                    img.attr('src', src);
                }
                else
                    icon.hide();

                if (options.header.label)
                    label.text(IMu.string(options.header.label));
                else
                    label.text('');
            }

            if (options.removeable)
            {
                var button = remove.child('div');
                button.addClass('section-remove');

                var image = "cross";
                if (header.hasClass('bg-colour-3'))
                    image += "_white";

                button = button.IMu('button-control');
                button.addState
                ({
                    layout:
                    [
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') + '&name=' + image
                        }
                        /* Add if client wants text for the remove button 
                        {
                            type: 'text',
                            value: IMu.string('form-designer-remove')
                        }
                        */
                    ],
                    onClick: function()
                    {
                        if (options.onRemove &&
                            typeof(options.onRemove) == 'function')
                            options.onRemove();
                        owner.remove();
                    }
                });
                button.createView();
            }

            if (options.toggle)
            {
                var tOptions = options.toggle;
                var button = toggle.child('div');
                button.addClass('section-toggle');

                button = button.IMu('button-control');
                button.addState
                ({
                    name: 'opened',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=' +
                            tOptions.openIcon
                    },
                    onClick: function()
                    {
                        this.setState('closed');
                        content.hide();
                        if (tOptions.onToggledClosed)
                            tOptions.onToggledClosed();
                    }
                });
                button.addState
                ({
                    name: 'closed',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=' +
                            tOptions.closedIcon
                    },
                    onClick: function()
                    {
                        this.setState('opened');
                        content.show();
                        if (tOptions.onToggledOpen)
                            tOptions.onToggledOpen();
                    }
                });
                button.createView();

                if (tOptions.closed)
                    button.onClick();
            }
        }
    };

    var _makeCollapsibleDetails = function(owner, options)
    {
        if (! options || ! options.details)
            return;

        var details = owner.child('div', 'details');

        if (options.details["class"])
            details.addClass(options.details["class"]);
        if (options.details.id)
            details.attr('id', options.details.id);

        if (options.details.fields)
        {
            var form;
            if (options.details.options)
                form = details.IMu('form', options.details.options);
            else
                form = details.IMu('form');

            var fields = options.details.fields;

            var type, fieldOpts;

            for (var i = 0; i < fields.length; i++)
            {
                var field = fields[i];
                type = field.type? field.type : 'text';
                fieldOpts = field.options ? field.options : {};

                var field = form.addField(type, fieldOpts);
                if (fieldOpts.name)
                    details[fieldOpts.name] = field;

            }
            form.createView();

            var values = options.details.info;
            if (values)
                form.setValues(values);

            return form;
        }
    };
})(IMu.Themes.shared);
