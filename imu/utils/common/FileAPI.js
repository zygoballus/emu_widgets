(function()
{
    window.FileAPI =
    {
        "StaticPath": IMu.path + "/dist/common/FileAPI"
    };

    IMu.FileAPI =
    {
        _filterFileTypes: function(files, accepts)
        {
            if (! accepts)
                return files;
            
            if (IMu.Type.get(accepts) != 'array')
                accepts = [ accepts ]; 
            else if (! accepts.length)
                return files;

            var acceptedFiles = [];
            var re = new RegExp(accepts.join("|"), "i");

            files.forEach(function(file)
            {
                var match = file.type.match(re);
                if (file.type.match(re) != null)
                    acceptedFiles.push(file);
            });

            return acceptedFiles;
        },

        _ready: false,
        _pending: [],
        _processPending: function()
        {
            for (var i = 0; i < this._pending.length; i++)
            {
                var item = this._pending[i];
                var options = item.options || {};
                var method = item.method;

                this[method](item.elem, options, item.callback);
            }

            delete this._pending;
            delete this._processPending;
        },

        FSButton: function(elem, options, callback)
        {
            if (! options)
                options = {};
            else if (typeof options == 'function')
            {
                callback = options;
                options = {};
            }

            if (! this._ready)
            {
                this._pending.push(
                {
                    'method': 'button',
                    'elem': elem,
                    'options': options,
                    'callback': callback
                });
            }
            else
               elem.FSButton([], callback);
        },

        dnd: function(elem, options, callback)
        {
            if (! options)
                options = {};
            else if (typeof options == 'function')
            {
                callback = options;
                options = {};
            }

            if (! this._ready)
            {
                this._pending.push(
                {
                    'method': 'dnd',
                    'elem': elem,
                    'options': options,
                    'callback': callback
                });
            }
            else
               elem.dnd(options, callback);
        },

        dndOff: function(elem, callback)
        {
            if (! this._ready)
            {
                this._pending.push(
                {
                    'method': 'dndOff',
                    'elem': elem,
                    'callback': callback
                });
            }
            else
                elem.dndoff(callback);
        },

        readData: function(file, options, callback)
        {
            if (typeof options == 'function')
            {
                callback = options;
                options = {};
            }

            window.FileAPI.readAsDataURL(file, function(e)
            {
                if (e.type == 'load')
                {
                    if (callback)
                        callback.call(IMu.FileAPI, e.result);
                }
                else if (e.type == 'progress')
                {
                    if (options.onProgress)
                        options.onProgress.call(IMu.FileAPI, e);
                }
                else
                {
                    if (options.onError)
                        options.onError.call(IMu.FileAPI, e);
                }
            });
        }
    };

    jQuery.getScript(FileAPI.StaticPath + "/FileAPI.min.js", 
        function()
        {
            IMu.FileAPI._ready = true;
            IMu.FileAPI._processPending();
            IMu.Events.trigger('imu-FileAPI-loaded');
            /* Turns the provided element into a wrapper for a file input element.
            **/
            jQuery.fn.FSButton = function(options, callback)
            {
                options = options || {};
                var accepts = options.accepts || [];

                var acceptHtml = '';
                if (accepts)
                {
                    // Construct html attributes
                    if (IMu.Type.get(accepts) != 'array')
                        accepts = [ accepts ]; 
                    if (accepts.length)
                        acceptHtml = " accept='" + accepts.join(';') + "'";
                }
                
                var html = IMu.Format.formatParams("<input type='file'{0}>",
                [
                    acceptHtml
                ]);

                var input = jQuery(html); 
                input.hide();
               
                // Prevent event propagation
                //
                input.click(function(e)
                {
                    e.stopPropagation();
                });

                // Capture file selection/deselection event
                //
                window.FileAPI.event.on(input[0], 'change', 
                    function(e)
                    {
                        var files = window.FileAPI.getFiles(e);
                        files = IMu.FileAPI._filterFileTypes(files);

                        callback.call(IMu.FileAPI, files);
                    }
                );

                this.click(function()
                {
                    input.click();
                });
                
                input.appendTo(this);
            };

            /* Enable drag-drop functionality for the given element(s).
            **/
            jQuery.fn.dnd = function(options, callback)
            {
                options = options || {};
                var accepts = options.accepts || [];

                window.FileAPI.event.dnd(this[0],
                    function(over)
                    {
                        if (over)
                            jQuery(this).addClass('drag-over');
                        else
                            jQuery(this).removeClass('drag-over');
                    },
                    function(files)
                    {
                        files = IMu.FileAPI._filterFileTypes(files, accepts);
                        callback.call(IMu.FileAPI, files);
                    }
                );
            };

            /* Disable drag-drop functionality for the given element(s).
            **/
            jQuery.fn.dndoff = function()
            {
                this.each(function()
                {
                    window.FileAPI.event.dnd.off(this, 
                        function(){},
                        function(){});
                });
            };
        });
})();
