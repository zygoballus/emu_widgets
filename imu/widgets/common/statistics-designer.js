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

IMu.Widgets.add('statistics-designer', 'designer',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-statistics-designer');

        this.registerOptions(
        {

        });
    },

    getDesigner: function()
    {
        return this.getStatistic();
    },

    /*!
     ** Gets the object representing the current statistic.
     **
     ** @returns object
     **   A simple object representing the statistic.
     */
    getStatistic: function()
    {
        if (this.view)
            return this.view.getStatistic();
        return undefined;
    },

    /*!
     ** Creates a new (empty) statistic
     */
    newStatistic: function()
    {
        if (this.view)
            this.view.newStatistic();
    },

    setDesigner: function(id, statistic)
    {
        this.setStatistic(id, statistic)
    },

    /*!
     ** Sets the statistic to be edited. The statistic should be a simple
     ** object.
     **
     ** @param statistic object
     **   The representation of the statistic.
     */
    setStatistic: function(id, statistic)
    {
        this.id = id;
        if (this.view)
            this.view.setStatistic(statistic);
    }
});
