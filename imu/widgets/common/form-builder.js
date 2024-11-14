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

IMu.Widgets.add('form-builder', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-form-builder');

        this.registerOptions
        ({
            /*!
            ** If true, focus moves to the next field in the form after a
            ** barcode has been scanned.
            */
            moveForwardAfterBarcode: true,

            /*!
            ** If true, show a control to allow the user to cancel the current
            ** set of edits to data in the form.
            */
            showCancel: true,

            /*!
            ** If set to **true**, a dialogue will be generated on validation
            ** if there are issues.
            */
            showErrors: true,

            /*!
            ** If true, show a control to allow the user to save the current
            ** set of edits to data in the form.
            */
            showSave: true,

            // event handlers
            
            /*!
            ** Called when the current set of changes is to be cancelled.
            */
            onCancel: undefined,
            
            /*!
            ** Called when any value in the form changes.
            */
            onChange: undefined,

            /*!
            ** Called when loading record values into the form.
            */
            onFetch: undefined,

            /*!
            ** Called when the current set of changes is to be saved.
            */
            onSave: undefined,

            /*!
            ** Called when the user has entered a search.
            */
            onSearch: undefined
        });

        this.pid = undefined;
        this.fid = undefined;
        this.form = undefined;

        this.mode = undefined;
        this.navigate = undefined;

        this.info = undefined;
        this.values = undefined;
        this.changed = false;

        // TODO: move from view
        this.recordSet = [];
        this.currentIndex = undefined;
        this.currentIrn = undefined;
    },

    getAsyncValues: function(callback)
    {
        var self = this;

        if (! callback)
            return;

        var values = {};

        if (! this.view)
            return values;

        var remaining = self.view.inputs.length;
        
        if (! remaining)
            callback(values);

        // poor-man's Promise.all
        self.view.inputs.forEach(function(input)
        {
            input.getAsyncValues(function(sectionValues)
            {
                for (var name in sectionValues)
                    values[name] = sectionValues[name];
                
                remaining--;

                if (! remaining)
                    callback(values);
            });
        });
    },

    getValues: function()
    {
        if (this.view)
            return this.view.getValues();
        return {};
    },

    moveBackward: function()
    {
        if (this.view)
            this.view.moveBackward();
    },

    moveForward: function()
    {
        if (this.view)
            this.view.moveForward();
    },

    save: function()
    {
        var self = this;

        var dialogue = new IMu.App.Dialogue();
        dialogue.setMessage(IMu.string('common-saving'));
        dialogue.show();

        self.getAsyncValues(function(values)
        {
            dialogue.hide();
            self.doSave(values);
        });
    },

    setForm: function(form, callback)
    {
        this.pid = form.pid;
        this.fid = form.id;
        this.form = form;

        if (this.form.script)
            this.mode = 'custom';
        else if (this.form.search)
            this.mode = 'search';
        else if (this.form.filter)
            this.mode = 'crowd-source';
        else
            this.mode = 'new';

        this.navigate = this.mode == 'crowd-source';
        // ideally we could do 'new' mode records too but not yet
            
        this.owner.empty();
        if (this.view)
            this.view.create();

        if (callback)
            callback.call(this);
    },

    setOwner: function(owner)
    {
        this._super.apply(this, arguments);

        var self = this;
        self.owner.on('barcode-scanned', function(e, info)
        {
            if (self.options.moveForwardAfterBarcode)
                self.moveForward();
        });
    },

    setValues: function(values)
    {
        if (values.irn)
            this.currentIrn = values.irn;
        if (this.navigate && values.irn)
        {
            this.currentIndex = undefined;
            for (var i in this.recordSet)
            {
                if (this.recordSet[i] == values.irn)
                {
                    this.currentIndex = i;
                    break;
                }
            }
            if (this.currentIndex == undefined)
            {
                this.currentIndex = this.recordSet.length;
                this.recordSet.push(values.irn);
            }
        }
        if (this.view)
            this.view.setValues(values);
    },

    /*!
    ** Form-builder level validation.
    ** 
    ** Creates an ``info`` object containing ``state`` and ``details`` of the 
    ** `form-builder`.
    ** Unlike in `control` widget validation, ``info.details`` is an array
    ** comprising of validation information from other widgets and ``info.state``
    ** is the 'worst' state of those other widgets.
    **
    ** Once the built-in validation process has concluded, the `form-builder`
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
        self.doBuiltinValidation(info, function()
        {
            self.showValidationState(info, function()
            {
                if (callback)
                    callback.call(self, info);
            });
        });
    },
    // end interface

    acceptBarcode: function(info)
    {
        if (this.view)
            this.view.acceptBarcode(info);
    },

    /* Form-builder level built-in validation.
    ** Called via the **validate( )** function.
    ** 
    ** Each of the section in the `form-builder` are a `form` widget.
    ** The `form-builder` progresses through each of these, validating them.
    ** After a section has been validated, its details are added to
    ** ``info.details``.
    **
    ** ``info.state`` will be updated if a section's validation state is worse.
    ** The ranking of states from best to worst is as follows:
    ** 1) ok
    ** 2) empty
    ** 3) invalid
    **
    ** Once all sections have been validated, control is returned to the 
    ** **validate( )** function.
    **
    ** @param info
    **   Information about the current state of the `form-builder`.
    **   At this point ``info.state`` should be **ok** and ``info.details``
    **   should be an empty array.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doBuiltinValidation: function(info, callback)
    {
        if (! this.view)
        {
            callback();
            return;
        }
        this.view.doBuiltinValidation(info, callback);
    },

    /* Form-builder level show validation.
    ** Called via the **validate( )** function.
    ** Summarises information from validation and displays in a dialogue box.
    **
    ** If the ``showErrors`` option is **false** or ``info.state`` is **ok** a
    ** callback will be fired (if one exists) and the function will return.
    **
    ** Otherwise, each array element in ``info.details`` is inspected.
    ** Each detail itself represents information about a control widget.
    ** If the control widget's validation state is the same as ``info.state`` it
    ** will be included. The control widget's validation details are used to 
    ** to identify the kind of issue/warning to be incremented.
    ** The result of this process will be a hash table of issues/warnings and
    ** the number of occurences.
    ** 
    ** A dialogue box is then created advising the user that there are
    ** issues/warnings and lists them.
    ** 
    ** If ``info.state`` is **empty**, the user is merely warned that there may
    ** be areas that need attention. 
    ** They will then be allowed to either:
    ** * continue - this will fire the callback, if any; or
    ** * cancel - this will allow the user to modify any values before trying
    **          again.
    **
    ** In the event of either an invalid state or a warning where the user
    ** chooses to cancel, the browser will focus on the first element on the
    ** page which needs attention.
    **
    ** @param info
    **   Information about the current state of the `form-builder` after validation.
    **   As the `form-builder` is a collection of sections with their own 
    **   controls, ``info.details`` is an array representing the validation 
    **   state of each of these controls.
    **   ``info.state`` is the 'worst' state of the above mentioned controls.
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

                var key = detail.info.details;

                // Update the counter for this type of error
                //
                if (! issues[key])
                    issues[key] = 1;
                else
                    issues[key]++;
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

    // view
    doCancel: function()
    {
        if (this.options.onCancel)
            this.options.onCancel.call(this);
    },

    doChange: function()
    {
        this.changed = true;
        if (this.options.onChange)
            this.options.onChange.call(this);
    },

    doFetch: function(key)
    {
        if (this.options.onFetch)
            this.options.onFetch.call(this, key);
    },

    doSave: function(values)
    {
        if (this.options.onSave)
            this.options.onSave.call(this, values);
    },

    doSearch: function(term, callback)
    {
        if (this.options.onSearch)
        {
            this.options.onSearch.call(this, term, function(result)
            {
                callback(result);
            });
        }
    }
});
