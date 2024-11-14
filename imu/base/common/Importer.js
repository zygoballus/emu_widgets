(function()
{
    // Private members
    var $head = document.getElementsByTagName('head')[0];
    var $path = IMu.path;
    var $last = IMu.elem;

    var Import = IMu.Class.create
    ({
		/* The status of the importer.
		**
		** The numerical values of these flags are significant so do not
		** change them.
		*/
        ERROR: 0,
        UNLOADED: 1,
        LOADING: 2,
        LOADED: 3,

        _construct: function()
        {
            this.state = undefined;
            this.setState(this.UNLOADED);

            this.callbacks = [];
        },

        ready: function(callback)
        {
            this.callbacks.push(callback);
        },

        // protected
        setState: function(state, callback)
        {
            if (this.state !== undefined && this.state == state)
                return;

            this.state = state;
            this.error = this.state == this.ERROR;
            this.unloaded = this.state == this.UNLOADED;
            this.loading = this.state == this.LOADING;
            this.loaded = this.state == this.LOADED;
            this.finished = this.error || this.loaded;

            if (this.finished)
            {
                for (var i = 0; i < this.callbacks.length; i++)
                    this.callbacks[i].call(this);
                if (callback)
                    callback.call(this);
            }
        }
    });

    var Item = Import.extend
    ({
        _construct: function(url)
        {
            this._super();

            this.url = url;
            this.enabled = undefined;
            this.attributes = undefined;
            this.element = undefined;
        },

        load: function(callback)
        {
            var self = this;

            if (self.loading)
                return;
            if (self.finished)
            {
                if (callback)
                    callback.call(this);
                return;
            }

            /* Check the URL
            */
            if (! self.url)
            {
                IMu.log('Loading error: no URL');
                self.setState(self.ERROR, callback);
                return;
            }

            if (! self.url.match(/^(\w+:)?\//))
            {
                self.url = self.url.replace(/^\.\//, '');
                self.url = $path + '/' + self.url;
            }

            /* Create the element
            */
            var isCSS = false;
            if (self.url.match(/\.css$/))
            {
                self.element = document.createElement('link');
                self.element.setAttribute('rel', 'stylesheet');
                self.element.setAttribute('type', 'text/css');
                self.element.setAttribute('href', self.url);
                isCSS = true;
            }
            else if (self.url.match(/\.js$/))
            {
                self.element = document.createElement('script');
                self.element.setAttribute('type', 'text/javascript');
                self.element.setAttribute('src', self.url);
            }
            else
            {
                IMu.log('Loading error: {0} is unknown type', self.url);
                self.setState(self.ERROR, callback);
                return;
            }

            /* Add event handlers so we know when the url has been loaded.
            **
            ** Earlier versions of IE (8 and earlier) make this harder than
            ** it should be.
            */
            if ('onload' in self.element)
            {
                self.element.onload = function()
                {
                    IMu.log('Loaded {0}', self.url);
                    self.setState(self.LOADED, callback);
                };
                self.element.onerror = function()
                {
                    IMu.log('Error loading {0}!', self.url);
                    self.setState(self.ERROR, callback);
                };
            }
            else if ('onreadystatechange' in self.element)
            {
                self.element.onreadystatechange = function()
                {
                    var state = this.readyState;
                    if (state == 'complete' || state == 'loaded')
                    {
                        /* It does not seem to be possible to distinguish
                        ** between success and failure using
                        ** onreadystatechange. Pragmatically, we assume
                        ** success!
                        */
                        IMu.log('Loaded {0}', self.url);
                        self.setState(self.LOADED, callback);
                    }
                };
            }
            else
            {
                IMu.log('Loading error {0}: seems to be no way to check load',
                    self.url);
                self.setState(self.ERROR, callback);
                return;
            }

            if (isCSS)
            {
                /* If the element is a CSS element then as well as relying on
                ** an onload event handler we also poll for successful loading.
                ** This is to work around issues with versions of Safari
                ** earlier than 6.0 where the onload event is not triggered for
                ** <link> elements.
                */
                var checkCSS = function()
                {
//                  IMu.log('checkCSS: checking {0}', self.url);
//                  IMu.log('- state {0} (before check)', self.state);
                    if (self.state != self.LOADING)
                        return;

                    var loaded;
                    try
                    {
                        loaded = self.element.sheet.rules != null;
                    }
                    catch (e)
                    {
                        loaded = false;
                    }
//                  IMu.log('- loaded {0}', loaded);
                    if (! loaded)
                        window.setTimeout(checkCSS, 50);
                    else if (self.state != self.LOADED)
//                  {
//                      IMu.log('- setting state to loaded');
                        self.setState(self.LOADED, callback);
//                  }
//                  else
//                  {
//                      IMu.log('- state already set to loaded');
//                  }
                }
                window.setTimeout(checkCSS, 50);
            }

            /* Insert into DOM tree
            */
            IMu.log('Loading {0}', self.url);
            self.setState(self.LOADING);
            var next = $last.nextSibling;
            if (! next)
                $head.appendChild(self.element);
            else
                $head.insertBefore(self.element, next);
            $last = self.element;
        }
    });

    var Group = Import.extend
    ({
        _construct: function(name)
        {
            this._super();

            this.name = name;
            this.group = [];
            this.aliases = {};
        },

        add: function(tag)
        {
            if (tag in this.aliases)
            {
                this.group.push(this.aliases[tag]);
                return this.aliases[tag];
            }
            return this.addItem(tag);
        },

        addItem: function(url)
        {
            var item = new Item(url);
            this.group.push(item);
            return item;
        },

        addList: function(name)
        {
            var list = new List(name);
            this.group.push(list);
            return list;
        },

        addSet: function(name)
        {
            var set = new Set(name);
            this.group.push(set);
            return set;
        },

        aliasList: function(name)
        {
            if (! (name in this.aliases))
                this.aliases[name] = new List(name);
            return this.aliases[name];
        },

        aliasSet: function(name)
        {
            if (! (name in this.aliases))
                this.aliases[name] = new Set(name);
            return this.aliases[name];
        }
    });

    var List = Group.extend
    ({
        load: function(callback)
        {
            var self = this;

            var state = self.LOADED;
            for (var i = 0; i < self.group.length; i++)
            {
                var item = self.group[i];
                if (item.unloaded)
                {
                    item.load(function()
                    {
                        self.load(callback);
                    });
                    return;
                }
                if (state > item.state)
                {
                    state = item.state;
                    break;
                }
            }
            self.setState(state, callback);
        }
    });

    var Set = Group.extend
    ({
        load: function(callback)
        {
            var self = this;

            var state = self.LOADED;
            for (var i = 0; i < self.group.length; i++)
            {
                var item = self.group[i];
                if (item.unloaded)
                {
                    item.load(function()
                    {
                        self.load(callback);
                    });
                }
                if (state > item.state)
                    state = item.state;
            }
            self.setState(state, callback);
        }
    });

/*
    var i = new Item('dist/common/json3.min.js');
    i.ready(function()
    {
        IMu.log('ready 1 for {0}: {1}', this.url, this.state);
    });
    i.ready(function()
    {
        IMu.log('ready 2 for {0}: {1}', this.url, this.state);
    });
    i.ready(function()
    {
        IMu.log('ready 3 for {0}: {1}', this.url, this.state);
    });
    i.load(function()
    {
        IMu.log('load callback 1 for {0}: {1}', this.url, this.state);
        i.load(function()
        {
            IMu.log('load callback 2 for {0}: {1}', this.url, this.state);
        });
    });
    var s = new Set();

    s.addItem('dist/common/json3.min.js');

    var a = s.aliasList('OpenLayers');
    a.addItem('dist/common/OpenLayers-2.12/OpenLayers.js');
    a.addItem('dist/common/ScaleBar.js');
    a.ready(function()
    {
        IMu.log('Loaded {0} list', this.name);
    });

    var l = s.addList();
    l.addItem('dist/common/aliases.js');
    l.ready(function()
    {
        IMu.log('Loaded aliases list');
    });

    s.add('OpenLayers');

    s.load(function()
    {
        IMu.log('set load callback {0}', s.state);
    });
*/

    IMu.Importer = new Set();
})();
