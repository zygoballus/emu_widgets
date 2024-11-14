IMu.Request.User = IMu.Request.Handler.extend
({
	_construct: function()
	{
		var self = this;

		self._super();

		self.name = 'User';
		self.irn = undefined;
	},

	addEntry: function(module, key, group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.module = module;
		params.key = key;
		if (group)
			params.group = group;
		return self.request('addEntry', params, callback);
	},
	
	addEntries: function(entries, group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.entries = entries;
		if (group)
			params.group = group;
		return self.request('addEntries', params, callback);  
	},

	addGroup: function(name, callback)
	{
		var self = this;

		// name is optional
		if (typeof(name) == 'function')
		{
			callback = name;
			name = undefined;
		}

		var params = self.makeParams();
		if (name)
			params.name = name;
		return self.request('addGroup', params, callback);
	},

	fetch: function(irn, name, callback)
	{
		var self = this;

		// irn and name are optional
		if (typeof(irn) == 'function')
		{
			callback = irn;
			irn = undefined;
			name = undefined;
		}
		else if (typeof(name) == 'function')
		{
			callback = name;
			name = undefined;
		}

		var params = self.makeParams();
		if (irn)
			params.irn = irn;
		if (name)
			params.name = name;
		return self.request('fetch', params, callback);
	},

	removeEntry: function(module, key, group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.module = module;
		params.key = key;
		if (group)
			params.group = group;
		return self.request('removeEntry', params, callback);
	},

	removeEntries: function(entries, group, callback)
	{
		var self = this;
		
		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.entries = entries;
		if (group)
			params.group = group;
		return self.request('removeEntries', params, callback);
	},

	removeAllEntries: function(group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		if (group)
			params.group = group;
		return self.request('removeAllEntries', params, callback);
	},

    removeGroup: function(group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		if (group)
			params.group = group;
		return self.request('removeGroup', params, callback);
	},

	renameGroup: function(name, group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.name = name;
		if (group)
			params.group = group;
		return self.request('renameGroup', params, callback);
	},

	selectGroup: function(group, callback)
	{
		var self = this;

		var params = self.makeParams();
		if (group)
			params.group = group;
		return self.request('selectGroup', params, callback);
	},

	toggleEntry: function(module, key, group, callback)
	{
		var self = this;

		// group is optional
		if (typeof(group) == 'function')
		{
			callback = group;
			group = undefined;
		}

		var params = self.makeParams();
		params.module = module;
		params.key = key;
		if (group)
			params.group = group;
		return self.request('toggleEntry', params, callback);
	},

        toggleEntries: function(entries, group, callback)
        {
                var self = this;

                // group is optional
                if (typeof(group) == 'function')
                {
                        callback = group;
                        group = undefined;
                }

                var params = self.makeParams();
                params.entries = entries;
                if (group)
                        params.group = group;
                return self.request('toggleEntries', params, callback);
        },

	// Private
	makeParams: function()
	{
		var self = this;

		var params = {};
		if (self.irn)
			params.irn = self.irn;
		return params;
	},

	request: function(method, params, callback)
	{
		var self = this;

		/* This looks a little odd but allows for both asynchronous and
		** synchronous ajax.
		*/
		var result = undefined;
		self._super(method, params, function(data)
		{
			if (data.irn)
				self.irn = data.irn;

			result = data;

			if (callback)
				callback(result);
		});
		return result;
	}
});
