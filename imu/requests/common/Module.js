IMu.Request.Module = IMu.Request.Handler.extend
({
    _construct: function(table)
    {
        this._super();

        this.name = 'Module';

        this.table = table;
    },

    fetch: function(flag, offset, count, columns, reload, callback)
    {
        // columns is optional
        if (typeof(columns) == 'function')
        {
            callback = columns;
            columns = undefined;
            reload = undefined;
        }
        // reload is optional
        if (typeof(reload) == 'function')
        {
            callback = reload;
            reload = undefined;
        }

        var params = {};
        params.flag = flag;
        params.offset = offset;
        params.count = count;
        params.columns = columns;
        params.reload = reload;
        return this.request('fetch', params, callback);
    },

    fetchHierarchy: function(key, parent, options, callback)
    {
        // options is optional
        if (typeof(options) == 'function')
        {
            callback = options;
            options = undefined;
        }
        var params = {};
        params.key = key;
        params.parent = parent;
        params.options = options;
        return this.request('fetchHierarchy', params, callback);
    },

    findKey: function(key, callback)
    {
        var params = {};
        params.key = key;
        return this.request('findKey', params, callback);
    },

    findKeys: function(keys, callback)
    {
        var params = {};
        params.keys = keys;
        return this.request('findKeys', params, callback);
    },

    findTerms: function(terms, options, callback)
    {
        // options is optional (duh!)
        if (typeof(options) == 'function')
        {
            callback = options;
            options = undefined;
        }

        if (terms instanceof IMu.Terms)
            terms = terms.toArray();

        var params = {};
        params.terms = terms;
        if (options)
            params.options = options;
        return this.request('findTerms', params, callback);
    },

    /* Inserts a new record into a module.
    **
    ** @param values
    **   A hash of values to be entered into the new record.
    **
    ** @param columns
    **   An array of columns to be fetched from the newly inserted record.
    **
    ** @param callback
    **   The function to be called after insertion.
    */
    insert: function(values, columns, callback)
    {
        // columns is optional
        if (typeof(columns) == 'function')
        {
            callback = columns;
            columns = undefined;
        }
        var params = {};
        params.values = values;
        params.columns = columns;
        return this.request('insert', params, callback);
    },

    sort: function(columns, flags, callback)
    {
        // flags is optional
        if (typeof(flags) == 'function')
        {
            callback = flags;
            flags = undefined;
        }

        var params = {};
        params.columns = columns;
        params.flags = flags;

        return this.request('sort', params, callback);
    },

    setMatchLimit: function(limit)
    {
        return this.request('setMatchLimit', limit);
    },

    update: function(flag, offset, count, values, columns, callback)
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
        params.values = values;
        params.columns = columns;
        return this.request('update', params, callback);
    },

    updateMany: function(list, values, columns, callback)
    {
        // columns is optional
        if (typeof(columns) == 'function')
        {
            callback = columns;
            columns = undefined;
        }
        var params = {};
        params.list = list;
        params.values = values;
        params.columns = columns;
        return this.request('updateMany', params, callback);
    },

    requestData: function()
    {
        var data = this._super();

        data.table = this.table;

        return data;
    }
});
