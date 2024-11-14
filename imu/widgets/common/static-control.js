/*!
** Static text control.
**
** @since 2.0
*/
IMu.Widgets.add('static-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-static-control');
    },

    /*!
    ** Compares the value of this control against another `static-control` or
    ** value.
    **
    ** Uses the same comparison method ad `text-control`.
    **
    ** Uses lowercase values to compare character value. If both lowercase
    ** strings are identical, it then compares the non-converted values.
    **
    ** @returns result
    **   A value indicating the relationship between the strings.
    **   * < 0 - the first character that does not match has a lower value in this
    **   control than the comparison control/value.
    **   * = 0 - the contents of both strings are equal.
    **   * > 0 - the first character that does not match has a greater value in
    **   this control than the comparison control/value.
    **   * undefined - the values cannot be compared.
    */
    compare: function(otherValue)
    {
        this.getValue();
        if (otherValue.getValue)
            otherValue = otherValue.getValue();

        if (this.value == null && otherValue == null)
            return 0;
        else if (this.value == null || otherValue == null)
            // We do not know how to sort null/undefined.
            // Leave it to the caller (eg. a grid widget
            // where columns can specifiy how to sort these value)
            return undefined;

        if (this.value.toLowerCase() == otherValue.toLowerCase())
        {
            // lower case is identical, check with upper case
            if (this.value == otherValue)
                return 0;
            if (this.value < otherValue)
                return -1;
            if (this.value > otherValue)
                return 1;
        }
        else if (this.value.toLowerCase() < otherValue.toLowerCase())
            return -1;
        else if (this.value.toLowerCase() > otherValue.toLowerCase())
            return 1;

        // it shouldn't get to here
        return undefined;
    }
});
