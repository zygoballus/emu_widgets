IMu.Request.Schema = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Schema';
	},

	getColumn: function(table, name, callback)
	{
		var params = {};
        params.table = table;
        params.name = name;
		return this.request('getColumn', params, callback);
	},

	getColumns: function(table, filter, callback)
	{
        // filter is optional
        if (typeof(filter) == 'function')
        {
            callback = filter;
            filter = undefined;
        }

		var params = {};
        params.table = table;
        if (filter !== undefined && filter !== '')
            params.filter = filter;

		return this.request('getColumns', params, callback);
	},

	getTables: function(filter, callback)
	{
        // filter is optional
        if (typeof(filter) == 'function')
        {
            callback = filter;
            filter = undefined;
        }
        
		var params = {};
        if (filter !== undefined && filter !== '')
            params.filter = filter;

		return this.request('getTables', params, callback);
	}
});
