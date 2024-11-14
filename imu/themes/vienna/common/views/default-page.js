(function(theme)
{
    theme.views.register('default-page', 'page',
    {
        _source: 'vienna/common/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                self.keywords = undefined;

                self.searchFormsLabel = undefined;
                self.searchForms = undefined;
                self.collectionLabel = undefined;
                self.collections = undefined;

                self.tabbed = undefined;
                self.browser = undefined;
                self.viewer = undefined;

                self.combinedViewer = undefined;
            },

            resize: function()
            {
                this._super.apply(this, arguments);

                var self = this;
                self.resizeSidebar();
            },

            makeHeader: function()
            {
                var self = this;

                self.makeTitle();
            },

            makeSidebar: function()
            {
                var self = this;

                self.makeSearchForms();
                if (self.widget.options.showMyCollections)
                    self.makeMyCollections();
            },

            makeContent: function()
            {
                var self = this;

                self.tabbed = self.content.IMu('tabbed-display',
                    {
                        ownerHeight: 'fixed'
                    }
                );

                var item;
                
                var sortControl = self.tabbed.owner.child('tr');

                item = self.tabbed.add('record-browser');
                self.browser = item.widget;
                self.browser.setOptions
                ({
                    showSelectionControl: true,
                    useURL: true
                });

                item = self.tabbed.add('combined-viewer');
                self.combinedViewer = self.viewer = item.widget;
                self.viewer.add('list-viewer');
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
            },

            makeFooter: function()
            {
            },

            /* Header */
            makeTitle: function()
            {
                var self = this;

                var table = self.header.child('table');
                table.css('width', '100%');
                var tr = table.child('tr');

                var td;

                td = tr.child('td', 'logo');
                td.css('width', '1%');
                var a = td.child('a');
                a.attr('href', window.location.pathname);
                var img = a.child('img', 'image');
                var src = IMu.Request.getURL('Image') + '&name=imu-logo';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);

                td = tr.child('td', 'title');
                td.css('width', '98%');
                td.text(IMu.string('imu-title'));

                td = tr.child('td', 'search');
                td.css('width', '1%');
                td.css('white-space', 'nowrap');
                var div  = td.child('div');
                
                self.keywords = div.IMu('keyword-search',
                    {
                        showLabel: true,
                        showSubmit: true,
                       
                        onSearch: function(text,imagesOnly)
                        {
                        	var terms = new IMu.Terms();
                        	
                        	terms.add('keywords',text);
                        	
	                        if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
	                        
                            self.doSearch(terms);
                        }
                    }
                );
            },

            /* Sidebar */
            makeSearchForms: function()
            {
                var self = this;

                self.searchFormsLabel = self.sidebar.child('div', 'searches-label');
                self.searchFormsLabel.text(IMu.string('common-search'));

                var searches = self.sidebar.child('div', 'searches');
                self.searchForms = searches.IMu('tabbed-display',
                {
                    showHeader: true
                });

                self.addSearchForms();
            },

            addSearchForms: function()
            {
				var self = this;

                self.makeAdvancedSearchForm()
                self.makeNarrativesSearchForm()
                self.makeObjectsSearchForm()
                self.makePartiesSearchForm()
                self.makeMultimediaSearchForm()
            },

            makeAdvancedSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'Advanced';
                item.icon = 'search-advanced';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        autoSuggest: true,
                        column: 'subjects',
                        lookup: 'Subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'AdmDateInserted',
                        prompt: 'common-date-inserted',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                (
                	//onlyItemsWithImages: true,
                    {
                        onSearch: function(terms,imagesOnly)
                        {
	                        if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
                            self.doSearch(terms);
                        }
                    }
                );
            },

            makeNarrativesSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'module-enarratives';
                item.icon = 'search-narratives';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'NarNarrative',
                        prompt: 'enarratives-text',
                        type: 'text'
                    },
                    {
                        column: 'DesIntendedAudience_tab',
                        prompt: 'Audience',
                        type: 'text'
                    },
                    {
                        column: 'subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'NarAuthorsLocal',
                        prompt: 'Authors',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                (
                    {
                        onSearch: function(terms,imagesOnly)
                        {
	                        if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
                            self.doSearch(terms, 'enarratives');
                        }
                    }
                );
            },

            makeObjectsSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'module-ecatalogue';
                item.icon = 'search-catalogue';
                item.widget.add
                ([
                    {
                        column: 'title',
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'accessionNumber',
                        prompt: 'Accession Number',
                        type: 'text'
                    },
                    {
                        column: 'objectStatus',
                        prompt: 'Status',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'objectRating',
                        lookup: 'Object Rating',
                        prompt: 'Rating',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                (
                    {
                        onSearch: function(terms,imagesOnly)
                        {
	                        if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
                            self.doSearch(terms, 'ecatalogue');
                        }
                    }
                );
            },

            makePartiesSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'module-eparties';
                item.icon = 'search-parties';
                item.widget.add
                ([
                    {
                        autoSuggest: true,
                        column: 'NamLast',
                        lookup: 'Surname',
                        prompt: 'Last Name',
                        type: 'text'
                    },
                    {
                        column: 'NamFirst',
                        prompt: 'First Name',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                (
                    {
                        onSearch: function(terms,imagesOnly)
                        {
                        	if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
                            self.doSearch(terms, 'eparties');
                        }
                    }
                );
            },

            makeMultimediaSearchForm: function()
            {
                var self = this;

                var item = self.searchForms.add('search-form');
                item.title = 'module-emultimedia';
                item.icon = 'search-multimedia';
                item.widget.add
                ([
                    {
                        column: 'MulTitle',
                        prompt: 'Title',
                        type: 'text'
                    },
                    {
                        column: 'media-type',
                        prompt: 'Type',
                        type: 'text'
                    },
                    {
                        column: 'MulMimeFormat',
                        prompt: 'Format',
                        type: 'text'
                    }	
                ]);
                item.widget.setOptions
                (
                    {
                        onSearch: function(terms,imagesOnly)
                        {
                        	if (imagesOnly)
	                        {
	                        	terms.add('MulHasMultiMedia', 'Y');
	                        }
                            self.doSearch(terms, 'emultimedia');
                        }
                    }
                );
            },	

            makeMyCollections: function()
            {
                var self = this;

                self.collectionsLabel = self.sidebar.child('div', 'collections-label');
                self.collectionsLabel.text(IMu.string('common-my-collections'));

                var collections = self.sidebar.child('div', 'collections');
                self.collections = collections.IMu('my-collections',
                    {
                        onRestoreGroup: function(group)
                        {
                            IMu.log('restore: group {0}', group);
                            var keys = [];
                            for (var i = 0; i < group.entries.length; i++)
                            {
                                var entry = group.entries[i];
                                keys.push([entry.module, entry.key]);
                            }
                            var search = new IMu.Request.Search();
                            search.findKeys(keys, function(hits)
                            {
                                IMu.log('restore: hits {0}', hits);
                                self.tabbed.select(1);
                                self.viewer.select(0);
                                self.viewer.showSearch(search);
                            });
                        }
                    }
                );
            },

            /* 
            ** Run a search based on passed parameter object.
            ** Typically this obtained from a URL hash parameter.
            ** Expects to be passed something like:
            **  { 'keywords': 'honey;canberra' }
            ** The mapping of allowed parameter to field/alias should be set in
            ** IMu.Config.linkSearches, eg:
            ** IMu.Config.linkSearches =
            ** {
            **      'keywords' : 'contentAnalysis',
            **      'date'     : 'CreDateCreated',
            **      'userTags' : 'WebUserTags_tab'
            ** };
            */
            linkSearch: function(hash)
            {
                var self = this;

                var terms = new IMu.Terms();

                jQuery.each(hash, function(alias, value)
                {
                    if (IMu.Config.linkSearches[alias] != undefined)
                    {
                        var searchField = IMu.Config.linkSearches[alias];
                        var values  = value.split(/;/);
                        jQuery.each(values, function(idx, value)
                        {
                            terms.add(searchField, value);
                        });
                    }
                    else
                    {
                        IMu.log('no definition in IMu.Config.linkSearches for: {0}', alias);
                    }
                });

                if (terms.list.length > 0)
                    self.doSearch(terms);
            },


            /* Convenience */
            doSearch: function(terms, include)
            {
                var self = this;

                if (typeof(include) == 'string')
                    include = [ include ];
                
                self.tabbed.beginDelay();

                var search = new IMu.Request.Search();
                search.search(terms, include, function(hits)
                {
                    self.tabbed.endDelay();

                    self.tabbed.select(1);
                    self.viewer.select(0);

                    self.viewer.addState(search);
                });
            },

            hideSidebar: function()
            {
                this.sidebar.visible(false);
            },

            resizeSidebar: function()
            {
                var self = this;

                IMu.log('resizeSidebar');
                if (! self.searchFormsLabel)
                    return;
                 
                if (! self.collectionsLabel && ! self.collections)
                	return;

                var sidebarHeight = self.sidebar.height();

                var used = 0;
                used += self.searchFormsLabel.fullHeight();
                used += self.searchForms.owner.fullHeight();
                if (self.collectionsLabel)
                    used += self.collectionsLabel.fullHeight();
                IMu.log('sidebarHeight {0} used {1}', sidebarHeight, used);
                if (self.collections)
                {
                    self.collections.owner.fullHeight(sidebarHeight - used);
                    self.collections.resize();
                }
            }
        },

        desktop:
        {
            createHeader: function()
            {
                this.makeHeader();
            },

            createSidebar: function()
            {
                this.makeSidebar();
            },

            createContent: function()
            {
                this.makeContent();
            },

            createFooter: function()
            {
                var img = this.footer.child('img');
                var src = IMu.Request.getURL('Image') + '&name=emu-silhouettes';
                img.attr('src', src);
                img.resizeOnLoad();
            }
        },

        phone:
        {
            createHeader: function()
            {
                /* No header for phones */
            },

            createSidebar: function()
            {
                this.makeSidebar();
                //this.hideSidebar();
            },

            createContent: function()
            {
                this.makeContent();
            },

            createFooter: function()
            {
                /* No footer for phones */
            }
        },

        tablet:
        {
            createHeader: function()
            {
                this.makeHeader();
            },

            createSidebar: function()
            {
                this.makeSidebar();
                //this.hideSidebar();
            },

            createContent: function()
            {
                this.makeContent();
            },

            createFooter: function()
            {
                /* No footer for tablets */
            }
        }
    });
})(IMu.Themes.get('vienna'));
