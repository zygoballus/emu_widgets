(function(theme)
{
    theme.views.register('default-page', 'page',
    {
        _source: 'marrakech/common/default-page',

        all:
        {
            makeHeader: function()
            {
                var self = this;

                self.makeTitle();
            },

            makeSidebar: function()
            {
                var self = this;

                self.makeSearchForms();
                self.makeMyCollections();
            },

            makeContent: function()
            {
                var self = this;

                self.tabbed = self.content.IMu('tabbed-display');

                var item = self.tabbed.add('record-browser');
                self.browser = item.widget;
                self.browser.setOptions
                ({
                    showSelectionControl: true,
                    useURL: true
                });

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
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
                div.IMu('keyword-search',
                    {
                        showLabel: true,
                        showSubmit: true,

                        onSearch: function(terms)
                        {
                            self.doSearch(['keywords', terms]);
                        }
                    }
                );
            },

            /* Sidebar */
            makeSearchForms: function()
            {
                var self = this;

                var label = self.sidebar.child('div', 'searches-label');
                label.text(IMu.string('common-search'));
                var searches = self.sidebar.child('div', 'searches');
searches.height(220);
                self.searchForms = searches.IMu('tabbed-display',
                {
                    showHeader: true
                });

                self.makeAdvancedSearchForm()
                self.makeNarrativesSearchForm()
                self.makeObjectsSearchForm()
                self.makePartiesSearchForm()
                self.makeMultimediaSearchForm()
            },

            makeAdvancedSearchForm: function()
            {
                var self = this;

                var item =
                {
                    type: 'search-form',
                    title: 'Advanced',
                    icon: 'search-advanced'
                }
                item = self.searchForms.add(item);
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
                    {
                        onSearch: function(terms)
                        {
                            self.doSearch(terms);
                        }
                    }
                );
            },

            makeNarrativesSearchForm: function()
            {
                var self = this;

                var item =
                {
                    type: 'search-form',
                    title: 'module-enarratives',
                    icon: 'search-narratives'
                }
                item = self.searchForms.add(item);
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
                        onSearch: function(terms)
                        {
                            self.doSearch(terms);
                        }
                    }
                );
            },

            makeObjectsSearchForm: function()
            {
                var self = this;

                var item =
                {
                    type: 'search-form',
                    title: 'module-ecatalogue',
                    icon: 'search-catalogue'
                }
                item = self.searchForms.add(item);
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
                        onSearch: function(terms)
                        {
                            self.doSearch(terms);
                        }
                    }
                );
            },

            makePartiesSearchForm: function()
            {
                var self = this;

                var item =
                {
                    type: 'search-form',
                    title: 'module-eparties',
                    icon: 'search-parties'
                }
                item = self.searchForms.add(item);
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
                        onSearch: function(terms)
                        {
                            self.doSearch(terms);
                        }
                    }
                );
            },

            makeMultimediaSearchForm: function()
            {
                var self = this;

                var item = 
                {
                    type: 'search-form',
                    title: 'module-emultimedia',
                    icon: 'search-multimedia'
                }
                item = self.searchForms.add(item);
                item.widget.add
                ([
                    {
                        column: 'MulTitle',
                        prompt: 'Title',
                        type: 'text'
                    },
                    {
                        column: 'DetResourceType',
                        prompt: 'Type',
                        type: 'text'
                    },
                    {
                        column: 'MulMimeType',
                        prompt: 'Mime Type',
                        type: 'text'
                    },
                    {
                        column: 'MulMimeFormat',
                        prompt: 'Mime Format',
                        type: 'text'
                    }	
                ]);
                item.widget.setOptions
                (
                    {
                        onSearch: function(terms)
                        {
                            self.doSearch(terms);
                        }
                    }
                );
            },	

            makeMyCollections: function()
            {
                var self = this;

                var label = self.sidebar.child('div', 'collections-label');
                label.text(IMu.string('common-my-collections'));

                var collections = self.sidebar.child('div', 'collections');
                collections.IMu('my-collections',
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

            /* Convenience */
            doSearch: function(terms)
            {
                var self = this;

                var search = new IMu.Request.Search();
                search.search(terms, function(hits)
                {
                    self.tabbed.select(1);
                    self.viewer.select(0);
                    self.viewer.showSearch(search);
                });
            },

            hideSidebar: function()
            {
                this.sidebar.visible(false);
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
                var self = this;

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
                this.hideSidebar();
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
                this.hideSidebar();
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
})(IMu.Themes.get('marrakech'));
