(function(theme)
{
    theme.views.register('geolocate-control', 'control',
    {
        _source: 'shared/common/geolocate-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                var options =
                {
                    select: function(e, ui)
                    {
                        widget.doSelect(ui.item);
                        widget.irn = ui.item.irn;
                    }
                };
                var table = self.content.child('table');
                var tbody = table.child('tbody','full-width');
                var tr = table.child('tr');
                var td = tr.child('td');
                self.control = td.child('input type="text"');
                self.control.on('textchange', function()
                {
                    self.widget.doChange();
                });
                self.setup();
                self.contentHint = '';
                if (self.hint)
                {
                    self.control.attr('title', self.hint);
                    self.contentHint = '(' + self.hint + ')';
                    self.control.on('focus', function()
                    {
                        if (self.control.val() == self.contentHint)
                        {
                            self.control.val('');
                            self.control.removeClass('hint');
                        }
                    });
                    self.control.on('blur', function()
                    {
                        if (self.control.val() == '')
                        {
                            self.control.val(self.contentHint);
                            self.control.addClass('hint');
                        }
                    });
                    self.control.on('blur');
                }
                self.control.on('keypress', function(e)
                {
                    if (e.keyCode == 13)
                        self.widget.doEnter();
                });
                self.control.on('barcode-scanned', function(e, info)
                {
                    self.setValue(info.value);
                    self.widget.doChange();
                });

                if (widget.options.minLength !== undefined)
                    options.minLength = widget.options.minLength;
                var td = tr.child('td');
                var url = IMu.Request.getURL('Image') + '&name=tulane_geolocate';

                var button = td.child('input type="image"','geolocate-button');
                button.attr('src',url);
                button.bind('click',function()
                {
                    var text = self.getValue();
                    var fullURL = self.widget.options.URL;
                    if (text)
                        fullURL += '?points=' + text;
                    self.openWindow(fullURL);
                });

                /*
                var div = td.child('button','geolocate-button');
                self.external = div.IMu('button-control');
                self.external.addState(
                {
                    layout:
                    {
                        type: 'graphic',
                        value: url
                    },
                    onClick: function ()
                    {
                        var text = self.getValue();
                        var fullURL = self.widget.options.URL;
                        if (text)
                            fullURL += '?points=' + text;
                        self.openWindow(fullURL);
                    }
                });
                */

                /* Add event listener for storage locations */
                $(window).bind('storage', function (e)
                {
                    var key = window.location + "-imu-geolocate-data";
                    if (e.originalEvent.key !== key)
                        return;
                    var value = window.localStorage.getItem(window.location + "-imu-geolocate-data");
                    self.control.val(value);
                });
            },

            openWindow: function(url)
            {
                var self = this;
                var html = '<html><head></head>';
                html += '<body><iframe width="100%" height="100%" src="' + url + '"></iframe>';
                html += '<script type="text/javascript">';
                html += 'window.addEventListener("message", function(evt){if (evt.origin != "http://www.museum.tulane.edu") return; else {window.localStorage.setItem(window.location + "-imu-geolocate-data",evt.data);window.close()};}, false);'
                html += '</script>';
                html += '</body></html>';
                self.popup = window.open('', 'Geolocate');
                self.popup.document.write(html);
            },
            /*!
            ** Gets the current value from the control.
            **
            ** @returns value
            **   The current value of the control.
            */
            getValue: function()

            {
                var value = this.control.val();
                if (value == this.contentHint)
                    value = undefined;
                var locObject = {};
                var array = value.split('|');
                if (array.length > 0)
                {
                    
                }
                return value;
            },

            /*!
            ** Sets a value of the control.
            **
            ** @param value
            **   The value to set.
            */
            setValue: function(value)
            {
                this.control.val(value);
                if (this.contentHint)
                {
                    if (this.control.val() != '')
                        this.control.removeClass('hint');
                    else
                    {
                        this.control.val(this.contentHint);
                        this.control.addClass('hint');
                    }
                }
            }


        }
    });
})(IMu.Themes.shared);
