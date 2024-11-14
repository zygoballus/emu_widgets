(function()
{
    jQuery.fn.IMuRowLayout = function(options)
    {
        var plugin = new IMu.jQuery.RowLayout(this);
        this.data(plugin.pluginName, plugin);
        plugin.setOptions(options);
        plugin.create();
        plugin.finalise();
        return plugin;
    }

    IMu.jQuery.RowLayout = IMu.jQuery.Plugin.extend
    ({
        pluginName: 'IMuRowLayout',

        // called by jQuery (see above)
        _construct: function()
        {
            this._super.apply(this, arguments);

            this.owner.addClass('imu-row-layout-plugin');

            this.registerOptions
            ({
                sameSize: false
            });

            this.holder = undefined;
            this.first = undefined;
            this.last = undefined;
            this.rows = [];
        },

        create: function()
        {
            var self = this;

            self.holder = self.owner.child('div', 'holder');
            self.holder.css
            ({
                height: '100%',
                overflowY: 'hidden',
                width: '100%'
            });

            self.first = self.holder.child('div');
            self.first.css
            ({
                height: '0px',
                overflow: 'hidden'
            });
            self.first.text('.');

            self.last = self.holder.child('div');
            self.last.css
            ({
                height: '0px',
                overflow: 'hidden'
            });
            self.last.text('.');

            IMu.Events.bind('dom-resize', function()
            {
                self.resize();
            });
            IMu.Events.bind('imu-show', function()
            {
                self.show();
            });
        },

        // public
        add: function(info)
        {
/*
            var row = new Row(this, info);
*/
            var row = {};
            row.weight = info;
            row.elem = jQuery('<div/>');
            row.elem.addClass('row');
            row.elem.insertBefore(this.last);
            row.minHeight = 0;
            this.rows.push(row);

            return row;
        },

        resize: function()
        {
            var holderOffset = this.holder.offset().top;
            var holderHeight = this.holder.height();
            IMu.log('holderHeight {0}', holderHeight);
            var minHeight = 0;
            var finish = 0;
            for (var i = 0; i < this.rows.length; i++)
            {
                var row = this.rows[i];
                var elem = row.elem;

                var offset = elem.offset().top - holderOffset;
                var prefix = offset - finish;
                var height = elem.outerHeight(false);

                var extra = 0;
                if (row.weight <= 0)
                    extra = height;
                else if (IMu.Type.isNumber(row.minHeight))
                    extra = row.minHeight;
                else if (IMu.Type.isString(row.minHeight))
                {
                    var match = row.minHeight.match(/^(\d+)(px|em|%)?$/);
                    if (match)
                    {
                        if (match[2] == 'em')
                            extra = jQuery.emToPixels(match[1]);
                        else if (match[2] == '%')
                            extra = match[1] / 100 * holderHeight;
                        else
                            extra = match[1] - 0;
                    }
                }
                IMu.log('row {0}: offset {1} prefix {2} height {3} extra {4}',
                    i, offset, prefix, height, extra);

                minHeight += prefix + extra;
                finish = offset + height;

                row.smallest = extra;
            }
            var offset = this.last.offset().top - holderOffset;
            var prefix = offset - finish;
            IMu.log('last: offset {1} prefix {2}', i, offset, prefix);
//            minHeight += prefix;
            var excessHeight = holderHeight - minHeight;
            IMu.log('minHeight {0} excessHeight{1}', minHeight, excessHeight);

            var totalWeight = 0;
            for (var i = 0; i < this.rows.length; i++)
            {
                var row = this.rows[i];
                if (row.weight > 0)
                    totalWeight += row.weight;
            }
            IMu.log('totalWeight {0}', totalWeight);

            for (var i = 0; i < this.rows.length; i++)
            {
                var row = this.rows[i];

                var css =
                {
                    height: '',
                    minHeight: '',
                    overflowY: ''
                };
                if (row.weight > 0)
                {
                    var height = row.smallest + row.weight / totalWeight * excessHeight;
                    var percentage = height / holderHeight * 100;
                    css.height = percentage + '%';
                    if (row.smallest > 0)
                        css.minHeight = row.smallest + 'px';
                    css.overflowY = 'auto';
                }
                row.elem.css(css);
            }
        },

        show: function()
        {
            this.resize();
        }
    });

    var Row = IMu.Class.create
    ({
        _construct: function(plugin, info)
        {
            this.plugin = plugin;

            this.css = undefined;
            this.minHeight = undefined;
            this.weight = 0;

            /* Process the info */
            if (! IMu.Type.isObject(info))
                throw new IMu.Error('RowLayoutBadRowInfo');

            if ('css' in info)
                this.css = info.css;

            if ('minHeight' in info)
                this.minHeight = info.minHeight;

            if ('weight' in info)
                this.weight = info.weight;

            this.elem = this.plugin.holder.child('div', 'row');
        }
    });
})();
