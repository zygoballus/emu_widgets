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

IMu.Widgets.add('statistics-list', 'manager',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-statistics-list');

        this.registerOptions
        ({
        });
        this.selected = undefined;
    },

    loadList: function(pid, callback)
    {
        var self = this;

        var request = new IMu.Request.Projects.Statistics();
        request.onError = function(response)
        {
            // TODO
        };
        request.onSuccess = function(response)
        {
            self.setList(response.result);
        };
        request.list(pid);
    }
});
