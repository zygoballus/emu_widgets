IMu.Events =
{
	on: function(name, context, callback)
	{
		// context is optional
		if (typeof(context) == 'function')
		{
			callback = context;
			context = undefined;
		}

		var item =
		{
			context: context,
			callback: callback
		};

		var list = this.set[name];
		if (! list)
			list = this.set[name] = [];
		list.push(item);
	},

	trigger: function(name)
	{
        if (! IMu.shown)
            return;

		IMu.log('Events.trigger: {0}', name);

		var list = this.set[name];
		if (! list)
			return;

		var args = Array.prototype.slice.call(arguments, 1);
		args.unshift(name);
		for (var i = 0; i < list.length; i++)
		{
			var item = list[i];
			var context = item.context;
			var callback = item.callback;
			callback.apply(context, args);
		}
	},

	set: {},

    setup: function()
    {
        var self = this;

        jQuery(window).on('orientationchange', function(e)
        {
            self.trigger('dom-orientationchange');
        });

        var height = -1;
        var width = -1;
        var fired = false;
        var timer = undefined;
        jQuery(window).on('resize', function(e)
        {
            IMu.log('low-level resize');

            /* In IE 8 and earlier changing the size of an element can generate
            ** a resize event even if the window size has not actually changed.
            **
            ** To workaround this we track the window size and only handle the
            ** event if the window really has changed size.
            */
            var newHeight = jQuery(window).height();
            var newWidth = jQuery(window).width();
            if (height == newHeight && width == newWidth)
                return;
            height = newHeight;
            width = newWidth;

            /* The number of resize events can become overwhelming.
            ** To keep the number down we set a timer and only trigger resizes
            ** periodically.
            */
            fired = true;
            if (! timer)
            {
                timer = window.setInterval(function()
                {
                    if (fired)
                    {
                        fired = false;
                        self.trigger('dom-resize');

                        /* Try to capture the elusive IE orientation change
                        ** event
                        */
                        if (IMu.Platform.browser.name)
                        {
                            if ((IMu.Platform.window.orientation.last != undefined) &&
                                (IMu.Platform.window.orientation.name !=
                                IMu.Platform.window.orientation.last))
                            {
                                    self.trigger('dom-orientationchange');
                            }
                        }
                    }
                    else
                    {
                        window.clearInterval(timer);
                        fired = false;
                        timer = undefined;
                        self.trigger('dom-resized');
                    }
                }, IMu.Config.resizeInterval);
            }
        });

        if (IMu.Config.handleBarcodingEvents)
        {
            /* Install global iCody barcode scan event functioins to be notified
            ** when a barcode has been scanned.
            */

            /* When iCody uses the device's camera to scan barcodes (rather
            ** than the scanner in a LineaPro sleeve) the overlaying of the
            ** camera view within the app causes the input element in the web
            ** page to lose focus. When the barcode has been scanned and the
            ** camera has been put away the document's activeElement is instead
            ** set to the page's <body> element.
            **
            ** To work around this we use the 'focusout' event to track the
            ** last element which had focus. When a barcode is scanned, if the
            ** active element is the page's <body> element we instead use the
            ** element which had focus prior to the scan being started.
            */
            var lastFocus = undefined;
            jQuery(window).on('focusout', function(e)
            {
                lastFocus = e.target;
            });
            var barcodeScanned = function(info)
            {
                var focus = jQuery(document.activeElement);
                if (focus.prop('tagName') == 'BODY')
                {
                    focus = jQuery(lastFocus);
                    focus.focus();
                }
                focus.trigger('barcode-scanned', info);
            };

            /* This is the iCody 3.0 approved way of handling the scan.
            ** However, we are not sure if all users have upgraded to version 3.0
            ** so we do not use it yet.
            **
            window.icodyJSON =
                function(json)
                {
                    info = JSON.parse(json);
                    barcodeScanned(info);
                };
            */

            /* This is the pre-iCody 3.0 way of handling the scan.
            ** It is deprecated in iCody 3.0 but is included here in case
            ** we are running an earlier version of iCody.
            */
            window.icodyDidScanBarcodeWithCoordinatesAndUDID =
                function(value, typeID, type, scandate, latitude, longitude, uuid)
                {
                    /* Build a structure which mimics as best as possible the
                    ** structure passed to the newer icodyJSON handler (above).
                    */
                    var info =
                    {
                        uuid: uuid,
                        typeID: typeID,
                        type: type,
                        value: value,
                        deviceName: undefined,
                        location:
                        {
                            longitude: longitude,
                            latitude: latitude
                        },
                        scandate: scandate
                    };
                    barcodeScanned(info);
                };
        }
    },
    
    // deprecated
	bind: function(name, context, callback)
	{
        this.on(name, context, callback);
    }
};
