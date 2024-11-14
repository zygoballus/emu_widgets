(function(theme)
{
    theme.views.register('my-collections',
    {
        _source: 'darwin/common/components/my-collections',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.holder = undefined;
                this.header = undefined;
                this.submit = undefined; 

                this.widget.search = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');

                self.header = self.holder.child('div', 'header');
                self.name = self.header.child('input type="text"', 'name');
                self.name.on('blur', function()
                {
                    self.widget.renameGroup(self.name.val());
                });

                var controls = self.header.child('div', 'controls');

                self.prev = controls.child('button', 'prev');
                self.prev.child('div', 'icon prev-icon');
                self.prev.click(function(e)
                {
                    self.widget.previousGroup();
                    e.preventDefault();
                });

                self.next = controls.child('button', 'next');
                self.next.child('div', 'icon next-icon');
                self.next.click(function(e)
                {
                    self.widget.nextGroup();
                    e.preventDefault();
                });

                self.remove = controls.child('button', 'remove');
                self.remove.child('div', 'icon remove-icon');
                self.remove.click(function(e)
                {
                    self.widget.removeGroup();
                    e.preventDefault();
                });

                self.add = controls.child('button', 'add');
                self.add.child('div', 'icon add-icon');
                self.add.click(function(e)
                {
                    self.widget.addGroup();
                    e.preventDefault();
                });

                self.restore = controls.child('button', 'restore');
                self.restore.text(IMu.string('label-restore'));
                self.restore.click(function(e)
                {
                    self.widget.restoreGroup();
                });

                self.content = self.holder.child('div', 'content');
                self.viewer = self.content.IMu('collection-viewer',
                {
                    onRecordSelected: function(rid, offset)
                    {
                        if (! this.search)
                            return;

                        var group = IMu.User.group;
                        IMu.log('restore: group {0}', group);

                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search', 'closed');

                        IMu.Events.trigger('show-search', this.search,
                        {
                            'view': 'details-viewer',
                            'offset': offset
                        });
                    }
                });

                /* This functionality should be migrated into the widget
                */
                IMu.User.load();
                self.widget.owner.resize();
            },

            collectionChanged: function()
            {
                this.update();
            },

            resize: function()
            {
                /* Do nothing by default
                */
            },

            update: function()
            {
                var self = this;

                var onlyGroup = IMu.User.groups.length == 1;
                self.prev.attr('disabled', onlyGroup);
                self.name.val(IMu.User.group.name);
                self.name.attr('disabled', onlyGroup);
                self.remove.attr('disabled', onlyGroup);
                self.restore.attr('disabled', IMu.User.group.entries.length == 0);

                if (! self.viewer)
                    return;

                self.viewer.dropSearch();

                if (IMu.User.group.entries.length > 0)
                {
                    var keys = [];
                    for (var i = 0; i < IMu.User.group.entries.length; i++)
                    {
                        var entry = IMu.User.group.entries[i];
                        keys.push([ entry.module, entry.key ]);
                    }

                    var search = new IMu.Request.Search();
                    search.findKeys(keys, function()
                    {
                        self.widget.search = search;
                        self.viewer.showSearch(search);
                    });
                }
            }
        }
    });
})(IMu.Themes.get('darwin'));
