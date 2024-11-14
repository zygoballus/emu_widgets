IMu.Themes =
{
	shared: undefined,

	registered: {},
	current: undefined,

	add: function(name)
	{
        var theme = new IMu.Theme(name);
        this.registered[name] = theme;
        return theme;
    },

    get: function(name)
    {
        return this.registered[name];
    },

	select: function(name, callback)
	{
		IMu.log('Themes.select: name {0}', name);
		if (this.current && this.current.name == name)
		{
			IMu.log('Themes.select: already selected');
            if (callback)
                callback();
			return;
		}

		var theme = this.registered[name];
		if (! theme)
			throw new IMu.Error('ThemesUnknownTheme', name);

		if (this.current)
		{
			this.current.deactivate();
			this.current = undefined;
		}
//		this.shared.activate();
//      theme.load(function()
//      {
            this.current = theme;
            this.current.activate();
            if (callback)
                callback();
//      });
	},

	// convenience
	string: function(id)
	{
		var string = this.current.strings.get(id);
		if (! string)
        {
            string = this.shared.strings.get(id);
            if (! string)
                string = id;
        }
        if (arguments.length > 1)
        {
            var params = Array.prototype.slice.call(arguments, 1);
            string = IMu.Format.formatParams(string, params);
        }
		return string;
	},

	// private
	update: function()
	{
//		this.shared.update();
        if (this.current)
            this.current.update();
	}
};

/* ... for convenience */
IMu.string = function(id)
{
	return IMu.Themes.string(id);
};
IMu.Events.bind('dom-orientationchange', function(name)
{
	IMu.Themes.update();
});
IMu.Events.bind('language-changed', function(name)
{
	IMu.Themes.update();
});

IMu.Theme = IMu.Class.create
({
	_construct: function(name)
	{
		this.name = name;

		this.strings = new IMu.Theme.Strings(this);
		this.css = new IMu.Theme.CSS(this);
		this.views = new IMu.Theme.Views(this);
	},

    load: null,

	activate: function()
	{
		this.css.activate();
		if (this.name != 'shared')
			IMu.Events.trigger('theme-activated', this);
	},

	deactivate: function()
	{
		this.css.deactivate();
		if (this.name != 'shared')
			IMu.Events.trigger('theme-deactivated', this);
	},

	initialise: function()
	{
	},

	update: function()
	{
		this.css.activate();
	}
});

IMu.Theme.Strings = IMu.Class.create
({
	_construct: function(theme)
	{
		this.theme = theme;
		this.set = {};
	},

	get: function(id)
	{
		if (! (id in this.set))
			return undefined;
		var lang = IMu.Languages.current.code;
		if (! (lang in this.set[id]))
            lang = lang.replace(/-[A-Z]+$/, "");    //try non-region specific
		if (! (lang in this.set[id]))
			return undefined;
		return this.set[id][lang];
	},

	register: function(set)
	{
		for (var id in set)
		{
			if (! this.set[id])
				this.set[id]  = {};
			for (var lang in set[id])
				this.set[id][lang] = set[id][lang];
		}
	}
});

IMu.Theme.CSS = IMu.Class.create
({
	_construct: function(theme)
	{
		this.theme = theme;
	},

	activate: function()
	{
        var links = jQuery('link[href*="/themes/"]');
        var pattern = /\/themes\/([a-z]+)\/css\/([^\/]+)$/;
        var sheets = [];
        for (var i = 0; i < links.length; i++)
        {
            var link = jQuery(links[i]);
            var href = link.attr('href');
            var match = href.match(pattern);
            if (! match)
                continue;
            var sheet =
            {
                link: link,
                href: href,
                theme: match[1],
                file: match[2],
                disabled: true
            };
            sheets.push(sheet);
        }
        IMu.log('Found {0} IMu-related stylesheets', sheets.length);

        var dirs = /\b(ltr|rtl)\./;
        var languages = /\b(ar|en|fr)\./;
        var orientations = /\b(landscape|portrait)\./;
        for (var i = 0; i < sheets.length; i++)
        {
            var sheet = sheets[i];

            if (sheet.theme != this.theme.name)
                continue;

            var match = sheet.file.match(dirs);
            if (match && match[1] != IMu.Languages.current.dir)
                continue;

            var match = sheet.file.match(languages);
            if (match && match[1] != IMu.Languages.current.code)
                continue;

            var match = sheet.file.match(orientations);
            if (match && match[1] != IMu.Platform.window.orientation.name)
                continue;

            sheet.disabled = false;
        }

        var enabled = 0;
        for (var i = 0; i < sheets.length; i++)
        {
            var sheet = sheets[i];
            sheet.link[0].disabled = sheet.disabled;
            IMu.log('{0}abling {1}', (sheet.disabled ? 'Dis' : 'En'), sheet.href);
            if (! sheet.disabled)
                enabled++;
        }
        IMu.log('Enabled {0} IMu-related stylesheets', enabled);
	},

	deactivate: function()
	{
        // do nothing as activate will take care of it?
	}
});

IMu.Theme.Views = IMu.Class.create
({
	_construct: function(theme)
	{
		this.theme = theme;
		this.set = {};
	},

	register: function(name)
	{
        IMu.log('{0}: Theme.Views.register: name {1}', this.theme.name, name);
        var entry = this.set[name];
		if (! entry)
        {
            entry = this.set[name] = {};
            entry.requires = {};
            entry.methods = [];
        }

        var index = 1;

        while (index < arguments.length)
        {
            if (! IMu.Type.isString(arguments[index]))
                break;
            var require = arguments[index++];
            entry.requires[require] = true;
        }

        while (index < arguments.length)
        {
            if (! IMu.Type.isObject(arguments[index]))
                break;
            var info = arguments[index++];
            for (var device in info)
            {
                if (device != 'all' && ! IMu.Platform.device.is[device])
                    continue;

                entry.methods.push(info[device]);

                /* Attach the full method name to the method!
                ** This is very useful for debugging in getMethods (see above).
                */
                var _method = info._source + '.' + device;
                for (var method in info[device])
                    info[device][method]._method = _method + '.' + method;
            }
        }
	}
});
