jQuery.fn.IMuMultimedia = function(options)
{
    var plugin = new IMu.jQuery.Multimedia(this);
    this.data(plugin.pluginName, plugin);
    plugin.setOptions(options);
    plugin.create();

    if (this.attr('src'))
        plugin.add(this.attr('src'));

    plugin.finalise();
    return plugin;
}

IMu.jQuery.Multimedia = IMu.jQuery.Plugin.extend
({
    pluginName: 'IMuMultimedia',

    // called by jQuery (see above)
    _construct: function()
    {
        var self = this;

        self._super.apply(self, arguments);
        self.owner.addClass('imu-multimedia-plugin');

        self.registerOptions
        ({
            autoMargin: true,
            onClick: 'overlay',
            overlayScale: 0.8
        });

        self.list = [];
        self.index = -1;
    },

    create: function()
    {
        var self = this;

        var table = self.owner.child('div', 'table');
        var row = table.child('div', 'table-row');
        var cell = row.child('div', 'table-cell');
        self.holder = cell.child('div', 'holder');

        self.owner.bind('click', function()
        {
            if (self.options.onClick == 'overlay')
                self.overlay();
            else if (self.options.onClick == 'next')
                self.next();
            else if (typeof(self.options.onClick) == 'function')
                self.options.onClick();
        });
    },

    resize: function()
    {
        var self = this;
    },

    // public
    addApplication: function(src, options)
    {
        var self = this;

        var item = self.addItem('application', src);
        if (options)
            item.setOptions(options);
    },

    addAudio: function(src, options)
    {
        var self = this;

        var item = self.addItem('audio', src);
        if (options)
            item.setOptions(options);
    },

    addImage: function(src, options)
    {
        var self = this;

        var item = self.addItem('image', src);
        if (options)
        {
            item.setOptions(options);

            if (options.title)
                item.elem.attr('title', options.title);
        }
    },

    addResourceByKey: function(key, options)
    {
        var self = this;

        var multimediaRequest = new IMu.Request.Multimedia();
        multimediaRequest.setKey(key);
        self.addResource(multimediaRequest, options);
    },

    addResourceByIdentifier: function(identifier, options)
    {
        var self = this;

        var multimediaRequest = new IMu.Request.Multimedia();
        multimediaRequest.setIdentifier(identifier);
        self.addResource(multimediaRequest, options);
    },

    addResource: function(multimediaRequest, options)
    {
        var self = this;

        var index = self.reserveIndex();

        multimediaRequest.fetchInfo(function(info)
        {
            self.adjustResourceRequest(info, multimediaRequest);

            var type = info.mimeType;
            var url = multimediaRequest.getURL();
            var item = self.addItem(type, url, index);
            if (options)
                item.setOptions(options);

            self.adjustResourceItem(info, multimediaRequest, item);
        });
    },

    addVideo: function(src, options)
    {
        var self = this;

        var item = self.addItem('video', src);
        if (options)
            item.setOptions(options);
    },

    clear: function()
    {
        var self = this;

        for (var i = 0; i < self.list.length; i++)
        {
            var item = self.list[i];
            item.clear();
        }
        self.list = [];
        self.index = -1;
    },

    get: function(index)
    {
        var self = this;

        if (index === undefined)
            index = self.index;
        if (index < 0 || index >= self.list.length)
            return undefined;
        return self.list[index];
    },

    next: function()
    {
        var self = this;

        var index = self.index + 1;
        if (index >= self.list.length)
            index = 0;
        self.show(index);
    },

    overlay: function()
    {
        var self = this;

        var item = self.get();
        if (item)
            item.overlay();
    },

    pause: function()
    {
        var self = this;

        var item = self.get();
        if (item)
            item.pause();
    },

    play: function()
    {
        var self = this;

        var item = self.get();
        if (item)
            item.play();
    },

    prev: function()
    {
        var self = this;

        var index = self.index - 1;
        if (index < 0)
            index = self.list.length - 1;
        self.show(index);
    },

    show: function(index)
    {
        var self = this;

        if (index < 0 || index > self.list.length)
            return;
        if (index == self.index)
            return;

        var item = self.list[self.index];
        if (item !== undefined)
            item.hide();

        self.index = index;
        var item = self.list[self.index];
        if (item !== undefined)
            item.show();
    },

    /* Private
    */
    adjustResourceItem: function(info, multimediaRequest, item)
    {
        var self = this;

        // If we don't already have a title use the multimedia title.
        if (! item.options.title && info.title)
            item.setOptions({title: info.title});

        switch (info.mimeType)
        {
            case 'application':
                item.elem.text(info.identifier);
                break;
            case 'audio':
                break;
            case 'image':
                if (self.options.onClick == 'overlay')
                {
                    /* Disable the overlay while we check to see if the image
                     * is a decent size and can be displayed.
                     */
                    item.setOptions({overlayURL: ''});

                    var height= jQuery(window).height();
                    var width = jQuery(window).width();

                    /* Try to get the best fit image for our window size.
                     */
                    var scale = self.options.overlayScale;
                    var request = new IMu.Request.Multimedia();
                    request.setKey(info.key);
                    request.addFilter('height', 'bf',
                        Math.round(height * scale));
                    request.addFilter('width', 'bf',
                        Math.round(width * scale));
                    /* We don't want to best fit to a supplementary.
                     */
                    request.addFilter('kind', 'ne', 'supplementary');
                    request.addFilter('kind', 'ne', 'thumbnail');

                    request.fetchInfo(function(overlayInfo)
                    {
                        var calculate = function(value)
                        {
                            value = Math.round(value * scale);
                            value = (value - (value % 100));
                            if (value < 100)
                                value = 100;
                            return value;
                        };
                        /* If the image is still too large then add a modifier
                         * to resize the image.
                         */
                        if (overlayInfo.height > height)
                            request.addModifier('height', calculate(height));

                        if (overlayInfo.width > width)
                            request.addModifier('width', calculate(width));

                        if (! self.canDisplayImageResource(
                                    overlayInfo.mimeFormat))
                            request.addModifier('format', 'jpeg');

                        var url = request.getURL();
                        item.setOptions({overlayURL: url});
                    });
                }
                break;
            case 'video':
                break;
            default:
                break;
        }
    },

    adjustResourceRequest: function(info, multimediaRequest)
    {
        var self = this;

        switch (info.mimeType)
        {
            case 'application':
                break;
            case 'audio':
                break;
            case 'image':
                if (! self.canDisplayImageResource(info.mimeFormat))
                    multimediaRequest.addModifier('format', 'jpeg');
                break;
            case 'video':
                break;
            default:
                break;
        }
    },

    canDisplayImageResource: function(mediaFormat)
    {
        var self = this;

        if (mediaFormat == 'jpeg' || mediaFormat == 'gif' ||
            mediaFormat == 'png' || mediaFormat == 'bmp')
            return true;
        return false;
    },

    addItem: function(type, src, index)
    {
        var self = this;

        if (index === undefined)
            index = self.reserveIndex();

        if (! (type in IMu.jQuery.Multimedia.Item))
            type = 'unknown';

        var item = new IMu.jQuery.Multimedia.Item[type](self, src);
        self.list[index] = item;

        if (self.index < 0)
            self.index = 0;
        if (index == self.index)
            item.show();

        return item;
    },

    reserveIndex: function()
    {
        var self = this;

        var length = self.list.push(undefined);
        return length - 1;
    }
});

IMu.jQuery.Multimedia.Item = IMu.Class.create(IMu.Mixins.Options,
{
    _construct: function(plugin, url)
    {
        var self = this;

        self.registerOptions
        ({
            autoPlay: false,
            overlayURL: url,
            title: ''
        });

        self.slimboxOptions =
        {
            imageFadeDuration: 100,
            initialWidth: 500,
            initialHeight: 500,
            overlayFadeDuration: 100
        };

        self.plugin = plugin;
        self.url = url;
    },

    clear: function()
    {
        var self = this;

        /* Remove potentially circular reference
        */
        self.plugin = undefined;
    },

    hide: function()
    {
    },

    overlay: function()
    {
    },

    pause: function()
    {
    },

    play: function()
    {
    },

    show: function()
    {
    },

    // private
    log: function()
    {
        var self = this;

        if (arguments.length == 0)
            return;

        var format = arguments[0];
        var params = Array.prototype.slice.call(arguments, 1);
        var output = IMu.Format.vsprintf(format, params);
        IMu.log('{0} item {1}', self.plugin.pluginName, output);
    }
});

IMu.jQuery.Multimedia.Item.application = IMu.jQuery.Multimedia.Item.extend
({
    _construct: function(plugin, src)
    {
        var self = this;

        self._super(plugin, src);

        self.elem = self.plugin.holder.child('a', 'item', 'item-application');
        self.elem.attr('href', self.url);
        self.elem.hide();
    },

    clear: function()
    {
        var self = this;

        self.elem.remove();
        self._super();
    },

    hide: function()
    {
        var self = this;

        self.elem.hide();
    },

    show: function()
    {
        var self = this;

        self.elem.show();
    }
});

IMu.jQuery.Multimedia.Item.audio = IMu.jQuery.Multimedia.Item.extend
({
    _construct: function(plugin, src)
    {
        var self = this;

        self._super(plugin, src);

        /*
        ** This div is needed for iOS. An audio element isn't hidden correctly 
        ** in iOS so a div wrapper is needed to hide the audio.
        */
        self.div = self.plugin.owner.child('div');

        self.elem = self.plugin.holder.child('audio', 'item', 'item-audio');
        self.elem.attr('controls', 'controls');

        self.elem.attr('src', self.url);
        self.div.hide();

        var ownerWidth = self.plugin.owner.width();
        var ownerHeight = self.plugin.owner.height();
        self.elem.fullWidth(ownerWidth);
        self.elem.fullHeight(ownerHeight);
    },

    clear: function()
    {
        var self = this;

        self.elem.remove();
        self._super();
    },

    hide: function()
    {
        var self = this;

        self.pause();
        self.div.hide();
    },

    pause: function()
    {
        var self = this;

        self.elem[0].pause();
    },

    play: function()
    {
        var self = this;

        self.elem[0].play();
    },

    show: function()
    {
        var self = this;

        self.div.show();

        /*
        ** This is a hack for iOS devices. For some reason iOS does not attempt
        ** to load audios that are hidden.
        ** This forces audios on iOS devices to load when shown.
        */
        if (IMu.Platform.os.is.ios)
        {
            window.setTimeout(function()
            {
                self.elem.load();
            }, 500);
        }
    }
});

IMu.jQuery.Multimedia.Item.image = IMu.jQuery.Multimedia.Item.extend
({
    _construct: function(plugin, src)
    {
        var self = this;

        self._super(plugin, src);

        self.elem = self.plugin.holder.child('img', 'item', 'item-image');

        self.elem.attr('src', self.url);
        self.elem.hide();
        self.elem.imagesLoaded(function(all, ok, bad)
        {
            self.setup();
        });
    },

    clear: function()
    {
        var self = this;

        self.elem.remove();
        self._super();
    },

    hide: function()
    {
        var self = this;

        self.elem.hide();
    },

    overlay: function()
    {
        var self = this;

        if (! self.options.overlayURL)
            return;
        jQuery.slimbox(self.options.overlayURL, self.options.title,
                self.slimboxOptions);
    },

    show: function()
    {
        var self = this;

        self.elem.show();
    },

    // private
    setup: function()
    {
        // do nothing by default.
        // centring logic has been moved to css files.
    }
});

IMu.jQuery.Multimedia.Item.video = IMu.jQuery.Multimedia.Item.extend
({
    _construct: function(plugin, src)
    {
        var self = this;

        self._super(plugin, src);

        self.elem = self.plugin.holder.child('video', 'item', 'item-video');
        self.elem.attr('controls', 'controls');

        self.elem.attr('src', self.url);
        self.elem.hide();

        var ownerWidth = self.plugin.owner.width();
        var ownerHeight = self.plugin.owner.height();
        self.elem.fullWidth(ownerWidth);
        self.elem.fullHeight(ownerHeight);
    },

    clear: function()
    {
        var self = this;

        self.elem.remove();
        self._super();
    },

    hide: function()
    {
        var self = this;

        self.pause();
        self.elem.hide();
    },

    pause: function()
    {
        var self = this;

        self.elem[0].pause();
    },

    play: function()
    {
        var self = this;

        self.elem[0].play();
    },

    show: function()
    {
        var self = this;

        self.elem.show();

        /*
        ** This is a hack for iOS devices. For some reason iOS does not attempt
        ** to load videos that are hidden.
        ** This forces videos on iOS devices to load when shown.
        */
        if (IMu.Platform.os.is.ios)
        {
            window.setTimeout(function()
            {
                self.elem.load();
            }, 500);
        }
    }
});
