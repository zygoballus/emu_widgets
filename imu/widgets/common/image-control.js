/*!
** Simple widget to display image in OL.
**
** Uses OL to load images
** Allows the user to pan and zoom into the image
**
** @since 2.0
*/

IMu.Widgets.add('image-control', 'control',
{
    _construct: function()
    {

        this._super.apply(this, arguments);
        this.classes.push('imu-image-control');

        this.registerOptions(
        {

            bestFitWidth: undefined,

            /*!
            ** The height in Pixels to set the image-control to.
            ** If one is not passed in or is less than 100px, the widget will set the height to 
            ** 100px.
            */
            height: undefined,

            /*!
            ** Called when the value of the control has changed.
            */
            onChange: undefined
        });

        this.images = [];

        this.isMultiple = false;
    },

    _ready: function()
    {

        var self = this;

        self._super.apply(self, arguments);
    },

    getSortableValue: function()
    {
        return null;
    },

    /*!
    **
    */
    getValue: function()
    {
        var self = this;

        var values = [];

        if (! self.images)
            return undefined;

        for (var i = 0; i < self.images.length; i++)
        {
            var image = self.images[i];

            var value = {};

            value._type = "image";

            if (image.irn)
                value.irn = image.irn;
            if (image.data)
                value.data = image.data;
            if (image.name)
                value.name = image.name;
               
            if (image.id in self.view.imagesAudit)
            {
                var audit = self.view.imagesAudit[image.id];

                if (audit.state)
                    value.state = audit.state;
                if (audit.polygons)
                    value.polygons = audit.polygons;
            }

            values.push(value);
        };

        return values;
    },

    /*!
    **
    */
    setValue: function(data)
    {
        var self = this;
        var values = {};

        self.view.clearImageLayer();
        self.view.imagesAudit = {};
        self.images = [];

        switch (IMu.Type.get(data))
        {
            // single IRN
            case 'number':
                values.irn = data;
            break;

            // array - can be IRN's, Data or JSON objects
            case 'array':
                values = data;
            break;

            // single JSON object
            case 'object':
                for (var name in data)
                    values[name] = data[name];
            break;

            // string - can be IRN, data JSON object
            case 'string':
                try
                {
                    // JSON object in string
                    values = JSON.parse(data);
                    self.setValue(values);
                }
                catch (e)
                {
                    var num = parseInt(data);
                    if (num !== undefined && !isNaN(num))
                    {
                        values.irn = num;
                    }
                    else
                    {
                        values.data = data;
                    }

                }
            break;            
        }

        if (values.irn)
        {
            self.loadImageUsingKey(values.irn, function(id)
            {
                self.setProperties(values);
               
                if (id !== undefined)
                    self.setAudit(id,values);
                self.autoHideLayerSelect();
            });
        }
        else if (values.data)
        {
            self.loadImageUsingData(values.data,'Local Image',function(id)
            {
                self.setProperties(values);
                self.setAudit(id,values);
                self.autoHideLayerSelect();
            });
        }
        else if (IMu.Type.get(values) == 'array')
        {
            self.isMultiple = true;
            self.images = [];

            for (var i = 0; i < data.length; i++) 
            {
                values = data[i];
                var dataType = IMu.Type.get(values);

                if (dataType == 'number')
                {
                    self.loadImageUsingKey(values, function(id)
                    {
                        if (id !== undefined)
                            self.setAudit(id, values);
                        self.autoHideLayerSelect();
                    });
                }
                else if (dataType == 'string')
                {
                    try
                    {
                        values = JSON.parse(values);
                        self.setValue(values);
                    }
                    catch (e)
                    {
                        var num = parseInt (values);
                        if (num !== undefined && !isNaN(values))
                        {
                            self.loadImageUsingKey(num, function(id)
                            { 
                                if (id !== undefined)
                                    self.setAudit(id,values);
                                self.autoHideLayerSelect();
                            });
                        }
                        else
                        {
                            self.loadImageUsingData(values,'Local Image',function(id)
                            {
                                self.setAudit(id,values);
                                self.autoHideLayerSelect();
                            });
                        }
                    }
                }
                else if (dataType == 'object')
                {
                    (function(values)
                    {
                        if (values.irn)
                        {
                            self.loadImageUsingKey(values.irn,function(id)
                            {
                                if (id !== undefined)
                                    self.setAudit(id,values);
                                self.autoHideLayerSelect();
                            });
                        }
                        else if (values.data)
                        {
                            self.loadImageUsingData(values.data,'Local Image',function(id)
                            {
                                self.setAudit(id,values);
                                self.autoHideLayerSelect();
                            });
                        }
                    })(values);
                }
            };
        }
    },

    //Private

    autoHideLayerSelect: function()
    {
        // Is this needed? I just put it here for a bit of safety
        if (! this.view || ! this.view.imageLayer.controls.length)
            return;
        var layerSwitcher = undefined;
        for (var i in this.view.imageLayer.controls)
            if (this.view.imageLayer.controls[i].displayClass ==
                "olControlLayerSwitcher")
            {
                var layerSwitcher = this.view.imageLayer.controls[i];
                break;
            }
        if (this.images.length > 1)
        {
            jQuery(layerSwitcher.div).css('display', 'block');
        }
        else
        {
            jQuery(layerSwitcher.div).css('display', 'none');
        }
    },

    /*
    ** Called by the view when the control's value has changed.
    */
    doChange: function()
    {
        this.value = this.getValue();
        if (this.options.onChange)
            this.options.onChange.call(this, this.value);
    },

    /*!
    */
    getPolygon: function()
    {
        var self = this;

        if (self.view)
            return self.view.getPolygon();
    },

    /*!
    */
    getState: function()
    {
        var self = this;

        if (self.view)
            return self.view.getState();
    },

    /*!
    */
    setPosition: function(x, y)
    {
        var self = this;
        x = x - 0;
        y = y - 0;

        if (isNaN(x) || isNaN(y))
        {
            IMu.log('PostionValueNaN : Value x or y is not a number');
            throw new IMu.Error('PostionValueNaN');
        }

        if (self.view)
        {
            self.view.setImageLatLon(x, y);
        }
    },

    /*!
    */
    setPolygon: function(coordinates)
    {
        var self = this;

        if (!IMu.Type.isArray(coordinates))
        {
            IMu.log('NonArray : value for coordinates is not of type array');
            throw new IMu.Error('NonArray');
        }
        if (IMu.Type.isArray(coordinates) && coordinates.length < 3)
        {
            IMu.log('NonPolygonCoordinates : Not enough coordinates to create a polygon');
            throw new IMu.Error('NonPolygonCoordinates')
        }

        if (self.view)
        {
            self.view.setPolygon(coordinates);
        } 
    },

    /*!
    */
    setProperties: function(values)
    {
        var self = this;

        if (values.state)
        {
            self.setZoomLevel(values.state.zoom);
            self.setPosition(values.state.x, values.state.y);
        }
        if (values.polygons)
        {
            for (var i = 0; i < values.polygons.length; i++) 
            {
                var polygons = undefined;
                var polygon = values.polygons[i];

                if (IMu.Type.get(polygon) == 'string')
                {
                    polygons = JSON.parse(polygon);
                }
                else if (IMu.Type.get(polygon) == 'array')
                {
                    polygons = polygon;
                }

                if(polygons)
                    self.setPolygon(polygons);
            };
        }
    },

    setAudit: function(id,values)
    {
        var self = this;

        if (id in self.view.imagesAudit)
        {
            IMu.log('image-control : setAudit - id {0} is in audit', id);

            var layer = self.view.imagesAudit[id];

            if(values.state)
                layer.state = values.state;

            if(values.polygons)
                layer.polygons = polygons;
        }
        else
        {
            IMu.log('image-control : setAudit - id {0} not in audit', id);

            var layer = self.view.imagesAudit[id] = {
                "state": undefined,
                "polygons" : undefined
            };

            if(values.state)
                layer['state'] = values.state;
            if(values.polygons)
                layer['polygons'] = polygons;

            //self.setProperties(values);
        }

        IMu.log('image-control : setAudit - audit is now {0}', self.view.audit);
    },

    /*!
    */
    setZoomLevel: function(level)
    {
        var self = this;

        level = level - 0;

        if (isNaN(level))
        {
            IMu.log('ZoomLevelValueNaN : Zoom value is not a number')
            throw new IMu.Error('ZoomLevelValueNaN');
        }

        if (self.view)
        {
            self.view.setZoomLevel(level);
        }
    },

    loadCapturedImageUsingData: function(data, name, callback)
    {
        var self = this;

        var value = {};
        value.data = data;
        value.name = name;

        if(self.view)
        {
            self.view.displayImageUsingData(data, name, function(graphic)
            {
                value.id = graphic.id;
                self.images.push(value);

                self.setAudit(graphic.id,value);
                self.autoHideLayerSelect();

                if (callback)
                    callback(graphic.id);
            });
        }
    },

    /*!
    */
    loadImageUsingData: function(data, name, callback)
    {
        var self = this;

        var value = {};
        value.data = data;

        if (self.view)
        {
            self.view.displayImageUsingData(data, name, function(graphic)
            {
                value.id = graphic.id;
                self.images.push(value);

                if(callback)
                    callback(graphic.id);
            });
        }
    },

    /*!
    */
    loadImageUsingKey: function(key, callback)
    {
        var self = this;

        var value = {};
        value.irn = key;

        if (self.view)
        {
            self.view.displayImageUsingKey(key,function(graphic)
            {
                value.id = (graphic !== undefined) ? graphic.id : undefined;
                self.images.push(value);

                if (callback)
                    callback(value.id);
            });
        }
    },

    /*!
    */
    removePolygons: function(callback)
    {
    }

});
