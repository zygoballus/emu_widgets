(function(theme)
{
    theme.views.register('locator-viewer', 'map-viewer',
    {
        _source: 'shared/common/locator-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);
                // currently the overview map functionality problematic for
                // Locator.  Force it to be disabled.
                self.widget.options.showOverviewMap = false;
            },

            makeClusterSignature: function(layer, features, cluster)
            {
                var self = this;

                var key = self._super.apply(self, arguments);
                key += ':' + self.widget.getCurrentFiltersAsString();
                return key;
            },

            /*
            ** showPopup.
            ** generate a popup that describes a feature
            */
            showPopup: function(features, triggeringEvent)
            {
                var self = this;
                self.showToolTip(features, triggeringEvent);
            },

            triggerEvent: function(localEventName, data)
            {
                IMu.Events.trigger('locator-viewer-' + localEventName, data);
            }
        }

    });
})(IMu.Themes.shared);
