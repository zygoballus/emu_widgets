(function(theme)
{
    theme.views.register('welcome-page', 'page',
    {
        _source: 'darwin/common/pages/welcome-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                this.widget.owner.addClass('imu-welcome-page');

                this.titleText = undefined;
                this.subtitleText = undefined;

                this.categorySelection = undefined;
                this.categoryButtons = undefined;

                this.myCollection = undefined;
            },

            _create: function()
            {
                this._super.apply(this, arguments);
                
                this.createCategorySelection(
                    ['ecatalogue', 'ecollectionevents', 'eparties', 'emultimedia']);

                this.createMyCollectionSection();
            },

            createCategorySelection: function(categories)
            {
                var self = this;
                categories = categories || [];

                this.categorySelection = jQuery(
                    "<section class='category-selection'></section>");

                var holder = this.categorySelection.child('div', 'holder');
                
                this.titleText = holder.child('h1');
                this.subtitleText = holder.child('h2');

                
                this.categoryButtons = holder.child('div', 'categories');
                for(var i = 0; i < categories.length; i++)
                {
                    (function(owner, category)
                    {
                        var button = owner.child('button');

                        var src = IMu.Request.getURL('Image') 
                            + '&name=' + category + '-icon';

                        button.child('div', 'icon', category + '-icon');

                        button.child('a').text(IMu.string(category + '-module'));

                        button.click(function(e)
                        {
                            IMu.Events.trigger('open-' + category + '-search');
                            
                            var module = IMu.string(category + '-module');
                            module = module.toLowerCase();

                            IMu.URL.Hash.values = {};
                            IMu.URL.Hash.values[module + '-search'] = '';
                            IMu.URL.Hash.update();

                            e.preventDefault();
                        });
                    })(this.categoryButtons, categories[i]);
                };

                
                this.setTitleText();
                this.setSubtitleText();

                this.categorySelection.appendTo(this.content);
            },


            createMyCollectionSection: function()
            {
                this.myCollectionSection = jQuery(
                    "<section class='my-collection'></section>");

                var holder = this.myCollectionSection.child('div', 'holder');

                var toggleBtn = holder.child('div', 'header')
                    .child('button', 'toggle closed');

                var src = IMu.Request.getURL('Image') 
                    + '&name=my-collection-icon';

                toggleBtn.child('img', 'icon my-collection-icon').attr('src', src);

                toggleBtn.child('a', 'title').text(IMu.string('my-collection-module'));

                toggleBtn.child('div', 'icon toggle-icon');

                var myCollection = this.myCollection = 
                    holder.child('div', 'content hidden');

                toggleBtn.click(function()
                {
                    toggleBtn.toggleClass('closed open');
                    myCollection.toggleClass('hidden shown');
                });

                //TODO
                this.widget.collections = myCollection.IMu('my-collections',
                {
                    onRestoreGroup: function(group)
                    {
                        IMu.log('restore: group {0}', group);
                        
                        if (! this.search)
                            return;

                        IMu.Events.trigger('clear-search-results');
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('open-keyword-search', 'closed');
                        
                        IMu.Events.trigger('show-search', this.search);
                    }
                });

                this.myCollectionSection.appendTo(this.content);
            },

            /* PUBLIC
            */

            setSubtitleText: function()
            {
                this.subtitleText.text(IMu.string('select-a-category'));
            },
            
            setTitleText: function()
            {
                this.titleText.text(IMu.string('welcome-page-message'));
            }
        }
    });
})(IMu.Themes.get('darwin'));
