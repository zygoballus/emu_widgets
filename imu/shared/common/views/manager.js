(function(theme)
{
    theme.views.register('manager', 'base',
    {
        _source: 'shared/common/manager',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var widget = this.widget;
                var owner = widget.owner;

                this.heading = owner.child('div', 'heading');
                var heading = this.widget.getOption('heading');
                if (heading)
                    this.heading.text(IMu.string(heading));

                this.list = owner.child('div', 'list');

                if (widget.getOption('showAdd', false))
                {
                    var add = owner.child('div', 'add');
                    add.on('click', function()
                    {
                        widget.doAdd();
                    });

                    var image = add.child('img', 'image');
                    var url = IMu.Request.getURL('Image') + '&name=app/add';
                    image.attr('src', url);

                    var text = add.child('div', 'text')
                    var str = widget.getOption('addLabel', 'manager-add');
                    text.text(IMu.string(str));
                }

                this.update();
            },

            update: function()
            {
                this.list.empty();
                for (var i in this.widget.list)
                    this.updateItem(this.widget.list[i]);
            },

            updateItem: function(item)
            {
                var self = this;

                var row = self.list.child('div', 'item');

                var cell = row.child('div', 'title');
                cell.text(item.title);
                cell.on('click', function()
                {
                    self.widget.doUse(item);
                });

                cell = row.child('div', 'edit');
                if (item.permission == 'edit')
                {
                    var img = cell.child('img');
                    var url = IMu.Request.getURL('Image') + '&name=app/edit';
                    img.attr('src', url);

                    cell.on('click', function()
                    {
                        self.widget.doEdit(item);
                    });
                }
                else
                {
                    cell.html('&nbsp;');
                    cell.on('click', function()
                    {
                        self.widget.doUse(item);
                    });
                }

                cell = row.child('div', 'remove');
                if (item.permission == 'edit')
                {
                    var img = cell.child('img');
                    var url = IMu.Request.getURL('Image') + '&name=cross';
                    img.attr('src', url);

                    cell.on('click', function()
                    {
                        self.widget.doRemove(item);
                    });
                }
                else
                {
                    cell.html('&nbsp;');
                    cell.on('click', function()
                    {
                        self.widget.doUse(item);
                    });
                }
            }
        }
    });
})(IMu.Themes.shared);
