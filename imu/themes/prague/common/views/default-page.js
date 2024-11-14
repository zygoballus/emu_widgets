(function(theme)
{
    theme.views.register('default-page', 'page',
    {
        _source: 'prague/common/default-page',

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
                
                item = self.tabbed.add('record-browser');
                self.browser = item.widget;
                
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

                var searches = self.sidebar.child('div', 'searches');
                self.searchFormsLabel = searches.child('div', 'searches-label');
                self.searchFormsLabel.text(IMu.string('common-search'));

                var searchForms = searches.child('div', 'search-forms');
                self.searchForms = searchForms.IMu('tabbed-display',
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
                        column: 'what',
                        prompt: 'common-what',
                        type: 'text'
                    },
                    {
                        column: 'where',
                        prompt: 'common-where',
                        type: 'text'
                    },
                    {
                        column: 'who',
                        prompt: 'common-who',
                        type: 'text'
                    },
                    {
                        column: 'when',
                        prompt: 'common-when',
                        type: 'text'
                    },
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
                        column: 'DesType_tab',
                        prompt: 'enarratives-type',
                        type: 'text'
                    },
                    {
                        column: 'NarAuthorsLocal',
                        prompt: 'enarratives-authors',
                        type: 'text'
                    },
                    {
                        column: 'NarDate0',
                        prompt: 'common-date',
                        type: 'text'
                    },
                    {
                        column: 'DesPurpose',
                        prompt: 'enarratives-purpose',
                        type: 'text'
                    },
                    {
                        column: 'DesIntendedAudience_tab',
                        prompt: 'enarratives-audience',
                        type: 'text'
                    },
                    {
                        column: 'DesGeographicLocation_tab',
                        prompt: 'common-location',
                        type: 'text'
                    },
                    {
                        column: 'subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'NotNotes',
                        prompt: 'common-notes',
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
                        prompt: 'accession-number',
                        type: 'text'
                    },
                    {
                        column: 'objectStatus',
                        prompt: 'status',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'objectRating',
                        lookup: 'object-rating',
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
                        allowEmpty: true,
                        column: 'NamPartyType',
                        prompt: 'party-type',
                        lookup: 'Party Type',
                        type: 'selection'
                    },
                    {
                        autoSuggest: true,
                        column: 'NamLast',
                        lookup: 'Surname',
                        prompt: 'eparties-last-name',
                        type: 'text'
                    },
                    {
                        column: 'NamFirst',
                        prompt: 'eparties-first-name',
                        type: 'text'
                    },
                    {
                        column: 'NamRoles_tab',
                        prompt: 'eparties-role',
                        type: 'text'
                    },
                    {
                        column: 'BioNationality',
                        prompt: 'eparties-nationality',
                        type: 'text'
                    },
                    {
                        column: 'BioBirthDate',
                        prompt: 'eparties-birth-date',
                        type: 'text'
                    },
                    {
                        column: 'BioDeathDate',
                        prompt: 'eparties-death-date',
                        type: 'text'
                    },
                    {
                        column: 'BioBirthPlace',
                        prompt: 'eparties-birth-place',
                        type: 'text'
                    },
                    {
                        column: 'BioDeathPlace',
                        prompt: 'eparties-death-place',
                        type: 'text'
                    },
                    {
                        column: 'NamOrganisation',
                        prompt: 'common-organisation',
                        type: 'text'
                    },
                    {
                        column: 'NamOrganisationOtherNames_tab',
                        prompt: 'eparties-other-names',
                        type: 'text'
                    },
                    {
                        column: 'AddPhysStreet',
                        prompt: 'eparties-street',
                        type: 'text'
                    },
                    {
                        column: 'AddPhysCity',
                        prompt: 'eparties-city',
                        type: 'text'
                    },
                    {
                        column: 'AddPhysState',
                        prompt: 'eparties-state',
                        type: 'text'
                    },
                    {
                        column: 'AddPhysPost',
                        prompt: 'eparties-zip-code',
                        type: 'text'
                    },
                    {
                        column: 'AddPhysCountry',
                        prompt: 'eparties-country',
                        type: 'text'
                    },
                    {
                        column: 'NotNotes',
                        prompt: 'common-notes',
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
                        prompt: 'common-title',
                        type: 'text'
                    },
                    {
                        column: 'media-type',
                        prompt: 'emultimedia-media-type',
                        type: 'text'
                    },
                    {
                        column: 'MulMimeFormat',
                        prompt: 'emultimedia-mime-format',
                        type: 'text'
                    },	
                    {
                        column: 'MulCreator_tab',
                        prompt: 'emultimedia-creator',
                        type: 'text'
                    },	
                    {
                        column: 'DetPublisher',
                        prompt: 'emultimedia-publisher',
                        type: 'text'
                    },	
                    {
                        column: 'DetLanguage_tab',
                        prompt: 'emultimedia-language',
                        type: 'text'
                    },	
                    {
                        column: 'DetDate0',
                        prompt: 'common-date',
                        type: 'text'
                    },
                    {
                        column: 'DetSubject_tab',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'NotNotes',
                        prompt: 'common-notes',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions(
                {
                    onlyItemsWithImages: false,
                    onSearch: function(terms)
                    {
                        self.doSearch(terms, 'emultimedia');
                    }
                });
            },	

            makeMyCollections: function()
            {
                var self = this;

                var collections = self.searchForms.add('my-collections',
                {
                    showImageExport: false,

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
                    },

                    onExportGroup: function(group)
                    {
                            IMu.log('export: group {0}', group);
                            var url = IMu.Request.getURL('Export');
                            url += '&group=' + group.irn;
                            url += '&column=export';
                            window.location = url;
                        },

                        onExportImageGroup: function(group)
                        {
                            IMu.log('image export: group {0}', group);
                            var url = IMu.Request.getURL('ImageExport');
                            url += '&group=' + group.irn;
                            window.location = url;
                        }

                });
                collections.title = 'common-my-collections';
                collections.icon = 'my-collections';

                self.collections = collections.widget;


            },

            /* Convenience */
            doSearch: function(terms, include)
            {
                var self = this;

                self.tabbed.beginDelay();

                self.widget.doSearch(terms, include, function(search)
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

                /* Resize if the label has changed size
                ** if the search form position is absolute
                */
                if (self.searchFormsLabel)
                {
                    var searchForms = self.searchForms.owner;
                    if (searchForms.css('position') == 'absolute')
                    {
                        var labelHeight = Math.floor(self.searchFormsLabel.fullHeight());
                        var searchFormsTop = self.searchForms.owner.css('top');
                        searchFormsTop = parseInt(searchFormsTop);
                        if (searchFormsTop != labelHeight)
                        {
                            searchForms.css('top', labelHeight);
                            IMu.log('searchForms top {0}', labelHeight);
                        }
                    }

                }

                /* TODO: put resizing for collections into appropriate clients code
                if (self.collections)
                {
                    self.collections.owner.fullHeight(sidebarHeight - used);
                    self.collections.resize();
                }
                */
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
                this.makeHeader();
                this.header.find('.search').css('width', '');
            },

            createSidebar: function()
            {
                this.makeSidebar();
                this.sidebar.addClass('phone');
                this.hideSidebar();
            },

            createContent: function()
            {
                this.makeContent();
            },

            createFooter: function()
            {
                /* No footer for phones */
            },

            createToggle: function()
            {
                var self = this;

                IMu.Events.on('keyword-search-view-created',
                function(e, widget)
                {
                    var a = self.toggle = jQuery("<a class='toggle'></a>");
                    widget.owner.after(a);
                    a.text(IMu.string('page-sidebar-show-label'));

                    a.on('click', function(e)
                    {
                        self.sidebar.toggle();
                        window.setTimeout(function()
                        {
                            IMu.Events.trigger('dom-resize');
                        }, 1);
                    });
                });

                IMu.Events.on('imu-search',
                function(e)
                {
                    if (! self.sidebar)
                        return;
                    self.sidebar.hide();
                    IMu.Events.trigger('dom-resize');
                });
            },

            resize: function()
            {
                var self = this;

                var headerHeight = self.header.fullHeight();
                var footerHeight = self.footer.fullHeight();
                self.sidebar.css('top', headerHeight);
                self.sidebar.css('bottom', footerHeight);

                var sidebarWidth = 0;
                if (self.sidebar.visible())
                    sidebarWidth = self.sidebar.fullWidth();
                self.sidebar.css('display', 'none');

                self.content.css('top', headerHeight);
                self.content.css('bottom', footerHeight);

                if (self.widget.options.showToggle && self.toggle)
                {
                    var label;
                    var title;
                    if (sidebarWidth > 0)
                    {
                        label = IMu.string('page-sidebar-hide-title');
                        title = IMu.string('page-sidebar-hide-title');
                    }
                    else
                    {
                        label = IMu.string('page-sidebar-show-title');
                        title = IMu.string('page-sidebar-show-title');
                    }
                    self.toggle.html(label);
                    self.toggle.attr('title', title);
                }

                self.resizeSidebar();
                if (sidebarWidth > 0)
                {
                    self.sidebar.css('display', 'block');
                }
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
})(IMu.Themes.get('prague'));
