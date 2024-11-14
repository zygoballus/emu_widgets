/*!
** Simple checkbox control.
**
** @since 2.0
*/
IMu.Widgets.add('checkbox-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-checkbox-control');

        this.value = false;
    },

    /*!
    ** Compares the value of this control against another `checkbox-control`.
    **
    ** @returns result
    **   A value indicating the relationship between the checkboxes.
    **   * < 0 - this control is unchecked but the other control is.
    **   * = 0 - both controls are either checked or unchecked.
    **   * > 0 - this control is checked but the other control is not.
    **   * undefined - the values cannot be compared.
    */
    compare: function(otherControl)
    {
        var otherValue = otherControl.widget.value;
        if (this.value == otherValue)
            return 0;
        else if (this.value)
            return 1
        else
            return -1;
    }
});
