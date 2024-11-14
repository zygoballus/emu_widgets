/*!
** Number input control.
**
** @since 2.0
*/
IMu.Widgets.add('number-control', 'box-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-number-control');

        this.registerOptions
        ({
        });
    },

    getSortableValue: function()
    {
        if (! this.value)
            return null;

        if (! this.regex)
            this.regex = /^\s*(\-|\+)?\d+(\.\d+)?\s*$/;
        
        if (! this.regex.test(this.value))
            return undefined;
        return parseFloat(this.value);
    },

    /*!
    ** Number-control level built-in validation.
    ** Called via the **validate( )** function.
    **
    ** A set of rules which always apply to the `number-control` are checked
    ** and the results are stored in ``info``.
    **
    ** The `number-control` runs its value against a regex to ensure it
    ** matchest the correct character pattern for a number.
    **
    ** @param info
    **   Information about the current state of the `number-control`.
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
            self.regex = /^\s*(\-|\+)?\d+(\.\d+)?\s*$/;

        self._super(info, value, function()
        {
            if (info.state == 'ok' && value != null)
            {
                if (! self.regex.test(value))
                {
                    info.state = 'invalid';
                    info.details = 'validation-invalid-number';
                }
            }
            callback();
        });
    }
});
