IMu.Request.Access = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Access';
	},

	getGroups: function(filter, callback)
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

		return this.request('getGroups', params, callback);
	},

	getUsers: function(filter, callback)
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

		return this.request('getUsers', params, callback);
	}
});
