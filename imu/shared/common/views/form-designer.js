(function(theme)
{
    theme.views.register('form-designer', 'designer',
    {
        _source: 'shared/common/form-designer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.sections = undefined;
                this.options = undefined;
                this.layouts = undefined;
            },

            _create: function()
            {
                sectionID = 0;

                this._super.apply(this, arguments);

                this.layoutTypes = this.widget.getUndefLayouts();

                this.makeDetails();
                this.makePermissions();
                this.makeSections();
                this.makeSearch();
                this.makeLayoutOptions();
                this.makeButtons();
                this.newForm();
            },

            /*!
            ** Clears all data from the `form-designer`.
            */
            clearForm: function()
            {
                this.title.text('');
                this.clearDetails();
                this.clearPermissions();
                this.clearInput();
                this.clearSearch();
                this.filters.clearFilters();
            },

            /*!
            ** Creates a hash representation of the form.
            **
            ** @returns form
            **   The hash representation of the form.
            */
            getForm: function()
            {
                var form = {};
                this.getDetails(form);
                this.getPermissions(form);
                this.getInput(form);
                this.getSearch(form);
                this.filters.getFilters(form);
                return form;
            },

            /*!
            ** Clears all values from the form and sets the title.
            */
            newForm: function()
            {
                this.clearForm();
                this.title.text(IMu.string('form-designer-new-form'));
            },

            /*!
            ** Sets values in the form.
            **
            ** Once the form information has loaded, the values are set.
            **
            ** @param form
            **   A hash representation of the form.
            */
            setForm: function(form)
            {
                this.clearForm();

                if (form)
                {
                    this.setDetails(form);
                    this.setPermissions(form);
                    this.setInput(form);
                    if (form.filter && form.filter.terms)
                        this.filters.setFilters(form.filter.terms);
                    this.setSearch(form);
                }
            },

            // private
            //
            /*!
            ** Adds a new column to be fetched when a search is matched in the
            ** form-builder.
            **
            ** Appends a new row to the search results grid.
            ** Columns entered are then fetched when a search completes
            ** successfully in the form-builder.
            */
            addSearchFetchField: function(info)
            {
                // TODO: suggest
                var widget = this.search.results;
                var values = 
                { 
                    'name': info,
                    'remove': '1'
                };
                var row = widget.appendRow(values);
                var remove = row.getCellByName('remove');
                var image = jQuery(remove.widget.view.control);
                widget.owner.css('display', 'block');
            },

            /*!
            ** Creates a new field designer within a section.
            **
            ** Creates sub-section within ``section`` for the designer to
            ** describe a field.
            ** The sub-section can be shown/hidden/removed as well as
            ** rearranged via click and drag.
            **
            ** @param section
            **   The conceptual section to add the new field.
            **
            ** @param info
            **   A hash containing values to set on creation.
            */
            addField: function(owner, info)
            {
                var self = this;

                var options =
                {
                    "class": 'field bg-colour-1',
                    header:
                    {
                        label: 'form-designer-field',
                        "class": 'txt-colour-3'
                    },
                    toggle:
                    {
                        openIcon: 'arrow_u',
                        closedIcon: 'arrow_d',

                        onToggledOpen: function()
                        {
                            var label = field.header.find('.label');
                            label.text(IMu.string('form-designer-field'));

                        },
                        onToggledClosed: function()
                        {
                            var label = field.header.find('.label');
                            var text = form.getValue('label');
                            if (! text)
                                text = form.getValue('id');
                            if (text)
                                label.text(text);
                        }
                    },
                    removeable: true
                };

                var field = self.addCollapsibleElement(owner, options);

                var form = field.content.child('div', 'form');
                form = form.IMu('form',
                {
                    columns: 2,
                    onValidate: function(info, callback)
                    {
                        /* Additional validation to be performed on the
                        ** form-designer.
                        */

                        /* Field type is attachment but column not suitable */
                        if (this.hash.table.getValue() == undefined &&
                            this.hash.column.getValue() != undefined &&
                            (this.hash.type.getValue() == "attachment" ||
                            this.hash.refColumn.getValue() != undefined))
                        {
                            this.updateValidationState(info, 'invalid');
                            info.details.push(
                            {
                                info:
                                {
                                    state: "invalid",
                                    details: "validation-type-not-ref-column"
                                },
                                field: this.hash.column.widget.view.control
                            });
                            this.hash.column.widget.setIcon("invalid",
                                "validation-type-not-ref-column");
                        }
                        /* Field type is attachment but reference column empty */
                        if (this.hash.refColumn.getValue() == undefined &&
                            (this.hash.type.getValue() == "attachment" ||
                             this.hash.table.getValue() != undefined))
                        {
                            this.updateValidationState(info, 'invalid');
                            info.details.push(
                            {
                                info:
                                {
                                    state: "invalid",
                                    details: "validation-empty-mandatory"
                                },
                                field: this.hash.refColumn.widget.view.control
                            });
                            this.hash.refColumn.widget.setIcon("invalid",
                                "validation-empty-mandatory");
                        }
                        
                        /* Check user has provided enough details for lookups */
                        if (this.hash.lookup.getValue() != undefined && 
                            this.hash.level.getValue() == undefined)
                        {
                            this.updateValidationState(
                                info, 'invalid');
                            info.details.push(
                            {
                                info:
                                {
                                    state: "invalid",
                                    details: "validation-empty-mandatory"
                                },
                                field: this.hash.level.widget.view.control
                            });
                            this.hash.level.widget.setIcon("invalid",
                                "validation-empty-mandatory");
                        }
                        else if (this.hash.lookup.getValue() == undefined && 
                            this.hash.level.getValue() != undefined)
                        {
                            this.updateValidationState(info, 'invalid');
                            info.details.push(
                            {
                                info:
                                {
                                    state: "invalid",
                                    details: "validation-empty-mandatory"
                                },
                                field: this.hash.lookup.widget.view.control
                            });
                            this.hash.lookup.widget.setIcon("invalid",
                                "validation-empty-mandatory");
                        }
                        
                        /* Check that the field type is supported as kind 'multiple'
                        **
                        ** TODO: this is hard coded. It would be nice to be able
                        ** to query the form-builder widget to see what it supports.
                        */
                        var supported = 
                        { 
                            'attachment': true,
                            'date': true,
                            'integer': true,
                            'number': true,
                            'selection': true,
                            'text': true
                        };
                        var type = this.hash.type.getValue();
                        var kind = this.hash.kind.getValue();
                        if (kind == 'multiple' && ! (type in supported))
                        {
                            this.updateValidationState(info, 'invalid');
                            info.details.push(
                            {
                                info:
                                {
                                    state: 'invalid',
                                    details: 'validation-field-type-multiple-not-supported'
                                },
                                field: this.hash.type.widget.view.control
                            });
                            this.hash.type.widget.setIcon("invalid",
                                "validation-field-type-multiple-not-supported");
                                //TODO add icon for other field too
                        }

                        callback(info);
                    },
                    order: 'row'
                });

                form.addField('text',
                {
                    name: 'id',
                    label: 'form-designer-field-id',
                    requirement: 'mandatory',
                    validateOnChange: true
                });
                form.addField('text',
                {
                    name: 'column',
                    label: 'form-designer-field-column',
                    requirement: 'suggested',
                    suggest:
                    {
                        type: 'function',
                        code: function(suggest, prefix, callback)
                        {
                            var table = self.details.getValue('table');
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
                        },
                        onSelect: function()
                        {
                            var value = this.getValue();
                            var table = self.details.getValue('table');

                            var request = new IMu.Request.Schema();
                            request.getColumn(table,value, function(result)
                            {
                                switch(result.DataKind) 
                                {
                                    case 'dkAtom':
                                        fieldKind.setValue('single');
                                        break;
                                    case 'dkTable':
                                        fieldKind.setValue('multiple');
                                        break;
                                }

                                var oldRefTable = refTable.value;
                                if(!result.RefTable)
                                {
                                    refTable.setValue('');
                                    refColumn.setValue('');
                                    matchLimit.setValue('');
                                    fieldType.setValue(result.DataType.toLowerCase());
                                    if (refTable.value != oldRefTable)
                                        fieldFilters.clearFilters();
                                    return;
                                }

                                fieldType.setValue('attachment');
                                refTable.setValue(result.RefTable);
                                refColumn.setValue('SummaryData');
                                matchLimit.setValue('20');
                                if (refTable.value != oldRefTable)
                                    fieldFilters.clearFilters();
                            });
                        }
                    },
                    validateOnChange: true
                });

                form.addField('text',
                {
                    columnSpan: 2,
                    requirement: 'suggested',
                    label: 'form-designer-field-label',
                    name: 'label',
                    onValidate: function(info, value, callback)
                    {
                        var access = this.controller.hash.access.getValue();
                        if (info.state == 'empty' && 
                            (access  == 'hidden' || access == undefined))
                        {
                            info.details = undefined;
                            info.state = 'ok';
                        }
                        callback();
                    },
                    validateOnChange: true
                });

                var fieldKind = form.addField('selection',
                {
                    name: 'kind',
                    label: 'form-designer-field-kind',
                    list:
                    [
                        'image',
                        'image-capture',
                        'mobile-image-capture',
                        'single',
                        'multiple'

                        // Capture control disabled until Sapphire 2.0
                        //'capture'
                    ],
                    onChange: function()
                    {
                        updateFieldLinesVisibility();
                    },
                    validateOnChange: true
                });

                var fieldType = form.addField('selection',
                {
                    name: 'type',
                    label: 'form-designer-field-type',
                    list:
                    [
                        'attachment',
                        'date',
                        'integer',
                        'number',
                        'selection',
                        'text'
                    ],
                    onChange: function()
                    {
                        updateFieldLinesVisibility();
                    },
                    validateOnChange: true
                });

                var fieldLines = form.addField('number',
                {
                    name: 'lines',
                    label: 'form-designer-field-lines',
                    validateOnChange: true
                });
                var updateFieldLinesVisibility = function()
                {
                        var kindValue = fieldKind.getValue();
                        var typeValue = fieldType.getValue();

                        var rNum = fieldLines.row + 1;
                        var cNum = fieldLines.column + 1;
                        var row = jQuery(form.view.table).find(".row-" + rNum);

                        if (kindValue != 'single' || typeValue != 'text')
                        {
                            fieldLines.widget.view.control.prop('disabled', true);

                            row.find(".label-" + cNum).hide()
                            row.find(".input-" + cNum).hide()

                            fieldLines.widget.setValue();
                        }
                        else
                        {
                            fieldLines.widget.view.control.prop('disabled', false);

                            row.find(".label-" + cNum).show()
                            row.find(".input-" + cNum).show()
                        }
                };

                form.addField('empty');

                form.addField('selection',
                {
                    name: 'access',
                    label: 'form-designer-field-access',
                    list:
                    [
                        'editable',
                        'hidden',
                        'read-only'
                    ],
                    validateOnChange: true
                });

                form.addField('selection',
                {
                    name: 'requirement',
                    label: 'form-designer-field-requirement',
                    list:
                    [
                        'mandatory',
                        'optional',
                        'suggested'
                    ],
                    validateOnChange: true
                });

                var level;
                form.addField('text',
                {
                    name: 'lookup',
                    label: 'form-designer-lookup-name',
                    suggest:
                    {
                        type: 'lookup',
                        name: 'Lookup Name',
                        level: 0,
                        onSelect: function()
                        {
                            level.setValue('1');
                        }
                    },
                    onChange: function()
                    {
                        level.setValue('');
                    },
                    validateOnChange: true
                });
                level = form.addField('text',
                {
                    name: 'level',
                    label: 'form-designer-lookup-level',
                    validateOnChange: true
                });

                form.addField('text',
                {
                    columnSpan: 2,
                    label: 'form-designer-field-default',
                    name: 'default',
                    validateOnChange: true
                });

                var refTable = form.addField('text',
                {
                    name : 'table',
                    label: 'form-designer-ref-table',
                    readonly: true,
                    validateOnChange: true
                });

                var refColumn = form.addField('text',
                {
                    name: 'refColumn',
                    label: 'form-designer-ref-column',
                    suggest: function(suggest, prefix, callback)
                    {
                        var table = refTable.getValue('table');
                        if (!table)
                        {
                            callback([]);
                            return;
                        }
                        var request = new IMu.Request.Schema();
                        request.getColumns(table, prefix, function(list)
                        {
                            callback(list);
                        });
                    },
                    //TODO need to link to refTable
                    validateOnChange: true
                });

                /* Zoom Form disabled until Sapphire 2.0
                var zoomForm = form.addField('text',
                {
                    name: 'zoomForm',
                    label: 'form-designer-zoom-form',
                    readonly: false,
                    validateOnChange: false
                });
                */

                var matchLimit = form.addField('number',
                {
                    name: 'matchLimit',
                    label: 'form-designer-match-limit',
                    validateOnChange: true
                });

                var bfWidth = form.addField('number',
                {
                    name: 'bfWidth',
                    label: 'form-designer-bf-width',
                    validateOnChange: true
                });

/* Removed by AB so Gerard can do his screen shots correctly.
** Needs to be removed properly in the future.
                var maxValues = form.addField('text',
                {
                    name: 'maxValues',
                    label: 'form-designer-max-values'
                });
*/

                form.createView();
                field.widget = form;
                var fieldFilters = form.filters = self.makeFilters(field.content);

                var values =
                {
                    access: 'editable',
                    kind: 'single',
                    type: 'text',
                    requirement: 'optional'
                };

                if (info)
                {
                    if ('id' in info)
                        values.id = info.id;
                    if ('access' in info)
                        values.access = info.access;
                    if ('column' in info)
                        values.column = info.column;

                    /* Referring to a key of 'default' in an object
                    ** using dot notation (i.e. values.default) does not
                    ** work in some browsers (because default is also 
                    ** a reserved word) so we need to be careful
                    ** here.
                    */
                    if ('default' in info)
                        values['default'] = info['default'];
                    if ('kind' in info)
                        values.kind = info.kind;
                    if ('label' in info)
                        values.label = info.label;
                    if ('lookup' in info)
                    {
                        if ('name' in info.lookup)
                            values.lookup = info.lookup.name;
                        if ('level' in info.lookup)
                            // assumes the user works with 1 based indexing
                            values.level = parseInt(info.lookup.level) +1;
                    }
                    if ('type' in info)
                        values.type = info.type;
                    if ('lines' in info)
                        values.lines = info.lines;
                    if ('requirement' in info)
                        values.requirement = info.requirement;
                    if ('table' in info)
                        values.table = info.table;
                    if ('refColumn' in info)
                        values.refColumn = info.refColumn;
                    /* Zoom Form disabled until Sapphire 2.0
                    if ('zoomForm' in info)
                        values.zoomForm = info.zoomForm;
                    */
                    if ('maxValues' in info)
                        values.maxValues = info.maxValues;
                    if ('matchLimit' in info)
                        values.matchLimit = info.matchLimit;
                    if ('bfWidth' in info)
                        values.bfWidth = info.bfWidth;
                    if ('filter' in info)
                    {
                        var table = info.table;
                        var filters = form.filters;
                        form.filters.setFilters(
                        {
                            terms: info.filter.terms,
                            table: table
                        });
                    }
                }

                form.setValues(values);
                updateFieldLinesVisibility();
            },

            /*!
            ** Adds a new column to be queried against in the form-builder.
            **
            ** Appends a new row to the search columns grid.
            ** Columns entered are then queried against when a search is
            ** executed in the form-builder.
            */
            addSearchField: function(info)
            {
                // TODO: suggest
                var widget = this.search.columns;
                var values = 
                { 
                    'name': info,
                    'remove': '1'
                };
                var row = widget.appendRow(values);
                var remove = row.getCellByName('remove');
                var image = jQuery(remove.widget.view.control);
                widget.owner.css('display', 'block');
            },

            
            /*!
            ** Creates a section of grouped elements.
            **
            ** Creates a div containing a title area, field area and filter area.
            ** The section can be rearranged with other sections via drag and
            ** drop, toggled open/closed and removed entirely.
            **
            ** @param info
            **   A hash representing the section to add. This contains
            **   information such as the section label.
            **
            ** @returns section
            **   The div created to represent the section.
            */
            addSection: function(info)
            {
                var self = this;

                var label = undefined;
                var id = undefined;
                if (info)
                {
                    label = info.label;
                    if (info.id)
                        id = info.id - 0;
                }

                var options =
                {
                    "class": 'section bg-colour-2 border-2',

                    header:
                    {
                        label: 'Section',
                        "class": 'bg-colour-3 txt-colour-1'
                    },

                    details:
                    {
                        info: 
                        {
                            label: label,
                            id: id
                        },
                        fields:
                        [
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'label',
                                    label: 'form-designer-section-label'
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'id',
                                    label: 'ID',
                                    readonly: true
                                }
                            }
                        ],
                        options:
                        {
                            columns: 2,
                            order: 'row'
                        }
                    },

                    removeable: true,

                    onRemove: function()
                    {
                        var details = content.find('.details').IMu();
                        var id = details.getValue('id');
                        delete(self.widget.sectionIDs[id]);
                    },

                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d',

                        onToggledOpen: function()
                        {
                            var text = options.header.label;
                            label = section.header.find('.label').text(text);
                        },
                        onToggledClosed: function()
                        {
                            /* TODO
                            ** Horribly non-multilingual!!
                            */
       
                            var details = content.find('.details');
                            details = details.IMu();
                        
                            var text = details.getValue('label');
                            if (! text)
                                text = options.header.label;

                            var kids = fields.children().length;
                            var word = 'field';
                            if (kids != 1)
                                word += 's';
                            text += ' (' + kids + ' ' + word + ')';
                            
                            label = section.header.find('.label').text(text);
                        }
                    }
                };
                
                var section = this.addCollapsibleElement(self.sections, options);
                var content = section.content;

                var fields = content.child('div', 'fields');
                section.fields = fields;
                
                /* Allow the fields to be sorted.
                ** Specifying the connectWith property allows the fields
                ** to be moved from section to section.
                */
                fields.sortable
                ({
                    connectWith: '.fields',
                    distance: 5
                });

                var add = content.child('div', 'add');
                add.on('click', function()
                {
                    self.addField(section.fields);
                });
                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);
                var text = add.child('div', 'text');
                text.text(IMu.string('form-designer-add-field'));

                return section;
            },

            /*!
            ** Clears all input from the each section.
            */
            clearInput: function()
            {
                this.sections.empty();
            },

            /*!
            ** Removes all filters, fetch columns and search columns from the
            ** search section.
            */
            clearSearch: function()
            {
                this.search.details.clearForm();
                this.search.columns.clearGrid();
                this.search.results.clearGrid();
            },

            /*!
            ** Gets a list of columns used by fields in the `form-designer`.
            **
            ** Finds each conseptual field in the form-designer and appends its
            ** column info onto an array.
            **
            ** @returns list
            **   The array of columns used in the `form-designer`.
            */
            getColumns: function()
            {
                var list = [];
                var forms = this.sections.find('.fields > .field > .form');
                for (var i = 0; i < forms.length; i++)
                {
                    var form = jQuery(forms[i]).IMu();
                    if (! form)
                        continue;
                    var field = form.getField('column');
                    if (! field || ! field.widget)
                        continue;
                    list.push(field);
                }
                return list;
            },

            /*!
            ** Gets form identifier, table, title and processing script from
            ** the details section.
            **
            ** @param form
            **   A hash representing the structure of the `form-designer`.
            **   Information from the details section is added to this.
            **
            ** @returns values
            **   A hash representing the details section.
            */
            getDetails: function(form)
            {
                var values = this.details.getValues();

                if (values.id)
                    this.widget.id = values.id;

                if (values.title)
                    form.title = values.title;
                
                if (values.description)
                    form.description = values.description;

                if (values.table)
                    form.table = values.table;

                if (values.script)
                    form.script = values.script;

                if (values.deferrable == 1)
                    form.deferrable = 1;
                else
                    form.deferrable = 0;

                return values;
            },

            /*!
            ** Gets all information about input sections in the `form-designer`.
            **
            ** Creates a hash representing each of the conseptual sections and 
            ** their fields.
            **
            ** @param form
            **   A hash representing the structure of the `form-designer`.
            **   Information about input sections are added to this.
            **
            ** @returns form.input
            */
            getInput: function(form)
            {
                form.input = {};

                // ... Sections
                form.input.sections = [];
                var sectionElems = this.sections.children('.section');
                for (var i = 0; i < sectionElems.length; i++)
                {
                    var section = {};
                    
                    var sectionElem = jQuery(sectionElems[i]);
                    var values = sectionElem.find('.details').IMu().getValues();
                    if (values.label)
                        section.label = values.label;
                    if (values.id)
                        section.id = values.id - 0;

                    section.fields = [];
                    var fieldElems = sectionElem.find('.field');
                    for (var j = 0; j < fieldElems.length; j++)
                    {
                        var field = {};
                        
                        var fieldElem = jQuery(fieldElems[j]);
                        var values = fieldElem.find('.form').IMu().getValues();
                        if (values.id)
                            field.id = values.id;
                        if (values.access)
                            field.access = values.access;
                        if (values.column)
                            field.column = values.column;
                        if (values.lines)
                            field.lines = values.lines;

                        /* Using default as an object key does not
                        ** work in some browsers (because it is also 
                        ** a reserved word) so we need to be careful
                        ** here.
                        */
                        if (values['default'])
                            field['default'] = values['default'];
                        if (values.kind)
                            field.kind = values.kind;
                        if (values.label)
                            field.label = values.label;
                        if (values.lookup)
                        {
                            field.lookup =
                            {
                                name: values.lookup
                            };
                            if (values.level)
                            {
                                // assumes the user works with 1 based indexing
                                field.lookup.level = parseInt(values.level) -1;
                                field.lookup.level = field.lookup.level.toString();
                            }
                        }
                        if (values.type)
                            field.type = values.type;
                        if (values.requirement)
                            field.requirement = values.requirement;
                        if(values.table)
                            field.table = values.table;
                        if(values.refColumn)
                            field.refColumn = values.refColumn;
                        /*
                        if(values.zoomForm)
                            field.zoomForm = values.zoomForm;
                        */
                        if(values.matchLimit)
                            field.matchLimit = values.matchLimit;
                        if(values.bfWidth)
                            field.bfWidth = values.bfWidth;
                        if(values.maxValues)
                            field.maxValues = values.maxValues;

                        var filters = fieldElem.find('.form').IMu().filters;
                        filters = filters.getFilters(field);

                        section.fields.push(field);
                    }
                    form.input.sections.push(section);
                }

                return form.input;
            },

            /*!
            ** Gets information about about the search section.
            ** 
            ** Extracts search column, filter and fetch information as 
            ** well as the maxiumn number of results to fetch.
            ** 
            ** This is the information that forms the search section in
            ** the `form-builder`.
            **
            ** @param form
            **   A hash representing the structure of the `form-designer`.
            **   Information about the search section is added to this.
            **
            ** @returns form.search
            **   A hash representing the search section.
            */
            getSearch: function(form)
            {
                var max = this.search.details.getValues()['maximum'];
                if (isNaN(max))
                    max = null;

                var columns = [];
                var values = this.search.columns.getValues();
                for (var i = 0; i < values.length; i++)
                    if (values[i].name != null)
                        columns.push(values[i].name);

                var results = [];
                var values = this.search.results.getValues();
                for (var i = 0; i < values.length; i++)
                    if (values[i].name != null)
                        results.push(values[i].name);

                if (max != null || columns.length > 0 || results.length > 0)
                {
                    form.search = {};
                    if (max != null)
                        form.search.maximum = max;
                    if (columns.length > 0)
                        form.search.columns = columns;
                    if (results.length > 0)
                        form.search.results = results;
                }

                return form.search;
            },

            /*!
            ** Creates the `form-designer` details section.
            **
            ** This includes information about the form's ``id``,
            ** ``title``, ``table`` and ``processing script``.
            */
            makeDetails: function()
            {
                var self = this;

                var details = self.holder.child('div', 'details');
                details.addClass('txt-colour-inherit ' +
                    'bg-colour-1 border-4');

                details = self.details = details.IMu('form',
                {
                    columns: 2,
                    order: 'row'
                });

                details.addField('text',
                {
                    name: 'title',
                    label: 'form-designer-title',
                    requirement: 'suggested',
                    validateOnChange: true,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'description',
                    label: 'form-designer-description',
                    validateOnChange: false,
                    lines: 2,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'id',
                    label: 'form-designer-id',
                    requirement: 'suggested',
                    validateOnChange: true
                });

                details.addField('text',
                {
                    name: 'table',
                    label: 'form-designer-table',
                    requirement: 'suggested',
                    suggest:
                    {
                        type: 'function',
                        code: function(suggest, prefix, callback)
                        {
                            self.loadTables(function(tables)
                            {
                                var list = [];
                                var regex = new RegExp('^' + prefix, 'i');
                                for (var i in tables)
                                {
                                    var table = tables[i];
                                    if (table.match(regex))
                                        list.push(table);
                                }
                                callback(list);
                            });
                        }
                    },
                    onChange: function()
                    {
                        self.filters.clearFilters();
                        var sections = self.sections.children('.section');
                        for (var i = 0; i < sections.length; i++)
                        {
                            var section = sections[i];
                            var fields = jQuery(section).find('.field > .form');
                            for (var j = 0; j < fields.length; j++)
                            {
                                var field = fields[j];
                                field = jQuery(field).IMu();
                                var refTable = field.getValue('table');
                                if (refTable == undefined)
                                    field.filters.clearFilters();
                            }
                        }

                    },
                    onLoseFocus: function()
                    {
                        self.checkTable();
                    },
                    validateOnChange: true
                });

                details.addField('text',
                {
                    name: 'script',
                    label: 'form-designer-processing-script',
                    validateOnChange: true
                });

                details.addField('selection',
                {
                    name: 'deferrable',
                    label: 'form-designer-deferrable',
                    list:
                    [
                        {
                            text: IMu.string('common-no'),
                            val: 0
                        },
                        {
                            text: IMu.string('common-yes'),
                            val: 1
                        }
                    ]
                });

                details.createView();
            },

            makeLayoutOptions: function()
            {
                var self = this;

                var options =
                {
                    "class": 'layout-options bg-colour-1 border-1',
                    header:
                    {
                        icon: 'app/layout_white',
                        label: 'form-designer-layout-options',
                        "class": 'bg-colour-3 txt-colour-1'
                    },
                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d',
                        closed: false
                    }
                };

                var layoutOptions = self.addCollapsibleElement(self.holder, options);
                var layouts = self.layouts = 
                    layoutOptions.content.child('div', 'layouts');

                layouts.sortable
                ({
                    connectWith: '.layouts',
                    distance: 5
                });

                var add = layoutOptions.content.child('div', 'add add-layout');
                add.on('click', function()
                {
                    var layout = self.widget.addLayout(
                    {
                        onRemove: function()
                        {
                            add.removeClass('disabled');
                        }
                    });
                    if (! self.widget.getUndefLayoutCount())
                        add.addClass('disabled');
                });
                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);
                var text = add.child('div', 'text');
                text.text(IMu.string('form-designer-add-layout'));

                /* TODO: extend functionality so that user can add multiple layouts.
                ** If all avaliable layout types have been defined, the add button should be disabled.
                ** When a layout is removed, the add button should be shown again.
                */
            },

            addLayout: function(widget, options)
            {
                var self = this;

                var layout = new Layout(self.layouts, widget, options);
                layout.create();

                return layout;
            },
                       
            /*!
            ** Creates the search section.
            **
            ** This is the section where designers configure the search to be
            ** used in the `form-builder`.
            **
            ** Settings include:
            ** * Maximum fetch results
            ** * Columns to be searched
            ** * Persistent search terms to be run every query
            ** * Columns to be fetched from matches
            */
            makeSearch: function()
            {
                var self = this;
                self.search = {};

                var options =
                {
                    "class": 'search bg-colour-1 border-1',

                    header:
                    {
                        icon: 'search_white',
                        label: 'form-designer-search-options',
                        "class": 'bg-colour-3 txt-colour-1'
                    },

                    details:
                    {
                        fields:
                        [
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'maximum',
                                    label: 'form-designer-search-maximum'
                                }
                            }
                        ]
                    },

                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d',
                        closed: true
                    }
                };

                var search = this.addCollapsibleElement(self.holder, options);
                self.search.details = search.details;
                var holder = search.content;
                
                var columns = holder.child('div', 'columns');
                columns.addClass('bg-colour-3 txt-colour-1');
                var title = columns.child('div', 'title');
                title.text(IMu.string('form-designer-search-columns'));

                var grid = columns.child('div', 'grid', 'bg-colour-2');
                var columnsWidget = self.search.columns = grid.IMu('grid');
                columnsWidget.addColumn('text',
                {
                    name: 'name',
                    suggest: function(suggest, prefix, callback)
                    {
                        var table = self.details.getValue('table');
                        if (!table)
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
                columnsWidget.addColumn('icon',
                {
                    name: 'remove',
                    icons:
                    {
                        1: 'cross'
                    },
                    onClickIcon: function()
                    {
                        var row = this.widget.cell.row;
                        row.remove();

                        if (row.controller.rows.length == 0)
                            row.controller.owner.css('display', 'none');
                    }
                });
                columnsWidget.createView();
               
                var add = holder.child('div', 'add');
                add.on('click', function()
                {
                    self.addSearchField();
                });
                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);
                var text = add.child('div', 'text');
                text.text(IMu.string('form-designer-add-search-column'));

                self.filters = self.makeFilters(holder);
                self.filters.addClass('bg-colour-3');
                self.filters.children('.title').removeClass('txt-colour-3');
                self.filters.children('.title').addClass('txt-colour-1');
                self.filters.children('.holder').addClass('bg-colour-2 txt-colour-3');

                var results = holder.child('div', 'results');
                results.addClass('bg-colour-3 txt-colour-1');
                var title = results.child('div', 'title');
                title.text(IMu.string('form-designer-search-results'));

                var grid = results.child('div', 'grid', 'bg-colour-2');
                var resultsWidget = self.search.results = grid.IMu('grid');
                resultsWidget.addColumn('text',
                {
                    name: 'name',
                    suggest: function(suggest, prefix, callback)
                    {
                        var table = self.details.getValue('table');
                        if (!table)
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
                resultsWidget.addColumn('icon',
                {
                    name: 'remove',
                    icons:
                    {
                        1: 'cross'
                    },
                    onClickIcon: function()
                    {
                        var row = this.widget.cell.row;
                        row.remove();
                        
                        if (row.controller.rows.length == 0)
                            row.controller.owner.css('display', 'none');
                    }
                });
                resultsWidget.createView();

                var add = holder.child('div', 'add');
                add.on('click', function()
                {
                    self.addSearchFetchField();
                });
                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);
                var text = add.child('div', 'text');
                text.text(IMu.string('form-designer-add-results-column'));
            },

            /*!
            ** Creates an area for input sections as well as buttons to add a
            ** new section.
            */
            makeSections: function()
            {
                var self = this;

                self.input = self.addCollapsibleElement(self.holder,
                {
                    "class": 'input bg-colour-1 border-3',
                    header:
                    {
                        icon: 'app/input_white',
                        label: 'form-designer-input',
                        "class": 'bg-colour-3 txt-colour-1'
                    },
                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d'
                    }
                });

                self.sections = self.input.content.child('div', 'sections');
                self.sections.sortable
                ({
                    distance: 5
                });

                var add = self.input.content.child('div', 'add');
                add.on('click', function()
                {
                    var info = { id: ++sectionID };
                    self.widget.sectionIDs[sectionID] = null;
                    self.addSection(info);
                });
                var image = add.child('img', 'image');
                var url = IMu.Request.getURL('Image') + '&name=app/add';
                image.attr('src', url);
                var text = add.child('div', 'text')
                text.text(IMu.string('form-designer-add-section'));
            },

            /*!
            ** Sets the values in the details section.
            **
            ** @param form
            **   A hash representing the `form-designer`.
            */
            setDetails: function(form)
            {
                var values = {};

                if (this.widget.id && this.widget.id != '_')
                    values.id = this.widget.id;
                
                if (form.title)
                    values.title = form.title;
                
                if (form.description)
                    values.description = form.description;
                
                if (form.table)
                    values.table = form.table;
                
                if (form.script)
                    values.script = form.script;
                
                if (form.deferrable == 1)
                    values.deferrable = 1;
                else
                    values.deferrable = 0;
                
                this.details.setValues(values);

                this.details.getField('id').widget.setOption('readonly', true);
            },
/*
            setFilters: function(form)
            {
                if (form && form.filter && form.filter.terms)
                    this._super(this.filters, form.filter.terms);
            },
*/          

            /*!
            ** Creates and sets values of sections as needed.
            **
            ** @param form
            **   A hash representing the `form-designer`.
            */
            setInput: function(form)
            {
                if (form.input && form.input.sections)
                {
                    var sections = form.input.sections;
                    var needIDs = [];

                    for (var i in sections)
                    {
                        var section = this.addSection(sections[i]);
                        if (sections[i].id)
                        {
                            var id = sections[i].id - 0;
                            if (id > sectionID)
                                sectionID = id;
                            this.widget.sectionIDs[id] = null;
                        }
                        else
                            needIDs.push(section);

                        var fieldsElement = section.fields;
                        for (var j in sections[i].fields)
                            this.addField(fieldsElement, sections[i].fields[j]);
                    }

                    for (var i = 0; i < needIDs.length; i++)
                    {
                        needIDs[i].details.hash.id.widget.setValue(++sectionID);
                        this.widget.sectionIDs[sectionID] = null;
                    }
                }
                this.checkTable();
            },
           
            /*!
            ** Sets values in the search section.
            **
            ** This includes adding and setting values of search columns,
            ** filter terms and fetch result columns as well as the maximum
            ** number of results to fetch.
            */
            setSearch: function(form)
            {
                if (! form.search)
                    return;

                if (form.search.maximum)
                    this.search.details.setValue('maximum', form.search.maximum);
                if (form.search.columns)
                {
                    var columns = form.search.columns;
                    for (var i in columns)
                        this.addSearchField(columns[i]);
                }
                if (form.search.results)
                {
                    var results = form.search.results;
                    for (var i in results)
                        this.addSearchFetchField(results[i]);
                }
            }
        }
    });

    var sectionID = 0;

    var Layout = IMu.Class.create
    ({
        _construct: function(owner, widget, options)
        {
            this._super.apply(this, arguments);
            
            this.owner = owner;
            this.designer = widget.controller.view;

            this.element = undefined;
            this.content = undefined;
            this.header = undefined;
            this.rows = undefined;
            this.widget = widget;

            this.options =
            {
                onRemove: undefined
            };

            if (options)
                this.configure(options);
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this.options)
                    this.options[name] = options[name];
        },

        create: function(widget)
        {
            var self = this;

            var layoutTypes = [];
            for (var type in self.widget.controller.layoutHash)
                layoutTypes.push(type);
            
            var layout = self.widget.controller.view.addCollapsibleElement(self.owner,
            {
                "class": 'layout bg-colour-2 border-2',
                header:
                {
                    label: 'Layout',
                    "class": 'bg-colour-3 txt-colour-1'
                },
                details:
                {
                    fields:
                    [
                        {
                            type: 'selection',
                            options:
                            {
                                name: 'type',
                                label: 'Type',
                                list: layoutTypes
                            }
                        },
                        {
                            type: 'selection',
                            options:
                            {
                                name: 'max-width',
                                label: 'form-designer-layout-orientation',
                                list:
                                [
                                    {
                                        text: 'Portrait',
                                        val: ''
                                    },
                                    {
                                        text: 'Landscape',
                                        val: 'none'
                                    }
                                ],
                                value: 0
                            }
                        }
                    ]
                },
                removeable: true,
                onRemove: function()
                {
                    if (self.options.onRemove)
                        self.options.onRemove();
                    self.widget.onRemove();
                }
            });

            self.widget.details = layout.details;
            self.element = layout.element;
            self.content = layout.content;
            self.header = layout.header;
            self.rows = self.content.child('div', 'rows');

            self.rows.sortable
            ({
                connectWith: '.row-layout',
                distance: 5
            });

            var add = self.content.child('div', 'add');
            add.on('click', function()
            {
                self.widget.addRow();
            });
            var image = add.child('img', 'image');
            var url = IMu.Request.getURL('Image') + '&name=app/add';
            image.attr('src', url);
            var text = add.child('div', 'text');
            text.text(IMu.string('form-designer-add-layout-row'));

            // TODO: later-development
            //
            // At a later point in development, the user should be able to 
            // add multiple rows to a layout. As this is not needed for the 
            // moment, hide elements.
            add.hide();
        },

        addRow: function(widget, options)
        {
            var row = new LayoutRow(this.rows, widget);
            row.create();
            return row;
        }
    });
    
    var LayoutRow = IMu.Class.create
    ({
        _construct: function(owner, widget, options)
        {
            this._super.apply(this, arguments);

            this.owner = owner;
            this.designer = widget.controller.view.designer;

            this.element = undefined;
            this.content = undefined;
            this.header = undefined;
            this.columns = undefined;
            this.widget = widget;

            this.options =
            {
                onRemove: undefined
            };
            
            if (options)
                this.configure(options);
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this.options)
                    this.options[name] = options[name];
        },

        create: function()
        {
            var self = this;

            var row = self.designer.addCollapsibleElement(self.owner,
            {
                "class": 'row-layout', // bg-colour-1 border-2',
                header:
                {
                    label: 'Row',
                    "class": '' //'bg-colour-2'
                },
                details:
                {
//                    "class": 'bg-colour-2'
                },
                removeable: true,
                onRemove: function()
                {
                    if (self.options.onRemove)
                        self.options.onRemove();
                    self.widget.onRemove();
                }
            });

            self.widget.details = row.details;
            self.element = row.element;
            self.content = row.content;
            self.header = row.header;
            self.columns = self.content.child('div', 'columns');

            var startIndex;
            self.columns.sortable
            ({
                connectWith: '.column-layout',
                distance: 5,
                start: function(e, ui)
                {
                    startIndex = ui.item.index();
                },
                stop: function(e, ui)
                {
                    var newIndex = ui.item.index();
                    
                    if (newIndex == startIndex)
                        return;

                    var columns = self.widget.columns;
                    var movedColumn = columns.splice(startIndex, 1)[0];
                    columns.splice(newIndex, 0, movedColumn);
                }
            });

            var add = self.content.child('div', 'add');
            add.on('click', function()
            {
                self.widget.addColumn();
            });
            var image = add.child('img', 'image');
            var url = IMu.Request.getURL('Image') + '&name=app/add';
            image.attr('src', url);
            var text = add.child('div', 'text');
            text.text(IMu.string('form-designer-add-layout-column'));

            // TODO: later-development
            //
            // At a later point in development, the user should be able to 
            // add multiple rows to a layout. As this is not needed for the 
            // moment, hide elements.
            self.header.hide();
            self.element.css(
            {
                border: 'none',
                margin: '0'
            });
        },

        addColumn: function(widget, options)
        {
            var column = new LayoutColumn(this.columns, widget);
            column.create();
            return column;
        }
    });

    var LayoutColumn = IMu.Class.create
    ({
        _construct: function(owner, widget, options)
        {
            this._super.apply(this, arguments);

            this.owner = owner;
            this.designer = widget.controller.view.designer;

            this.element = undefined;
            this.content = undefined;
            this.header = undefined;
            this.sections = undefined;
            this.widget = widget;

            this.options =
            {
                onRemove: undefined
            };

            if (options)
                this.configure(options);
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this.options)
                    this.options[name] = options[name];
        },

        create: function()
        {
            var self = this;

            var column = self.designer.addCollapsibleElement(self.owner,
            {
                "class": 'column-layout bg-colour-1 border-2',
                header:
                {
                    label: 'Column',
                    "class": 'bg-colour-1'
                },
                details:
                {
                    "class": 'bg-colour-1',
                    fields:
                    [
                        {
                            type: 'text',
                            options:
                            {
                                name: 'min-width',
                                label: 'Minimum Width'
                            }
                        },
                        {
                            type: 'selection',
                            options:
                            {
                                name: 'overflow-y',
                                label: 'Overflow (vertical)',
                                list:
                                [
                                    'show',
                                    'hide',
                                    'scroll'
                                ]
                            }
                        }
                    ]
                },
                removeable: true,
                onRemove: function()
                {
                    if (self.options.onRemove)
                        self.options.onRemove();
                    self.widget.onRemove();
                }
            });

            self.widget.details = column.details;
            self.element = column.element;
            self.content = column.content;
            self.header = column.header;
            self.sections = self.content.child('div', 'sections');

            var startIndex = undefined;
            self.sections.sortable
            ({
                connectWith: '.section-layout',
                distance: 5,
                start: function(e, ui)
                {
                    startIndex = ui.item.index();
                },
                stop: function(e, ui)
                {
                    var newIndex = ui.item.index();
                    
                    if (newIndex == startIndex)
                        return;

                    var sections = self.widget.sections;
                    var movedSection = sections.splice(startIndex, 1)[0];
                    sections.splice(newIndex, 0, movedSection);
                }
            });

            var add = self.content.child('div', 'add');
            add.on('click', function()
            {
                self.widget.addSection();
            });
            var image = add.child('img', 'image');
            var url = IMu.Request.getURL('Image') + '&name=app/add';
            image.attr('src', url);
            var text = add.child('div', 'text');
            text.text(IMu.string('form-designer-add-layout-section'));
        },

        addSection: function(widget, options)
        {
            var section = new LayoutSection(this.sections, widget);
            section.create();
            return section;
        }
    });

    var LayoutSection = IMu.Class.create
    ({
        _construct: function(owner, widget, options)
        {
            this._super.apply(this, arguments);

            this.owner = owner;
            this.designer = widget.controller.view.designer;

            this.element = undefined;
            this.content = undefined;
            this.header = undefined;
            this.fields = undefined;
            this.widget = widget;

            this.options =
            {
                onRemove: undefined
            };

            if (options)
                this.configure(options);
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this.options)
                    this.options[name] = options[name];
        },

        create: function()
        {
            var self = this;

            var section = self.designer.addCollapsibleElement(self.owner,
            {
                "class": 'section-layout bg-colour-2 border-2',
                header:
                {
                    label: 'Section',
                    "class": 'bg-colour-3 txt-colour-1'
                },
                details:
                {
                    "class": 'bg-colour-2',
                    fields:
                    [
                        {
                            type: 'text',
                            options:
                            {
                                name: 'id',
                                label: 'ID'
                            }
                        },
                        {
                            type: 'selection',
                            options:
                            {
                                name: 'collapsible',
                                label: 'Collapsible',
                                list:
                                [
                                    {
                                        text: 'yes',
                                        val: 'yes'
                                    },
                                    {
                                        text: 'no',
                                        val: 'no'
                                    }
                                ]
                            }
                        },
                        {
                            type: 'selection',
                            options:
                            {
                                name: 'growth',
                                label: 'Height',
                                list:
                                [
                                    {
                                        text: 'Fixed',
                                        val: 'fixed'
                                    },
                                    {
                                        text: 'Dynamic',
                                        val: 'dynamic'
                                    }
                                ]
                            }
                        }
                    ]
                },
                removeable: true,
                onRemove: function()
                {
                    if (self.options.onRemove)
                        self.options.onRemove();
                    self.widget.onRemove();
                }
            });

            self.widget.details = section.details;
            self.element = section.element;
            self.content = section.content;
            self.header = section.header;
        }
    });
})(IMu.Themes.shared);
