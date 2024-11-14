IMu.Request.Projects.Editors = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Projects/Editors';
	},

	edit: function(pid, eid, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
		return this.request('edit', params, callback);
	},

	fetchDestination: function(pid, eid, term, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
        params.term = term;
		return this.request('fetchDestination', params, callback);
	},

	fetchSource: function(pid, eid, term, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
        params.term = term;
		return this.request('fetchSource', params, callback);
	},

	list: function(pid, callback)
	{
		var params = {};
        params.pid = pid;
		return this.request('list', params, callback);
	},

	remove: function(pid, eid, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
		return this.request('remove', params, callback);
	},

	save: function(pid, eid, editor, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
        params.editor = editor;
		return this.request('save', params, callback);
	},

	update: function(pid, eid, keys, value, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
        params.keys = keys;
        params.value = value;
		return this.request('update', params, callback);
	},

	use: function(pid, eid, callback)
	{
		var params = {};
        params.pid = pid;
        params.eid = eid;
		return this.request('use', params, callback);
	}
});
