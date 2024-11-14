/*!
** @since 2.0
*/
IMu.Widgets.add('widget-browser', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-widget-browser');

        this.registerOptions
        ({
        });
   
        this.device = undefined;
        this.widgets = [];
    },

    addWidget: function(name, options)
    {
        var self = this;

        var widget = IMu.Widgets.create(name, options);
        self.widgets.push(widget);
        widget.id = name + self.widgets.length;
        widget.controller = self;

        return widget;
    }
});
