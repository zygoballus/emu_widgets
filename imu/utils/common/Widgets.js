/*!
** Turns an element into an IMu widget.
**
** @param name string
**   The name of the type of widget to be created.
**
** @param options object
**   Any options to be passed to the widget to configure its behaviour.
**
** @returns object
**   The widget.
*/
jQuery.fn.IMu = function(name, options)
{
    var dataName = 'IMuWidget';

    if (! name)
        return this.data(dataName);

    var object = IMu.Widgets.create(name, options);
    object.setOwner(this);

    this.data(dataName, object);

    return object;
}

/*!
** Finds the widget which "owns" this element.
**
** @returns object
**   The first widget which encloses the element.
*/
jQuery.fn.IMuOwner = function()
{
    var widget = this.IMu();
    if (widget)
        // The element is a widget itself.
        return widget;

    var parents = this.parents();
    for (var i = 0; i < parents.length; i++)
    {
        var widget = jQuery(parents[i]).IMu();
        if (widget)
            return widget;
    }
    return undefined;
}

/*!
** Finds the list of widgets which "own" this element.
**
** The list is returned in order from nearest enclosing widget outwards.
**
** @returns array
**   The list of widgets which enclose the element.
*/
jQuery.fn.IMuOwners = function()
{
    var list = [];

    var widget = this.IMu();
    if (widget)
        // The element is a widget itself.
        list.push(widget);

    var parents = this.parents();
    for (var i = 0; i < parents.length; i++)
    {
        var widget = jQuery(parents[i]).IMu();
        if (widget)
            list.push(widget);
    }
    return list;
}

IMu.Widgets =
{
    add: function(name, base, properties)
    {
        // base is optional
        if (typeof(base) == 'object')
        {
            properties = base;
            base = undefined;
        }

        var widget;
        if (base === undefined)
            widget = IMu.Class.create(IMu.Mixins.Options, properties);
        else
            widget = this.widgets[base].extend(properties);
        this.widgets[name] = widget;
        return widget;
    },

    create: function(name)
    {
        if (! (name in this.widgets))
        {
            IMu.log('Widgets.create: unknown widget {0}', name);
            throw new IMu.Error('WidgetsCreateBadName', name);
        }

        var widget = this.widgets[name];
        var object = new widget(name);
        this.objects.push(object);
        for (var i = 1; i < arguments.length; i++)
            object.setOptions(arguments[i]);
        object._ready();
        return object;
    },

    applyTheme: function()
    {
        this.sequence++;
        IMu.log('Widgets.applyTheme: sequence {0}', this.sequence);
        for (var i = 0; i < this.objects.length; i++)
            this.objects[i].createView();
        for (var i = 0; i < this.objects.length; i++)
            this.objects[i].showView();
    },

    destroy: function(object)
    {
        for (var i = 0; i < this.objects.length; i++)
        {
            if (this.objects[i] == object)
                this.objects.splice(i, 1);
        }
    },

    get: function(name)
    {
        return this.widgets[name];
    },

    resize: function()
    {
        for (var i = 0; i < this.objects.length; i++)
            this.objects[i].resize();
    },

    updateState: function()
    {
    },

    widgets: {},
    objects: [],
    sequence: 0
};
(function()
{
    /* Register various event handlers
    */
    IMu.Events.bind('dom-orientationchange', function(e)
    {
        IMu.Widgets.resize();
    });
    IMu.Events.bind('dom-resize', function(e)
    {
        IMu.Widgets.resize();
    });
    IMu.Events.bind('imu-show', function(name, lang)
    {
        IMu.Widgets.applyTheme();
    });
    IMu.Events.bind('language-changed', function(name, lang)
    {
        IMu.Widgets.applyTheme();
    });
    IMu.Events.bind('theme-activated', function(name, lang)
    {
        IMu.Widgets.applyTheme();
    });
})();
