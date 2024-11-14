IMu.Request.Projects.Statistics = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Projects/Statistics';
	},

	edit: function(pid, sid, callback)
	{
		var params = {};
        params.pid = pid;
        params.sid = sid;
		return this.request('edit', params, callback);
	},

	list: function(pid, callback)
	{
		var params = {};
        params.pid = pid;
		return this.request('list', params, callback);
	},

	remove: function(pid, sid, callback)
	{
		var params = {};
        params.pid = pid;
        params.sid = sid;
		return this.request('remove', params, callback);
	},

	save: function(pid, sid, statistic, callback)
	{
		var params = {};
        params.pid = pid;
        params.sid = sid;
        params.statistic = statistic;
		return this.request('save', params, callback);
	},

	use: function(pid, sid, callback)
	{
		var params = {};
        params.pid = pid;
        params.sid = sid;
		return this.request('use', params, callback);
	}
});
