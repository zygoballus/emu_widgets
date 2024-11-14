IMu.Request.Modules = IMu.Request.Handler.extend
({
	_construct: function()
	{
		this._super();

		this.name = 'Modules';
	},

	addFetchSet: function(name, set, callback)
	{
		var params = {};
		params.name = name;
		params.set = set;
		return this.request('addFetchSet', params, callback);
	},

	addFetchSets: function(sets, callback)
	{
		return this.request('addFetchSet', sets, callback);
	},

	addSearchAlias: function(name, set, callback)
	{
		var params = {};
		params.name = name;
		params.set = set;
		return this.request('addSearchAlias', params, callback);
	},

	addSearchAliases: function(sets, callback)
	{
		return this.request('addSearchAliases', sets, callback);
	},

	addSortSet: function(name, set, callback)
	{
		var params = {};
		params.name = name;
		params.set = set;
		return this.request('addSortSet', params, callback);
	},

	addSortSets: function(sets, callback)
	{
		return this.request('addSortSets', sets, callback);
	},

	fetch: function(flag, offset, count, columns, callback)
	{
		// columns is optional
		if (typeof(columns) == 'function')
		{
			callback = columns;
			columns = undefined;
		}
		var params = {};
		params.flag = flag;
		params.offset = offset;
		params.count = count;
		params.columns = columns;
		return this.request('fetch', params, callback);
	},

	fetchMany: function(list, columns, callback)
	{
		// columns is optional
		if (typeof(columns) == 'function')
		{
			callback = columns;
			columns = undefined;
		}

		var params = {};
		params.list = list;
		params.columns = columns;
		return this.request('fetchMany', params, callback);
	},

	findAttachments: function(table, columns, key, callback)
	{
		var params = {};
		params.table = table;
		params.columns = columns;
		params.key = key;
		return this.request('findKey', params, callback);
	},

	findKeys: function(keys, include, callback)
	{
		// include is optional
		if (typeof(include) == 'function')
		{
			callback = include;
			include = undefined;
		}

		var params = {};
		params.keys = keys;
		if (include)
			params.include = include;
		return this.request('findKeys', params, callback);
	},

	findTerms: function(terms, include, callback)
	{
		// include is optional
		if (typeof(include) == 'function')
		{
			callback = include;
			include = undefined;
		}

        if (terms instanceof IMu.Terms)
            terms = terms.toArray();

		var params = {};
		params.terms = terms;
		if (include)
			params.include = include;
		return this.request('findTerms', params, callback);
	},

	getAllHits: function(callback)
	{
		return this.request('getAllHits', undefined, callback);
	},

	sort: function(set, flags, callback)
	{
		// flags is optional
		if(typeof(flags) == 'function')
		{
			callback = flags;
			flags = undefined;
		}

		var params = {};
		params.set = set;
		params.flags = flags;

		return this.request('sort', params, callback);
	},

	requestData: function()
	{
		var data = this._super();

		return data;
	}
});
