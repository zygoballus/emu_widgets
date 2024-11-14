IMu.URL =
{
    base: undefined,
    path: undefined,
    search: undefined,
    params: {},

    /*!
    ** Parses and extracts values from a string formatted as a
    ** conventional GET URL.
    **
    ** @param string string
    **   The string to extract values from.
    */
	decode: function(string)
	{
		var values = {};
		if (string)
		{
			var parts = string.split('&');
			var plus = /\+/g;
			for (var i = 0; i < parts.length; i++)
			{
				var name = parts[i];
				var value = '';
				var index = name.indexOf('=');
				if (index >= 0)
				{
					value = name.substr(index + 1);
					name = name.substr(0, index);
				}
                name = window.decodeURIComponent(name);
                value = window.decodeURIComponent(value);
                if (values[name] === undefined)
                    values[name] = value;
                else if (! IMu.Type.isArray(values[name]))
                    values[name] = [ values[name], value ];
                else
                    values[name].push(value);
			}
		}
		return values;
	},

    encode: function(values)
    {
        var string = '';
        for (var name in values)
        {
            var value = values[name];
            name = window.encodeURIComponent(name);
            value = window.encodeURIComponent(value);
            if (string)
                string += '&';
            string += name + '=' + value;
        }
        return string;
    }
};

(function()
{
    var m = window.location.href.match(/^([^\?]*)\?(.*$)/);
    if (m)
    {
        IMu.URL.base = m[1];
        IMu.URL.search = m[2];
    }
    else
    {
        IMu.URL.base = window.location.href;
        IMu.URL.search = '';
    }
    IMu.URL.path = IMu.URL.base.replace(/\/[^\/]*$/, '');
    IMu.URL.params = IMu.URL.decode(IMu.URL.search);

    IMu.log('URL.base {0}', IMu.URL.base);
    IMu.log('URL.path {0}', IMu.URL.path);
    IMu.log('URL.params {0}', IMu.URL.params);
})();

IMu.URL.Hash =
{
    complete: false,
	ignore: false,
	values: {},

    /*!
    */
    clear: function()
    {
        this.values = {};

        this.update();
    },

    /*!
    */
	get: function(name)
	{
		return this.values[name];
	},

    /*!
    */
	has: function(name)
	{
		return name in this.values;
	},

    /*!
    */
	set: function(name, value)
	{
		if (value === undefined)
			delete this.values[name];
		else
			this.values[name] = value;

        this.update();
    },

    setValue: function(name, value)
    {
        if (value === undefined)
            delete this.values[name];
        else
            this.values[name] = value;
    },

	// private
	load: function()
	{
        IMu.log('loading hash');
		if (this.ignore)
        {
            IMu.log('ignore set');
			this.ignore = false
            return;
        }

        this.values = {};
        var hash = IMu.Object.copy(window.location.hash);
        if (this.complete)
            hash = hash.replace(/^#/, '');
        else
        {
            var matches = hash.match(/imu\[(.*?)\]/);
            if (matches)
                hash = matches[1];
        }
        IMu.log('raw hash "{0}"', hash);
        this.values = IMu.URL.decode(hash);

        IMu.Events.trigger('hash-loaded', IMu.Object.copy(this.values));
	},
    getUrl: function()
    {
		var string = '';
		for (var name in this.values)
		{
			if (string != '')
				string += '&';

            if (this.values[name] != '')
    		    string += name + '=' + window.encodeURIComponent(this.values[name]);
            else
    			string += name; // for pages that don't need names, eg register-user
		}

        var hash;
        if (this.complete)
            hash = string;
        else
        {
            if (string != '')
                string = 'imu[' + string + ']';

            hash = window.location.hash;
            IMu.log('hash (1) {0}', hash);
            if (hash.match(/imu\[/))
                hash = hash.replace(/imu\[(.*?)\]/, string);
            else if (string != '')
                hash += string;
            else
                return '';
        }
        return hash;
    },

    update: function(callback)
    {
        var self = this;
        var hash = self.getUrl();
        if (hash === '')
            return;
		this.ignore = true;
		window.location.hash = hash;

        if (callback)
            callback(hash);
	},

    /*!
    ** Updates the URL with the values from the search parameters.
    **
    ** @param params object
    **   The search terms.
    **
    ** @param include array
    **   The modules searched across, searches all if not specified.
    **
    ** @param id string
    **   The handler id.
    **
    ** @param view string
    **   The view eg list, lightbox or details view.
    */
    updateURLHashValues: function(params, include, id, view)
    {
        if (IMu.Type.isArray(params.list))
        {
            IMu.URL.Hash.values = {};

            /* Set view if not defined
            */
            if (!view)
                IMu.URL.Hash.setValue('view', 'list');
            else
                IMu.URL.Hash.setValue('view', view);

            /* Set handler id
            */
            if (id)
                IMu.URL.Hash.setValue('id', id);

            /* Set query modules
            */
            var modules = '';
            if (IMu.Type.isArray(include))
            {
                for (var i = 0; i < include.length; i++)
                {
                    if (modules)
                        modules += ';';
                    modules += include[i];
                }
                IMu.URL.Hash.setValue('modules', modules);
            }

            /* Set terms
            */
            for (var i = 0; i < params.list.length; i++)
            {
                var term = params.list[i][1];

                if (term)
                    IMu.URL.Hash.setValue(params.list[i][0], term);
            }
            IMu.URL.Hash.update();
        }
    }
};
(function()
{
    IMu.URL.Hash.load();
    jQuery(window).hashchange(function(e)
    {
        IMu.log('raw hashchange event');
        IMu.URL.Hash.load();
    });
}).apply(IMu.URL.Hash);
