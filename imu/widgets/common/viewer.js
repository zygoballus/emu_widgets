/*!
** Base widget for all widgets which display records from a result set.
**
** @since 2.0
*/
IMu.Widgets.add('viewer', 'base',
{
	_construct: function()
	{
		this._super.apply(this, arguments);

		this.registerOptions
		({
            /*!
            ** Called when a record has been selected.
            **
            ** Usually used to allow a switch from a summary view
            ** such as **list** or **lightbox** to a more detailed
            ** view such as **details**
            **
            ** @param rid string
            **   The id of the record selected. 
            **   An rid is of the form *module*:*irn*
            */
			onRecordSelected: undefined,

			onRecordToggled: undefined
		});

		this.search = undefined;
		this.hits = undefined;

        this.states = [];
        this.index = -1;
	},

	// public
	dropSearch: function()
	{
		if (this.view)
			this.view.dropSearch();
		this.destroySearch();
	},

	getOffset: function()
	{
//		return this.view.getOffset();
        return this.offset;
	},

	setOffset: function(offset)
	{
		if (offset === undefined)
			offset = 0;
		if (this.view)
			this.view.setOffset(offset);
        this.offset = offset;
	},

    /* TODO: 
    **
    ** Code migrated from search-sort widget.
    **
    ** Combined-viewer's inherited function uses callback param
    ** to then update it's views.
    **
    ** Not entirely sure if this function is ok as is for a base or if it needs 
    ** reworking.
    **
    ** -phil
    */
    updateSortSet: function(sortSet, flags, callback)
    {
        var self = this;
        if (! self.search)
            return;

        if (typeof(flags) == 'function')
        {
            callback = flags;
            flags = ['report', 'full-text'];
        }
        else if (flags === undefined)
            flags = ['report', 'full-text'];
        else if (typeof(flags) == 'object')
        {
            flags.push("report");
            flags.push("full-text");
        }
        
        var sortName = 'summary';
        self.search.addSortSet(sortName, sortSet, function()
        {
            self.search.sort(sortName, flags, function(result)
            {
                var search = self.search;
                self.dropSearch();
                self.showSearch(search);

                self.offset = undefined;
                self.setOffset(0);

                if (callback && typeof(callback) == 'function')
                    callback(result);
            });
        });
    },

    showRecord: function(module, key)
    {
        var self = this;

        if (self.controller && ('showRecord' in self.controller))
        {
            self.controller.showRecord(module, key);
            return;
        }

        if (key == undefined)
        {
            var a = module.split(/[.:]/);
            if (a.length < 2)
                return;
            module = a[0];
            key = a[1];
        }

        var keys = [ [module, key] ];
        var search = new IMu.Request.Search();
        search.findKeys(keys, [module], function(hits)
        {
            self.addState(search, 0);
        });
    },

	showSearch: function(search, offset)
	{
		if (this.search != search)
		{
			this.dropSearch();
			this.setSearch(search);
			this.offset = undefined;
		}
		else
			this.view.resize();

		this.setOffset(offset);
	},

    // maintaining state
    addState: function(search, offset)
    {
        var states = [];
        for (var i = 0; i <= this.index; i++)
            states.push(this.states[i]);
        this.states = states;

        if (this.states.length > 0)
        {
            var state = this.states[this.states.length - 1];
            state.offset = this.getOffset();
        }

        var state =
        {
            search: search,
            offset: offset
        };
        this.states.push(state);
        this.index = this.states.length - 1;

        this.showState();
    },

    prevState: function()
    {
        if (! this.index)
            return;

        var state = this.states[--this.index];
//        state.offset = this.getOffset();

        this.showState();
        if (state.offset)
            this.setOffset(state.offset);
    },

    nextState: function()
    {
        if (this.index < this.states.length - 1)
        {
            var state = this.states[this.index++];
            state.offset = this.getOffset();

            this.showState();
        }
    },

    showState: function()
    {
        var state = this.states[this.index];
        this.showSearch(state.search, state.offset);
    },

	// view methods
	recordSelected: function(rid, offset)
	{
		var self = this;

		IMu.log('recordSelected: {0} (offset {1})', rid, offset);
		if (self.options.onRecordSelected)
			self.options.onRecordSelected.call(self, rid, offset);
	},

	recordToggled: function(rid, on)
	{
		var self = this;

		IMu.log('recordToggled: {0} {1}', rid, (on ? 'on' : 'off'));
		var parts = rid.split(/[.:]/);
		IMu.User.load(function()
		{
			if (on)
				IMu.User.addEntry(parts[0], parts[1]);
			else
				IMu.User.removeEntry(parts[0], parts[1]);

			if (self.options.onRecordToggled)
				self.options.onRecordToggled.call(self, rid, on);
		});
	},

	updateOffset: function(offset)
	{
		if (this.offset != offset)
		{
			IMu.log('updateOffset: {0}', offset);
			this.offset = offset;
			if (this.options.useURL)
            {
                var complete = IMu.URL.Hash.complete;
                IMu.URL.Hash.complete = true;

				IMu.URL.Hash.set('offset', this.offset);
                
                IMu.URL.Hash.complete = complete;
            }
		}
	},

	// protected
	destroySearch: function()
	{
		if (this.search)
        {
            this.search.onComplete = undefined;
			this.search = undefined;
        }
	},

	setSearch: function(search)
	{
		this.search = search;
		this.hits = this.search.hits.total;
		if (this.view)
			this.view.setSearch(search);
	}
});
