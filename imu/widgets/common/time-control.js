/*!
** Simple time control.
**
** Currently only supports 24 hour time.
**
** @since 2.0
*/
IMu.Widgets.add('time-control', 'box-control',
{
    _construct: function()
    {
        var self = this;

        self._super.apply(this, arguments);
        self.classes.push('imu-time-control');

        self.registerOptions
        ({
            /*!
            **
            */
            patterns:
            [
                'T',
                't'
            ],

            /*!
            ** If true, display a pop-up time-picker when the control
            ** gets focus.
            */
            picker: false,

            /*!
            ** Called when the user has pressed the ``Enter`` key.
            */
            onEnter: undefined
        });

        self.language = IMu.Languages.current.code;
        self.currentPattern = undefined;
        self.language = undefined;
        IMu.Events.bind('language-changed', function()
        {
            self.changeLanguage();
        });
        
    },

    /*!
    ** Time-control level built-in validation.
    ** Called via **validate( )** function.
    **
    ** A set of rules which always apply to the `time-control` widget are
    ** checked and the results are stored in ``info``.
    **
    ** If the results of the parent **doBuiltinValidation( )** call are **ok**
    ** and the value is not ``undefined``, the value will be checked to see if
    ** it is a valid date.
    **
    ** If the value is not a valid time, ``info.state`` will be set to
    ** **invalid** and ``info.details`` will be set to a meaningful string to
    ** reflect why the value is invalid.
    **
    ** Currently this is a work in progress and there are no rules in place.
    **
    ** @param info
    **   Information about the current state of the `time-control`.
    **   Further validation is only required if ``info.state`` is **ok**.
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
        var self = this;

        self._super(info, value, function()
        {
            if (info.state == 'ok' && value != null)
            {
                if (self.getSortableValue() == null)
                {
                    info.state = 'invalid';
                    info.details = 'validation-invalid-time-format';
                }
            }
            callback(info, value);
        });
    },

    /* Prevent overwriting of value by parent control.
    ** This is handy for if getSortableValue has set a more meaningful value.
    */
    getValue: function()
    {
        if (this.value)
            return this.value;
        return this._super();
    },

    getSortableValue: function()
    {
        if (! this.value)
            return null;

        var locale = IMu.Languages.current.code;
        if (! locale)
            locale = Globalize.culture().name;
        
        var parsedDate = null;
        for (var pattern in this.options.patterns)
        {
            parsedDate = Globalize.parseDate(this.value,
                Globalize.culture(locale).calendar.patterns[pattern]);
            if (parsedDate != null)
                return parsedDate;
        }
        return undefined;
    },
    // end interface
    
    changeLanguage: function()
    {
        if (! this.value)
        {
            this.language = IMu.Languages.current.code;
            return;
        }
        var sortableValue = this.getSortableValue();
        if (! sortableValue)
        {
            this.language = IMu.Languages.current.code;
            return;
        }
        var formattedValue = Globalize.format(
            sortableValue,
            this.currentPattern,
            IMu.Languages.current.code);

        // change language before setting value, otherwise validation error
        this.language = IMu.Languages.current.code;
        if (formattedValue)
            this.view.setValue(formattedValue);
    }
});
