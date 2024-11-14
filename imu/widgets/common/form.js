/*!
** A widget for simplifying the creation, arrangement and modification of forms.
**
** Creates a table to help align elements in the form.
**
** @since 2.0
*/

/*!
** @example
**   Create a two column form consisting of two text boxes with labels
**
** @code
**   var widget = $('#my-div').IMu('form')
**   {
**      columns: 2,
**      order: 'column'
**   });
**
**   widget.addField('text',
**   {
**      label: 'field 01',
**      name: 'value01'
**   });
**   widget.addField('text,
**   {
**      label: 'field 02',
**      name: 'value02'
**   });
*/
(function()
{
    IMu.Widgets.add('form', 'base',
    {
        _construct: function()
        {
            this._super.apply(this, arguments);
            this.classes.push('imu-form');

            this.registerOptions
            ({
                /*!
                ** The number of columns in the form
                */
                columns: 1,
                
                /*!
                ** Called when any the value of any field changes.
                **
                ** @param field Field
                **   The field which has changed.
                ** @param value mixed
                **   The new value for the field.
                */
                onChange: undefined,

                /*!
                ** Called when any field gets focus.
                **
                ** @param field Field
                **   The field which now has focus.
                */
                onGainFocus: undefined,

                /*!
                ** Called when any field loses focus.
                **
                ** @param field Field
                **   The field which  has lost focus.
                */
                onLoseFocus: undefined,

                /*!
                ** Called as a part of the **validate( )** function chain.
                ** This occurs after the `form`'s built-in validation and 
                ** gives a `form` instance the chance to review the validation.
                */
                onValidate: undefined,
                
                /*!
                ** The order to fill the form if a field
                ** is not supplied with enough position data.
                */
                order: 'column',

                /*!
                ** The number of rows in the form
                */
                rows: undefined,

                /*!
                ** If set to **true**, a dialogue will be generated on
                ** validation if there are issues.
                */
                showErrors: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `field`'s values change.
                */
                validateOnChange: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `field`'s controls gain focus.
                */
                validateOnGainFocus: false,

                /*!
                ** If **true**, causes the **validate( )** method to be called
                ** when any of the `field`'s controls lose focus.
                */
                validateOnLoseFocus: false
            });

            this.fields = [];
            this.hash = {};
            this.controlGroups = {};
        },

        /*!
        ** Adds a field to the form.
        **
        ** @param type string
        **   The type of field to add.
        **
        ** @param options object
        **   Any options used to configure the field.
        **
        ** @returns object
        **   The new field object.
        */
        addField: function(type, options)
        {
            var field;

            switch (type)
            {
                case 'attachment':
                    field = new AttachmentField(this)
                    break;
                case 'checkbox':
                    field = new CheckBoxField(this);
                    break;
                case 'date':
                    field = new DateField(this);
                    break;
                case 'empty':
                    field = new EmptyField(this);
                    break;
                case 'grid':
                    field = new GridField(this);
                    break
                case 'icon':
                    field = new IconField(this);
                    break
                case 'image':
                    field = new ImageField(this);
                    break
                case 'imageCapture':
                    field = new ImageCaptureField(this);
                    break
                case 'capture':
                    field = new CaptureField(this);
                    break;
                case 'integer':
                    field = new IntegerField(this);
                    break;
                case 'number':
                    field = new NumberField(this);
                    break;
                case 'selection':
                    field = new SelectionField(this);
                    break;
                case 'static':
                    field = new StaticField(this);
                    break;
                case 'text':
                    field = new TextField(this);
                    break;
                case 'time':
                    field = new TimeField(this);
                    break;
                default:
                    throw new IMu.Error('BadFieldType', type);
            }
            if (options)
                field.configure(options);

            if (field.row == undefined && field.column == undefined)
            {
                if (this.fields.length == 0)
                {
                    field.row = 0;
                    field.column = 0;
                }
                else if (this.options.order == 'row')
                {
                    var last = this.fields[this.fields.length - 1];
                    field.row = last.row;
                    field.column = last.column + last.columnSpan;
                    if (this.options.columns !== undefined)
                    {
                        if (field.column >= this.options.columns)
                        {
                            field.row++;
                            field.column = 0;
                        }
                    }
                }
                else // if (this.options.order == 'column')
                {
                    var last = this.fields[this.fields.length - 1];
                    field.row = last.row + last.rowSpan;
                    field.column = last.column;
                    if (this.options.rows !== undefined)
                    {
                        if (field.row >= this.options.rows)
                        {
                            field.row = 0;
                            field.column++;
                        }
                    }
                }
            }

            field.tabIndex = this.fields.length + 1;

            this.fields.push(field);
            if (field.name)
                this.hash[field.name] = field;

            if (field.dataColumn && field.dataColumn.substr(field.dataColumn.length - 3) == 'Ref')
            {
                if (! this.controlGroups[field.dataColumn])
                {
                    this.controlGroups[field.dataColumn] = [];
                }
                this.controlGroups[field.dataColumn].push(field);
            }
            return field;
        },

        /*!
        ** Clears all values from the form.
        */
        clearForm: function()
        {
            var values = this.getValues();
            for (var name in values)
                values[name] = null;
            this.setValues(values);
        },

        /*!
        ** Clears all values from the form except for fields specified.
        **
        ** @param fields mixed
        **   The set of fields to retain their values.
        **   Can be a ``string``, an array of ``string``\s or an ``object``
        **   containing a ``name`` property.
        */
        clearFormExcept: function(fields)
        {
            var self = this;

            var ignore = [];
            var type = jQuery.type(fields);

            if (type == 'undefined')
                return;

            if (type != 'array')
                fields = [fields];

            for (var i = 0; i < fields.length; i++)
            {
                type = jQuery.type(fields[i]);
                if (type == 'string')
                    ignore.push(fields[i].toLowerCase());
                else if (type == 'object')
                    ignore.push(fields[i].name.toLowerCase());
            }

            if (ignore.length == 0)
                return;

            var values = self.getValues();
            for (var name in values)
            {
                var inarray = jQuery.inArray(name.toLowerCase(), ignore);
                if (inarray == -1)
                    values[name] = undefined;
            }

            self.setValues(values);
        },

        /*!
        ** Gets a field from a form (by name).
        **
        ** @param name string
        **   The name of the field to get.
        **
        ** @returns Field
        **   The field (or undefined if not field found).
        */
        getField: function(name)
        {
            if (name in this.hash)
                return this.hash[name];
            return undefined;
        },

        /*!
        ** Creates a two dimensional array containing each of fields from the
        ** form widget in their correct location.
        **
        ** @returns object
        **   The layout of the form.
        */
        getLayout: function()
        {
            var layout =
            {
                rows: [],
                columns: []
            };

            for (var i = 0; i < this.fields.length; i++)
            {
                var field = this.fields[i];

                while (layout.rows.length <= field.row)
                {
                    layout.rows.push
                    ({
                        fields: []
                    });
                }
                var row = layout.rows[field.row];
                while (row.fields.length <= field.column)
                    row.fields.push(undefined);
                row.fields[field.column] = field;

                while (layout.columns.length <= field.column)
                {
                    layout.columns.push
                    ({
                        fields: [],
                        labels: false
                    });
                }
                var column = layout.columns[field.column];
                while (column.fields.length <= field.row)
                    column.fields.push(undefined);
                column.fields[field.row] = field;
                if (field.label)
                    column.labels = true;
            }

            return layout;
        },

        /*!
        ** Gets a specific value from a form.
        **
        ** @param name string
        **   The name of the field.
        **
        ** @returns mixed
        **   The field's value.
        */
        getValue: function(name)
        {
            var field = this.getField(name);
            if (field)
                return field.getValue();
            return null;
        },

        /*!
        ** Gets all the values in the form.
        **
        ** This is a convenience function to save having
        ** to iterate over all the fields in the form.
        **
        ** @returns object
        **   The values by field name.
        */
        getValues: function()
        {
            var values = {};
            for (var i in this.fields)
            {
                var field = this.fields[i];
                var name = field.name;
                if (name)
                    values[name] = field.getValue();
            }
            return values;
        },

        /* The form widget now supports widgets that fetch data asynchronously.
        ** This method is needed when dealing with those widgets.
        */
        getAsyncValues: function(callback)
        {
            var self = this;

            if (! callback)
                return;

            var values = {};
            var remaining = self.fields.length;
            
            if (! remaining)
                callback(values);

            // poor-mans Promise.all
            self.fields.forEach(function(field)
            {
                field.getAsyncValue(function(value)
                {
                    values[field.name] = value;
                    remaining--;
                    
                    if (! remaining)
                        callback(values);
                });
            });
        },

        /*!
        ** Sets a specific value from a form.
        **
        ** @param name string
        **   The name of the field.
        **
        ** @param value mixed
        **   The value to be set.
        **
        ** @returns mixed
        **   The field's value.
        */
        setValue: function(name, value)
        {
            var field = this.getField(name);
            if (field)
                field.setValue(value);
        },

        /*!
        ** Sets all the values in the form.
        **
        ** This is a convenience function to save having
        ** to iterate over all the fields in the form.
        **
        ** @param values object
        **   The values to be set.
        */
        setValues: function(values)
        {
            for (var i in this.fields)
            {
                var field = this.fields[i];
                var name = field.name;
                if (name && name in values)
                    field.setValue(values[name]);
            }
        },

        /*!
        ** Form level validation.
        **
        ** Creates an ``info`` object containg ``state`` and ``details`` of the
        ** `form`.
        ** Unlike in `control` widget validation, ``info.details`` is an array
        ** comprising of validation information from each `field` in the `form` 
        ** widget, ``info.state`` is the 'worst' state of those `field`s.
        **
        ** Once the built-in validation process has concluded, the `form`
        ** displays the results and then fires a callback event, if one exists.
        **
        ** Each subsequent function in the validation chain occurs as a callback
        ** of the previous function. This guards against potential unexpected
        ** asynchronous events.
        **
        ** @param callback function
        **   The function to be called at the end of the validation chain.
        **   Takes ``info`` as an argument.
        */
        validate: function(callback)
        {
            var self = this;
            var info =
            {
                state: 'ok',
                details: []
            };
            
            // previously we would force update of field values via getValues().
            // realistically values should be accessed using the field's getValue
            // method rather than the cached value in the field.

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
        },
        // end interface
        
        changed: function(field, value)
        {
            if (this.options.onChange)
                this.options.onChange.call(this, field, value);
            if (this.validateOnChange)
                this.widget.validate();
        },

        /*!
        ** Form level built-in validation.
        ** Called when the form needs to be validated.
        **
        ** Each of the `field`s within the `form` widget are validated and the 
        ** validation info is added to ``info.details``.
        ** 
        ** ``info.state`` will be updated if a `field`'s validation state is
        ** 'worse'.
        ** The ranking of states from best to worst is as follows:
        ** 1) ok
        ** 2) empty
        ** 3) invalid
        **
        ** Once all `field`s have been validated, control is returned to the
        ** **validate( )** function.
        **
        ** @param info
        **   Information about the current state of the `form`.
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

            var length = self.fields.length;
            var numValidated = 0;
            for (var i in self.fields)
            {
                (function(field)
                {
                    field.validate(function(result)
                    {
                        if (result.state != 'ok')
                        {
                            info.details.push(
                            {
                                field: field.widget.view.control,
                                info: result
                            });
                            if (result.state == 'invalid' && 
                                info.state != 'invalid')
                                info.state = 'invalid';
                            else if (result.state == 'empty' &&
                                info.state != 'invalid' && 
                                info.state != 'empty')
                                info.state = 'empty';
                        }
                        if (++numValidated == length)
                            callback();
                    })
                })(self.fields[i]);
            }
            if (length == 0)
                callback();
        },

        /*!
        ** Form level custom validation.
        ** Called via the **validate( )** function.
        **
        ** Checks to see if there is an ``onValidate`` function in the options.
        ** If one exists, it is called before control is passed back to
        ** **validate( )**.
        **
        ** @param info
        **   Information about the current state of the `form` before any
        **   custom validation.
        **
        ** @param callback function
        **   Returns control back to the previous function once the custom 
        **   validation has concluded.
        */
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

        /*
        ** Called by a field when its control has gained focus.
        */
        doGainFocus: function(field)
        {
            if (this.options.onGainFocus)
                this.options.onGainFocus.call(this, field);
            if (this.options.validateOnGainFocus)
                this.validate();
        },

        /*
        ** Called by a field when its control has lost focus.
        */
        doLoseFocus: function(field)
        {
            if (this.options.onLoseFocus)
                this.options.onLoseFocus.call(this, field);
            if (this.options.validateOnLoseFocus)
                this.validate();
        },

        /*!
        ** Form level show validation.
        ** Called via the **validate( )** function.
        ** Summarises information from validation and displays in a dialogue box.
        **
        ** If the ``shoErrors`` option is not **true** or ``info.state`` is 
        ** **ok** a callback will be fired (if one exists) and the function will
        ** return.
        **
        ** Otherwise, each array element in ``info.details`` is inspected.
        ** Each details itself represents information about a `field` in the
        ** `form` widget.
        ** If the `field` widget's validation state is the same as
        ** ``info.state`` it will be included. The `field` widget's validation
        ** details are used to identify the kind of issue/warning to have its
        ** counter incremented. The result of this process will be a hash table
        ** of issues/warnings and the number of occurences.
        **
        ** A dialogue box is then created advising the user that there are
        ** issues/warnings and lists them.
        **
        ** If ``info.state`` is **empty**, the user is merely warned that there
        ** may be areas that need attention.
        ** They will then be allowed to either:
        ** * continue - this will fire the callback, if any; or
        ** * cancel - this will allow the user to modify any values before 
        **          trying again.
        **
        ** In the event of either an invalid state or a warning where the user
        ** chooses to cance, the browser will focus on the first element on the
        ** page which needs attention.
        **
        ** @param info
        **   Information about the current state of the `form` after validation.
        **   As the `form` contains many `fields`, ``info.details`` is an array
        **   representing the validation state of each of these `fields`.
        **   ``info.state`` is the 'worst' state of the `fields`.
        **
        ** @param callback function
        **   Returns control back to the previous function.
        */
        showValidationState: function(info, callback)
        {
            if (! this.options.showErrors || info.state == 'ok')
            {
                callback(info);
                return;
            }

            var dialogue = new IMu.App.Dialogue();
            dialogue.addButton(IMu.string('ok'));
            var issues = {};
            var firstIssue = undefined;
            
            if (IMu.Type.isString(info.details))
            {
                if (! firstIssue && info.field)
                    firstIssue = info.field;
                dialogue.addDetail(IMu.string(info.details));
            }
            else if (IMu.Type.isArray(info.details))
            {
                for (var i in info.details)
                {
                    var detail = info.details[i];
                    if (detail.info.state != info.state)
                        continue;
                    if (! firstIssue && detail.field)
                        firstIssue = detail.field;
                    if (! issues[detail.info.details])
                        issues[detail.info.details] = 1;
                    else
                        issues[detail.info.details]++;
                }
                for (var key in issues)
                {
                    var message = issues[key] + ' ';
                    if (issues[key] == 1)
                        message += IMu.string('show-' + key);
                    else
                        message += IMu.string('show-multiple-' + key);

                    dialogue.addDetail(message);
                }
            }
            else
            {
                // I'm not sure what to do here.
            }

            if (info.state == 'invalid')
            {
                dialogue.setMessage(IMu.string('show-validation-invalid'));
                dialogue.show({showDetails: true}, function()
                {
                    if (firstIssue)
                        firstIssue.focus();
                    // No need to run callback if there are errors.
                    return;
                });
            }
            else
            {
                dialogue.setMessage(IMu.string('show-validation-warning'));
                dialogue.addButton(IMu.string('cancel'));
                dialogue.show({showDetails: true}, function(code) 
                { 
                    if (code != 'ok')
                    {
                        if (firstIssue)
                            firstIssue.focus();
                        return; 
                    }
                    callback(info); 
                });
            }
        },
        
        /*!
        ** A convinience function which only changes the validation state if
        ** the new state is more severe than the current state.
        */
        updateValidationState: function(info, state)
        {
            if (state == 'invalid' && info.state != 'invalid')
                info.state = 'invalid';
            else if (state == 'empty' &&
                info.state != 'invalid' && info.state != 'empty')
                info.state = 'empty';
            else
                return;
            info.details = [];
        }
    });

    /*!
    ** A field element within the form.
    **
    */
    var Field = IMu.Class.create
    ({
        _construct: function(controller)
        {
            this.controller = controller;

            this.column = undefined;
            this.columnSpan = 1;
            this.css = undefined;
            this.label = undefined;
            this.name = undefined;
            this.row = undefined;
            this.rowSpan = 1;

            this.value = undefined;

            this.widget = undefined;

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            /*!
            ** Text to be displayed as a hint for data input.
            */
            this.hint = undefined;

            /*!
            ** The icons to be used to compliment the `field` widget.
            ** 
            ** In general these are used for control validation, though they
            ** can also be used for other purposes.
            */
            this.icons =
            {
                /*!
                ** The initial icon to be displayed by the `field` when it is
                ** first created.
                */
                inital: undefined,

                /* The next three are associated with validation.
                */
                /*!
                ** The icon to be displayed when validation succeeds.
                */
                ok: undefined,

                /*!
                ** The icon to be displayed if a `field` is left empty yet has
                ** a ``requirement`` of ``suggested``.
                */
                empty: 'lightbulb',

                /*!
                ** The icon to be displayed if validation fails.
                */
                invalid: 'exclam',

                /* Used to indicate a delay.
                **
                ** There is no current functionality to support this.
                */
                spinner: undefined

                /* Others can be added and then set using setIcon().
                */
            };

            /*!
            ** Called when the value of the control has changed.
            */
            this.onChange = undefined;

            /*!
            ** Called when the control has gained keyboard focus
            */
            this.onGainFocus = undefined;

            /*!
            ** Called when the control has lost keyboard focus
            */
            this.onLoseFocus = undefined;

            /*!
            ** Called as a part of the **validate( )** function chain.
            ** This value is passed to the `field`'s `control`, which will
            ** execute this function after its own built-in validation.
            ** This gives the `field`/`control` the chance to review the 
            ** validation before the parent `form` moves onto the next `field`. 
            */
            this.onValidate = undefined;

            /*!
            ** If true, display the control as read-only.
            */
            this.readonly = undefined;

            /*!
            ** Used to determine how a control should be styled
            ** Two possible options : **mandatory** or **suggested**
            */
            this.requirement = undefined;

            /*!
            ** Used to set the tabindex attribute on the control.
            */
            this.tabIndex = undefined;

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when the `field`'s value changes.
            */
            this.validateOnChange = false;

            /*!
            ** If **true**, causes the **validate( )** function to be called 
            ** when the `field` gains focus.
            */
            this.validateOnGainFocus = false;

            /*!
            ** If **true**, causes the **validate( )** function to be called 
            ** when the `field` loses focus.
            */
            this.validateOnLoseFocus = false;
        },

        create: function(owner)
        {
            this.owner = owner;
        },

        configure: function(options)
        {
            for (var name in options)
                if (name in this)
                    this[name] = options[name];

            if (! options.name)
                this.name = 'field-' + (this.controller.fields.length +1);
        },

        /*!
        ** Gets the current value of the field.
        */
        getAsyncValue: function(callback)
        {
            if (! callback)
                return;
            if (! this.widget)
                callback(null);
            
            this.widget.getAsyncValue(function(value)
            {
                callback(value);
            });
        },

        /*!
        ** Gets the current value of the field.
        **
        ** @returns mixed
        **   The field's current value.
        */
        getValue: function(value)
        {
            if (this.widget)
            {
                this.value = this.widget.getValue();
                return this.value;
            }
            return null;
        },

        /*!
        ** Sets the value of the control.
        **
        ** @param mixed
        **   The value to assign.
        */
        setValue: function(value)
        {
            this.value = value;
            if (this.widget)
                this.widget.setValue(this.value);
        },
        
        /*!
        ** Form field level validation.
        **
        ** Once the built-in validation process has concluded, control is passed
        ** back to the `form`.
        **
        ** @param callback function
        **   The function to be called after validation.
        **   Takes ``info`` as an argument.
        */
        validate: function(callback)
        {
            var self = this;

            self.doBuiltinValidation(function(info)
            {
                // custom validation not needed here. was executed at control level.
                // show validation not needed here. executed by control and parent.
                if (callback)
                    callback.call(self, info);
            });
        },
        // end interface
        
        changed: function(value)
        {
            if (this.onChange)
                this.onChange.call(this, value);
            if (this.validateOnChange)
                this.widget.validate();
            this.controller.changed(this, value);
        },
        checkHierarchy: function(control, value)
        {
            if (control.suggest)
                control.list = control.suggest;
            var lookupName = control.list.name;
            var lookupLevel = control.list.level;
            for(var i = 0; i < control.controller.fields.length; i++)
            {
                var field = control.controller.fields[i];
                if (field.suggest)
                    field.list = field.suggest;
                if (field.list.useHierarchy)
                {
                    if (field.list && field.list.name == lookupName)
                    {
                        if (lookupLevel >= field.list.level)
                            continue;
                        var info = field.list;
                        info.keys = new Array(parseInt(lookupLevel));
                        info.keys[lookupLevel] = value;
                        if (field.widget.name == "selection-control")
                            field.widget.setList(info);
                        else if (field.widget.name = "text-control")
                            field.widget.suggest = info;
                    }
                }
            }
        },

        /*!
        ** Form field level built-in validation
        ** Called via the **validate( )** function.
        **
        ** This triggers the **validate( )** function of the `field` if one exists.
        ** If no such function exists it is assumed the validation succeded and
        ** the callback is fired.
        **
        ** @param callback function
        **   Returns control back to the previous function once validation has
        **   concluded.
        */
        doBuiltinValidation: function(callback)
        {
            // this is a fudge to get around new field types such as grid which
            // may not have a validate funciton defined.
            if (! this.widget || ! this.widget.validate)
            {
                callback({state: 'ok'});
                return;
            }
            this.widget.validate(function(info)
            {
                callback(info);
            });
        },

        doGainFocus: function()
        {
            if (this.onGainFocus)
                this.onGainFocus.call(this);
            if (this.validateOnGainFocus)
                this.widget.validate();
            this.controller.doGainFocus(this);
        },

        doLoseFocus: function()
        {
            if (this.onLoseFocus)
                this.onLoseFocus.call(this);
            if (this.validateOnLoseFocus)
                this.widget.validate();
            this.controller.doLoseFocus(this);
        }
    });

    /*!
    ** Creates a new field consisting of a $<attachment-control>.
    */
    var AttachmentField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
             **
             ** TODO
             ** This needs to be tidied up!
             */
            this.table = undefined;
            this.displayColumn = undefined;
            this.searchColumns = undefined;
            this.terms = undefined;
            this.maxValues = undefined;
            this.matchLimit = undefined;
            this.minLength = undefined;
            this.onSelect = undefined;
            this.dataColumn = undefined;
            this.zoomForm = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            var options =
            {
                hint: self.hint,
                icons: self.icons,
                readonly: self.readonly,
                requirement: self.requirement,

                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                onChange: function(value)
                {
                    self.changed(value);
                    if (! value)
                    {
                        self.widget.setValue(null);
                        if(self.controller.controlGroups[self.dataColumn])
                        {
                            var controls = self.controller.controlGroups[self.dataColumn];
                            for(var i = 0; i < controls.length; i++)
                            {
                                if (controls[i] !== self)
                                {
                                    controls[i].widget.setValue(null);
                                    controls[i].widget.irn = undefined;
                                }
                            }
                        }
                    }
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                onSelect: function(value)
                {
                    if(self.controller.controlGroups[self.dataColumn])
                    {
                        var controls = self.controller.controlGroups[self.dataColumn];
                        for(var i = 0; i < controls.length; i++)
                        {
                            if (controls[i] !== self)
                            {
                                controls[i].widget.setValue(value.irn);
                                controls[i].widget.irn = undefined;
                            }
                        }
                    }
                    self.widget.doChange();
                    if(!self.onSelect)
                        return;
                    self.onSelect(value);
                },
                /*
                ** Form attachment-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            };

            /* These options should only be passed if defined.
            ** Otherwise we will accept the control's defaults.
            */
            if (self.matchLimit !== undefined)
                options.matchLimit = self.matchLimit;
            if (self.minLength !== undefined)
                options.minLength = self.minLength;
            if (self.table !== undefined)
                options.table = self.table;
            if (self.terms !== undefined)
                options.terms = self.terms;
            if (self.displayColumn !== undefined)
                options.column = self.displayColumn;
            if (self.searchColumns !== undefined)
                options.searchColumns = self.searchColumns;
            if (self.dataColumn !== undefined)
                options.dataColumn = self.dataColumn;
            if (self.zoomForm !== undefined)
            {
                options.zoomForm = self.zoomForm;
                options.onPopout = function(value)
                {
                    var base = IMu.URL.base;
                    base = base.replace(/#.*$/,'');
                    IMu.URL.Hash.complete = true;
                    IMu.URL.Hash.load();
                    IMu.URL.Hash.setValue('form', self.zoomForm);
                    var child = window.open(base + '#' + IMu.URL.Hash.getUrl());
                    child.openctl = self.widget;
                    self.widget.doChange();
                };
            }

            self.widget = owner.IMu('attachment-control', options);
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/
        }
    });

    /*!
    ** A check box field.
    **
    ** Creates a new field consisting of a $<checkbox-control>.
    */
    var CheckBoxField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            this.choices = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('checkbox-control',
            {
                choices: self.choices,
                onChange: function(value)
                {
                    self.changed(value);
                },

                hint: self.hint,
                icons: self.icons,
                readonly: self.readonly,
                tabIndex: self.tabIndex,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** A date field.
    **
    ** Creates a new field consisting of a $<date-control>.
    */
    var DateField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            this.picker = false;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('date-control',
            {
                hint: self.hint,
                icons: self.icons,
                onChange: function(value)
                {
                    self.changed(value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                
                /*
                ** Form date-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                picker: self.picker,
                readonly: self.readonly,
                requirement: self.requirement,

                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** A blank field.
    */
    var EmptyField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this);
        },

        create: function(owner)
        {
            this._super.apply(this, arguments)
            
            var p = jQuery(owner).parent(); 
            p.addClass('empty');
        }
    });

    /*!
    */
    var GridField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            this.newRow = false;
            this.rowNumbers = undefined;
            this.dataColumn = undefined;
            this.showAddRemove = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('grid',
            {
                newRow: self.newRow,
                rowNumbers: self.rowNumbers,
                showAddRemove: self.showAddRemove,
                //dataColumn: self.dataColumn,
                onChange: function(value)
                {
                    self.changed(value);
                },
                onValidate: function(info, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, callback);
                },

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });

            self.widget.createView();
        }
    });

    var IconField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /*
            ** Options to pass to controls
            */
            this.icons = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('icon-control',
            {
                icons: self.icons,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });

            self.widget.createView();
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
            */
        }
    });

    /*!
    ** Creates a new image field consiting of a $<image-control>.
    */
    var ImageField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
             **
             ** TODO
             ** This needs to be tidied up!
             */
            this.bestFitWidth = undefined;
            this.height = undefined;
            this.x = undefined;
            this.y = undefined;
            this.zoom = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('image-control',
            {
                bestFitWidth: self.bestFitWidth,
                height: self.height,
                x: self.x,
                y: self.y,
                zoom: self.zoom,
                onChange: function(value)
                {
                    self.changed(value);
                },

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });

            self.widget.createView();
        }
    });

    var ImageCaptureField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);
            
            this.imageControlHeight = undefined;
            this.allowMultiple = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('image-capture-control',
            {
                imageControlHeight : self.imageControlHeight,
                allowMultiple : self.allowMultiple,
                onChange: function(value)
                {
                    self.changed(value);
                },

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });

            self.widget.createView();
        },

        /*!
        ** Gets the current value of the control
        **
        ** This method differs from the generic Field method in that the Field
        ** does not duplicate the control's data.
        **
        ** @returns mixed
        **   The field's current value.
        */
        getValue: function()
        {
            if (this.widget)
                return this.widget.getValue();
            return null;
        },
        
        /*!
        ** Sets the value of the control
        **
        ** This method differs from the generic Field method in that the Field
        ** does not duplicate the control's data.
        **
        ** @param mixed
        **   The value to assign.
        */
        setValue: function(value)
        {
            if (this.widget)
                this.widget.setValue(value);
        }
    });

    var CaptureField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self,arguments)

            self.widget = owner.IMu('capture-control',
            {
                onChange: function(value)
                {
                    self.changed(value);
                },

                readOnly: self.readonly,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
        },

        // This method does not work.
        // Use getAsncValue instead.
        getValue: function()
        {
            throw new IMu.Error('BadMethod', 'use getAsyncValue');
        },

        /*!
        ** Sets the value of the control
        **
        ** This method differs from the generic Field method in that the Field
        ** does not duplicate the control's data.
        **
        ** @param mixed
        **   The value to assign.
        */
        setValue: function(value)
        {
            if (this.widget)
                this.widget.setValue(value);
        }
    });

    /*!
    ** Creates a new field consisting of a $<integer-control>.
    */
    var IntegerField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('integer-control',
            {
                hint: self.hint,
                icons: self.icons,

                onChange: function(value)
                {
                    self.changed(value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                
                /*
                ** Form integer-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                readonly: self.readonly,
                requirement: self.requirement,
                
                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/
        }
    });

    /*!
    ** Creates a new field consisting of a $<integer-control>.
    */
    var NumberField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('number-control',
            {
                hint: self.hint,
                icons: self.icons,

                onChange: function(value)
                {
                    self.changed(value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                
                /*
                ** Form number-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                readonly: self.readonly,
                requirement: self.requirement,
                
                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** Creates a new field consisting of a $<selection-control>.
    */
    var SelectionField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            this.list = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('selection-control',
            {
                hint: self.hint,
                icons: self.icons,
                list: self.list,
                getAllLanguages: IMu.Config.getAllLanguages,

                onChange: function(value)
                {
                    self.changed(value);
                    if (self.list.useHierarchy)
                        self.checkHierarchy(self, value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                onSelect: function(value)
                {
                    if(!self.onSelect)
                        return;
                    self.onSelect(value);
                },
                
                /*
                ** Form selection-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                readonly: self.readonly,
                requirement: self.requirement,
                
                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** Creates a new field consisting of a $<static-control>.
    */
    var StaticField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('static-control', 
            {
                icons: self.icons,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** Creates a new field consisting of a $<text-control>.
    */
    var TextField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
             **
             ** TODO
             ** This needs to be tidied up!
             */
            this.lines = 1;
            this.suggest = undefined;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('text-control',
            {
                hint: self.hint,
                lines: self.lines,

                onChange: function(value)
                {
                    self.changed(value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                    if (self.suggest && self.suggest.useHierarchy)
                        self.checkHierarchy(self, self.getValue());
                },
                
                /*
                ** Form text-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                readonly: self.readonly,
                requirement: self.requirement,
                suggest: self.suggest,
                getAllLanguages: IMu.Config.getAllLanguages,
                
                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
/* TODO: this is to be considered for removal            
            if (self.value == undefined)
                self.widget.setIcon('initial');
*/                
        }
    });

    /*!
    ** Creates a new field consisting of a $<time-control>.
    */
    var TimeField = Field.extend
    ({
        _construct: function()
        {
            this._super.apply(this, arguments);

            /* Options to be passed to the contols
            **
            ** TODO
            ** This needs to be tidied up!
            */
            this.picker = false;
        },

        create: function(owner)
        {
            var self = this;
            self._super.apply(self, arguments)

            self.widget = owner.IMu('time-control',
            {
                hint: self.hint,

                onChange: function(value)
                {
                    self.changed(value);
                },
                onGainFocus: function()
                {
                    self.doGainFocus();
                },
                onLoseFocus: function()
                {
                    self.doLoseFocus();
                },
                
                /*
                ** Form time-field level custom validation.
                */
                onValidate: function(info, value, callback)
                {
                    if (! self.onValidate)
                    {
                        callback();
                        return;
                    }
                    self.onValidate(info, value, callback);
                },
                
                picker: self.picker,
                readonly: self.readonly,
                
                validateOnChange: self.validateOnChange,
                validateOnGainFocus: self.validateOnGainFocus,
                validateOnLoseFocus: self.validateOnLoseFocus,

                defaultContext: self.controller.getOption('defaultContext'),
                defaultPort: self.controller.getOption('defaultPort')
            });
            self.widget.createView();
            self.widget.setValue(self.value);
        }
    });
})();
