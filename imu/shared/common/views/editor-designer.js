(function(theme)
{
    theme.views.register('editor-designer', 'designer',
    {
        _source: 'shared/common/editor-designer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.source = undefined;
                this.destination = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                this.makeDetails();
                this.makePermissions();
                this.sections = this.holder.child('div', 'sections');
                this.makeSource();
                this.makeDestination();
                this.makeButtons();
                this.newEditor();
            },

            /*!
            ** Clears all data from the `editor-designer`.
            */
            clearEditor: function()
            {
                this.title.text('');
                this.clearDetails();
                this.clearPermissions();
                this.source.clearForm();
                this.destination.clearForm();
                this.clearTerms();
            },

            /*!
            ** Creates a hash representation of the editor.
            **
            ** @returns editor
            **   The hash representation of the editor.
            */
            getEditor: function()
            {
                var self = this;

                var editor = {};
                var config = editor.config = {};
                var options = editor.options = {};

                var detailValues = self.details.getValues();
                var sourceValues = self.source.getValues();
                var destinationValues = self.destination.getValues();

                if(detailValues.id)
                    self.widget.id = detailValues.id;

                if(detailValues.title)
                    editor.title = detailValues.title;
                
                if(detailValues.description)
                    editor.description = detailValues.description;

                //PERMISSION
                //
                self.getPermissions(editor);

                //OPTIONS
                //
                if(self.method)
                    options.method = self.method;
                if(destinationValues.onlyEmpty)
                    options.onlyEmpty = destinationValues.onlyEmpty;
                else
                    options.onlyEmpty = false;

                //CONFIG
                //
                if(detailValues.table)
                    config.sourceTable = detailValues.table;
                if(sourceValues.column)
                    config.sourceColumn = sourceValues.column;
                if(destinationValues.destinationTable)
                    config.destinationTable = destinationValues.destinationTable;
                if(destinationValues.column)
                    config.destinationColumn = destinationValues.column;
                if(destinationValues.attachmentColumn)
                    config.attachmentColumn = destinationValues.attachmentColumn;

                if(destinationValues.column && destinationValues.attachmentColumn)
                    options.method = 'attach';
                else
                    options.method = 'replace';

                // TERMS
                // 
                var sections = self.sections.children('.section');
                var sourceTerms = [];
                var destinationTerms = [];
                var length = sections.length;

                for (var i = 0; i < length; i++)
                {
                    var s = jQuery(sections[i]);
                    var terms = s.find('.terms').children('.term');

                    var t3 = sections[i].filters.getFilters();
                    if (t == undefined)
                        var t = [];
                    t.push(t3);
                    switch (i)
                    {
                        case 0:
                            sourceTerms = sections[i].filters.getFilters();
                            break;
                        case 1:
                            destinationTerms = sections[i].filters.getFilters();
                            break;
                    }
                }

                if(sourceTerms.length > 0)
                    config.sourceTerms = sourceTerms;
                if(destinationTerms.length > 0)
                    config.destinationTerms = destinationTerms;

                //REPLACE
                //
                if (self.method == 'replace')
                {
                    var replaceField = options.replaceField = {};

                    if(destinationValues.type)
                        replaceField.type = destinationValues.type;
                    if(destinationValues.hint)
                        replaceField.hint = destinationValues.hint;
                    if(destinationValues.name)
                    {
                        var suggest = replaceField.suggest = {};
                        suggest.type = 'lookup';
                        suggest.name = destinationValues.name;
                        if (destinationValues.level)
                        {
                            // assumes the user works with 1 based indexing
                            suggest.level = parseInt(destinationValues.level) -1;
                            suggest.level = suggest.level.toString();
                        }
                    }
                }

                return editor;
            },

            /*!
            ** Clears all values from the editor and sets the title.
            */
            newEditor: function()
            {
                this.clearEditor();
                this.title.text(IMu.string('editor-designer-new-form'));
            },

            /*!
            ** Sets values in the editor.
            **
            ** Once the editor information has loaded, the values are set.
            **
            ** @param editor
            **   A hash representation of the editor.
            */
            setEditor: function(editor)
            {
                var self = this;
                self.clearEditor();

                if(! editor)
                    return

                if(editor.method)
                    self.method = editor.method;

                //DETAILS
                //
                var values = {};

                if(self.widget.id && self.widget.id != '_')
                    values.id = self.widget.id;

                if(editor.title)
                    values.title = editor.title;

                if(editor.description)
                    values.description = editor.description;

                if(editor.config.sourceTable)
                    values.table = editor.config.sourceTable;

                self.details.setValues(values);

                self.details.getField('id').widget.setOption('readonly', true);

                //PERMISSIONS
                self.setPermissions(editor);

                //SOURCE
                //
                var values = {};
                if(editor.config.sourceColumn)
                    values.column = editor.config.sourceColumn;
                self.source.setValues(values);

                //DESTINATION
                //
                var values = {};
                if(editor.config.attachmentColumn)
                    values.attachmentColumn = editor.config.attachmentColumn;
                if(editor.options.onlyEmpty)
                    values.onlyEmpty = editor.options.onlyEmpty;
                if(editor.config.destinationColumn)
                    values.column = editor.config.destinationColumn;
                if(editor.config.destinationTable)
                    values.destinationTable = editor.config.destinationTable;

                if(editor.config.destinationColumn && editor.config.destinationTable)
                    self.method = 'attach';
                else
                    self.method = 'replace';

                if (editor.options.replaceField)
                {
                    var replaceField = editor.options.replaceField;
                    if(replaceField.type)
                        values.type = replaceField.type;
                    if(replaceField.hint)
                        values.hint = replaceField.hint;
                    if (replaceField.suggest)
                    {
                        var suggest = replaceField.suggest;
                        if (suggest.name)
                            values.name = suggest.name;
                        if (suggest.level)
                            // assumes the user works with 1 based indexing
                            values.level = parseInt(suggest.level) +1;
                    }
                }

                self.destination.setValues(values);

                //TERMS
                //
                var sections = self.sections.children('.section');
                if(editor.config.sourceTerms)
                {
                    var terms = editor.config.sourceTerms;
                    sections[0].filters.setFilters(terms);
                }
                
                if(editor.config.destinationTerms)
                {
                    var terms = editor.config.destinationTerms;
                    sections[1].filters.setFilters(terms);
                }

                self.checkTable();
            },

            /*!
            ** Clears all terms for source and destination sections.
            */
            clearTerms: function()
            {
                var sections = this.sections.children('.section');
                for (var i = 0; i < sections.length; i++)
                    sections[i].filters.clearFilters();
            },

            /*!
            **
            ** @returns list
            **   The list of columns.
            */
            getColumns: function()
            {
                var list = [];
                var forms = this.sections.find('.form');
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
            ** Creates the data destination section.
            */
            makeDestination: function()
            {
                var self = this;

                var options =
                {
                    "class": 'section bg-colour-1 border-3',
                    header:
                    {
                        icon: 'app/destination_white',
                        label: 'editor-designer-destination-section',
                        "class": 'bg-colour-3 txt-colour-1'
                    },
                    details:
                    {
                        options:
                        {
                            columns: 2,
                            rows: 2,
                            onValidate: function(info, callback)
                            {
                                /* Uncomment if either
                                ** 1) Attachment field types become available
                                ** 2) Reference Column becomes modifiable

                                if (this.hash.table.getValue() == undefined &&
                                    this.hash.column.getValue() != undefined &&
                                    (this.hash.type.getValue() == "attachment" ||
                                    this.hash.refColumn.getValue() != undefined))
                                {
                                    this.updateValidationState(
                                        info, 'invalid');
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
                                        "designer-validation-type-not-ref-column");
                                }
                                */
                                if (this.hash.name.getValue() != undefined &&
                                    this.hash.level.getValue() == undefined)
                                {
                                    this.updateValidationState(
                                        info, "invalid");
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
                                else if (this.hash.name.getValue() == undefined &&
                                    this.hash.level.getValue() != undefined)
                                {
                                    this.updateValidationState(
                                        info, "invalid");
                                    info.details.push(
                                    {
                                        info:
                                        {
                                            state: "invalid",
                                            details: "validation-empty-mandatory"
                                        },
                                        field: this.hash.name.widget.view.control
                                    });
                                    this.hash.name.widget.setIcon("invalid",
                                        "validation-empty-mandatory");
                                }
                                callback(info);
                            },
                            order: 'row',
                            validateOnChange: true
                        },
                        fields:
                        [
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'attachmentColumn',
                                    label: 'editor-designer-destination-column',
                                    requirement: 'mandatory',
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
                                            var prefix = this.getValue()
                                            var table = self.details.getValue('table');

                                            var request = new IMu.Request.Schema();
                                            request.getColumn(table, prefix, function(result)
                                            {
                                                var destinationTable = 
                                                    self.destination
                                                    .hash.destinationTable;
                                                var destinationColumn =
                                                    self.destination
                                                    .hash.column;
                                                var replaceType = 
                                                    self.destination
                                                    .hash.type;
                                                if (! result.RefTable)
                                                {
                                                    self.method = 'replace';
                                                    destinationTable.setValue('');
                                                    destinationColumn.setValue('');

                                                    replaceType.setValue(
                                                        result.DataType.toLowerCase());
                                                    return;
                                                }
                                                self.method = 'attach';
                                                destinationTable.setValue(result.RefTable);
                                                destinationColumn.setValue('SummaryData');
                                            });
                                        }
                                    },
                                    onChange: function()
                                    {
                                        // TODO
                                        var destinationTable = 
                                            self.destination.hash.destinationTable;
                                        var destinationColumn =
                                            self.destination.hash.column;

                                        destinationTable.setValue('');
                                        destinationColumn.setValue('');
                                    },
                                    onLoseFocus: function()
                                    {
                                        this.suggest.onSelect.call(this);
                                    },
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'checkbox',
                                options:
                                {
                                    name: 'onlyEmpty',
                                    label: 'editor-designer-only-empty',
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'destinationTable',
                                    label: 'editor-designer-reference-table',
                                    readonly: true,
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'column',
                                    label: 'editor-designer-reference-column',
                                    readonly: true,
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'selection',
                                options:
                                {
                                    name: 'type',
                                    label: 'editor-designer-replace-type',
                                    list:
                                    [
                                        'text',
                                        'date'
                                    ],
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'hint',
                                    label: 'editor-designer-replace-hint',
                                    validateOnChange: true
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'name',
                                    label: 'editor-designer-lookup-name',
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
                                }
                            },
                            {
                                type: 'text',
                                options:
                                {
                                    name: 'level',
                                    label: 'editor-designer-lookup-level',
                                    validateOnChange: true
                                }
                            }
                        ]
                    },
                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d'
                    },
                    removeable: false
                };

                var section = self.addCollapsibleElement(self.sections, options);
                var destination = self.destination = section.details;
                var filters = self.makeFilters(section.content);
                section.element[0].filters = filters;
            },

            /*!
            ** Creates the editor details section.
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
                    label: 'editor-designer-title',
                    requirement: 'suggested',
                    validateOnChange: true,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'description',
                    label: 'editor-designer-description',
                    validateOnChange: false,
                    lines: 2,
                    columnSpan: 2
                });

                details.addField('text',
                {
                    name: 'id',
                    label: 'editor-designer-id',
                    validateOnChange: true
                });

                details.addField('text',
                {
                    name: 'table',
                    label: 'editor-designer-table',
                    requirement: 'mandatory',
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
                    onLoseFocus: function()
                    {
                        self.checkTable();
                    },
                    validateOnChange: true
                });
                
                details.createView();
            },

            /*!
            ** Creates the data source section.
            */
            makeSource: function()
            {
                var self = this;

                var options =
                {
                    "class": 'section bg-colour-1 border-3',
                    header:
                    {
                        icon: 'app/source_white',
                        label: 'editor-designer-source-section',
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
                                    name: 'column',
                                    label: 'editor-designer-source-column',
                                    requirement: 'mandatory',
                                    suggest: function(suggest, prefix, callback)
                                    {
                                        var table = self.details.getValue('table')
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
                                    validateOnChange: true

                                }
                            }
                        ]
                    },
                    toggle:
                    {
                        openIcon: 'arrow_white_u',
                        closedIcon: 'arrow_white_d'
                    },
                    removeable: false
                };
                var section = self.addCollapsibleElement(self.sections, options);
                var source = self.source = section.details;
                var filters = self.makeFilters(section.content)
                section.element[0].filters = filters;
            }
        }
    });
})(IMu.Themes.shared);
