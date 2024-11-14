/*!
** Simple widget to display, add and remove resources.
**
** Uses FileAPI utility to upload files.
**
** @since 2.0
*/
IMu.Widgets.add('capture-control', 'control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-capture-control');

        this.registerOptions(
        {
            useCaptureButtons: true,
            useCaptureDropzone: true,
            showResources: true,

            readOnly: false,        // Overrides useCaptureButtons and 
                                    // useCaptureDropzone to false.
                                    // Hides resource remove button.

            onChange: undefined
        });

        this.resources = [];
    },

    /* Loads a resource into the widget using file provided.
    */
    _addResourceUsingFile: function(file, callback)
    {
        var self = this;

        var resource =
        {
            "file": file,
            "name": file.name || 'Local File'
        };

        self.resources.push(resource);

        self.view.addResource(resource, function(elem)
        {
            resource.elem = elem;
        });
    },


    /* Loads a resource into the widget from the database using
    ** a key provided.
    */
    _addResourceUsingKey: function(key, callback)
    {
        var self = this;

        var resource =
        {
            "irn": key,
            "readOnly": true
        };
        self.resources.push(resource);
       
        // Don't set resource url until record can be found
        var mm = new IMu.Request.Multimedia();
        mm.setKey(key);

        var context = self.getOption('defaultContext');
        var port = self.getOption('defaultPort');
        
        var url = mm.getURL();
        if(context)
            url += "&context=" + context;
        if(port)
            url += "&port=" + port;

        var view = self.view;
        self.view.addResource(resource, function(elem)
        {
            //the element needs to be set here in case it is removed before
            // fetching info returns
            resource.elem = elem;

            mm.onError = function(response)
            {
                var msg = '';
                if (response.id == "MultimediaResourceNotFound")
                    msg = IMu.string('capture-control-resource-not-found')
                else if (response.id == "MultimediaResolutionNotFound")
                    msg = IMu.string('capture-control-resource-restricted')
                else if (response.id == "SessionConnect")
                    msg = IMu.string('capture-control-resource-connection-error')
                else
                    msg = IMu.string('capture-control-resource-unknown-error')

                resource.name = IMu.Format.formatParams(msg, [resource.irn]);
                view.setResourceValues(resource.elem, resource);
            };

            mm.fetchInfo(function(info)
            {
                // If execution does not get to this point, the record cannot 
                // be found.
                
                //in case the resource is deleted before fetchInfo returns. 
                if(self.resources.indexOf(resource) == -1 )
                    return;

                if (info.identifier)
                    resource.name = info.identifier;
                resource.url = url;

                resource.readOnly = false;

                view.setResourceValues(resource.elem, resource);
            });
        });
    },
    
    _processValues: function(data)
    {
        var values = [];

        if (! IMu.Type.isArray(data))
            data = [ data ];

        // Flatten values into an array
        var processValue = (function()
        {
            return function(value)
            { 
                var dataType = IMu.Type.get(value);
        
                if (dataType == 'number')
                    // single IRN
                    values.push({ irn: value });
                else if (dataType == 'string')
                {
                    // string - can be IRN, data JSON object
                    try
                    {
                        // JSON object in string
                        var json = JSON.parse(value);
                        processValue(json);
                    }
                    catch (e)
                    {
                        var num = parseInt(value);
                        if (num !== undefined && ! isNaN(num))
                            values.push({ irn: num });
                        else
                            values.push({ data: value });
                    }
                }
                else if (dataType == 'array')
                {
                    // array - can be IRN's, Data or JSON objects
                    value.forEach(function(val)
                    {
                        processValue(val);
                    });
                }
                else if (dataType == 'object')
                    // single JSON object
                    values.push(value);
            };
        })();

        data.forEach(function(value)
        {
            processValue(value);
        });

        return values;
    },
    
    _ready: function()
    {
        this._super.apply(this, arguments);
    },

    /* 
    ** Public
    */
    
    clearValue: function()
    {
        if (! this.resources.length)
            return;

        this.view.clearResources();
        this.resources = [];

        this.doChange();
    },

    /* Called by the view when the control's value has changed.
    */
    doChange: function()
    {
        if (this.options.onChange)
            this.options.onChange.call(this, this.resources);
    },

    getSortableValue: function()
    {
        return null;
    },

    // This method does not work.
    // Use getAsncValue instead.
    getValue: function()
    {
        throw new IMu.Error('BadMethod', 'use getAsyncValue');
    },

    getAsyncValue: function(callback)
    {
        var self = this;

        if (! callback)
            return;

        var values = [];
        var remaining = (this.resources || []).length;
        
        if (! remaining)
            callback(values);

        self.resources.forEach(function(resource)
        {
            var value = { "_type": "multimedia" };
            
            if (resource.irn)
                value.irn = resource.irn;
            if (resource.name)
                value.name = resource.name;

            values.push(value);

            if (resource.file)
            {
                IMu.FileAPI.readData(resource.file, function(data)
                {
                    value.data = data;

                    remaining--;

                    if (! remaining)
                        callback(values);
                });
            }
            else
            {
                remaining--;

                if (! remaining)
                    callback(values);
            }
        });
    },

    addFiles: function(files)
    {
        var self = this;

        files.forEach(function(file)
        {
            self._addResourceUsingFile(file);
        });

        self.doChange();
    },

    setValue: function(data)
    {
        var self = this;

        self.clearValue();

        var values = self._processValues(data);

        values.forEach(function(value)
        {
            if (! IMu.Type.isObject(value))
                value = { "data": value };

            if (value.irn)
                self._addResourceUsingKey(value.irn);
            else if (value.data)
                self._addResourceUsingData(value.data, value.name || 'Local File');
        });

        self.doChange();
    },

    removeResource: function(resourceData)
    {
        var index = this.resources.indexOf(resourceData);
        
        if (index < 0)
            return;
        
        var elem = this.resources[index].elem;
        
        this.view.removeResource(elem);
        this.resources.splice(index, 1);
        
        this.doChange();
    },


    /*!
    ** Capture control level validation.
    **
    ** Creates an ``info`` object containing ``state`` and ``details`` of the
    ** `control`.
    ** ``state`` defaults to **ok** and ``details`` defaults to ``undefined``.
    **
    ** A two step validation process then occurs:
    ** 1) Built-in rules that always apply to the `capture-control` widget are checked
    ** 2) Custom rules set at instantiation are run
    **
    ** Oncethe validation process has concluded, the `control` displays the
    ** results and then fires a callback event, if one exists.
    **
    ** Each subsequent function in the validation chain occurs as a callback of the
    ** previous function to guard against potential unexpected asynchronous events.
    **
    ** @param callback function
    **   The function to be called at the end of the validation chain.
    **   Takes ``info`` as an argument.
    */
    validate: function(callback)
    {
        var info =
        {
            "state": "ok",
            "details": undefined
        };

        if (callback)
            callback.call(this, info);
    }
});
