/*!
 ** Base widget for specific controls.
 **
 ** @since 2.0
 */
IMu.Widgets.add('control', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-control');

        this.registerOptions
        ({
            /*!
            ** Text to be displayed as a hint for data input.
            **
            ** How this is used depends on the type of control. For example,
            ** for a text box the hint is shown both as a title (hover-over)
            ** and in the text box itself.
            */
            hint: undefined,

            /*!
            ** The icons used to complement the `control` widget.
            **
            ** In general these are used for control validation, though they
            ** can also be used for other purposes.
            */
            icons:
            {
                /*!
                ** The initial icon to be displayed by the `control` when it
                ** is first created.
                */
                inital: undefined,

                /* The next three are associated with validation.
                */
                /*!
                ** The icon to be displayed when validation succeeds.
                */
                ok: undefined,

                /*!
                ** The icon to be displayed if a `control` is left empty yet has
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
            },

            /*!
            ** If **true**, display the control as read-only.
            */
            readonly: false,

            /*!
            ** Used to determine how a control should be styled
            ** Two possible options : **mandatory** or **suggested**.
            */
            requirement: undefined,

            /*!
            ** Used to set the tabindex attribute on the control.
            */
            tabIndex: undefined,


            /*!
            ** Called when the value of the control has changed.
            */
            onChange: undefined,

            onClickIcon: undefined,

            /*!
            ** Called when control has received keyboard focus.
            */
            onGainFocus: undefined,

            /*!
            ** Called when the control has lost keyboard focus.
            */
            onLoseFocus: undefined,

            /*!
            ** Called as a part of the **validate( )** function chain.
            ** This occurs after a `control`'s  built-in validation and 
            ** gives a `control` instance the chance to review the validation.
            */
            onValidate: undefined,

            /*
            ** Called after standard validation has taken place.
            ** This give an individual control the chance to review the
            ** validation.
            */
            //onValidated: undefined
            
            /*!
            ** If **true**, causes the **validate( )** function to be called 
            ** when the `control`'s value changes.
            */
            validateOnChange: false,

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when the `control` gains focus.
            */
            validateOnGainFocus: false,

            /*!
            ** If **true**, causes the **validate( )** function to be called
            ** when the `control` loses focus.
            */
            validateOnLoseFocus: false
        });

        this.value = undefined;
    },

    /*!
    ** Compares the value of this control against another control.
    ** 
    ** @returns 0
    **   By default, all controls are equal.
    */
    compare: function()
    {
        return 0;
    },

    /*!
    ** Gets a normalized version of the value that can be evaluated as either
    ** <, == or > than another normalized value of the same control.
    **
    ** By default, simply return the value.
    */
    getSortableValue: function()
    {
        return this.getValue();
    },

    getAsyncValue: function(callback)
    {
        if (! callback)
            return;

        var value = this.getValue();
        callback(value);
    },

    /*!
    ** Gets the current value of the control.
    **
    ** @returns mixed
    **   The control's current value.
    */
    getValue: function()
    {
        if (this.view)
            this.value = this.view.getValue();
        if (this.value === undefined)
            this.value = null;
        return this.value;
    },

    /*!
    ** Sets the image that is to be displayed in the control and its tooltip.
    **
    ** @param name
    **   The name of the icon to be used.
    **   If this value is not defined in icons, no image will be displayed.
    **
    ** @param info
    **   The message to be displayed as a tooltip.
    **   Clicking on the image will also bring up a dialogue box displaying the
    **   message.
    */
    setIcon: function(name, info)
    {
        this.view.setIcon(name, info);
    },

    /*!
    ** Sets the value of the control.
    **
    ** @param mixed
    **   The value to assign.
    */
    setValue: function(value, callback)
    {
        var self = this;

        self.value = value;
        if (self.view)
        {
            self.view.setValue(self.value);
            self.validateValue(self.value, function(info)
            {
                if (callback)
                    callback.call(self, info);
            });
        }
    },

    /*!
    ** Control level validation.
    **
    ** Creates an ``info`` object containing ``state`` and ``details`` of the 
    ** `control`.
    ** ``state` defaults to **ok** and ``details``defaults to ``undefined``.
    ** 
    ** A two step validation process then occurs:
    ** 1) Built-in rules that always apply to the `control` widget are checked
    ** 2) Custom rules set at instantiation are run
    ** 
    ** Once the validation process has concluded, the `control` displays the
    ** results and then fires a callback event, if one exists.
    **
    ** Each subsequent function in the validation chain occurs as a callback
    ** of the previous function to guard against potential unexpected
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
            details: undefined
        };

        var value = self.getValue();
        self.doBuiltinValidation(info, value, function()
        {
            self.doCustomValidation(info, value, function()
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
    ** Control level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** A set of rules which always apply to the `control` widget are checked and
    ** the results are stored in ``info``.
    **
    ** For the `control` widget, the only rule we can check is that there a
    ** value exists when a ``requirement`` has been set.
    ** 
    ** If input is **mandatory** and no value is given, the `control` is
    ** essentially invalid.
    ** If input is **suggested** and no value is given, the user may need to be
    ** notified before proceeding.
    ** In both cases ``info.details`` is set to hash key from the strings file.
    **
    ** @param info
    **   Information about the current state of the `control`.
    **   At this point ``info.state`` should be **ok** and ``info.details`` 
    **   should be ``undefined.
    **
    ** @param value
    **   The current value of the widget.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doBuiltinValidation: function(info, value, callback)
    {
        if (this.isEmpty(value))
        {
            var requirement = this.options.requirement;
            if (requirement == 'mandatory')
            {
                info.state = 'invalid';
                info.details = 'validation-empty-mandatory';
            }
            else if (requirement == 'suggested')
            {
                info.state = 'empty';
                info.details = 'validation-empty-suggested';
            }
        }
        callback();
    },

    /*
    ** Called by the view when the control's value has changed.
    */
    doChange: function()
    {
        this.value = this.view.getValue();
        if (this.options.onChange)
            this.options.onChange.call(this, this.value);
        else if (this.options.validateOnChange)
            this.validate();
    },

    /*! 
    ** Control level custom validation.
    ** Called via the **validate( )** function.
    **
    ** Checks to see if there is an ``onValidate`` function in the options.
    ** If one exists, it is called before control is passed back to 
    ** **validate( )**.
    **
    ** @param info
    **   Information about the current state of the `control` before any
    **   custom validation.
    **
    ** @param value
    **   The current value of the widget.
    **
    ** @param callback function
    **   Returns control back to the previous function once validation has
    **   concluded.
    */
    doCustomValidation: function(info, value, callback)
    {
        var self = this;

        if (! self.options.onValidate)
        {
            callback();
            return;
        }
        self.options.onValidate.call(self, info, value, function()
        {
            callback();
        });
    },

    /*
    ** Called by the view when the control has gained focus.
    */
    doGainFocus: function()
    {
        if (this.options.onGainFocus)
            this.options.onGainFocus.call(this);
        else if (this.options.validateOnGainFocus)
            this.validate();
    },

    /*
    ** Called by the view when the control has lost focus.
    */
    doLoseFocus: function()
    {
        if (this.options.onLoseFocus)
            this.options.onLoseFocus.call(this);
        else if (this.options.validateOnLoseFocus)
            this.validate();
    },

    getIconURL: function(value)
    {
        // TODO: what about those placeholders?
        if (! IMu.Type.isObject(this.options.icons))
            return undefined;

        var icon = this.options.icons[value];
        if (! icon)
            return undefined;

        return IMu.Request.getURL('Image') + '&name=' + icon;
    },

    /*
    ** Creates a normalised version of list-related options.
    **
    ** Convenience method used to normalise list-related options:
    **
    ** * list option of selection-control
    ** * suggest option of text-control
    **
    ** The method makes some guesses as to the type of list being
    ** specified.
    **
    ** @param data
    **   The option as specified by the user.
    **
    ** @returns object
    **   The option normalised into a standard stucture.
    */
    getListInfo: function(data)
    {
        var info = {};
        switch (IMu.Type.get(data))
        {
            case 'array':
                info.type = 'array';
                info.values = data;
                break;

            case 'function':
                info.type = 'function';
                info.code = data;
                break;

            case 'object':
                for (var name in data)
                    info[name] = data[name];
                break;

            case 'string':
                // TODO this should be more flexible
                info.type = 'lookup';
                info.name = data;
                break;
        }
        if (! info.type)
            info.type = 'empty';
        return info;
    },

    isEmpty: function(value)
    {
        if (value === undefined)
            value = this.getValue();
        return (value === undefined || value === '' || value === null);
    },

    optionsChanged: function(list)
    {
        var view = this.view;
        if (! view)
            return;

        for (var i in list)
        {
            var item = list[i];
            if (item.name == 'readonly')
                view.setReadOnly();
            else if (item.name == 'requirement')
                view.setRequirement();
            else if (item.name == 'tabIndex')
                view.setTabIndex();
        }
    },

    /*!
    ** Control level show validation state.
    **
    ** By default do nothing.
    **
    ** @param info
    **   Information about the current state of the `control` after validation.
    **   This parameter is taken for consistency.
    **
    ** @param callback function
    **   Returns control back to the previous function.
    */
    showValidationState: function(info, callback)
    {
        callback();
    },

    /* This function is pretty much identical to ``validate`` except
    ** it is used when the caller wants to explicitly define what the
    ** value being validated is.
    ** 
    ** This should be for strictly PRIVATE use only.
    ** Appropriate use would be in the setValue function, where the view
    ** part of the control might not be able to properly represent the data.
    ** For example, a control that has specific values that can be set but 
    ** the set of values have not been populated at the time of settng the
    ** widget value.
    */
    validateValue: function(value, callback)
    {
        var self = this;

        var info =
        {
            state: 'ok',
            details: undefined
        };

        self.doBuiltinValidation(info, value, function()
        {
            self.doCustomValidation(info, value, function()
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
