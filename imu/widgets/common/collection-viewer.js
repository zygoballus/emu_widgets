/*!
 * Displays records in a user's collection (shopping cart).
 *
 * @since 2.0
 */
IMu.Widgets.add('collection-viewer', 'paged-viewer',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-collection-viewer');
    }
});
