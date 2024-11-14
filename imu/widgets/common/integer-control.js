/*!
** Integer input control.
**
** @since 2.0
*/
IMu.Widgets.add('integer-control', 'box-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-integer-control');

        this.registerOptions
        ({
        });

        this.regex = undefined;
    },

    getSortableValue: function()
    {
        if (! this.value)
            return null;

        if (! this.regex)
            this.regex = /^\s*(\-|\+)?\d+\s*$/;
                
        if (! this.regex.test(this.value))
            return undefined;
        return parseInt(this.value, 10);
    },

    /*!
    ** Integer-control level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** A set of rules which always apply to the `integer-control` are checked
    ** and the results are stored in ``info``.
    **
    ** The `integer-control` runs its value against a regex to ensure it
    ** matches the correct character pattern for an integer.
    **
    ** @param info
    **   Information about the current state of the `integer-control`.
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

        // Don't want all the extra base stuff that parseInt() does.
        if (! self.regex)
            self.regex = /^\s*(\-|\+)?\d+\s*$/;

        self._super(info, value, function()
        {
            if (info.state == 'ok' && value != null)
            {
                if (! self.regex.test(value))
                {
                    info.state = 'invalid';
                    info.details = 'validation-invalid-integer';
                }
            }
            callback();
        });
    }
});
