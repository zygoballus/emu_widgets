IMu.Request.Projects.Forms = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Projects/Forms';
	},

	edit: function(pid, fid, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
		return this.request('edit', params, callback);
	},

	fetch: function(pid, fid, info, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
        params.info = info;
		return this.request('fetch', params, callback);
	},

	list: function(pid, callback)
	{
		var params = {};
        params.pid = pid;
		return this.request('list', params, callback);
	},

	remove: function(pid, fid, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
		return this.request('remove', params, callback);
	},

	save: function(pid, fid, form, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
        params.form = form;
		return this.request('save', params, callback);
	},

	search: function(pid, fid, terms, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
        params.terms = terms;
		return this.request('search', params, callback);
	},

	store: function(pid, fid, info, values, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
        params.info = info;
        params.values = values;
		return this.request('store', params, callback);
	},

	use: function(pid, fid, callback)
	{
		var params = {};
        params.pid = pid;
        params.fid = fid;
		return this.request('use', params, callback);
	}
});
