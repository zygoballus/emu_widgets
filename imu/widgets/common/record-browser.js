/*!
 * Displays an EMu record.
 *
 * @since 2.0
*/
(function()
{
    IMu.Widgets.add('record-browser', 'base',
    {
        _construct: function()
        {
            var self = this;

            self._super.apply(self, arguments);
            self.classes.push('imu-record-details');
            this.classes.push('imu-record-browser');

            self.registerOptions
            ({
                /*!
                ** If **true** will load the default record when the view is
                ** shown.
                ** Value is set to **true** by default for legacy purposes.
                */
                loadOnShowView: true,

                /*!
                ** If **true** includes a control to allow the record to be selected.
                ** When selected the record is added to the user's current
                ** collection.
                */
                showSelectionControl: IMu.Config.showSelectionControls,

                onRecordToggled: undefined
            });

            self.module = undefined;
            self.key = undefined;
        },

        _ready: function()
        {
            var self = this;

            self.getMaster();
            self.getFromURL();
            if (self.options.useURL)
            {
                IMu.Events.bind('hash-loaded', function()
                {
                    self.getMaster();
                    self.getFromURL();
                    self.load();
                });
            }
        },

        /*!
        ** Displays the record registered as the master.
        */
        showMaster: function()
        {
            var self = this;

            self.getMaster();
            self.load(true);
        },

        /*!
        ** Display a specific record.
        **
        ** @param module string
        **   The name of the module containing the record to be
        **   displayed.
        **
        ** @param key integer
        **   The IRN of the record to be displayed.
        */
        showRecord: function(module, key)
        {
            var self = this;

            if (key != undefined)
            {
                self.module = module;
                self.key = key;
            }
            else
            {
                var a = module.split(/[.:]/);
                if (a.length < 2)
                    return;
                self.module = a[0];
                self.key = a[1];
            }
            self.load(true);
        },

        // view methods
        recordToggled: function(rid, on)
        {
            var self = this;

            IMu.log('recordToggled: {0} {1}', rid, (on ? 'on' : 'off'));
            var parts = rid.split(':');
            IMu.User.load(function()
            {
                if (on)
                    IMu.User.addEntry(parts[0], parts[1]);
                else
                    IMu.User.removeEntry(parts[0], parts[1]);

                if (self.options.onRecordToggled)
                    self.options.onRecordToggled.call(self, rid, on);
            });
        },

        // protected
        showView: function()
        {
            if (this.options.loadOnShowView)
                this.load(true);
        },

        // private
        getFromURL: function()
        {
            var self = this;

            if (! self.options.useURL)
                return false;
            return self.splitKey(IMu.URL.Hash.get('rid'));
        },

        getMaster: function()
        {
            var self = this;

            return self.splitKey(IMu.Config.browseMaster);
        },

        load: function(updateURL)
        {
            var self = this;

            if (! self.view)
                return;
            if (! self.module || ! self.key)
                return;

            var key = self.module + '.' + self.key;

            self.destroySearch();
            request = new IMu.Request.Search();
            request.findKey(key, function(data)
            {
                request.fetch('start', 0, 1, 'browse', function(result, success)
                {
                    if (! success || ! result)
                        return;

                    var data = result;
                    if (! data)
                        return;

                    if (! data.modules)
                        return;
                    if (data.modules.length < 1)
                        return;
                    if (! data.modules[0].rows)
                        return;
                    if (data.modules[0].rows.length < 0)
                        return;

                    var module = data.modules[0].name;
                    var method = 'show_' + module;
                    if (! (method in self.view))
                        method = 'show_default';

                    var row = data.modules[0].rows[0];

                    row.source = module;

                    /* Tranform older form of rid (module:irn) to
                    ** newer form (module.irn)
                    */
                    row.rid = row.rid.replace(':', '.');

                    self.view[method](row);

                    if (self.options.useURL && updateURL)
                        IMu.URL.Hash.set('rid', row.rid);

                    IMu.Events.trigger('record-browser-load', row.rid);
                });
            });
        },

        destroySearch: function()
        {
            if (request != undefined)
                request.onComplete = undefined;
        },

        splitKey: function(rid)
        {
            var self = this;

            if (! rid)
                return false;
            var matches = rid.match(/^([^.:]+)[.:](\d+)$/);
            if (! matches)
                return false;
            self.module = matches[1];
            self.key = matches[2];
            return true;
        }

    });

    // Private
    var request = undefined;
})();
