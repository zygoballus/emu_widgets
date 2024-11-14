(function(theme)
{
    theme.views.register('search-page', 'page',
    {
        _source: 'darwin/common/pages/search-page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);
                self.widget.owner.addClass('imu-search-page');

                self.navigationSection = undefined;
                self.searchToggleBtn = undefined;
                self.searchSection = undefined;
                
                this.wrapper = undefined;

                IMu.Events.bind('begin-search-delay',
                function()
                {
                    self.widget.combinedViewer.view.beginDelay();
                });

                IMu.Events.bind('end-search-delay',
                function()
                {
                    self.widget.combinedViewer.view.endDelay();
                });

                IMu.Events.bind('clear-search-results',
                function()
                {
                    self.widget.combinedViewer.dropSearch();
                    self.widget.combinedViewer.updateResultCount();
                });

                IMu.Events.bind('clear-search-forms',
                function()
                {
                    var forms = self.searchTabs.widget.pages;
                    for (var i = 0; i < forms.length; i++)
                        forms[i].widget.clear();
                });

                IMu.Events.bind('show-search',
                function(e, search, options)
                {
                    self.toggleSearch('closed');
                    options = options || {};

                    var index = 0;
                    if (options.view)
                    {
                        var list = self.widget.combinedViewer.list;
                        for (var i = 0; i < list.length; i++)
                        {
                            if (options.view == list[i].type)
                            {
                                index = i;
                                break;
                            }
                        }
                    }
                    
                    self.widget.combinedViewer.select(index);

                    self.widget.combinedViewer.addState(search, options.offset);
                });

                IMu.Events.bind('show-search-error',
                function(e, response)
                {
                    self.widget.combinedViewer.view.showError(response);
                });
            },

            _create: function()
            {
                this._super.apply(this, arguments);

                this.wrapper = this.content.child('div', 'wrapper');

                this.navigationSection = this.wrapper.child('div', 'navigation');
                
                var backButton = this.navigationSection.child('button', 'back');
                backButton.text(IMu.string('back-button'));
                
                backButton.click(function(e)
                {
                    IMu.Events.trigger('open-welcome-page');
                    IMu.Events.trigger('clear-search-forms');
                    e.preventDefault();
                });

                this.createSearches();
                this.createResults();
            },

            createResults: function()
            {
                var results = this.resultsSection =
                    jQuery("<section class='results'></section>");
                
                var holder = results.child('div', 'holder');

                var combinedViewer = this.widget.combinedViewer = 
                    holder.child('div').IMu('combined-viewer');

                combinedViewer.add(
                {
                    'type': 'list-viewer', 
                    'options':
                    {
                        'recordsPerRow': 1
                    }
                });
                combinedViewer.add('lightbox-viewer');
                combinedViewer.add('details-viewer');

                results.appendTo(this.wrapper);
            },

            createSearches: function()
            {
                var self = this;

                var searches = self.searchSection = jQuery(
                    "<section class='searches closed'></section");

                var holder = searches.child('div', 'holder');

                var toggleBtn = self.searchToggleBtn = 
                    holder.child('div', 'header').child('button', 'toggle closed');

                toggleBtn.child('div', 'icon no-icon');

                self.searchTitleText = toggleBtn.child('a', 'title');
                self.setSearchTitleModule();

                toggleBtn.child('div', 'icon toggle-icon');

                var searchForms = self.searchForms =
                    holder.child('div', 'content hidden');

                toggleBtn.click(function()
                {
                    self.toggleSearch();
                });

                var tabbedDisplay = searchForms.child('div')
                .IMu('tabbed-display',
                {
                    showHeader: false
                });

                self.widget.searchTabs = tabbedDisplay;

                IMu.Events.bind('tabbed-display-view-created',
                function(e, widget)
                {
                    self.searchTabs = tabbedDisplay.view;
                });

                searches.appendTo(this.wrapper);
            },
            
            makeKeywordSearchForm: function()
            {
                var form = this.makeSearchForm();
                form.title = IMu.string('keywords');

                form.widget.add(
                [
                    {
                        column: 'keywords',
                        prompt: 'keywords',
                        type: 'text'
                    }
                ]);
            },

            makeSearchForm: function(module, options)
            {
                var self = this;

                options = options || {};
                
                var formOptions = 
                {
                    showSubmit: true,
                    onlyItemsWithImages: true
                };

                for (var key in options)
                {
                    formOptions[key] = options[key];
                }

                var form = self.widget.searchTabs.add('search-form', formOptions);

                if (module)
                    form.title = 'module-' + module;
               
                form.widget.setOptions(
                {
                    onSearch: function(terms, imagesOnly)
                    {
                        IMu.Events.trigger('begin-search-delay');
                        IMu.Events.trigger('clear-search-results');

                        self.toggleSearch('closed');

                        if (imagesOnly)
                            terms.add('MulHasMultiMedia', 'Y');

                        self.widget.parent.doSearch(terms, module, function(search)
                        {
                            IMu.Events.trigger('show-search', search);
                        });
                    }
                });

                return form;
            },

            resize: function()
            {
                var contentHeight = this.content.fullHeight();
                var wrapperPadding = 
                    parseInt(this.wrapper.css('padding-bottom'), 10) +
                    parseInt(this.wrapper.css('padding-top'), 10);
                var navHeight = this.navigationSection.fullHeight();
                
                var toggled = false;
                if (! this.searchForms.hasClass('hidden'))
                {
                    toggled = true;
                    this.searchForms.addClass('hidden');
                }

                var searchHeight = this.searchSection.fullHeight();
                
                if (toggled)
                    this.searchForms.removeClass('hidden');

                var height = contentHeight - navHeight 
                    - searchHeight - wrapperPadding;

                this.resultsSection.css('height', height);
            },

            /* PUBLIC
            */
            selectSearchTab: function(index)
            {
               this.searchTabs.widget.select(index);
            },

            setSearchTitleModule: function(moduleName)
            {
                var text = IMu.string('search-title');
                if (moduleName)
                {
                    moduleName = IMu.string(moduleName + '-module');
                    text = IMu.Format.formatParams(text, [moduleName]);
                }
                else
                    text = IMu.Format.formatParams(text, 
                        [IMu.string('keyword')]);
                
                this.searchTitleText.text(text);
            },

            toggleSearch: function(state)
            {
                var toggleBtn = this.searchToggleBtn;
                var searches = this.searchSection;
                var searchForms = this.searchForms;

                if (state == 'closed')
                {
                    toggleBtn.removeClass('open').addClass('closed');
                    searches.removeClass('open').addClass('closed');
                    searchForms.removeClass('show').addClass('hidden');
                }
                else if (state == 'open')
                {
                    toggleBtn.removeClass('closed').addClass('open');
                    searches.removeClass('closed').addClass('open');
                    searchForms.removeClass('hidden').addClass('show');
                }
                else if (state === undefined)
                {
                    toggleBtn.toggleClass('closed open');
                    searches.toggleClass('closed open');
                    searchForms.toggleClass('hidden show');
                }
                // else do nothing
            }
        }
    });
})(IMu.Themes.get('darwin'));
