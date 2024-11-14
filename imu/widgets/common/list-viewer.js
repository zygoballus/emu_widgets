/*!
 * Display a simple list (summary-style) view of each record in a result set.
 *
 * @since 2.0
 */
IMu.Widgets.add('list-viewer', 'paged-viewer',
{
	_construct: function()
	{
		this._super.apply(this, arguments);
		this.classes.push('imu-list-viewer');

        this.registerOptions
        ({
            /* If set, override vertical-viewer's calculation.
            */
            recordsPerRow: undefined
        });
	}
});
