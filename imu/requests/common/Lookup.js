IMu.Request.Lookup = IMu.Request.Handler.extend
({
	_construct: function()
	{
		var self = this;

		self._super();

		self.name = 'Lookup';
	},

	hierarchy: function(name, level, filter, callback)
	{
		var self = this;

		// level and keys are optional
		if (typeof(level) == 'function')
		{
			callback = level;
			level = undefined;
            filter = undefined;
		}
		else if (typeof(filter) == 'function')
		{
			callback = filter;
            filter = undefined;
		}
		var params = {};
		params.name = name;
		params.level = level;
		params.filter = filter;

		return this.request('hierarchy', params, callback);
	},
    lookup: function(name, level, keys, callback)
	{
		var self = this;

		// level and keys are optional
		if (typeof(level) == 'function')
		{
			callback = level;
			level = undefined;
			keys = undefined;
		}
		else if (typeof(keys) == 'function')
		{
			callback = keys;
			keys = undefined;
		}
		var params = {};
		params.name = name;
		params.level = level;
		params.keys = keys;
		return this.request('lookup', params, callback);
	},
    lookupAll: function(name, level, keys, callback)
	{
		var self = this;

		// level and keys are optional
		if (typeof(level) == 'function')
		{
			callback = level;
			level = undefined;
			keys = undefined;
		}
		else if (typeof(keys) == 'function')
		{
			callback = keys;
			keys = undefined;
		}
		var params = {};
		params.name = name;
		params.level = level;
		params.keys = keys;
		return this.request('lookupAll', params, callback);
	}

});
