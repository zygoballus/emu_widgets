/*!
 * @since 2.0
 */
(function()
{
    IMu.Widgets.add('mineralogy-page', 'page',
    {
        _construct: function()
        {
            this._super.apply(this, arguments);
            this.classes.push('imu-mineralogy-page');

            this.registerOptions
            ({
                /*!
                ** Specifies that the my collections box should be shown in lower
                ** part of sidebar.
                */
                showMyCollections: true
            });
        },

        doSearch: function(terms, include, callback)
        {
            var self = this;

            if (typeof(include) == 'string')
                include = [ include ];

            if (userSearch !== undefined)
                userSearch.onComplete = undefined;

            var search = userSearch = new IMu.Request.Search();
            search.search(terms, include);
            search.onComplete = function(hits)
            {
                search.onComplete = undefined;

                if (! hits.success && self.view.onSearchError)
                {
                    self.view.onSearchError(hits.response);
                }

                /* If updateURL option is set to true, update the
                ** URL after a search
                */
                if (IMu.Config.updateURL)
                {
                    IMu.URL.Hash.updateURLHashValues(terms, include,
                        hits.response.id);
                }

                if (callback)
                    callback(search);
            };
        },

        /*!
        ** Run a search based on passed URL hash parameters.
        ** expects to be passed something like:
        **  #imu[keywords=honey]
        ** in the URL
        */
        processUrlHash: function(hash)
        {
            var self = this;

            if (self.view.linkSearch != undefined)
                self.view.linkSearch(hash);
            else
            {
                IMu.log("page has no url hash processing capability for: {0}", hash);
            }
        },

        /*!
        ** Run a search based on the browser URL hash parameters.
        */
        processURLSearch: function()
        {
            var self = this;

            var rid = IMu.URL.Hash.get('details');
            if (rid !== undefined)
            {
                self.view.tabbed.select(1);
                self.view.viewer.select(2);
                self.view.viewer.showRecord(rid);
                return;
            }

            var view = IMu.URL.Hash.get('view');
            if (view !== undefined)
            {
                self.view.tabbed.select(1);

                if (view == 'list')
                    self.view.viewer.select(0);
                else if (view == 'lightbox')
                    self.view.viewer.select(1);
                else if (view == 'details')
                    self.view.viewer.select(2);

                var values = IMu.URL.Hash.values;
                var modules = undefined;
                var terms = new IMu.Terms();

                for (var key in values)
                {
                    if (key == 'view' || key == 'id')
                        continue;

                    /* Build the modules array with the modules to search on
                    */
                    if (key == 'module' || key == 'modules')
                    {
                        if (modules === undefined)
                            modules = [];
                        if (IMu.Type.isArray(values[key]))
                        {
                            for (var i = 0; i < values[key].length; i++)
                                modules = modules.concat(values[key][i].split(';'));
                        }
                        else
                            modules = modules.concat(values[key].split(';'));
                        continue;
                    }

                    /* Build the search terms array
                    */
                    if (IMu.Type.isArray(values[key]))
                    {
                        for (var i = 0; i < values[key].length; i++)
                            terms.add(key, values[key][i]);
                    }
                    else
                        terms.add(key, values[key]);
                }

                /* Set the fields on the search form with the search terms from the
                ** URL if they exists. First set the keywords field and then go
                ** through every field on the search form.
                */
                if (self.view.keywords)
                {
                    var keywords = IMu.URL.Hash.get('keywords');
                    if (keywords)
                    {
                        if (IMu.Type.isArray(keywords))
                            self.view.keywords.view.input[0].value = keywords[0];
                        else
                            self.view.keywords.view.input[0].value = keywords;
                    }
                    else
                        self.view.keywords.view.input[0].value = '';
                }

                for (var i = 0; i < self.view.searchForms.pages.length; i++)
                {
                    var searchForm = self.view.searchForms.pages[i];

                    if (searchForm.widget.fields)
                    {
                        for (var j = 0; j < searchForm.widget.fields.length; j++)
                        {
                            var value = IMu.URL.Hash.get(searchForm.widget.fields[j].column);
                            if (value)
                            {
                                if (IMu.Type.isArray(value))
                                    searchForm.widget.fields[j].input[0].value = value[0];
                                else
                                    searchForm.widget.fields[j].input[0].value = value;
                            }
                            else
                                searchForm.widget.fields[j].input[0].value = '';
                        }
                    }
                }

                var search = new IMu.Request.Search();
                search.onError = function(response)
                {
                    /* If the handler has timed out we want to run the
                    ** search again
                    */
                    if (response.id ==  'ContextBadIdentifier')
                    {
                        search.id = null;
                        search.search(terms, modules, function(hits)
                        {
                            IMu.URL.Hash.set('id', search.id);
                            self.view.viewer.showSearch(search);
                        });
                    }
                };

                /* See if the handler with the specified id exist, if so
                ** we retrieve the hits. If the handler has timed out we
                ** handle the error and run a new search in the function
                ** above
                */
                var id = IMu.URL.Hash.get('id');
                if (id !== undefined)
                {
                    search.id = id;
                    search.getAllHits(function(hits)
                    {
                        search.hits = hits;
                        self.view.viewer.showSearch(search);
                    });
                    return;
                }

                /* If we don't have an id, run search and display results
                */
                search.search(terms, modules, function(hits)
                {
                    self.view.viewer.showSearch(search);
                });
                return;
            }

            var rid = IMu.URL.Hash.get('browse');
            if (rid === undefined)
                rid = IMu.Config.browseMaster;
            if (rid !== undefined)
            {
                self.view.tabbed.select(0);
                self.view.browser.showRecord(rid);
                return;
            }
        }
    });

    // Private
    var userSearch = undefined
})();
