/*!
 * @since 2.0
 */
IMu.Widgets.add('tree-viewer', 'viewer',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-tree-viewer');

        this.registerOptions
        ({
        });
    },

	setOffset: function(offset)
	{
		var self = this;

		if (offset === undefined)
			offset = 0;
		if (this.offset === undefined || this.offset != offset)
		{
			this.offset = offset;
			self.search.fetchMany([offset, 1], 'irn', function(result)
			{
				IMu.log('tree-viewer: offset {0} result {1}', offset, result);
				var row = result.rows[0];
				var module = row.source;
				var key = row.irn;
				if (self.view)
					self.view.showRecord(module, key);
			});

			this.resize();
		}
	}
});
