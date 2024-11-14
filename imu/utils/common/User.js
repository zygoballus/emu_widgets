IMu.User =
{
    loaded: false,

	irn: undefined,
	groups: [],
	index: -1,
    count: 0,
	group: undefined,

	handler: undefined,

	load: function(callback)
	{
		var self = this;

		if (self.loaded)
		{
			if (callback)
				callback();
			return;
		}

        /*
        ** Use user IRN from URL if supplied.
        */
        var user = IMu.URL.Hash.get('user');
        if (user)
            self.irn = user;
        else
            self.irn = IMu.Cookies.get().values.user;
		IMu.log('User.load: irn {0}', self.irn);
		if (! self.irn)
		{
			/* Create a fake group
			**
			** This avoids creating records in ewebusers and ewebgroups
			** for a casual user.
			*/
			var group = self.newGroup();
			group.name = self.allocateName();
			self.groups = [ group ];
			self.index = 0;
			self.group = group;

            self.loaded = true;
			self.notify();
			if (callback)
				callback();
			return;
		}

		/* Load real user information */
		var handler = self.getHandler();
		handler.fetch(self.irn, function(data)
		{
            self.loaded = true;
			self.process(data, callback);
		});
	},

	addEntries: function(values, callback)
	{
		var self = this;
		
		self.initialise(function()
		{
            var entries = [];

            for (var i = 0; i < values.length; i++)
            {
                var entry = values[i];
                if (IMu.Type.isString(entry))
                    var entry = entry.split(/[.:]/);
                if (IMu.Type.isArray(entry))
                {
                    entries.push(
                    {
                        'module': entry[0],
                        'key': entry[1]
                    });
                }
                else if (IMu.Type.isObject(entry))
                    entries.push(entry);
            }

            var handler = self.getHandler();
            handler.addEntries(entries, function(data)
            {
                self.process(data, callback);
            });
		});
	},

	addEntry: function(module, key, callback)
	{
		var self = this;

		self.initialise(function()
		{
			var handler = self.getHandler();
			handler.addEntry(module, key, function(data)
			{
				self.process(data, callback);
			});
		});
	},

	addGroup: function(callback)
	{
		var self = this;

		self.initialise(function()
		{
			var handler = self.getHandler();
			var name = self.allocateName();
			handler.addGroup(name, function(data)
			{
				self.process(data, callback);
			});
		});
	},

    hasEntry: function(module, key)
    {
        if (! this.group)
            return false;

        var entries = this.group.entries;
        for (var i = 0; i < entries.length; i++)
        {
            var entry = entries[i];
            if (entry.module != module)
                continue;
            if (entry.key != key)
                continue;
            return true;
        }
        return false;
    },

	nextGroup: function(callback)
	{
		var self = this;

		var index = self.index + 1;
		while (index >= self.groups.length)
			index -= self.groups.length;
		self.setGroup(index, callback);
	},

	removeEntries: function(values, callback)
	{
            var entries = [];

            for (var i = 0; i < values.length; i++)
            {
                var entry = values[i];
                if (IMu.Type.isString(entry))
                    var entry = entry.split(/[.:]/);
                if (IMu.Type.isArray(entry))
                {
                    entries.push(
                    {
                        'module': entry[0],
                        'key': entry[1]
                    });
                }
                else if (IMu.Type.isObject(entry))
                    entries.push(entry);
            }

            var handler = self.getHandler();
            handler.removeEntries(entries, function(data)
            {
                self.process(data, callback);
            });
	},

	removeEntry: function(module, key, callback)
	{
		var self = this;

		self.initialise(function()
		{
			var handler = self.getHandler();
			handler.removeEntry(module, key, function(data)
			{
				self.process(data, callback);
			});
		});
	},

    removeAllEntries: function(group, callback)
    {
        var self = this;

        self.initialise(function()
        {
            var handler = self.getHandler();
            handler.removeAllEntries(group, function(data)
            {
                self.process(data,callback);
            });
        });
    },

	removeGroup: function(callback)
	{
		var self = this;

		var handler = self.getHandler();
		handler.removeGroup(function(data)
		{
			self.process(data, callback);
		});
	},

	renameGroup: function(name, callback)
	{
		var self = this;

        var handler = self.getHandler();
        var group = self.group || {};

		handler.renameGroup(name, group.irn, function(data)
		{
			self.process(data, callback);
		});
	},

	previousGroup: function(callback)
	{
		var self = this;

		var index = self.index - 1;
		while (index < 0)
			index += self.groups.length;
		self.setGroup(index, callback);
	},

	selectGroup: function(irn, callback)
	{
		var self = this;

		var handler = self.getHandler();
		handler.selectGroup(irn, function(data)
		{
			self.process(data, callback);
		});
	},

	setGroup: function(index, callback)
	{
		var self = this;

		if (index >= 0 && index < self.groups.length)
			self.selectGroup(self.groups[index].irn, callback);
	},

	toggleEntry: function(module, key, callback)
	{
		var self = this;

		self.initialise(function()
		{
			var handler = self.getHandler();
			handler.toggleEntry(module, key, function(data)
			{
				self.process(data, callback);
			});
		});
	},

        toggleEntries: function(entries, callback)
        {
                var self = this;

                self.initialise(function()
                {
                        var handler = self.getHandler();
                        handler.toggleEntries(entries, function(data)
                        {
                                self.process(data, callback);
                        });
                });
        },

	// Private
	allocateName: function()
	{
		var self = this;

		var base = IMu.string('common-my-collection');
		var name = undefined;
		for (var i = 0; ; i++)
		{
			name = base;
			if (i > 0)
				name += ' (' + (i + 1) + ')';
			var found = false;
			for (var j = 0; j < self.groups.length; j++)
			{
				if (self.groups[j].name == name)
				{
					found = true;
					break;
				}
			}
			if (! found)
				break;
		}
		return name;
	},

	getHandler: function()
	{
		var self = this;

		if (! self.handler)
			self.handler = new IMu.Request.User();
		return self.handler;
	},

	initialise: function(callback)
	{
		var self = this;

		if (self.irn)
		{
			if (callback)
				callback();
			return;
		}
		var handler = self.getHandler()
		handler.fetch(undefined, self.group.name, function(data)
		{
			self.update(data);
			if (callback)
				callback();
		});
	},

	newGroup: function()
	{
		var self = this;

		var group =
		{
			name: undefined,
			irn: undefined,
			entries: []
		};
		return group;
	},

	notify: function()
	{
		var self = this;

IMu.log('notify: collection-changed');
		IMu.Events.trigger('collection-changed');
	},

	process: function(data, callback)
	{
		var self = this;

		self.update(data);
		self.notify();
		if (callback)
			callback();
	},

	update: function(data)
	{
		var self = this;

		IMu.log('User.update: data {0}', data);
		if (self.irn != data.irn)
		{
			self.irn = data.irn;
			var cookie = IMu.Cookies.get();
			cookie.values.user = self.irn;
			cookie.save(IMu.Config.userCookieDuration);
		}
		self.groups = [];
		self.index = -1;
		self.group = undefined;
		for (var i = 0; i < data.groups.length; i++)
		{
			var group = self.newGroup();
			group.name = data.groups[i].GroupName;
			group.irn = data.groups[i].irn;
			group.entries = data.groups[i].entries;
			self.groups.push(group);
			if (group.irn == data.DefaultGroupRef)
			{
				self.index = i;
				self.group = group;
                self.count = 0;
			}
		}
        if (self.index == -1)
        {
            /* No group found. Create one.
            ** The self.count allows us to avoid an infinite loop
            ** if there are errors creating the group. It is reset
            ** when we successfully access the default group.
            */
            if (self.count++ == 0)
                self.addGroup(); 
        }
	}
};
