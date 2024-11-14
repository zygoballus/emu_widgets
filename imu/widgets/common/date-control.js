/*!
** Simple date control.
**
** @since 2.0
*/
IMu.Widgets.add('date-control', 'box-control',
{
    _construct: function()
    {
        var self = this;
        self._super.apply(self, arguments);
        self.classes.push('imu-date-control');

        self.registerOptions
        ({
            /*!
            ** The date format to be used.
            **
            ** The formatting of dates is problematic and is tied up
            ** with a much larger issue of localisation.
            **
            ** This option only provides a short-cut workaround.  As such,
            ** it may be deprecated in the future!
            */
            format: 'dd/mm/yy',

            /*!
            ** The locale to match date patterns against.
            ** If **undefined**, will attempt to guess based on the user's
            ** current location.
            **
            ** For supported locales see globalize/cultures in the dist
            ** directory.
            */
            language: undefined,

            /*!
            ** The list of date patterns to match against.
            **
            ** By default all but pure time based patterns have been included.
            ** For reasons of locale dependent variation, the exact pattern
            ** formats cannot be listed in the documentation.
            **
            ** For supported patterns see globalize/cultures in the dist
            ** directory.
            */
            patterns:
            [
                'd',
                'D',
                'M',
                'Y',
                'S'
            ],

            /*!
            ** If true, display a pop-up date-picker when the control
            ** gets focus.
            */
            picker: false
        });

        self.currentPattern = undefined;
        self.language = undefined;
        IMu.Events.bind('language-changed', function()
        {
            self.changeLanguage();
        });
    },

    _ready: function()
    {
        if (this.options.language)
            this.language = this.options.language;
        else
            this.language = IMu.Languages.current.code;
    },

    /*!
    ** Date-control level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** A set of rules which always apply to the `date-control` widget are 
    ** checked and the results are stored in ``info``.
    **
    ** If the results of the parent **doBuiltinValidation( )** call are **ok**
    ** and the value is not ``undefined``, the value will be checked to see if
    ** it is a valid date.
    **
    ** If the value is not a valid date, ``info.state`` will be set to
    ** **invalid** and ``info.details`` will be set to a meaningful string to
    ** reflect why the value is invalid.
    **
    ** Currently this is a work in progress and there are no rules in place.
    **
    ** @param info
    **   Information about the current state of the `date-control`.
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
                    info.details = 'validation-invalid-date-format';
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

        if (this.value instanceof Date)
            return this.value;

        var language = this.language;
        if (! language)
            language = Globalize.culture().name;
        
        var parsedDate = null;
        for (var i in this.options.patterns)
        {
            var pattern = this.options.patterns[i];
            parsedDate = Globalize.parseDate(this.value,
                Globalize.culture(language).calendar.patterns[pattern]);
            if (parsedDate != null)
            {
                this.currentPattern = this.options.patterns[i];
                return this.value = parsedDate;
            }
        }
        return undefined;
    },

    setValue: function(value, callback)
    {
        var language = this.language;
        this.language = "en";

        this._super(value, callback);
        this.changeLanguage(language);
    },
    // end interface
   
    /* It should be noted that if an invalid date becomes valid after a
    ** language change, the implied value changes
    */
    changeLanguage: function(newLanguage)
    {
        if (! newLanguage)
            newLanguage = IMu.Languages.current.code;

        if (! this.value)
        {
            this.language = newLanguage;
            return;
        }
        var sortableValue = this.getSortableValue();
        if (! sortableValue)
        {
            this.language = newLanguage;
            return;
        }
        var formattedValue = Globalize.format(
            sortableValue, 
            this.currentPattern,
            IMu.Languages.current.code);
        
        // change language before setting value, otherwise validation error
        this.language = newLanguage;
        if (formattedValue)
            this.view.setValue(formattedValue);
    }
});
