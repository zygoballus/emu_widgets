(function(theme)
{
    var Section = IMu.Class.create
    ({
        /* Create a section.
        **
        ** A section has the following structure:
        **
        ** <div class="section">
        **   <div class="heading">
        **     <!--
        **       Section heading.
        **       See createHeading() method below.
        **     -->
        **   </div>
        **
        **   <div class="content">
        **     <!--
        **       Section content.
        **       See createContent() method below.
        **     -->
        **   </div>
        ** </div>
        */
        _construct: function(view, id, owner)
        {
            this.view = view;

            this.labels = undefined;

            this.heading = undefined;
            this.label = undefined;
            this.toggle = undefined;
            this.tween = undefined;

            this.content = undefined;

            var section = undefined;
            if (owner)
                section = owner.child('div');
            else
                section = this.view.widget.owner.child('div');
                
            section.addClass('section');
            section.addClass('section-' + id);
            section.addClass('bg-colour-2 border-4');

            var holder = section.child('div', 'holder');
            //removed for IE8
            //holder.addClass('bg-colour-2');

            this.heading = holder.child('div', 'heading');
            // for compatibility with existing css
            this.heading.addClass('title');

            this.content = holder.child('div', 'content');
            // for compatibility with existing css
            this.content.addClass('form');
        },

        /* Create section content.
        */
        createContent: function()
        {
            // overridden
        },

        /* Create a section heading.
        **
        ** A section heading has the following structure:
        **
        ** <table>
        **   <tbody>
        **     <tr>
        **
        **       <td style="width: 99%">
        **         <div class="label">
        **           <!-- Text of label (if any) -->
        **         </div> 
        **       </td>
        **
        **       <td style="width: 1%">
        **          <div class="toggle">
        **            <!-- IMu button-control -->
        **          </div>
        **       </td>
        **
        **     </tr>
        **   </tbody>
        ** </table>
        */
        createHeading: function(options)
        {
            var self = this;

            if (options.visible == undefined)
                options.visible = '';
            if (options.hidden == undefined)
                options.hidden = options.visible;
            self.labels =
            {
                visible: options.visible,
                hidden: options.hidden
            };

            var table = self.heading.child('table');
            var tr = table.child('tbody').child('tr');

            // label
            var td = tr.child('td');
            td.css('width', '99%');
            td.addClass('txt-colour-2');
            self.label = td.child('div', 'label');
            self.label.text(self.labels.visible);

            td.on('click', function()
            {
                self.toggleContent();
            });

            var td = tr.child('td');
            td.css('width', '1%');

            if (options.collapsible === undefined || options.collapsible == 'yes')
            {
                table.addClass('collabsible');

                var div = td.child('div', 'toggle');
                self.toggle = div.IMu('button-control');
                self.toggle.addState
                ({
                    name: 'opened',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=arrow_u'
                    },
                    onClick: function()
                    {
                        self.hideContent();
                    }
                });
                self.toggle.addState
                ({
                    name: 'closed',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=arrow_d'
                    },
                    onClick: function()
                    {
                        self.showContent();
                    }
                });
                self.toggle.createView();
            }
        },

        createTween: function()
        {
            var self = this;

            self.tween = new TimelineMax
            ({
                onComplete: function()
                {
                    self.label.text(self.labels.hidden);
                    self.view.resize();
                },

                onUpdate: function()
                {
                    // Allows for resizing minimum height of layout
                    self.view.resize();
                },

                /* The following lines are used to essentially reset
                ** tweenmax so that it doesn't do strange things with
                ** height.
                */
                onReverseComplete: function()
                {
                    self.content.css('height', '');
                    this.invalidate();
                    self.view.resize();
                }
            });
            self.tween.to(self.content, 0.1,
                {
                    css:
                    {
                        overflow: 'hidden'
                    }
                }
            );
            self.tween.to(self.content, 0.8,
                {
                    css:
                    {
                        height: 0
                    },
                    ease: Linear.easeNone
                }
            );
        },

        hideContent: function()
        {
            this.toggle.setState('closed');
            if (this.tween == undefined)
                this.createTween();
            this.tween.play();
        },

        isHidden: function()
        {
            var index = this.toggle.getState();
            var state = this.toggle.states[index];
            return state.name == 'closed';
        },

        isVisible: function()
        {
            var index = this.toggle.getState();
            var state = this.toggle.states[index];
            return state.name == 'opened';
        },

        setHiddenLabel: function(label)
        {
            if (label == undefined)
                label = this.visible;
            this.labels.hidden = label;
            if (this.isHidden())
                this.label.text(label);
        },

        setLabels: function(visible, hidden)
        {
            if (visible == undefined)
                visible = '';
            if (hidden == undefined)
                hidden = visible;
            this.labels =
            {
                visible: visible,
                hidden: hidden
            };

            var label = this.labels.visible;
            if (this.isHidden())
                label = this.labels.hidden;
            this.label.text(label);
        },

        setVisibleLabel: function(label)
        {
            if (label == undefined)
                label = '';
            this.labels.visible = label;
            if (this.isVisible())
                this.label.text(label);
        },

        showContent: function()
        {
            this.label.text(this.labels.visible);
            this.toggle.setState('opened');
            if (this.tween == undefined)
                this.createTween();
            this.tween.reverse();
        },

        toggleContent: function()
        {
            if (this.isVisible())
                this.hideContent();
            else
                this.showContent();
        }
    });

    var InputSection = Section.extend
    ({
        _construct: function(view, id, owner)
        {
            this._super(view, id, owner);

            this.info = undefined;

            this.form = undefined;
        },

        createContent: function(info)
        {
            var self = this;

            self.info = info;

            self.form = self.content.IMu('form',
            {
                onChange: function()
                {
                    self.view.enableSaveCancel(true);
                    self.view.widget.doChange();
                },
                defaultContext: IMu.Request.defaultContext,
                defaultPort: IMu.Request.defaultPort

            });
            for (var i in self.info.fields)
                self.addField(i, self.info.fields[i]);
            self.form.createView();
        },

        getAsyncValues: function(callback)
        {
            var self = this;

            if (! callback)
                return;

            var values = {};

            var remaining = self.info.fields.length;

            if (! remaining)
                callback(values);
            
            // poor-man's Promise.all
            self.info.fields.forEach(function(field)
            {
                var id = field.id;
                if (field.isRestricted && field.isRestricted =='1')
                {
                    // Skip this field for values
                    remaining--;
                    if (! remaining)
                        callback(values);
                }
                else
                {
                    if (! field.view)
                    {
                        // Makes hidden default values work!
                        values[id] = field.value;

                        remaining--;

                        if (! remaining)
                            callback(values);
                    }
                    else
                    {
                        var widget = field.view.widget;
                        widget.getAsyncValue(function(fieldVals)
                        {
                            values[id] = fieldVals;
                            remaining--;

                            if (! remaining)
                                callback(values);
                        });
                    }
                }
            });
        },

        getValues: function()
        {
            var values = {};
            for (var i in this.info.fields)
            {
                var field = this.info.fields[i];
                var id = field.id;
                // Skip restricted fields.
                if (field.isRestricted && field.isRestricted == '1')
                    continue;
                if (! field.view)
                    // Makes hidden default values work!
                    values[id] = field.value;
                else
                    values[id] = field.view.getValue();
            }
            return values;
        },

        setValues: function(values)
        {
            for (var i in this.info.fields)
            {
                var field = this.info.fields[i];
                var id = field.id;

                if (! field.view)
                    // Makes hidden default values work!
                    field.value = values[id];
                else if (field.kind == 'multiple')
                {
                    field.view.widget.clearGrid();

                    // Create suitable structure for grid widget
                    var column = values[id];
                    var colValues = [];
                    if (column !== undefined)
                    {
                        if (IMu.Type.isArray(column))
                        {
                            for (var j in column)
                            {
                                colValues[j] = {};
                                colValues[j][id] = column[j];
                            }
                        }
                        else
                        {
                            colValues.push({});
                            colValues[0][id] = column;
                        }

                        field.view.setValue(colValues);
                    }
                    if (field.view.widget.rows.length == 0)
                        field.view.widget.appendRow();
                }
                else
                    field.view.setValue(values[id]);
            }
        },

        validate: function(info, callback)
        {
            var self = this;

            self.form.validate(function(result)
            {
                if (result.state != 'ok')
                {
                    info.details = info.details.concat(result.details);
                    if (result.state == 'invalid')
                    {
                        if (info.state != 'invalid')
                            info.state = 'invalid';
                    }
                    else if (result.state == 'empty')
                    {
                        if (info.state != 'invalid' && info.state != 'empty')
                            info.state = 'empty';
                    }
                }
                callback();
            });
        },

        // private

        /*
        ** Creates a new field in a form.
        **
        ** @param n
        **   The order of appearance for the field.
        **
        ** @param field
        **   A hash representation of the field to add.
        */
        addField: function(n, field)
        {
            if (field.access == 'hidden')
                return;

            var kind = field.kind;
            if (! kind && field.column && field.column.kind)
            {
                kind = field.column.kind;
                if (kind == 'atom')
                    kind = 'single';
                else if (kind == 'key')
                    kind = 'single';
                else if (kind == 'nested')
                    kind = 'nested';
                else if (kind == 'table')
                    kind = 'multiple';
            }
            if (! kind)
                kind = 'single';

            if (kind == 'image')
                this.addImageField(n, field);
            else if (kind == 'image-capture')
                this.addImageCaptureField(n, field);
            else if (kind == 'mobile-image-capture')
                this.addMobileImageCaptureField(n, field);
            else if (kind == 'capture')
                this.addCaptureField(n, field);
            else if (kind == 'multiple')
                this.addMultipleField(n, field);
            else if (kind == 'nested')
                this.addNestedField(n, field);
            else if (kind == 'single')
                this.addSingleField(n, field);
        },

        /*
        ** Creates an image field in a form.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the image field.
        */
        addImageField: function(n, field)
        {
            var options = this.getFieldOptions(field);
            if (field.height)
                options.height = field.height;
            if (field.bfWidth)
                options.bestFitWidth = field.bfWidth;
            field.view = this.form.addField('image', options);
        },

        /*
        ** Creates an image-capture field in a form.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the image field.
        */
        addImageCaptureField: function(n, field)
        {
            var options = this.getFieldOptions(field);
            if(field.imageControlHeight)
                options.imageControlHeight = field.imageControlHeight;
	    if (field.bfWidth)
	       	options.bestFitWidth = field.bfWidth;
            options.allowMultiple = true;
            field.view = this.form.addField('imageCapture', options);
        },
        
        addCaptureField: function(n, field)
        {
            var options = this.getFieldOptions(field);
            field.view = this.form.addField('capture', options);
        },

        /*
        ** Creates a mobile-image-capture field in a form.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the image field.
        */
        addMobileImageCaptureField: function(n, field)
        {
            var options = this.getFieldOptions(field);
            if(field.imageControlHeight)
                options.imageControlHeight = field.imageControlHeight;
	    if (field.bfWidth)
	       	options.bestFitWidth = field.bfWidth;
            field.view = this.form.addField('imageCapture', options);
        },

        /*
        ** Creates a field with multiple inputs.
        **
        ** Currently supports `attachment`, `selection` and `text` field
        ** types.
        **
        ** @param n
        **   The order of appearance of the fields in the form.
        **
        ** @param field
        **   A hash representation of the fields.
        */
        addMultipleField: function(n, field)
        {
            var type = field.type;

            if (! type && field.column && field.column.type)
                type = field.column.type;
            if (! type)
                type = 'text';

            if (type == 'attachment')
                this.addMultipleAttachment(n, field);
            else if (type == 'date')
                this.addMultipleDate(n, field);
            else if (type == 'number')
                this.addMultipleNumber(n, field);
            else if (type == 'integer')
                this.addMultipleInteger(n, field);
            else if (type == 'selection')
                this.addMultipleSelection(n, field);
            else if (type == 'text')
                this.addMultipleText(n, field);
        },

        /*
        ** Creates multiple attachment fields.
        **
        ** @param n
        **   The order of appearance of the fields in the form.
        **
        ** @param field
        **   A hash representation of the attachment fields.
        */
        addMultipleAttachment: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.rowNumbers = false;
            var refcolumn = undefined;
            if (field.column)
                refcolumn = field.column.name;
            var showAddRemove = !options.readonly || field.zoomForm;
            var grid = field.view = this.form.addField('grid',
            {
                label: options.label,
                rowNumbers: false,
                showAddRemove: showAddRemove,
                dataColumn: refcolumn,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }

                    if (callback)
                        callback();
                }
            });

            if ('table' in field)
                options.table = field.table;
            if ('refColumn' in field)
                options.displayColumn = field.refColumn;
            if ('zoomForm' in field)
                options.zoomForm = field.zoomForm;
            if ('maxValues' in field)
                options.maxValues = field.maxValues;
            if ('matchLimit' in field)
                options.matchLimit = field.matchLimit;
            if ('terms' in field)
                options.terms = field.terms
            if ('searchColumns' in field)
                options.searchColumns = field.searchColumns;
            if('column' in field)
                options.dataColumn = field.column.name;

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (!grid)
                    return;
                if (widget != grid.widget)
                    return;

                grid.widget.addColumn('attachment',
                {
                    name: options.id,
                    table: options.table,
                    hint: options.hint,
                    readonly: options.readonly,
                    matchLimit: options.matchLimit,
                    maxValues: options.maxValues,
                    displayColumn: options.displayColumn,
                    searchColumns: options.searchColumns,
                    zoomForm: options.zoomForm,
                    dataColumn: options.dataColumn,
                    terms: options.terms,
                    minLength: 2,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        addMultipleDate: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.rowNumbers = false;
            options.picker = true;

            var grid = field.view = this.form.addField('grid',
            {
                label: options.label,
                rowNumbers: false,
                showAddRemove: !options.readonly,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }

                    if (callback)
                        callback();
                }
            });

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (widget != grid.widget)
                    return;

                grid.widget.addColumn('date',
                {
                    name: options.id,
                    picker: options.picker,
                    readonly: options.readonly,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        addMultipleInteger: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.rowNumbers = false;

            var grid = field.view = this.form.addField('grid',
            {
                label: options.label,
                rowNumbers: false,
                showAddRemove: !options.readonly,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }

                    if (callback)
                        callback();
                }
            });

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (widget != grid.widget)
                    return;

                grid.widget.addColumn('integer',
                {
                    name: options.id,
                    readonly: options.readonly,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        addMultipleNumber: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.rowNumbers = false;
            
            var grid = field.view = this.form.addField('grid',
            {
                label: options.label,
                rowNumbers: false,
                showAddRemove: !options.readonly,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }

                    if (callback)
                        callback();
                }
            });

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (widget != grid.widget)
                    return;

                grid.widget.addColumn('number',
                {
                    name: options.id,
                    readonly: options.readonly,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        /*
        ** Creates multiple selection fields.
        **
        ** @param n
        **   The order of appearance of the fields in the form.
        **
        ** @param field
        **   A hash representation of the selection fields.
        */
        addMultipleSelection: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.rowNumbers = false;

            if (field.list)
                options.list = field.list

            var lookup = this.getFieldLookup(field);
            if (lookup)
            {
                options.list =
                {
                    type: 'lookup',
                    name: lookup.name
                };
                if (lookup.level)
                    options.list.level = lookup.level;
            }
            var grid = field.view = this.form.addField('grid',
            {
                label: options.label,
                rowNumbers: false,
                showAddRemove: !options.readonly,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }
                    
                    if (callback)
                        callback();
                }
            });

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (widget != grid.widget)
                    return;

                grid.widget.addColumn('selection',
                {
                    hint: 'common-selection-choose-a-value',   // allow an null value
                    name: options.id,
                    readonly: options.readonly,
                    list: options.list,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        /*
        ** Creates multiple text fields.
        **
        ** @param n
        **   The order of appearance of the fields in the form.
        **
        ** @param field
        **   A hash representation of the text fields.
        */
        addMultipleText: function(n, field)
        {
            var self = this;

            var options = this.getFieldOptions(field);
            options.rowNumbers = false;
            if (field.description)
                options.hint = field.description;

            var lookup = this.getFieldLookup(field);
            if (lookup)
            {
                options.suggest = 
                {
                    type: 'lookup',
                    name: lookup.name
                };
                if (lookup.level)
                    options.suggest.level = lookup.level;
            }
            var grid = field.view = this.form.addField('grid',
            {
                access: options.access,
                restricted: options.restricted,
                label: options.label,
                rowNumbers: false,
                showAddRemove: !options.readonly,
                onChange: function()
                {
                    IMu.Events.trigger('dom-resize');
                },
                onValidate: function(info, callback)
                {
                    var requirement = options.requirement || '';
                    if (requirement.toLowerCase() == 'mandatory')
                    {
                        if (! grid.value.length)
                        {
                            info.state = 'invalid';
                            info.details = 'validation-empty-mandatory';
                        }
                    }

                    if (callback)
                        callback();
                }
            });

            IMu.Events.bind('grid-view-created', function(name, widget)
            {
                if (widget != grid.widget)
                    return;
                
                grid.widget.addColumn('text',
                {
                    name: options.id,
                    hint: options.hint,
                    suggest: options.suggest,
                    readonly: options.readonly,
                    onChange: function(cell, value)
                    {
                        grid.widget.updateGrid(cell);
                    }
                });
                grid.widget.appendRow();
            });
        },

        /*
        **
        */
        addNestedField: function(n, field)
        {
            // TODO
        },

        /*
        ** Creates a field with a single input.
        **
        ** Currently supports `attachment`, `date`, `integer`, `number`,
        ** `selection` and `text` field types.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleField: function(n, field)
        {
            var type = field.type;
            if (! type && field.column && field.column.type)
                type = field.column.type;
            if (! type)
                type = 'text';

            if (type == 'attachment')
                this.addSingleAttachment(n, field);
            else if (type == 'date')
                this.addSingleDate(n, field);
            else if (type == 'integer')
                this.addSingleInteger(n, field);
            else if (type == 'number')
                this.addSingleNumber(n, field);
            else if (type == 'selection')
                this.addSingleSelection(n, field);
            else if (type == 'text')
                this.addSingleText(n, field);
        },

        /*
        ** Creates an attachment field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleAttachment: function(n, field)
        {
            var options = this.getFieldOptions(field);

            if('table' in field)
                options.table = field.table;
            if('refColumn' in field)
                options.displayColumn  = field.refColumn;
            if('zoomForm' in field)
                options.zoomForm  = field.zoomForm;
            if('maxValues' in field)
                options.maxValues = field.maxValues;
            if('matchLimit' in field)
                options.matchLimit = field.matchLimit;
            if('terms' in field)
                options.terms = field.terms;
            if('searchColumns' in field)
                options.searchColumns = field.searchColumns;
            if('column' in field)
                options.dataColumn = field.column.name;
            field.view = this.form.addField('attachment', options); 
        },

        /*
        ** Creates a date field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleDate: function(n, field)
        {
            var options = this.getFieldOptions(field);
            options.picker = true;
            field.view = this.form.addField('date', options);
        },

        /*
        ** Creates an integer field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleInteger: function(n, field)
        {
            var options = this.getFieldOptions(field);
            field.view = this.form.addField('integer', options);
        },

        /*!
        ** Creates a number field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleNumber: function(n, field)
        {
            var options = this.getFieldOptions(field);
            field.view = this.form.addField('number', options);
        },

        /*!
        ** Creates a selection field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleSelection: function(n, field)
        {
            var options = this.getFieldOptions(field);
            if (field.list)
                options.list = field.list
            else
            {
                var lookup = this.getFieldLookup(field);
                if (lookup)
                {
                    options.list =
                    {
                        type: 'lookup',
                        name: lookup.name
                    };
                    if (lookup.level)
                        options.list.level = lookup.level;
                }
            }
            field.view = this.form.addField('selection', options);
        },

        /*
        ** Creates a text field.
        **
        ** @param n
        **   The order of appearance of the field in the form.
        **
        ** @param field
        **   A hash representation of the field.
        */
        addSingleText: function(n, field)
        {
            var options = this.getFieldOptions(field);
            if (field.description)
                options.hint = field.description;
            if (field.lines)
            {
                options.lines = field.lines - 0;
                options.rowSpan = field.lines - 0;
            }

            var lookup = this.getFieldLookup(field);
            if (lookup)
            {
                options.suggest =
                {
                    type: 'lookup',
                    name: lookup.name
                };
                if (lookup.level)
                    options.suggest.level = lookup.level;
            }
            field.view = this.form.addField('text', options);
        },

        getFieldLookup: function(field)
        {
            if (field.lookup)
                return field.lookup;
            if (! field.column)
                return undefined;
            return field.column.lookup;
        },

        getFieldOptions: function(field)
        {
            var options = {};

            if (field.id)
                options.id = field.id;
            if (field.label)
                options.label = field.label;
            if (field.access == 'read-only')
                options.readonly = true;
            if (field.isRestricted == '1')
                options.restricted = true;
            if (field.requirement)
                options.requirement = field.requirement;
            if (field.validateOnGainFocus)
                options.validateOnGainFocus = true;
            if (field.validateOnLoseFocus)
                options.validateOnLoseFocus = true;
            options.validateOnChange = true;
            options.onChange = function(e) {};
            return options;
        }
    });

    var SearchSection = Section.extend
    ({
        _construct: function(view, id)
        {
            this._super(view, id);

            this.info = undefined;

            this.search = undefined;
            this.input = undefined;
            this.submit = undefined;
            this.found = undefined;
            this.add = undefined;

            this.results = undefined;
        },

        createContent: function(info)
        {
            var self = this;

            self.info = info;

            // Search
            //
            self.search = self.content.child('div', 'search');
            self.input = self.search.child('input type="text"', 'input');
            self.input.on('keyup', function(e)
            {
                if (e.keyCode == 13)
                {
                    self.runSearch();
                    return false;
                }
            });
            self.input.on('barcode-scanned', function(e, info)
            {
                self.input.val(info.value);
                self.runSearch();
                return false;
            });
            self.submit = self.search.child('div', 'submit').IMu('button-control');
            self.submit.addState
            ({
                classes: 'bg-colour-3 txt-colour-1',
                layout:
                {
                    type: 'text',
                    value: IMu.string('form-builder-submit')
                },
                onClick: function()
                {
                    self.runSearch();
                }
            });
            self.submit.createView();

            self.found = self.search.child('div', 'found');

            self.add = self.search.child('div', 'add').IMu('button-control');
            self.add.addState
            ({
                classes: 'bg-colour-3 txt-colour-1',
                layout:
                {
                    type: 'text',
                    value: IMu.string('form-builder-new-record')
                },
                onClick: function()
                {
                    self.hideContent();
                    self.view.widget.doFetch();
                }
            });
            self.add.createView();

            // Results
            //
            self.results = self.content.child('div', 'results').IMu('grid',
            {
                onRowClicked: function(row)
                {
                    self.showRow(row);
                }
            });
            var columns = self.info.results;
            if (! columns)
                columns = ['SummaryData'];
            for (var i in columns)
            {
                var key = columns[i];
                self.results.addColumn('static',
                {
                    name: key
                });
            }
            self.results.createView();
        },

        runSearch: function()
        {
            var self = this;

            this.setHiddenLabel();

            var terms = self.input.val();
            self.view.widget.doSearch(terms, function(results)
            {
                self.showResults(results);
            });
        },

        showResults: function(results)
        {
            var text = results.hits + ' ' + IMu.string('form-builder-found');
            this.setHiddenLabel(this.labels.visible + ' (' + text + ')');
            this.found.text(text);

            var text = results.hits + ' ' + IMu.string('form-builder-found');

            this.results.clearGrid();
            if (results.hits > 0)
                this.results.appendRows(results.rows);
            this.view.widget.setValues({});
        },

        showRow: function(row)
        {
            var key = row.values.irn;
            this.view.widget.doFetch(key);
            this.hideContent();
        }
    });

    theme.views.register('form-builder', 'base',
    {
        _source: 'shared/common/form-builder',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                this.search = undefined;
                this.inputs = undefined

                this.back = undefined;
                this.fwd = undefined;
                this.mesg = undefined;
                this.save = undefined;
                this.cancel = undefined;
            },

            clear: function()
            {
            },

            create: function()
            {
                var self = this;

                self.widget.owner.addClass('txt-colour-3');
                var form = self.widget.form;

                // Search section
                //
                if ('search' in form && 'table' in form)
                {
                    var info = form.search;

                    self.search = new SearchSection(self, 'search');
                    self.search.createHeading({visible: IMu.string('form-builder-search')});
                    self.search.createContent(info);
                    self.search.hideContent();
                }

                // Input sections
                //
                self.createInputSections(form);

                // Buttons
                //
                var buttons = self.widget.owner.child('div', 'buttons');
//                buttons.addClass('bg-colour-2');
                var tr = buttons.child('table').child('tbody').child('tr');

                // bwd
                //
                var td = tr.child('td');
                td.css('width', '1%');
                if (self.widget.navigate)
                {
                    self.bwd = td.child('div', 'bwd').IMu('button-control');
                    self.bwd.addState
                    ({
                        classes: 'bg-colour-3 txt-colour-1',
                        layout:
                        {
                            type: 'text',
                            value: IMu.string('form-builder-navigation-bwd')
                        },
                        onClick: function()
                        {
                            self.doBackward();
                        }
                    });
                    self.bwd.createView();
                }

                // fwd
                //
                var td = tr.child('td');
                td.css('width', '1%');
                if (self.widget.navigate)
                {
                    self.fwd = td.child('div', 'fwd').IMu('button-control');
                    self.fwd.addState
                    ({
                        classes: 'bg-colour-3 txt-colour-1',
                        layout:
                        {
                            type: 'text',
                            value: IMu.string('form-builder-navigation-fwd')
                        },
                        onClick: function()
                        {
                            self.doForward();
                        }
                    });
                    self.fwd.createView();
                }

                // mesg
                //
                var td = tr.child('td');
                td.css('width', '95%');
                if (self.widget.navigate)
                    self.mesg = td.child('div', 'mesg');

                // next
                //
                var td = tr.child('td');
                td.css('width', '1%');
                if (self.widget.navigate)
                {
                    self.next = td.child('div', 'next').IMu('button-control');
                    self.next.addState
                    ({
                        classes: 'bg-colour-3 txt-colour-1',
                        layout:
                        {
                            type: 'text',
                            value: IMu.string('form-builder-navigation-next')
                        },
                        onClick: function()
                        {
                            self.doNext();
                        }
                    });
                    self.next.createView();
                }

                var platform = IMu.Platform;

                if (platform.device.type == 'phone') 
                {
                    tr = buttons.child('table').child('tbody').child('tr');
                    var td = tr.child('td');
                    td.css('width', '95%');
                    if (self.widget.navigate)
                        self.mesg = td.child('div', 'mesg');
                }

                // save
                //
                var td = tr.child('td');
                td.css('width', '1%');
                if (self.widget.getOption('showSave', true))
                {
                    self.save = td.child('div', 'save').IMu('button-control');
                    self.save.addState
                    ({
                        classes: 'bg-colour-3 txt-colour-1',
                        layout:
                        {
                            type: 'text',
                            value: IMu.string('form-builder-save')
                        },
                        onClick: function()
                        {
                            self.widget.validate(function(info)
                            {
                                self.doSave();
                            });
                        }
                    });
                    self.save.createView();
                }

                // cancel
                //
                var td = tr.child('td');
                td.css('width', '1%');
                if (self.widget.getOption('showCancel', true))
                {
                    self.cancel = td.child('div', 'cancel').IMu('button-control');
                    self.cancel.addState
                    ({
                        classes: 'bg-colour-3 txt-colour-1',
                        layout:
                        {
                            type: 'text',
                            value: IMu.string('form-builder-cancel')
                        },
                        onClick: function()
                        {
                            self.doCancel();
                        }
                    });
                    self.cancel.createView();
                }

                self.enableNavigation();
                self.enableSaveCancel(false);
            },

            createInputSections: function(form)
            {
                this.inputs = [];

                if (! form)
                    return;
                if (form.layouts)
                    // TODO: add logic for determining layout based on device
                    // type and available layouts.
                    // For now only accept layouts specified as the "default" layout
                    if (form.layouts['default'])
                        this.createCustomLayout(form.input.sections, form.layouts["default"]);
                    else
                        this.createLinearLayout(form.input.sections);
                else
                    this.createLinearLayout(form.input.sections);
            },

            createCustomLayout: function(sections, layout)
            {
                var self = this;

                var owner = self.widget.owner;
                owner.addClass("custom-layout table");

                if (layout['max-width'])
                    jQuery('.imu-app').addClass('landscape');
                
                var createRow = function(rowInfo)
                {
                    var row = owner.child('div', 'row');
                    var minHeight = 0;

                    var createColumn = function(columnInfo, owner)
                    {
                        var holder = owner.child('div', 'holder');
                        var tbody = holder.child('table').child('tbody');

                        if (columnInfo.sections)
                        {
                            var paddingNeeded = true;
                            var last_tr;

                            for (var i = 0; i < columnInfo.sections.length; i++)
                            {
                                var sectionInfo = columnInfo.sections[i];
                                last_tr = tbody.child('tr');
                                var td = last_tr.child('td');
     
                                var growth = 'fixed';
                                /* TODO: dynamic heights have been removed until
                                ** we have time / funding to fix it
                                **
                                if (sectionInfo['growth'] == 'dynamic')
                                {
                                    growth = 'dynamic';
                                    paddingNeeded = false;
                                }
                                */
                                td.addClass(growth + '-height');

                                var info = undefined;
                                for (var j = 0; j < sections.length; j++)
                                {
                                    if (sections[j].id == sectionInfo.id)
                                    {
                                        info = sections[j];
                                        break;
                                    }
                                }

                                if (! info)
                                    break;

                                var input = new InputSection(self, i, td);
                                input.createHeading(
                                {
                                    visible: info.label,
                                    collapsible: sectionInfo.collapsible
                                });
                                input.createContent(info);

                                // Attempt to stretch field height if
                                // only one field exists.
                                if (growth == 'dynamic' && 
                                    input.info.fields.length == 1)
                                {
                                    var usedHeight = input.heading.css('height');
                                    usedHeight = parseInt(usedHeight, 10) + 1;

                                    /* for IE8 resize method
                                    */
                                    jQuery(input.content).parent()
                                        .addClass('calc');
                                }
                                

                                self.inputs.push(input);
                            }
                            last_tr.addClass('last-row');
                        }

                        var colHeight = holder.fullHeight();
                        if (colHeight > minHeight)
                            minHeight = colHeight;

                        if (paddingNeeded)
                            tbody.child('tr', 'padding').child('td');
                    };

                    var tr = row.child('table').child('tbody').child('tr');
                    for (var i = 0; i < rowInfo.columns.length; i++)
                    {
                        var columnInfo = rowInfo.columns[i];
                        var td = tr.child('td', 'column');

                        if (columnInfo['min-width'])
                        {
                            var minWidth = columnInfo['min-width'];
                            if (! minWidth.match(/(px|%|em|ex|cm|mm|in|pt|pc)$/i))
                                minWidth += "em";
                            td.css('min-width', columnInfo['min-width'] + 'em');
                        }

                        td.css('width', 100 / rowInfo.columns.length + "%");

                        var overflowY = 'show';
                        if (columnInfo['overflow-y'] == 'scroll')
                            overflowY = 'scroll';
                        else if (columnInfo['overflow-y'] == 'hide')
                            overflowY = 'hide';
                        td.addClass('overflow-y-' + overflowY);

                        // Add other column classes relivant to custom layout 
                        // here.
                            
                        createColumn(columnInfo, td);
                    }

                    /* Find the minimum width of the contents of each column
                    */
                    tr.children('.column').each(function()
                    {
                        var width = jQuery(this).css('min-width');
                        if (width == '0px')
                        {
                            jQuery(this).css('max-width', '0px');
                            var table = 
                                jQuery(this).children('.holder').children('table');
                            width = table.css('width');
                            jQuery(this).css('max-width', 'none');
                        }
                        
                        width = parseInt(width, 10) + 11 + 'px';
                        jQuery(this).css('min-width', width)
                    });

//                    row.css('height', '');

                    /* The idea here is to set a minimum height for a row, though
                    ** there are issues with when a section is toggled closed not
                    ** altering the minimum height value.
                    */
//                    if (minHeight)
//                        row.css('min-height', minHeight + 'px');

                    return row;
                };


                for (var i = 0; i < layout.rows.length; i++)
                    var row = createRow(layout.rows[i]);
          
                /* Various elements in the entire page (not just this app)
                ** might need resizing.
                */
                IMu.Events.trigger('dom-resize');
            },

            /* Used if no custom layout has been defined in the designer
            */
            createLinearLayout: function(sections)
            {
                for (var i in sections)
                {
                    var info = sections[i];

                    var input = new InputSection(this, i);
                    input.createHeading({visible: info.label});
                    input.createContent(info);

                    this.inputs.push(input);
                }
            },

            doBuiltinValidation: function(info, callback)
            {
                var self = this;

                var length = self.inputs.length;
                var done = 0;
                for (var i in self.inputs)
                {
                    self.inputs[i].validate(info, function()
                    {
                        if (++done == length)
                            callback();
                    });
                }
            },

            /* Gets the values of each control in the form.
            **
            ** @returns values
            **   The values in the form.
            */
            getValues: function()
            {
                var values = {};
                for (var i in this.inputs)
                {
                    var section = this.inputs[i].getValues();
                    for (var name in section)
                        values[name] = section[name];
                }
                return values;
            },

            move: function(amount)
            {
                var focus = document.activeElement;
                if (! focus)
                    return;
                var list = jQuery(':tabbable');
                for (var i = 0; i < list.length; i++)
                {
                    if (list[i] == focus)
                    {
                        var next = (i + amount);
                        while (next < 0)
                            next += list.length;
                        next %= list.length;
                        jQuery(list[next]).focus();
                        break;
                    }
                }
            },

            moveBackward: function()
            {
                this.move(-1);
            },

            moveForward: function()
            {
                this.move(1);
            },

            /* Sets the values of controls in the form.
            **
            ** @param values
            **   A hash table containing the control ids and their value.
            */
            setValues: function(values)
            {
                for (var i in this.inputs)
                    this.inputs[i].setValues(values);
                this.enableNavigation();
                if (window.opener && window.openctl)
                {
                    this.enableSaveCancel(true);
                }
                else
                {
                    this.enableSaveCancel(false);
                }
            },

            // private

            doBackward: function()
            {
                var length = this.widget.recordSet.length;
                if (length == undefined || length <= 1)
                    return;
                var index = this.widget.currentIndex;
                if (index == undefined || index <= 0)
                    return;
                var irn = this.widget.recordSet[index - 1];
                this.widget.doFetch(irn);
            },

            doCancel: function()
            {
                this.widget.doCancel();
            },

            doForward: function()
            {
                var length = this.widget.recordSet.length;
                if (length == undefined || length <= 1)
                    return;
                var index = this.widget.currentIndex;
                if (index == undefined || index < 0 || index >= length - 1)
                    return;
                var irn = this.widget.recordSet[index - 0 + 1];
                this.widget.doFetch(irn);
            },

            doNext: function()
            {
                this.widget.doFetch();
            },

            doSave: function()
            {
                this.widget.save();
            },

            enableNavigation: function()
            {
                var length = this.widget.recordSet.length;
                if (length == undefined)
                    length = 0;
                var index = this.widget.currentIndex;
                if (index == undefined)
                    index = -1;
                else
                    index -= 0;
               
                if (this.bwd)
                    this.bwd.disable(length <= 1 || index <= 0);
                if (this.fwd)
                    this.fwd.disable(length <= 1 || index >= length - 1);
                if (this.mesg)
                {
                    var text;
                    if (length <= 0)
                        text = '';
                    else if (index < 0)
                        text = '';
                    else if (index < length - 1)
                    {
                        text = IMu.string('form-builder-navigation-record-of');
                        text = IMu.Format.format(text, index + 1, length);
                    }
                    else
                    {
                        text = IMu.string('form-builder-navigation-record');
                        text = IMu.Format.format(text, length);
                    }
                    this.mesg.text(text);
                }
            },

            enableSaveCancel: function(enabled)
            {
                if (this.next)
                    this.next.disable(enabled);
                if (this.save)
                    this.save.disable(! enabled);
                if (this.cancel)
                    this.cancel.disable(! enabled);
            },

            resize: function()
            {
                // TODO: skip resize code if not custom layout.

                /* Logic here is for minimum row height as well as
                ** IE browsers (they struggle with css height calculations)
                */
                var isIE = IMu.Platform.browser.is.ie;
                    
                var form = this.widget.owner;
                var page = jQuery(form).parent();
                var header = jQuery(page).children('.title');
                var rows = form.children('.row');

                // at this stage in development there should only be 1 row
                rows.each(function()
                {
                    
                    /* Reset height values so they do not interfear with 
                    ** calculations
                    */
                    var row = jQuery(this);
                    row.css({
                        'height': '',
                        'min-height': ''
                    })

                    if (! isIE)
                        return;
                    
                    /* Reset inline styles set for IE browsers
                    */
                    row.find('.column').each(function()
                    {
                        var column = jQuery(this);
                        column.css('height', '');
                        column.children('.holder').css('height', '');

                        column.find('.section').each(function()
                        {
                            var section = jQuery(this);
                            section.css('height', '');
                            section.children('.holder').css('height', '');
                        });
                    });
                });

                /* Reset inline styles set for IE browsers
                */
                if (isIE)
                {
                    form.css('height', '');
                    var height = parseInt(page.css('height'), 10);

                    // Browser height calculations seem to be off by 3
                    height -= header.fullHeight() + 3; 
                    form.css('height', height);
                }

                rows.each(function()
                {
                    var row = jQuery(this);

                    /* Set inline style for IE browsers
                    */
                    if (isIE)
                    {
                        /* TODO: later-development
                        **
                        ** This code assumes there is only one layout row.
                        ** If form designer is changed to support multi-row layouts
                        ** this will need to be altered
                        */
                        var fontSize = parseInt(form.css('font-size'), 10);
                        var rowHeight = height - (fontSize * 3);

                        row.css({
                            'height': rowHeight + 'px'
                        });
                    }
       
                    /* Find minimum row height and set inline style for IE browsers.
                    */
                    var minRowHeight = 0;
                    row.find('.column').each(function()
                    {
                        var column = jQuery(this);
                        var colHeight = column.fullHeight();

                        /* Set inline style for IE browsers
                        */
                        if (isIE)
                        {
                            column.children('.holder').css('height', colHeight);
                            column.find('.padding').css('display', 'none');

                            column.find('.section').each(function()
                            {
                                var section = jQuery(this);
                                var secHolder = section.children('.holder');
                                var heading = secHolder.children('.heading');
                                var content = secHolder.children('.content');
                            
                                var maxHeight = section.parent().fullHeight();
                                var minHeight = content.fullHeight() + 
                                    heading.fullHeight();

                                section.css(
                                {
                                    'min-height': minHeight,
                                    'max-height': maxHeight
                                });
                                
                                var curHeight = '';
                                var secParent = section.parent();
                                if (secParent.hasClass('dynamic-height'))
                                {
                                    curHeight = secParent.fullHeight();
                                    section.css('height', curHeight);

                                    content.css('height', 
                                        maxHeight - heading.fullHeight());
                                }
                            });
                            column.find('.padding').css('display', '');
                        }

                        /* For minimum row height calculation
                        */
                        if (colHeight > minRowHeight)
                            minRowHeight = colHeight;
                    });

                    /* Set minimum row height if minimum is larger than current height
                    */
                    if (rowHeight === undefined)
                        var rowHeight = parseInt(row.css('height'), 10);
                    if (minRowHeight > rowHeight)
                        row.css('min-height', minRowHeight);
                });
            }
        }
    });
})(IMu.Themes.shared);
