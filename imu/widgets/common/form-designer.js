/*!
**
**
** @since 2.0
*/

/*!
** @example
*/

/*!
** @example
*/

/*!
** @example
*/
(function()
{
    IMu.Widgets.add('form-designer', 'designer',
    {
        _construct: function()
        {
            this._super.apply(this, arguments);
            this.classes.push('imu-form-designer');
           
           // A hash of possible layouts that can be created by the user.
            this.layoutHash =
            {
                'default': undefined
                
                /* Other suggested layouts for later-development:
                ** 'tablet-landscape': undefined,
                ** 'tablet-portrait': undefined,
                ** etc
                */
            };
            this.layouts = [];

            /* A hash of section IDs currently in use.
            */
            this.sectionIDs = {};

            this.registerOptions
            ({
            });
        },

        addLayout: function(options)
        {
            var self = this;

            var onRemove = undefined;
            if (options.onRemove)
                onRemove = options.onRemove;

            var undefinedLayouts = self.getUndefLayouts();
            if (! undefinedLayouts.length)
                return;

            var layout = new Layout(self,
            {
                // TODO: this is a very poorly designed out validation
                onChange: function()
                {
                    self.validateLayout();
                },
                onRemove: function()
                {
                    // If layoutHash for this layout type is mapped to
                    // this layout and not some other layout, remove the 
                    // layoutHash reference.
                    var type = this.details.getValue('type');

                    if (self.layoutHash[type] === this)
                        self.layoutHash[type] = undefined;

                    var index = this.id;
                    var last = self.layouts.length - 1;
                    if (last != index)
                    {
                        self.layouts[index] = self.layouts[last];
                        self.layouts.splice(last, 1);
                        self.layouts[index].id = index;
                    }
                    else
                        self.layouts.splice(index, 1);


                    self.validateLayout(
                    {
                        state: 'ok',
                        details: []
                    },
                    function()
                    {
                        if (onRemove)
                            onRemove();
                    });
                },
                onValidate: function(info, callback)
                {
                    var typeField = this.details.hash.type;
                    var typeControl = typeField.widget.view.control;
                    var type = typeField.getValue();

                    if (! self.layoutHash[type])
                    {
                        self.layoutHash[type] = this;
                        typeField.widget.setIcon('ok');
                    }
                    else
                    {
                        typeField.widget.setIcon('invalid', 'validation-not-unique');

                        self.layoutHash[type].details.hash.type.widget.setIcon(
                            'invalid', 'validation-not-unique');

                        info.state = 'invalid';
                        info.details.push(
                        {
                            field: typeControl,
                            info: 
                            {
                                details: 'validation-not-unique',
                                state: 'invalid'
                            }
                        });
                    }

                    if (callback)
                        callback();
                }
            });



            // Select the first available layout by default
            // unless a value has been provided.
            var info = undefined;
            if (! options || ! options.info)
            {
                info = 
                {
                    details: 
                    {
                        type: undefinedLayouts[0]
                    }
                };
            }
            else
            {
                info = options.info;
                if (! info.details)
                    info.details = {};
                if (! info.details.type)
                    info.details.type = undefinedLayouts[0];
            }
            layout.create(info);

            self.layoutHash[info.details.type] = layout;
            self.layouts.push(layout);

            return layout;
        },

        getDesigner: function()
        {
            var form = this.getForm();
            var layouts = this.getLayouts();
            if (layouts != undefined)
                form.layouts = layouts;
            return form;
        },

        /*!
        ** Gets the object representing the current designer.
        **
        ** @returns object
        **   A simple object representing the designer.
        */
        getForm: function()
        {
            if (! this.view)
                return undef;
            
            var form = this.view.getForm();
            return form;
        },

        getLayouts: function()
        {
            if (! this.layouts.length)
                return undefined;

            var layouts = {}; 
            for (var i = 0; i < this.layouts.length; i++)
            {
                var layout = this.layouts[i].getLayout();
                jQuery.extend(layouts, layout);
            }
            return layouts;
        },

        /*!
        ** Creates a new (empty) form.
        */
        newForm: function()
        {
            if (this.view)
                this.view.newForm();
        },

        getUndefLayouts: function()
        {
            var layouts = [];
            for (var key in this.layoutHash)
            {
                if (this.layoutHash[key] === undefined)
                    layouts.push(key);
            }
            return layouts;
        },
        getUndefLayoutCount: function()
        {
            var layouts = this.getUndefLayouts();
            return layouts.length;
        },

        /*!
        ** Sets the designer to be edited. The designer should be a simple object.
        **
        ** @param form object
        **   The representation of the designer.
        **   This parameter is optional.
        */
        setForm: function(id, form)
        {
            this.id = id;

            if (! this.view)
                return;

            if (! form)
            {
                this.view.clearForm();
                return;
            }

            this.view.setForm(form);

            if (form.layouts)
                this.setLayouts(form.layouts);
        },
        // end interface

        // TODO: look into trying to merge funciton from form-designer and
        // editor-designer into one function in designer.
        /*!
        ** Form-designer level built-in validation.
        ** Called via the **validate( )** function.
        **
        ** Each of the `form-designer`'s sections and the details are a `form` 
        ** widget.
        ** The `form-designer` progresses through each of these, validation them.
        ** After a section has been validated, its vailidation info is added to 
        ** ``info.details``.
        **
        ** ``info.state`` will be updated if a section's validation state is 'worse'.
        ** The ranking of states from best to worst is as follows:
        ** 1) ok
        ** 2) empty
        ** 3) invalid
        **
        ** Once all sections have been validated, control is returned to the
        ** **validate( )** function.
        **
        ** @param info
        **   Information about the current state of the `form-designer`.
        **   At this point ``info.state`` should be **ok** and ``info.details``
        **   should be an empty array.
        **
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        */
        doBuiltinValidation: function(info, callback)
        {
            var self = this;

            var ready = false;
            self.validateSections(info, function()
            {
                if (ready && callback)
                    callback(info);
                else
                    ready = true;
            });
            self.validateLayout(info, function()
            {
                 if (ready && callback)
                    callback(info);
                else
                    ready = true;
            });
        },

        setLayouts: function(layouts)
        {
            var add = jQuery(".layout-options .add-layout");

            for (var type in layouts)
            {
                var layout = layouts[type];
                var options =
                {
                    onRemove: function()
                    {
                        add.removeClass('disabled');
                    },
                    info: layouts[type]
                };
                options.info.details = 
                {
                    type: type
                };
                this.addLayout(options);
            }
            if (! this.getUndefLayoutCount())
                add.addClass('disabled');
        },

        validateLayout: function(info, callback)
        {
            var self = this;

            var layouts = [];
            var numValidated = 0;

            // Reassign hash and array by layout type
            for (var type in self.layoutHash)
            {
                if (self.layoutHash[type])
                    self.layoutHash[type] = undefined;
            }

            if (! self.layouts.length)
            {
                if (callback)
                    callback(info);
                return;
            }

            for (var i = 0; i < self.layouts.length; i++)
            {
                (function(j)
                {
                    var containsInvalidID = false;
                    var containsDuplicateIDs = false;

                    var layout = self.layouts[j];
                    layout.validate(function(results)
                    {
                        if (results.state == 'invalid')
                        {
                            info.state = 'invalid';
                            for (var i = 0; i < results.details.length; i++)
                            {
                                var issue = results.details[i];
                                if (issue.info.details == 'validation-empty-mandatory')
                                {
                                    info.details.push(
                                    {
                                        field: issue.field,
                                        info:
                                        {
                                            details: issue.info.details,
                                            state: 'invalid'
                                        }
                                    });

                                }
                                else if (issue.info.details == 'validation-layout-id-not-valid')
                                {
                                    if (! containsInvalidID)
                                    {
                                        info.details.push(
                                        {
                                            field: issue.field,
                                            info:
                                            {
                                                details: issue.info.details,
                                                state: 'invalid'
                                            }
                                        });
                                        containsInvalidID = true;
                                    }
                                }
                                else if (issue.info.details == 'validation-layout-id-not-unique')
                                {
                                    if (! containsDuplicateIDs)
                                    {
                                        info.details.push(
                                        {
                                            field: issue.field,
                                            info:
                                            {
                                                details: issue.info.details,
                                                state: 'invalid'
                                            }
                                        });
                                        containsDuplicateIDs = true;
                                    }
                                }
                                else
                                    info.details.push(
                                    {
                                        field: issue.field,
                                        info:
                                        {
                                            details: 'validation-unknown-issue',
                                            state: 'invalid'
                                        }
                                    });
                            }
                        }

                        if (++numValidated == self.layouts.length && callback)
                            callback(info);
                    });
                })(i);
            }
        },

        validateSections: function(info, callback)
        {
            var self = this;

            /* Validate the input sections
            */
            var sections = self.view.sections;
            var fields = sections.find('.field > .holder > .form');
            var details = self.view.details.owner[0];
            fields.push(details);
            var length = fields.length;

            var sectionDetails = sections.find('.section > .holder > .details');
            length += sectionDetails.length;

            var numValidated = 0;
            for (var i = 0; i < fields.length; i++)
            {
                (function(j)
                {
                    var field = jQuery(fields[j]).IMu();
                    field.validate(function(result)
                    {
                        if (result.state != 'ok')
                        {
                            self.updateValidationState(info, result.state);
                            info.details = info.details.concat(result.details);
                        }

                        // This part could do with some improvements
                        if (j < fields.length -1) // don't look at details section
                        {
                            var id = this.hash.id.widget.getValue();
                            var breakFlag = false;
                            
                            // starting at 0 instead of j to allows for more 
                            // readable code.
                            for (var k = 0; k < fields.length -1; k++)
                            {
                                if (breakFlag)
                                    break;

                                (function(l)
                                {
                                    var field2 = jQuery(fields[l]).IMu();
                                    if (field == field2)
                                        return;

                                    var id2 = field2.hash.id.widget.getValue();
                                    if (id && id2 && id == id2)
                                    {
                                        self.updateValidationState(info, 'invalid');
                                        result =
                                        {
                                            info:
                                            {
                                                state: 'invalid',
                                                details: 'validation-not-unique'
                                            },
                                            field: field.hash.id.widget.view.control
                                        };
                                        field.hash.id.widget.setIcon("invalid",
                                            "validation-not-unique");
                                        info.details = info.details.concat(result);
                                        breakFlag = true;
                                    }
                                })(k);
                            }
                        }
                        if (++numValidated == length)
                            callback(info);
                    });
                })(i);
            }
            for (var i = 0; i < sectionDetails.length; i++)
            {
                (function(j)
                {
                    var field1 = jQuery(sectionDetails[j]).IMu();
                    field1.validate(function(result)
                    {
                        var id1 = this.hash.id.widget.getValue();
                        var breakFlag = false;

                        for (var k = 0; k < sectionDetails.length; k++)
                        {
                            if (breakFlag)
                                break;

                            (function(l)
                            {
                                if (l == j)
                                    return;
                                
                                var field2 = jQuery(sectionDetails[l]).IMu();
                                var id2 = field2.getValue('id');

                                if (id1 && id2 && id1 == id2)
                                {
                                    self.updateValidationState(info, 'invalid');
                                    result =
                                    {
                                        info:
                                        {
                                            state: 'invalid',
                                            details: 'validation-not-unique'
                                        },
                                        field: field1.hash.id.widget.view.control
                                    };
                                    field1.hash.id.widget.setIcon("invalid",
                                        "validation-not-unique");
                                    info.details = info.details.concat(result);
                                    breakFlag = true;
                                }
                            })(k);
                        }
                        if (++numValidated == length)
                            callback(info);
                    });
                })(i);
            }

            if (length == 0)
                callback(info);
        }
    });

    /* Layout classes
    */
    var Layout = IMu.Class.create
    ({
        _construct: function(controller, options)
        {
            this._super.apply(this, arguments);
            this.controller = controller;

            this.details = undefined;
            this.rows = [];
            this.view = undefined;
            
            this.options =
            {
                onRemove: undefined,
                onChange: undefined,
                fields: undefined,

                onValidate: undefined
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

        create: function(info)
        {
            var self = this;

            self.view = self.controller.view.addLayout(self);
           
            // Call onChange as Layout, not as form
            if (self.details)
                self.details.options.onChange = function()
                {
                    self.onChange.call(self, arguments);
                };
            
            if (info)
                self.setValues(info);

            // TODO: later-development
            //
            // At a later point in development, the user should be able to
            // add multiple rows to a layout, but for now only the one row
            // may be added, and it is done automatically.
            // As it is all handled for the user, they do not need to see the extra
            // interface. 
            if (! (info && info.rows && info.rows.length))
                self.addRow();
        },

        addRow: function(info)
        {
            var row = new Row(this);
            row.create(info);
            this.rows.push(row);
        },

        doBuiltinValidation: function(info, callback)
        {
            var sectionIDs = jQuery.extend(true, {}, this.controller.sectionIDs);
            for (var id in sectionIDs)
                sectionIDs[id] = null;

            for (var r = 0; r < this.rows.length; r++)
            {
                var row = this.rows[r];
                for (var c = 0; c < row.columns.length; c++)
                {
                    var column = row.columns[c];
                    for (var s = 0; s < column.sections.length; s++)
                    {
                        var section = column.sections[s];
                        var idField = section.details.hash.id;
                        var id = idField.getValue();

                        if (id === null || sectionIDs[id] === undefined)
                        {
                            var message;
                            if (id === null)
                                message = 'validation-empty-mandatory';
                            else
                                message = 'validation-layout-id-not-valid';

                            idField.widget.setIcon(
                                'invalid', message);

                            info.state = 'invalid';
                            info.details.push(
                            {
                                field: idField.widget.view.control,
                                info: 
                                {
                                    details: message,
                                    state: 'invalid'
                                }
                            });
                        }
                        else if (sectionIDs[id] === null)
                        {
                            sectionIDs[id] = idField;
                            idField.widget.setIcon('ok');
                        }
                        else
                        {
                            var existingSectionID = sectionIDs[id];
                            existingSectionID.widget.setIcon(
                                'invalid', 'validation-not-unique');
                            idField.widget.setIcon(
                                'invalid', 'validation-not-unique');
                            
                            info.state = 'invalid';
                            info.details.push(
                            {
                                field: existingSectionID.widget.view.control,
                                info: 
                                {
                                    details: 'validation-layout-id-not-unique',
                                    state: 'invalid'
                                }
                            });
                        }
                    }
                }
            }

            callback();
        },

        doCustomValidation: function(info, callback)
        {
            if (! this.options.onValidate)
            {
                callback();
                return;
            }
            this.options.onValidate.call(this, info, function()
            {
                callback();
            });
        },

        getDetails: function(columns)
        {
            if (! this.details)
                return;
            return this.details.getValues(columns);
        },

        getLayout: function()
        {
            /* TODO: get full details to be saved
            */
            var layout = {};
            
            var details = this.getDetails();
            var type = details.type;

            layout[type] = {};

            for (var key in details)
            {
                if (key == 'type')
                    continue;
                layout[type][key] = details[key];
            }
            
            if (this.rows.length)
            {
                layout[type].rows = [];
                for (var i = 0; i < this.rows.length; i++)
                {
                    var row = this.rows[i].getRow();
                    layout[type].rows.push(row);
                }
            }

            return layout;
        },
        
        onChange: function()
        {
            if (this.options.onChange)
                this.options.onChange.call(this, arguments);
        },
        
        onRemove: function()
        {

            if (this.options.onRemove)
                this.options.onRemove.call(this, arguments);
        },

        setValues: function(info)
        {
            if (! info)
                return;
            if (this.details)
                this.details.setValues(info);
            if (info.rows)
            {
                for (var i = 0; i < info.rows.length; i++)
                    this.addRow(info.rows[i]);
            }
        },

        showValidationState: function(info, callback)
        {
            callback();
        },

        validate: function(info, callback)
        {
            var self = this;

            if (typeof(info) == 'function')
                callback = info;
            if (info == undefined || typeof(info) == 'function')
            {
                info =
                {
                    state: 'ok',
                    details: []
                };
            }
            
            self.doBuiltinValidation(info, function()
            {
                self.doCustomValidation(info, function()
                {
                    self.showValidationState(info, function()
                    {
                        if (callback)
                            callback.call(self, info);
                    });
                });
            });
        }
    });

    var Row = IMu.Class.create
    ({
        _construct: function(controller, options)
        {
            this._super.apply(this, arguments);
            this.controller = controller;

            this.details = undefined;
            this.columns = [];
            this.view = undefined;

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

        create: function(info)
        {
            var self = this;

            self.view = self.controller.view.addRow(self);

            if (self.details)
                self.details.options.onChange = function()
                {
                    self.onChange.call(self, arguments);
                };

            if (info)
                this.setValues(info);
        },

        addColumn: function(info)
        {
            var self = this;

            var column = new Column(this,
            {
                onRemove: function()
                {
                    var index = jQuery(this.view.element).index();
                    self.columns.splice(index, 1);
                }
            });
            column.create(info);
            self.columns.push(column);
        },
        
        getDetails: function(columns)
        {
            if (! this.details)
                return;
            return this.details.getValues(columns);
        },

        getRow: function()
        {
            var row = {};

            var details = this.getDetails();
            for (var key in details)
            {
                if (key == 'type')
                    continue;
                row[key] = details[key];
            }
            
            if (this.columns.length)
            {
                row.columns = [];
                for (var i = 0; i < this.columns.length; i++)
                {
                    var column = this.columns[i].getColumn();
                    row.columns.push(column);
                }
            }

            return row;
        },

        setValues: function(info)
        {
            if (! info)
                return;
            if (this.details)
                this.details.setValues(info);
            if (info.columns)
            {
                for (var i = 0; i < info.columns.length; i++)
                    this.addColumn(info.columns[i]);
            }
        },

        onChange: function()
        {
        },
        
        onRemove: function()
        {
            // TODO
        }
    });

    var Column = IMu.Class.create
    ({
        _construct: function(controller, options)
        {
            this._super.apply(this, arguments);
            this.controller = controller;

            this.details = undefined;
            this.sections = [];
            this.view = undefined;

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

        create: function(info)
        {
            var self = this;

            self.view = self.controller.view.addColumn(self);

            if (self.details)
                self.details.options.onChange = function()
                {
                    self.onChange.call(self, arguments);
                };
            
            if (info)
                this.setValues(info);
        },

        addSection: function(info)
        {
            var section = new Section(this);
            section.create(info);
            this.sections.push(section);
        },


        getDetails: function(columns)
        {
            if (! this.details)
                return;
            return this.details.getValues(columns);
        },

        getColumn: function()
        {
            var column = {};

            var details = this.getDetails();
            for (var key in details)
            {
                if (key == 'type')
                    continue;
                column[key] = details[key];
            }
            
            if (this.sections.length)
            {
                column.sections = [];
                for (var i = 0; i < this.sections.length; i++)
                {
                    var section = this.sections[i].getSection();
                    column.sections.push(section);
                }
            }

            return column;
        },

        setValues: function(info)
        {
            if (! info)
                return;
            if (this.details)
                this.details.setValues(info);
            if (info.sections)
            {
                for (var i = 0; i < info.sections.length; i++)
                    this.addSection(info.sections[i]);
            }
        },

        onChange: function()
        {
        },

        // TODO: account for drag/drop
        onRemove: function()
        {
            if (this.options.onRemove)
                this.options.onRemove.call(this, arguments);
            
            for (var i = 0; i < this.controller.columns.length; i++)
            {
                var column = this.controller.columns[i];
                if (column == this)
                {
                    this.controller.columns.splice(i, 1);
                    break;
                }
            }
            
        }
    });

    var Section = IMu.Class.create
    ({
        _construct: function(controller, options)
        {
            this._super.apply(this, arguments);
            this.controller = controller;

            this.details = undefined;
            this.fields = [];
            this.view = undefined;

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

        create: function(info)
        {
            var self = this;

            self.view = self.controller.view.addSection(self);

            if (self.details)
                self.details.options.onChange = function()
                {
                    self.onChange.call(self, arguments);
                };
            
            if (info)
                self.setValues(info);
        },

        getDetails: function(columns)
        {
            if (! this.details)
                return;
            return this.details.getValues(columns);
        },

        getSection: function()
        {
            var section = { };

            var details = this.getDetails();
            for (var key in details)
            {
                if (key == 'type')
                    continue;
                section[key] = details[key];
            }
            
            return section;
        },

        setValues: function(info)
        {
            if (! info)
                return;
            if (this.details)
                this.details.setValues(info);
        },

        onChange: function()
        {
        },

        onRemove: function()
        {   
            if (this.options.onRemove)
                this.options.onRemove.call(this, arguments);

            for (var i = 0; i < this.controller.sections.length; i++)
            {
                var section = this.controller.sections[i];
                if (section == this)
                {
                    this.controller.sections.splice(i, 1);
                    break;
                }
            }
        }
    });
})();
