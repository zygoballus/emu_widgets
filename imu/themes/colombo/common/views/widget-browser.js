(function(theme)
{
    theme.views.register('widget-browser', 'base',
    {
        _source: 'colombo/common/browse-page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;
            },

            _create: function()
            {
                var self = this;
                self._super();
                
                self.holder = self.widget.owner.child('div', 'holder');

                switch (self.widget.device)
                {
                    case 'phone':
                        break;
                    case 'tablet':
                        break;
                    case 'desktop':
                    default:
                        var options =
                        {
                            loadOn: 'click',
                            showSidebar: true
                        };
                        var explore = self.addWidget('explore', options);
                        explore.addColumns(3);
                        explore.setModule('ecatalogue');
                        explore.setTerms();
                        explore.doSearch();
                        break;
                };
            },

            addWidget: function(name, options)
            {
                var self = this;

                var widget = self.widget.addWidget(name, options);
                widget.owner = self.holder.child('div',
                    'imu-' + name + ' ' + widget.id);

                return widget;
            },

            resize: function()
            {
                this._super();
            }
        }
    });
})(IMu.Themes.get('colombo'));
