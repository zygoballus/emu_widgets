(function()
{
    IMu.App.Dialogue = IMu.Class.create
    ({
        _construct: function()
        {
            this.owner = undefined;
            this.message = undefined;
            this.details = undefined;
            this.buttons = [];
        },

        addButton: function(code, text)
        {
            var info = {};
            info.code = code;
            info.text = text;
            this.buttons.push(info);
        },

        addDefaultButtons: function()
        {
            this.addButton('ok');
            this.addButton('cancel');
        },

        addHtmlDetail: function()
        {
            if (! this.details)
                this.details = [];

            var detail = IMu.Format.format.apply(IMu.Format, arguments);
            this.details.push(
            {
                type: 'html',
                value: detail
            });
        },
        
        addHtmlDetailParams: function()
        {
            if (! this.details)
                this.details = [];

            var detail = IMu.Format.formatParams.apply(IMu.Format, arguments);
            this.details.push(
            { 
                type: 'html',
                value: detail 
            });
        },

        /*! Deprecated
        **   See ``addTextDetail``
        */
        addDetail: function()
        {
            this.addTextDetail.apply(this, arguments);
        },
        addTextDetail: function()
        {
            if (! this.details)
                this.details = [];

            var detail = IMu.Format.format.apply(IMu.Format, arguments);
            this.details.push(
            {
                type: 'text',
                value: detail
            });
        },
        
        /*! Deprecated
        **   See ``addTextDetailParams``
        */
        addDetailParams: function()
        {
            this.addTextDetailParams.apply(this, arguments);
        },
        addTextDetailParams: function()
        {
            if (! this.details)
                this.details = [];

            var detail = IMu.Format.formatParams.apply(IMu.Format, arguments);
            this.details.push(
            { 
                type: 'text',
                value: detail 
            });
        },

        clearButtons: function()
        {
            this.buttons = [];
        },

        hide: function(options)
        {
            var self = this;
            
            options = options || {};
            var minDisplayTime = options.minDisplayTime || 0;

            if (! minDisplayTime)
            {
                // Close now
                self.owner.remove();
                if (options.callback)
                    options.callback();
                
                return;
            }
           
            // Close only after the dialogue has been shown for
            // a set period of time.
            var interval = setInterval(function()
            {
                var timeNow = Date.now();
                if (timeNow - self.timeShown >= minDisplayTime)
                {
                    clearInterval(interval);
                    self.owner.remove();

                    if (options.callback)
                        options.callback();
                }
            },1);
        },

        setHtmlMessage: function()
        {
            this.message = 
            {
                type: 'html',
                value: IMu.Format.format.apply(IMu.Format, arguments)
            };
        },
        setHtmlMessageParams: function()
        {
            this.message = 
            {
                type: 'html',
                value: IMu.Format.formatParams.apply(IMu.Format, arguments)
            };
        },

        setMessage: function()
        {
            this.message = 
            {
                type: 'text',
                value: IMu.Format.format.apply(IMu.Format, arguments)
            };
        },

        setMessageParams: function()
        {
            this.message = 
            {
                type: 'text',
                value: IMu.Format.formatParams.apply(IMu.Format, arguments)
            };
        },

        show: function(options, callback)
        {
            var self = this;

            // options is optional!
            if (typeof(options) == 'function')
            {
                callback = options;
                options = undefined;
            }
            var test = jQuery('body').children('div.imu-dialogue');
            jQuery('body').children('div.imu-dialogue').remove();
            var owner = self.owner = jQuery('body').child('div', 'imu-dialogue');

            var box = owner.child('div', 'box');

            var message = box.child('div', 'message');
            if (this.message)
            {
                var value = this.message.value;
                var method = this.message.type;
                message[method](value);
            }
            
            if (self.details)
            {
                var details = box.child('div', 'details');
                for (var i in self.details)
                {
                    if (! self.details.hasOwnProperty(i))
                        continue;

                    var detail = details.child('div', 'detail');

                    var value = self.details[i].value;
                    var method = self.details[i].type || 'text';

                    detail[method](value);
                }

                var show = box.child('div', 'show-details');
                if (! options || options.showDetails !== true)
                {
                    show.text('Details');
                    details.hide();
                }
                else
                {
                    details.show();
                    show.text('Hide details');
                }

                show.on('click', function()
                {
                    if (details.visible())
                    {
                        details.hide();
                        show.text('Details');
                    }
                    else
                    {
                        details.show();
                        show.text('Hide details');
                    }
                });
            }

            var buttons = box.child('div', 'buttons');
            for (var i in self.buttons)
            {
                (function(n)
                {
                    if (! self.buttons.hasOwnProperty(n))
                        return;

                    var info = self.buttons[n];
                    var button = buttons.child('button', 'button', info.code);
                    var text = info.text;
                    if (! text)
                    {
                        var id = 'dialogue-button-' + info.code;
                        text = IMu.string(id);
                        if (text == id)
                            text = IMu.string(info.code);
                    }
                    button.text(text);
                    button.on('click', function(e)
                    {
                        if (callback)
                            callback.call(self, info.code, details);
                        self.hide();
                    });
                    button.on('keypress', function(e)
                    {
                        if (e.keyCode == 13)
                        {
                            if (callback)
                                callback.call(self, info.code, details);
                            self.hide();
                        }
                    });
                    button.attr('tabindex', '-1');
                    if (n == 0)
                        button.focus();
                })(i);
            }

            self.timeShown = Date.now();
        }
    });
})();
