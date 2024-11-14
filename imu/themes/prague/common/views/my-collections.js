(function(theme)
{
    theme.views.register('my-collections',
    {
        _source: 'prague/common/my-collections',

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
                
                self.setId();
                
                var src = IMu.Request.getURL('Image') + '&name=my-collections-';
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
//                self.prev.text('<');
                this.prev.child('img').attr('src', src + IMu.Languages.current.near);
                self.prev.bind('click', function()
                {
                    self.widget.previousGroup();
                });

                self.next = self.header.child('button', 'next');
                self.next.attr('title', IMu.string('common-next'));
//                self.next.text('>');
                this.next.child('img').attr('src', src + IMu.Languages.current.far);
                self.next.bind('click', function()
                {
                    self.widget.nextGroup();
                });

                self.remove = self.header.child('button', 'remove');
                self.remove.attr('title', IMu.string('common-remove'));
//                self.remove.text('-');
                this.remove.child('img').attr('src', src + 'remove');
                self.remove.bind('click', function()
                {
                    self.widget.removeGroup();
                });

                self.add = self.header.child('button', 'add');
                self.add.attr('title', IMu.string('common-add'));
//                self.add.text('+');
                this.add.child('img').attr('src', src + 'add');
                self.add.bind('click', function()
                {
                    self.widget.addGroup();
                });

                self.more = self.header.child('button');
                self.more.attr('title', IMu.string('common-more'));
//                self.more.html('&rarr;');
                this.more.child('img').attr('src', src + 'more');
                self.more.bind('click', function()
                {
                    self.background = self.header.child('div', 'background');
                    self.background.bind('click', function()
                    {
                        self.background.remove();
                    });

                    self.box = self.background.child('div', 'box');

                    self.restore = self.box.child(
                        'div', 'button-container').child('div', 'box-button');
                    self.restore.text(IMu.string('common-restore'));
                    self.restore.bind('click', function()
                    {
                        self.widget.restoreGroup();
                    });

                    if (self.widget.options.showExport)
                    {
                        self.fileExport = self.box.child(
                            'div', 'button-container').child('div', 'box-button');
				    	self.fileExport.text(IMu.string('common-export'));
                        self.fileExport.bind('click', function()
                        {
                            self.widget.exportGroup();
                        });
                    }

                    if (self.widget.options.showImageExport)
                    {
                        self.imageExport = self.box.child(
                            'div', 'button-container').child('div', 'box-button');
                        self.imageExport.text(IMu.string('common-image-export'));
                        self.imageExport.bind('click', function()
                        {
                            self.widget.exportImageGroup();
                        });
                    }
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
                /* Do nothing by default
                */
            },

            update: function()
            {
                var self = this;

                var onlyGroup = IMu.User.groups.length == 1;
                self.prev.attr('disabled', onlyGroup);
                self.next.attr('disabled', onlyGroup);
                self.remove.attr('disabled', onlyGroup);
               
                if (! IMu.User.group)
                {
                    self.more.attr('disabled', true);
                    return;
                }
                
                self.more.attr('disabled', false);
                self.name.val(IMu.User.group.name);

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
                        self.viewer.showSearch(search);
                    });
                }
            }
        }
    });
})(IMu.Themes.get('prague'));
