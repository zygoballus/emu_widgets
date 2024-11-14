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

IMu.Widgets.add('designer', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-designer');

        this.registerOptions
        ({
            /*!
            ** If true, show a control to allow the user to cancel the current
            ** set of edits to data in the form.
            */
            showCancel: true,

            /*!
            ** If true, show a control to allow the user to exit back to project or home screen
            */
            showExit: true,

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
            ** Called when the current set of changes is to be exited.
            */
            onExit: undefined,

            /*!
            ** Called when the current set of changes is to be saved.
            */
            onSave: undefined,

            /*!
            ** If set to **true**, a dialogue will be generated on validation
            ** if there are issues.
            */
            showErrors: true
        });

        this.id = undefined;
    },

    getDesigner: function()
    {
        // Interface function
    },

    getIdentifier: function()
    {
        return this.id;
    },

    setIdentifier: function(id)
    {
        this.id = id;
    },

    // view
    doCancel: function()
    {
        if (this.options.onCancel)
            this.options.onCancel.call(this);
    },

    doExit: function()
    {
        if(this.options.onExit)
            this.options.onExit.call(this);
    },

    doSave: function(form)
    {
        if (this.options.onSave)
            this.options.onSave.call(this, this.id, form);
    },

    /*!
    ** Designer level validation.
    **
    ** Creates an ``info`` object containing ``state`` and ``details`` of the
    ** `designer`.
    ** Unlike in `control` widget validation, ``info.details`` is an array
    ** comprising of validation information from other widgets and ``info.state``
    ** is the 'worst' state of those other widgets.
    **
    ** Once the built-in validation process has concluded, the `designer`
    ** displays the results and then fires a callback event, if one exists.
    **
    ** Each subsequent function in the validation chain occurs as a callback of
    ** the previous function. This guards against potential unexpected
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
// TODO        
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

    /*!
    ** Designer level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** Does nothing by default.
    **
    ** @param info
    **   Information about the curent state of the `designer`.
    **   At this point ``info.state`` should be **ok** and ``info.details``
    **   should be an empty array.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doBuiltinValidation: function(info, callback)
    {
        // TODO: look into trying to merge functions from form-designer and 
        // editor-designer into this one function.
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

    /*!
    ** Designer level show validation.
    ** Called via the **validate( )** function.
    ** Summarises information from validation and displays in a dialogue box.
    **
    ** If the ``showErrors`` option is not **true** or ``info.state`` is **ok**
    ** callback will be fired (if one exists) and the function will return.
    **
    ** Otherwise, each array element in ``info.details`` is inspected.
    ** Each detail itself represents information about a control widget.
    ** If the control widget's validation state is the same as ``info.state``
    ** it will be included. The control widget's validation details are used to
    ** identify the kind of issue/warning to have its counter incremented. The
    ** result of this process will be a hash table of issues/warnings and the
    ** number of occurences.
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
    **   Information about the current state of the `designer` after validation.
    **   As the `designer` is a collection of sections with their own controls,
    **   ``info.details`` is an array representing the validation state of each
    **   of these controls.
    **   ``info.state`` is the 'worst' state of the above mentioned controls.
    **
    ** @param callback function
    **   Returns control back to the previous function.
    */
    showValidationState: function(info, callback)
    {
        if (! this.options.showErrors || 
            info.state == 'ok' || info.state == 'empty')
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
            dialogue.addDetail(info.details);
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
    ** A convinience function which only changes the validation state if the new
    ** state is more severe than the current state. 
    */
    updateValidationState: function(info, state)
    {
        if (state == 'invalid' && info.state != 'invalid')
            info.state = 'invalid';
        else if (state == 'empty' && 
            info.state != 'invalid' && info.state != 'empty')
            info.state = 'empty';
    }
});
