IMu.Request.Projects = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Projects';
	},

	get: function(pid, callback)
	{
		var params = {};
        params.pid = pid;
		return this.request('get', params, callback);
	},

	list: function(callback)
	{
		var params = {};
		return this.request('list', params, callback);
	}
});
