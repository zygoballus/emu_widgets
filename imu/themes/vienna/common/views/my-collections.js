(function(theme)
{
    theme.views.register('my-collections',
    {
        _source: 'vienna/common/my-collections',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;
                self.header = undefined;
                self.submit = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');

                if (self.getOption('showLabel'))
                {
                    var label = self.holder.child('div', 'label');
                    label.text(IMu.string('common-my-collections'));
                }

                self.header = self.holder.child('div', 'header');

                self.name = self.header.child('input type="text"', 'name');
                self.name.bind('blur', function()
                {
                    self.widget.renameGroup(self.name.val());
                });

                self.prev = self.header.child('button', 'prev');
                self.prev.attr('title', IMu.string('common-prev'));
                self.prev.text('<');
                self.prev.bind('click', function()
                {
                    self.widget.previousGroup();
                });

                self.next = self.header.child('button', 'next');
                self.next.attr('title', IMu.string('common-next'));
                self.next.text('>');
                self.next.bind('click', function()
                {
                    self.widget.nextGroup();
                });

                self.remove = self.header.child('button', 'remove');
                self.remove.attr('title', IMu.string('common-remove'));
                self.remove.text('-');
                self.remove.bind('click', function()
                {
                    self.widget.removeGroup();
                });

                self.add = self.header.child('button', 'add');
                self.add.attr('title', IMu.string('common-add'));
                self.add.text('+');
                self.add.bind('click', function()
                {
                    self.widget.addGroup();
                });

                self.restore = self.header.child('button', 'restore');
                self.restore.attr('title', IMu.string('common-restore'));
                self.restore.html('&rarr;');
                self.restore.bind('click', function()
                {
                    self.widget.restoreGroup();
                });

                self.content = self.holder.child('div', 'content');
                self.viewer = self.content.IMu('collection-viewer');

                IMu.User.load(function()
                {
//  				self.update();
                });
				self.widget.owner.resize();
            },

            collectionChanged: function()
            {
                var self = this;

                self.update();
            },

            resize: function()
            {
                var self = this;

                var ownerHeight = self.widget.owner.height();
                self.holder.fullHeight(ownerHeight - 1);
                var holderHeight = self.holder.height();

                var headerHeight = self.header.fullHeight();
                var contentHeight = holderHeight - headerHeight - 1;
                self.content.fullHeight(contentHeight);
                self.viewer.resize();
            },

            update: function()
            {
                var self = this;

                var onlyGroup = IMu.User.groups.length == 1;
                self.prev.attr('disabled', onlyGroup);
                self.name.val(IMu.User.group.name);
                self.next.attr('disabled', onlyGroup);
                self.remove.attr('disabled', onlyGroup);
                self.restore.attr('disabled', IMu.User.group.entries.length == 0);

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
                        self.viewer.showSearch(search);
                    });
                }
            }
        }
    });
})(IMu.Themes.get('vienna'));
