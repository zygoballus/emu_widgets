IMu.Request.Search = IMu.Request.Modules.extend
({
    _construct: function()
    {
        var self = this;

        self._super();

        self.name = 'Search';
        self.hits = null;
    },

    fetchMany: function(list, columns, callback)
    {
        var self = this;

        // columns is optional
        if (typeof(columns) == 'function')
        {
            callback = columns;
            columns = undefined;
        }

        /* This looks a little odd but allows for both asynchronous and
        ** synchronous ajax.
        */
        var result = undefined;
        self._super(list, columns, function(data)
        {
//          IMu.log('fetchMany: data {0}', data);

            /* Calculate offsets */
            for (var i = 0; i < data.rows.length; i++)
            {
                var row = data.rows[i];

//              IMu.log('fetchMany: source {0} index {1} rownum {2}',
//                  row.source, row.index, row.rownum);

//              row.rid = row.source + ':' + row.irn;
                row.rid = row.source + '.' + row.irn;
                IMu.log('fetchMany: rid {0}', row.rid);

                var offset = 0;
                for (var j = 0; j < row.index; j++)
                {
                    var hits = self.hits.modules[j].hits;
                    if (hits > 0)
                        offset += hits;
                }
                offset += row.rownum - 1;
                row.offset = offset;
//              IMu.log('fetchMany: offset {0}', row.offset);
            }

            result = data;

            if (callback)
                callback(result);
        });
        return result;
    },

    findKey: function(key, include, callback)
    {
        var self = this;

        // include is optional
        if (typeof(include) == 'function')
        {
            callback = include;
            include = undefined;
        }

        var params = {};
        params.key = key;
        if (include)
            params.include = include;

        return self.searchRequest('findKey', params, callback);
    },

    findKeys: function(keys, include, callback)
    {
        var self = this;

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

        return self.searchRequest('findKeys', params, callback);
    },

    newResultSet: function(columns, pageSize)
    {
        var self = this;

        return new IMu.Request.Search.ResultSet(self, columns, pageSize);
    },

    search: function(terms, include, callback)
    {
        var self = this;

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

        return self.searchRequest('search', params, callback);
    },

    searchRequest: function(method, params, callback)
    {
        var self = this;

        /* This looks a little odd but allows for both asynchronous and
        ** synchronous ajax.
        */
        var result = undefined;
        self.request(method, params, function(hits)
        {
            self.hits = hits;

            result = hits;

            if (callback)
                callback(result);
        });
        return result;
    },

    searchSavedSet: function(set, module, callback)
    {
        var self = this;

        var result = undefined;
        var params = { 'set': set, 'module': module };
        self.request('searchSavedSet', params, function(hits)
        {
            self.hits = hits;

            result = hits;

            if (callback)
                callback(result);
        });
        return result;
    }
});

IMu.Request.Search.ResultSet = IMu.Class.create
({
    _construct: function(search, columns, pageSize)
    {
        var self = this;

        self.name = 'ResultSet';

        self.search = search;
        self.columns = columns;
        self.pageSize = pageSize;
        if (! self.pageSize || self.pageSize < 1)
            self.pageSize = 1;
        self.data = {};
        self.waiting = {};
        self.queue = [];
        self.busy = false;
    },

    destroy: function()
    {
        var self = this;

        // detach from Search to avoid circular references
        self.search = undefined;

        self.columns = undefined;
        self.data = undefined;
        self.waiting = undefined;
        self.queue = undefined;
    },

    get: function(index, reload, callback)
    {
        var self = this;

        if (typeof(reload) == 'function')
        {
            callback = reload;
            reload = undefined;
        }
//      IMu.log('ResultSet.get: index {0}', index);

        var total = self.search.hits.total;

        if (index < 0 || index >= total)
        {
//          IMu.log('ResultSet.get: outside range');
            if (callback)
                callback(undefined);
            return;
        }

        var data;

        if (reload)
        {
            self.data[index] = undefined;
        }
        else
        {
            data = self.data[index];
            if (data)
            {
    //          IMu.log('ResultSet.get: data in cache');
                if (callback)
                    callback(data);
                return;
            }
        }

        var page = Math.floor(index / self.pageSize);
//      IMu.log('ResultSet.get: not in cache (page is {0})', page);
        if (! self.waiting[page])
        {
//          IMu.log('ResultSet.get: need to fetch page');

            /* Build list of rows to fetch */
            var start = page * self.pageSize;
//          IMu.log('ResultSet.get: page start {0}', start);
            var list = [];
            var offset = start;
            var count = 0;
            for (var i = 0; i < self.pageSize; i++)
            {
                var n = start + i;
                if (n >= total)
                    break;

                if (! self.data[n])
                    count++;
                else
                {
                    if (count > 0)
                        list.push({offset: offset, count: count});
                    offset = n + 1;
                    count = 0;
                }
            }
            if (count > 0)
                list.push({offset: offset, count: count});
//          IMu.log('ResultSet.get: list(1) [{0}] {1}', list.length, list);

            /* Tidy up the list */
            var copy = [];
            for (var i = 0; i < list.length; i++)
            {
                var entry = list[i];
                if (entry.offset >= total)
                    continue;
                if (entry.offset + entry.count > total)
                    entry.count = total - entry.offset;
                if (entry.count == 0)
                    continue;
                copy.push(entry);
            }
            list = copy;
//          IMu.log('ResultSet.get: list(2) [{0}] {1}', list.length, list);

            /* Add request to front of queue */
            var request =
            {
                list: list,
                page: page
            };
//          IMu.log('ResultSet.get: request {0}', request);
            self.queue.unshift(request);
//          IMu.log('ResultSet.get: queue size {0}', self.queue.length);

            self.waiting[page] = [];
        }
//      else
//          IMu.log('ResultSet.get: fetch pending');

//      IMu.log('ResultSet.get: adding callback');
        self.waiting[page].push({index: index, callback: callback});
//      IMu.log('ResultSet.get: page callback list length {0}',
//          self.waiting[page].length);

        if (self.queue.length > 0 && ! self.busy)
            self.processRequest();
    },

    /*!
    ** Gets the module of the record specified at the offset.
    **
    ** @param offset int
    **   The position of the record in the result set.
    **
    ** @returns string
    **   The module of the record at the offset.
    */
    getModule: function(offset)
    {
        var self = this;

        var count = 0;

        for (var i = 0; i < self.search.hits.modules.length; i++)
        {
            if (offset < self.search.hits.modules[i].hits + count)
            {
                IMu.log('getModule: module {0}',
                    self.search.hits.modules[i].name);
                return self.search.hits.modules[i].name;
            }
            else
                count += self.search.hits.modules[i].hits;  
        }
    },

    // Private
    processRequest: function()
    {
        var self = this;

        self.busy = true;

        var request = self.queue.shift();
//      IMu.log('ResultSet.processRequest: request {0}', request);
        var list = request.list;
        var page = request.page;
        self.search.fetchMany(list, self.columns, function(data)
        {
            // Check if the search has been destroyed in the interim?
            if (! self.search)
            {
                IMu.log('ResultSet: has been destroyed during AJAX call?');
                return;
            }

//          IMu.log('ResultSet.processRequest: fetched {0} rows',
//              data.rows.length);
            for (var i = 0; i < data.rows.length; i++)
            {
                var row = data.rows[i];
//              IMu.log('ResultSet.processRequest: adding row {0} to cache',
//                  row.offset);
                self.data[row.offset] = row;
            }

            var waiting = self.waiting[page];
//          IMu.log('ResultSet.processRequest: waiting {0}', waiting);
            for (var i = 0; i < waiting.length; i++)
            {
                var entry = waiting[i];
//              IMu.log('ResultSet.processRequest: calling {0}', entry);
                if (entry.callback)
                    entry.callback(self.data[entry.index]);
            }
            delete(self.waiting[page]);

            self.busy = self.queue.length > 0;
            if (self.busy)
                self.processRequest();
        });
    }
});
