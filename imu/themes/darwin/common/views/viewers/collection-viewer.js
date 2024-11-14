(function(theme)
{
    theme.views.register('collection-viewer', 'lightbox-viewer',
    {
        _source: 'darwin/common/viewers/collection-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                this.columns = 'collection';
                this.pageSize = 50;
            },

            resize: function()
            {
            },

            setSearch: function(search)
            {
                var self = this;

                self.holder.empty();

                search.fetch('start', 0, -1, 'collection',
                function(result, success)
                {
                    if (! success || ! result.count)
                        return;

                    self.holder.empty();
                    var index = 0;

                    for (var i = 0; i < result.modules.length; i++)
                    {
                        var module = result.modules[i];
                        
                        var method = 'create_' + module.name;
                        if (! self[method])
                            method = 'create_other';

                        for (var j = 0; j < module.rows.length; j++)
                        {
                            var row = module.rows[j];

                            row.offset = index;
                            index++;

                            var record = self.holder.child('div', 
                                'record', module.name);
                            self[method](record, row);
                        }
                    }
                });
            }
        }
    });
})(IMu.Themes.get('darwin'));
