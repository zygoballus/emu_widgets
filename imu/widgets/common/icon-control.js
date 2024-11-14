/*!
** Control to show a logical value as an icon.
**
** @since 2.0
*/
IMu.Widgets.add('icon-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-icon-control');

        this.registerOptions
        ({
        });
    },

    // convenience function
    getURL: function(value)
    {
        return this.getIconURL(value);
    },

    // While this seems strange, sorting on columns with hazard icons has been
    // requested by clients.
    /*!
    ** Compares the value of this control against another `icon-control`. 
    ** Uses the `icon`'s name as a value.
    **
    ** @returns result
    **   A value indicating the relationship between icons.
    */
    compare: function(otherControl)
    {
        var value = undefined;
        if (IMu.Type.isNumber(this.value))
            value = "'" + this.value + "'";
        else
            value = this.value;
            
        var otherValue = otherControl.widget.value;
        if (IMu.Type.isNumber(otherValue))
            otherValue = "'" + otherValue + "'";

        if (value == otherValue)
            return 0;
        else if (value == '' || otherValue == '')
            return undefined;
        else if (value < otherValue)
            return -1;
        else if (value > otherValue)
            return 1;
    }
});
