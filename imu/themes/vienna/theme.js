/* THIS FILE IS BUILT AUTOMATICALLY.
** DO NOT CHANGE IT DIRECTLY.
**
** Built at: 2024-11-14 17:52:27 UTC (2024-11-14 17:52:27 UTC)
*/
"use strict";

/* Source: ./themes/vienna/common/strings.js
*/
(function(theme)
{
    theme.strings.register
    ({
        'child-narratives':
        {
            en: 'Child narratives'
        },
        'collection-number':
        {
            en: 'Collection {0} of {1}'
        },
        'common-searching':
        {
            en: 'Searching...'
        },
        'no-current-search':
        {
            en: 'No current search'
        },
        'only-items-with-images':
        {
            en: 'Only items with images',
            fr: 'Uniquement les articles avec images'
        },
        'parent-narratives':
        {
            en: 'Parent narratives'
        },
        'related-narratives':
        {
            en: 'Related narratives'
        },
        'related-objects':
        {
            en: 'Related objects'
        },
        'section-hide-label':
        {
            en: '-'
        },
        'section-objects-label':
        {
            en: 'Objects'
        },
        'section-related-narratives-label':
        {
            en: 'Related narratives'
        },
        'section-show-label':
        {
            en: '+'
        },
        'section-subnarratives-label':
        {
            en: 'Sub-narratives'
        },

        'page-sidebar-hide-label':
        {
            ar: '&raquo;',
            en: '&laquo;',
            fr: '&laquo;'
        },
        'page-sidebar-hide-title':
        {
            en: 'Hide sidebar'
        },
        'page-sidebar-show-label':
        {
            ar: '&laquo;',
            en: '&raquo;',
            fr: '&raquo;'
        },
        'page-sidebar-show-title':
        {
            en: 'Show sidebar'
        },
        'collectionGroup':
        {
            en: 'Held By'
        },
        'objectType':
        {
            en: 'Category'
        },
        'userTags':
        {
            en: 'User Tags'
        },
        'refine-search':
        {
            en: 'Refine search'
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/collection-viewer.js
*/
(function(theme)
{
    theme.views.register('collection-viewer', 'vertical-viewer',
    {
        _source: 'vienna/common/collection-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'collection';
                self.pageSize = 50;
            },

            create_other: function(div, data)
            {
                var self = this;

                var table = div.child('table');
                var tr = table.child('tr');

                // image
                var image = tr.child('td', 'image');
                image.css('width', '1%');
                var frame = image.child('div', 'frame');
                if (data.image)
                {
                    var img = frame.child('img');

                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('index', 1);
                    var url = mm.getURL();

                    img.attr('src', url);
                    img.imagesLoaded(function()
                    {
                        var frameHeight = frame.height();
                        var imageHeight = img.height();
                        if (frameHeight > imageHeight)
                        {
                            var margin = Math.floor((frameHeight - imageHeight) / 2);
                            img.css('margin-top', margin + 'px');
                        }
                    });
                }

                var title = tr.child('td', 'title');
                title.css('width', '98%');
                var box = title.child('div');
                var text = data.rid;
                if (data.title)
                    text = data.title;
                box.text(text);
                window.setTimeout(function()
                {
                    box.IMuEllipsis();
                }, 10);

                var remove = tr.child('td', 'remove');
                remove.css('width', '1%');
                var button = remove.child('button');
                button.html('&times;');
                button.bind('click', function()
                {
                    IMu.User.removeEntry(data.source, data.irn);
                });
            }
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'vienna/common/combined-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.header = undefined;
                self.navigate = undefined;
                self.modules = undefined;
                self.icons = undefined;

                self.list = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                var widget = self.widget;

                self.header = self.holder.child('div', 'header');

                var table = self.header.child('table');
                var tr = table.child('tr');

                self.navigate = tr.child('td', 'navigate');
                self.navigate.attr('title', 'Back');
                var prev;
                if (IMu.Languages.current.dir == 'ltr')
                    prev = '<';
                else
                    prev = '>';
                self.navigate.text(prev);
                self.navigate.bind('click', function()
                {
                    self.widget.prevState();
                });

                self.modules = tr.child('td', 'modules');

                self.icons = tr.child('td', 'icons');
                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(n)
                    {
                        var item = widget.list[n];
                        if (item.elem)
                            item.elem.remove();

                        var index = n + 1;

                        item.img = self.icons.child('img', 'icon icon-' + index);
                        var src = IMu.Request.getURL('Image');
                        src += '&name=' + item.icon;
                        if (n == widget.selected)
                            src += '-selected';
                        item.img.attr('src', src);
                        item.img.attr('title', IMu.string(item.title));
                        item.img.click(function()
                        {
                            widget.select(n);
                        });

                        var item = widget.list[n];
                        self.holder.append(item.elem);
                        if (n == widget.selected)
                        {
                            item.elem.visible(true);
                            item.widget.resize();
                        }
                    })(i);
                }
            },

            resize: function()
            {
                var self = this;

                self._super();

                var holderHeight = self.holder.height();
                var headerHeight = self.header.fullHeight();
                var itemHeight = holderHeight - headerHeight;
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
                    item.elem.fullHeight(itemHeight);
                }
            },

            select: function(index, offset)
            {
                var self = this;

                self.resize();
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
                    var src = item.img.attr('src');
                    var pos = src.indexOf('-selected');

                    if (i == index)
                    {
                        if (pos < 0)
                        {
                            src += '-selected';
                            item.img.attr('src', src);
                        }

                        item.elem.show();
                        item.widget.showSearch(self.widget.search, offset);
                    }
                    else
                    {
                        if (pos >= 0)
                        {
                            src = src.substr(0, pos);
                            item.img.attr('src', src);
                        }

                        item.elem.hide();
                    }
                }
            },

            drawResultCount: function()
            {
                var self = this;

                self.widget.search.getAllHits(function(hits)
                {
                    var inc = 0;
                    var pos = 0;
                    self.modules.empty();

                    for (var i = 0; i < hits.modules.length; i++)
                    {
                        (function(n)
                        {
                            var module = hits.modules[n];
                            if (module.hits < 0)
                                return;

                            if (inc > 0)
                            {
                                var span = self.modules.child('span');
                                span.text(' | ');
                            }

                            var span = self.modules.child('span', 'module');
                            var text = IMu.string('module-' + module.name);
                            text += ' ';
                            //text += module.hits;
                            span.text(text);

                            var resultSpan = span.child('span','result-count');
                            resultSpan.text(module.hits);
                            
                            var offset = pos;
                            span.bind('click', function()
                            {
                                var item = self.widget.list[self.widget.selected];
                                item.widget.setOffset(offset);
                            });
                            inc++;
                            pos += module.hits;
                        })(i);
                    }    
                });
            },

            setOffset: function(offset)
            {
                var self = this;

                self.resize();
                for (var i = 0; i < self.widget.list.length; i++)
                {
                    var item = self.widget.list[i];
                    if (i == self.widget.selected)
                        item.widget.showSearch(self.widget.search, offset);
                }
            },

            setSearch: function(search)
            {
                var self = this;

                self.navigate.attr('title', 'Back (' + self.widget.states.length + ')');

                self.drawResultCount();
            },

            updateResultCount: function()
            {
                var self = this;
                
                self.drawResultCount();
            }            
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'vienna/common/page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;

                self.header = undefined;
                self.footer = undefined;
                self.sidebar = undefined;
                self.content = undefined;
                self.toggle = undefined;
            },

            _create: function()
            {
                var self = this;

                self.holder = self.widget.owner.child('div', 'holder');
                self.holder.css
                ({
                    height: '100%',
                    position: 'relative'
                });

                self.header = self.holder.child('div', 'header');
                self.header.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                });
                self.createHeader();

                self.sidebar = self.holder.child('div', 'sidebar');
                self.sidebar.css
                ({
                    position: 'absolute'
                });
                self.createSidebar();

                self.content = self.holder.child('div', 'content');
                self.createContent();
                var sidebarWidth = self.sidebar.fullWidth();
                self.content.css
                ({
                    position: 'absolute'
                });
                self.content.css(IMu.Languages.current.far, 0);

				if (self.widget.options.showToggle)
				{
					self.toggle = self.holder.child('button', 'toggle');
					self.toggle.css
					({
						position: 'absolute'
					});
					self.toggle.bind('click', function(e)
					{
						self.sidebar.toggle();
						window.setTimeout(function()
						{
							IMu.Events.trigger('dom-resize');
						}, 0);
					});
				}
				
				self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    bottom: 0
                });
                self.createFooter();
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

                self.content.css('top', headerHeight);
                self.content.css('bottom', footerHeight);
                self.content.css(IMu.Languages.current.near, sidebarWidth -1);
                if (! IMu.Platform.device.is.desktop)
                    self.content.css(IMu.Languages.current.far, -sidebarWidth);

				if (self.widget.options.showToggle)
				{
					self.toggle.css(IMu.Languages.current.near, 0);
					self.toggle.css('bottom', footerHeight);
					var label;
					var title;
					if (sidebarWidth > 0)
					{
						label = IMu.string('page-sidebar-hide-label');
						title = IMu.string('page-sidebar-hide-title');
					}
					else
					{
						label = IMu.string('page-sidebar-show-label');
						title = IMu.string('page-sidebar-show-title');
					}
					self.toggle.html(label);
					self.toggle.attr('title', title);
				}

                self.resizeSidebar();
            },

            /* Do nothing by default */
            createHeader: function()
            {
            },

            createFooter: function()
            {
            },

            createSidebar: function()
            {
            },

            createContent: function()
            {
            },

			resizeSidebar: function()
			{
			}
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/default-page.js
*/
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

/* Source: ./themes/vienna/common/views/record-details.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for record-details should go in the
    ** appropriate file in the record-details directory. For example,
    ** specific code for the Parties module should go in
    ** record-details/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
	theme.views.register('record-details', 'paged-viewer',
	{
		_source: 'vienna/common/record-details',

		all:
		{
			_construct: function()
			{
				var self = this;

				self._super.apply(self, arguments);

				self.showSaveMultimedia = undefined;
			},

			_create: function()
			{
				var self = this;

				self._super();
			},

			resize: function()
			{
				var self = this;

				self._super();
			},

			/* Show the multimedia, title &, possibly, the selector checkbox
			 * associated with a record from another database, i.e. the 'data'
			 * parameter contains the column values for a non-multimedia
			 * record.
			 */
			showMultimedia: function(owner, data)
			{
				var self = this;

				var table = owner.child('table');
				var tr = table.child('tr');

				if (data.multimedia && data.multimedia.length > 0)
				{
					var td = tr.child('td', 'multimedia-cell');
					self.showMedia(td, data.multimedia);
				}
				var details = tr.child('td', 'details-cell').child('div', 'details');
				var div = details.child('div', 'title');
				div.text(data.title);

				if (self.widget.options.showSelectionControl)
				{
					td = tr.child('td', 'select-cell');
					td.css('width', '1%');

					self.showSelectionControl(td, data);
				}

				return details;
			},

			showMedia: function(owner, multimedia)
			{
				var self = this;

				if (! multimedia || multimedia.length < 1)
					return;

				var base = owner.child('div', 'multimedia');
				var mainPlugin = base.IMuMultimedia();
				for (var i = 0; i < multimedia.length; i++)
				{
					mainPlugin.addResourceByKey(multimedia[i].irn);
				}

				if (self.showSaveMultimedia)
				{
					var saveMultimediaDiv = owner.child('div', 'multimedia-show-save');
					var saveMultimediaTr = saveMultimediaDiv.child('table').child('tr');
					saveMultimediaTr.child('td', 'multimedia-count').text('1/' + multimedia.length);

					var mm = new IMu.Request.Multimedia();
					mm.setKey(multimedia[0].irn)
					mm.setDisposition('attachment');
					var url = mm.getURL();
					var a = saveMultimediaTr.child('td').child('a', 'multimedia-save');
					a.text(IMu.string(self.showSaveMultimedia));
					a.attr('href', url);
				}

				if (multimedia.length < 2)
					return;

				var scrollerDiv = owner.child('div', 'multimedia-scroller');
				var tr = scrollerDiv.child('table').child('tr');

				for (var i = 0; i < multimedia.length; i++)
				{
					var irn = multimedia[i].irn;
					var mimeType = multimedia[i].type;

					/* add the multimedia to the secondary multimedia plugin.
					 * Note the closure in loop issue.
					*/
					var show = (function(index, irn)
					{
						return function()
						{
							mainPlugin.show(index);

							if (self.showSaveMultimedia)
							{
								saveMultimediaDiv.find('.multimedia-count').text(
									(index + 1) + '/' + multimedia.length);
								var mm = new IMu.Request.Multimedia();
								mm.setKey(irn)
								mm.setDisposition('attachment');
								var url = mm.getURL();
								saveMultimediaDiv.find('.multimedia-save').attr('href', url);
							}
						}
					})(i, irn);

					var td = tr.child('td');
					var plugin = td.child('div').IMuMultimedia({ onClick:
						show });

					if (mimeType == 'image')
					{
						var mm = new IMu.Request.Multimedia();
						mm.setKey(irn);
						mm.addFilter('kind', 'thumbnail');
						plugin.addResource(mm);
					}
					else
					{
						var src = IMu.Request.getURL('Image') + '&name=multimedia-' + mimeType;
						plugin.addImage(src);
					}
				}
				var options =
				{
					scrollType: 'horizontal',
					horizontalPager: true
				};
				var scroller = scrollerDiv.IMuScroller(options);
				var content = scroller.getContent();
				var parts = content.find('td');
				var offsetOne = jQuery(parts[0]).offset();
				var offsetTwo = jQuery(parts[1]).offset();
				var snap = offsetTwo.left - offsetOne.left;
				scroller.setOptions({ horizontalSnap: snap });
			},

			showSection: function(owner, items, name, table)
			{
				var self = this;

				if (! items || items.length < 1)
					return;

				var section = owner.child('div', 'section ' + name);
				var label = IMu.string('section-' + name + '-label');

				self.showSectionHeader(section, label);
				self.showSectionItems(section, table, items);
			},

			showSectionHeader: function(owner, heading)
			{
				var self = this;

				var tr = owner.child('table').child('tr');
				var td = tr.child('td');
				div = td.child('div', 'section-buttons');

				var button = div.child('button', 'hide');

				button.text(IMu.string('section-hide-label'));
				button.bind('click', function()
				{
					owner.find('.items').hide();
				});

				button = div.child('button', 'show');
				button.text(IMu.string('section-show-label'));
				button.bind('click', function()
				{
					owner.find('.items').show();
				});

				td = tr.child('td');
				var div = td.child('div', 'section-heading');
				div.text(heading);
			},

			showSectionItems: function(owner, tableName, items)
			{
				var self = this;

				var div = owner.child('div', 'items');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];

					var show = (function(irn)
					{
						return function()
						{
							self.widget.showRecord(tableName, irn);
						}
					})(item.irn);

					var elem = div.child('div', 'item');
					elem.bind('click', show);

					if (item.image)
					{
						var tr = elem.child('table').child('tr');
						elem = tr.child('td');

						var mm = new IMu.Request.Multimedia();
						mm.setKey(item.image.irn);
						mm.addFilter('kind', 'thumbnail');

						var mmPlugin =
							elem.child('div').IMuMultimedia({onClick: false});
						mmPlugin.addResource(mm);

						elem = tr.child('td');
					}
					elem.child('div').IMuEllipsis(item.title);
				}
			},
			
            collectionChanged: function()
            {
                var self = this;

                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            },

			/* Luca
			*/
			showTableRow: function(element, stringsId, value)
			{
				var self = this;

				if (! value)
					return;
				if (value instanceof Array)
				{
					if (value.length == 1)
					{
						value = value[0];
					}
					else
					{
						self.showTableRows(element, stringsId, value);
						return;
					}
				}
				var tr = element.child('tr');
				var td = tr.child('td');
				td.text(IMu.string(stringsId) + ':');
				td = tr.child('td');
				td.text(value);
			},

			showTableRows: function(element, stringsId, values)
			{
				if (! values || values.length < 1)
					return;

				if (values.length > 1)
				{
					var pluralId = stringsId + 's';
					if (IMu.string(pluralId) != pluralId)
						stringsId = pluralId;
				}
				var tr = element.child('tr');
				var td = tr.child('td');
				td.text(IMu.string(stringsId) + ':');
				td = tr.child('td');
				for (var i = 0; i < values.length; i++)
				{
					tr = td.child('tr');
				 	tr.text(values[i] || '');
				}
			},

			/* Phil
			*/
            makeRefData: function(data, column, module)
            {
                var self = this;
                var value = null;

                if (!data || ! column)
                    return null;

                if (data.length)
                {
                    /* Process array
                    */
                    value = new Array();
                    for (var i = 0; i < data.length; i++)
                    {
                        if (data[i] && data[i].length)
                        {
                            /* Is multi-dimensional structure
                            */
                            value[i] = self.makeRefData(data[i],
                                column, module);
                        }
                        else if (data[i] && data[i][column])
                        {
                            /* Create appropriate data structure for cell
                            */
                            if (module && data[i].irn)
                            {
                                var newValue = new Object();
                                newValue.data = data[i][column];
                                newValue.irn = data[i].irn;
                                newValue.refModule = module;

                                value[i] = newValue;
                            }
                            else
                                value[i] = data[i][column];
                        }
                    }
                }
                else if (data[column])
                {
                    // Process cell
                    if (module && data['irn'])
                    {
                        var newValue = new Object();
                        newValue.data = data[column];
                        newValue.irn = data['irn'];
                        newValue.refModule = module;

                        value = newValue;
                    }
                    else
                        value = data[column];
                }

                return value;
            },

            addDetail: function(prompt, value, owner, link)
            {
                var self = this;

                if (! value)
                    return undefined;

                function add()
                {
                    var tr = owner.child('tr');

                    var td = tr.child('td', 'prompt');
                    td.text(IMu.string(prompt) + ':');

                    td = tr.child('td', 'value');

                    return td;
                }

                var td;

                var type = IMu.Type.get(value);
                if (type == 'array')
                {
                    if (value.length < 1)
                        return undefined;

                    td = add();

                    var valueTable = td.child('table');
                    for (var i = 0; i < value.length; i++)
                        self.addDetailRow(valueTable, value[i]);
                }
                else if (type == 'object')
                {
                    if (! value.refModule)
                        return undefined;

                    td = add();
                    td.text(value.data);
                    td.bind('click', function()
                    {
                        self.widget.showRecord(value.refModule, value.irn);
                    });
                    td.attr('class', 'link');
                }
                else
                {
                    td = add();
                    if(link)
                    {
                        var urlLink = td.child('a','link');
                        urlLink.attr('href',value);
                        urlLink.text(value);
                    }
                    else
                    {
                        td.text(value);
                    }
                    
                }

                return td;
            },

            addDetailRow: function(table, value)
            {
                var self = this;

                if (! value)
                    return;

                var tr = table.child('tr');
                var td = table.child('td');

                // mo - if array contain object
                var type = IMu.Type.get(value);

                if(type == 'object')
                    td.text(value.data);
                else                                             
                    td.text(value);
                if (value.refModule)
                {
                    td.attr('class', 'link');
                    td.bind('click', function()
                    {
                        self.widget.showRecord(value.refModule, value.irn);
                    });
                }
            },

            // Creates a new row and a cell that spans multiple columns
            addMultiColumnCell: function(owner, span)
            {
                var self = this;

                var tr = owner.child('tr');
                var td = tr.child('td');
                td.attr('colSpan', span);

                return td;
            },

            /*  addTableDetails
                tblHead[i][j]
                    where 'i' is the header type (i = 0 horizontal, i = 1 vertical)
                    where 'j' is the header index
                tblData[i][j]
                    where 'i' is the column
                    where 'j' is the row
                owner is the parent element of the table being added
            */
            addTableDetails: function(tblHead, tblData, owner)
            {
                var self = this;
                var rows = 0;
                var columns = 0;
                var dataWritten = false;

                /* Sizing up table
                */
                for (var i = 0; i < tblData.length; i++)
                {
                    if (tblData[i] && tblData[i].length)
                    {
                        if (tblData[i].length > rows)
                            rows = tblData[i].length;
                    }
                    else if (tblData[i] && tblData[i].nesttabColumns)
                        for (var n = 0; n < tblData[i].nesttabColumns; n++)
                            if (tblData[i][n] && tblData[i][n].length > rows)
                                rows = tblData[i][n].length;
                }

                if (rows == 0)
                    return false;

                columns = tblData.length;

                if (tblHead)
                {
                    if (tblHead[1] && tblHead[1].length > rows)
                        rows = tblHead[1].length;

                    if (tblHead[0] && tblHead[0].length > columns)
                        columns = tblHead[0].length;
                }

                // Write table
                var table = owner.child('table');
                var tr;
                var td;
                var th;

                // Write column headers
                if (tblHead)
                {
                    if (tblHead[0] && tblHead[0].length > 0)
                    {
                        tr = table.child('thead').child('tr');

                        if (tblHead[1] && tblHead[1].length > 0)
                            th = tr.child('th'); // leave top left header blank

                        for (var i = 0; i < tblHead[0].length; i++)
                        {
                            th = tr.child('th');
                            if (tblHead[0][i])
                                th.text(IMu.string(tblHead[0][i]));
                        }
                    }
                }

                for (var i = 0; i < rows; i++)
                {
                    tr = table.child('tr');

                    // Write row headers
                    if (tblHead && tblHead[1] && tblHead[1].length > 0)
                    {
                        td = tr.child('td', 'header');
                        if (tblHead[1][i])
                            td.text(IMu.string(tblHead[1][i]));
                    }

                    // Write data
                    for (var j = 0; j < columns; j++)
                        if (self.writeTableData(tblData, j, i, tr))
                            dataWritten = true;
                }

                return dataWritten;
            },

            writeTableData: function(tblData, columnNum, rowNum, owner)
            {
                var self = this;

                var dataWritten = false;
                var td = owner.child('td');

                if (! tblData[columnNum])
                    td.text = '';
                else if (tblData[columnNum].nesttabColumns)
                {
                    // Write nesttab data
                    td.attr('class', 'nesttab');

                    var cellData = new Array();

                    for (var nestColNum = 0; nestColNum < tblData[columnNum].nesttabColumns; nestColNum++)
                        cellData[nestColNum] = tblData[columnNum][nestColNum][rowNum];

                    if (self.addTableDetails(null, cellData, td))
                        dataWritten = true;
                }
                else if (tblData[columnNum][rowNum])
                {
                    if (tblData[columnNum][rowNum].refModule)
                    {
                        // Reference to another record
                        td.text(tblData[columnNum][rowNum].data);
                        td.bind('click', function()
                        {
                            self.widget.showRecord(
                                tblData[columnNum][rowNum].refModule,
                                tblData[columnNum][rowNum].irn);
                        });
                        td.attr('class', 'link');
                    }
                    else
                        td.text(tblData[columnNum][rowNum]);

                    dataWritten = true;
                }
                else
                    td.text = '';

                return dataWritten;
            },

            addSection: function(owner, header)
            {
                var self = this;

                if (! owner)
                    return null;

                var div = owner.child('div', 'info');

                if (header)
                {
                    var head = div.child('div', 'record-section-header');
                    head.text(IMu.string(header));
                    head.text(IMu.string(header));
                }

                var table = div.child('table', 'details');
                table.css('clear', 'both');
                table.css('width', '100%');
                table.attr('id', header);

                return table;
            },

			removeEmptySections: function(owner)
            {
                var self = this;

                owner.children('.info').each(function()
                {
                    jQuery(this).find('.details').each(function()
                    {
                        var size = jQuery(this).children('tbody').children().length;

                        if (size == 0)
                            jQuery(this).parent().remove(); //TODO: add trace?
                    });
                });
            }
		}
	});
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/details-viewer.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the details-viewer view should go in the
    ** appropriate file in the details-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** details-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('details-viewer', 'record-details',
    {
        _source: 'vienna/common/details-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                jQuery.extend(self.scrollerOptions,
                {
                    horizontalPager: true,
                    horizontalScrollbar: true,
                    horizontalSnap: '100%',
                    scrollType: 'horizontal'
                });
                self.scrollerOptions.mouseDrag = false;

                self.columns = 'details';
                self.pageSize = 5;

                // set by scrollerResize
                self.recordWidth = undefined;
                self.recordHeight = undefined;

            },

            create_other: function(div, data)
            {
                var self = this;

                var text = 'offset: ' + data.offset;
                text += ' rid: ' + data.rid;
                div.text(text);
            },

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                var self = this;

                if (width == 0)
                    return undefined;

                var range = {};
                range.first = Math.floor(frame.left / width);
                range.last = Math.floor((frame.left + width) / width);

                /* No range checking done here.
                ** It will be done by the caller (see paged-viewer).
                */
                return range;
            },

            locateRecord: function(offset, div)
            {
                var self = this;

                var left = offset * self.recordWidth;
                var top = 0;

                var width = self.recordWidth;
                var height = self.recordHeight;

                div.left(left);
                div.top(top);
                div.fullWidth(width);
                div.fullHeight(height);
                div.visible(true);
            },

            setOffset: function(offset)
            {
                var self = this;

                var pos =
                {
                    left: offset * self.recordWidth,
                    top: 0
                };
                self.log('setOffset: offset {0} recordWidth {1} pos {2}',
                    offset, self.recordWidth, pos);
                self.scroller.scrollTo(pos);
            },

            scrollerResize: function(info)
            {
                var self = this;

                if (! self.widget.results)
                    return;

                self.content.fullHeight(info.height);
                var contentHeight = self.content.height();
                self.log('scrollerResize: contentHeight {0}', contentHeight);

                self.recordWidth = info.width;
                self.recordHeight = contentHeight;

                var contentWidth = self.recordWidth * self.widget.hits;
                self.log('scrollerResize: contentWidth {0}', contentWidth);
                self.content.width(contentWidth);
            }


        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/lightbox-viewer.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the lightbox-viewer view should go in the
    ** appropriate file in the lightbox-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** lightbox-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'vienna/common/lightbox-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'lightbox';
                self.pageSize = 20;
            },

            create_other: function(div, data)
            {
                var self = this;
                // image
                var frame = div.child('div', 'frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'resolution');

                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
                else
                {
                    self.createMissingMMDisplay(frame, data)
                }

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                title.text(data.title);

                /* The title doesn't get resized so we can add an ellipsis
                ** (if necessary) now rather than in a resize handler (as is
                ** done in list-viewer). Doing it here is much more efficient.
                ** 
                ** If the design changes so that the title changes on resize then
                ** the ellipsis should be added in a resize_*() method.
                */
                title.IMuEllipsis();

                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                // checkbox
                if (self.widget.options.showSelectionControl)
                    self.showSelectionControl(info, data);
            },

            collectionChanged: function()
            {
                var self = this;

                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            },

            /* protected.
            ** Allow descendents to override how missing images are handled.
            */
            createMissingMMDisplay: function(holder, data)
            {
                var self = this;
                var img = holder.child('img', 'no-image');
                var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
                img.attr('src', src);
            }
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/list-viewer.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the list-viewer view should go in the
    ** appropriate file in the list-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** list-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'vienna/common/list-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'list';
                self.pageSize = 20;
            },

            /* Fall through code called only if there is no module-specific
            ** version.
            */
            create_other: function(div, data)
            {
                var self = this;
                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                var text = data.rid;
                if (data.title)
                    text = data.title;
                title.text(text);
                window.setTimeout(function()
                {
                    title.IMuEllipsis();
                }, 10);
                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });
            },

            collectionChanged: function()
            {
                var self = this;

                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            },

            /* protected.
            ** Allow descendents to override how missing images are handled.
            */
            createMissingMMDisplay: function(holder, data)
            {
                var self = this;
                var img = holder.child('img', 'no-image');
                var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
                img.attr('src', src);
            },

            // private
            createTable: function(div, data)
            {
                var self = this;

                var items = {};

                var table = div.child('table', 'table');

                var tr = table.child('tr', 'row');

                // image
                var td = tr.child('td', 'image-cell')
                td.css('width', '1%');

                var frame = td.child('div', 'image-frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'thumbnail');

                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
                else
                {
                    self.createMissingMMDisplay(frame, data)
                }

                // content
                td = tr.child('td', 'content-cell');
                td.css('width', '98%');

                // checkbox
                if (self.widget.options.showSelectionControl)
                {
                    td = tr.child('td', 'select-cell');
                    td.css('width', '1%');

                    self.showSelectionControl(td, data);
                }

                return table;
            }
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/tree-viewer.js
*/
(function(theme) {
    theme.views.register('tree-viewer', 'viewer', {
        _source: 'vienna/common/tree-viewer',

        all: {
            _construct: function() {
                this._super.apply(this, arguments);

                this.holder = undefined;
                this.browser = undefined;

                this.details = undefined;
            },

            _create: function() {
                var self = this;
                var archiveSortingOption

                self.holder = self.widget.owner.child('div', 'holder');
                self.holder.attr('id', 'tree-viewer-holder')

                var tree = self.holder.child('div');
                tree.attr('id', 'treeview');

                self.browser = tree.child('ul');
                self.browser.attr('id', 'treeview-holder');

                self.details = self.holder.child('div');
                self.details.attr('id', 'treeview-details');

                self.details = self.details.IMu('record-browser', {

                });

                self.details.createView();

                //check to see if we have a custom sorting option
                //if not just use the standard (SummaryData)
                if (IMu.Config.archiveSortingOption) {
                    archiveSortingOption = IMu.Config.archiveSortingOption;
                }

                self.browser = self.browser.IMu('tree-browser', {
                    parent: IMu.Config.archiveParent,
                    displayWidget: self.details,
                    expandable: true,
                    sortOption: archiveSortingOption
                });

                self.browser.createView();

                self.scroller = self.holder.child('a', 'scroll');
                self.scroller.text('scroll to top');
                self.scroller.attr('href', ' ');

                self.scroller.click(function() {
                    var parent = this.parentElement;
                    $(parent).animate({
                        scrollTop: 0
                    }, 800);
                    return false;
                });
            },

            showRecord: function(module, key) {
                var self = this;

                self.browser.options.module = module;
                self.browser.options.key = key;

                self.browser.fetchHierarchy(module, key);
            }
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/my-collections.js
*/
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

/* Source: ./themes/vienna/common/views/record-browser.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the record-browser view should go in the
    ** appropriate file in the record-browser directory. For example,
    ** specific code for the Parties module should go in
    ** record-browser/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('record-browser', 'record-details',
    {
        _source: 'vienna/common/record-browser',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'browse';
            },

            _create: function()
            {
                var self = this;
            },

            resize: function()
            {
                var self = this;

            },

            show_default: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showMultimedia(owner, data.multimedia);
                var div = owner.child('div', 'description');
                div.css('clear', 'both');
                div.text(IMu.Format.sprintf('{0}', data));
            },

            collectionChanged: function()
            {
                var self = this;

                self.widget.owner.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
            }
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/box-control.js
*/
(function(theme)
{
    theme.views.register('box-control', 'control',
    {
        _source: 'shared/common/box-control',

        all:
        {
            _create: function()
            {
                 this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                // if(! widget.options.lines || widget.options.lines < 2)
                // {
                //     if(widget.options.isTagControl)
                //     {   
                //         widget.owner = widget.owner.child('div', 'tag-holder');
                //         self.tagControl = widget.owner.child('span', 'tags');

                //         var submit = widget.owner.parent().child('button', 'submit');
                //         // var submit = widget.owner.child('button', 'submit');
                //         submit.text(IMu.string('tag-control-update'));
                //         submit.bind('click', function()
                //         {
                //             widget.updateTags();
                //         });                        
                //     }
                // }

                if(widget.options.isCommentsControl)
                {
                        var submit = widget.owner.parent().child('button', 'submit');
                        submit.addClass('post-comment-btn');
                        // var submit = widget.owner.child('button', 'submit');
                        submit.text(IMu.string('comment-control-post'));
                        submit.bind('click', function()
                        {
                            self.widget.commentText = self.control[0].value;
                            self.widget.postComment();
                            self.control[0].value = "";
                        });   
                }

              
                self.control.keypress(function(e)
                {
                    if(widget.options.delimiter)
                    {
                        var key = widget.options.delimiter.charCodeAt(0);

                        if(e.which == key)
                        {
                            var value = self.getValue();
                            //remove all non alpha numeric chars
                            value = value.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                            self.setValue(value,true);
                            self.control.value = "";
                        }
                    }
                });
            }
        }
    });
})(IMu.Themes.shared);

/* Source: ./themes/vienna/common/views/comments-control.js
*/
(function(theme)
{
    theme.views.register('comments-control', 'text-control',
    {
        _source: 'vienna/common/comments-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;
            },

            printComments: function()
            {
                var self = this;

                var widget = self.widget;

                var div = widget.owner.parent().parent().parent().parent();
                div = div.child('table','imu-comments');

                for (var i = 0; i < self.widget.comments.length; i++) 
                {
                    var data = self.widget.comments[i];
                    var comment = self.addCommentSection(div);

                    var timeStamp = comment.child('td','imu-comment-timestamp');
                    timeStamp.text(data.AdmDateInserted + ' ' + data.AdmTimeInserted);

                    var commentText = comment.child('td','imu-comment-text');
                    commentText[0].innerHTML = data.NarNarrative;

                };
            },

            addCommentSection: function(owner)
            {
                var self = this;

                if (! owner)
                    return null;

                var table = owner.child('tr', 'imu-comment');

                // var table = div.child('table', 'details');
                table.css('clear', 'both');
                table.css('width', '100%');
                // table.attr('id', header);

                return table;

            },
        }
    });
})(IMu.Themes.get('vienna'));

/* Source: ./themes/vienna/common/views/sort-control.js
*/
(function(theme)
{
    theme.views.register('sort-control', 'selection-control',
    {
        _source: 'vienna/common/sort-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                self.control.bind('change', function(e)
                {
                    widget.sortValue = self.getValue();
                    widget.sortChanged();
                });

                var icons = jQuery('#combinedViewer.header.icons img');
                
            }
        }
    });
})(IMu.Themes.get('vienna'));
/* Source: ./themes/vienna/common/views/faceted-search-control.js
*/
(function(theme)
{
    theme.views.register('faceted-search-control',
    {
        _source: 'vienna/common/faceted-search-control',

        all:
        {

            _create: function()
            {
                var self = this;
                var widget = self.widget;

                // var widgetTitle = self.widget.owner.child('h2','widget-title');
                // widgetTitle.text(IMu.string('refine-search'));

                var widgetTitle = self.widget.owner.child('div','searches-label');
                widgetTitle.addClass('client-search-label');
                widgetTitle.text(IMu.string('refine-search'));


                self.holder = widget.owner.child('div','holder');
                self.holder.attr('id','faceted-search-holder');

            },

            printFacets: function(summary)
            {
                var self = this;
                var holder = self.holder;

                holder.children().remove();

                if (self.widget.searchIsFiltered())
                {
                    var clearTerms = holder.child('button','btn-link clear-all');
                    clearTerms.text('clear all');
                    clearTerms.click(function()
                    {
                        self.widget.clearFilters();
                    });
                }

                for (var i = 0; i < summary.length; i++) 
                {
                    var facet = summary[i];
                    var div = holder.child('div','facet-holder');
                    var facetTitle = div.child('h3','facet-title');
                    facetTitle.text(IMu.string(facet.key));                     

                    var table = div.child('table');

                    for (var key in facet.counts) 
                    {
                       var obj = facet.counts[key];
                       var tr = table.child('tr');
                       var facetSpan = tr.child('span','facet-text');
                       facetSpan.text(key);
                       facetSpan.attr('facet',facet.key);

                       // tr.text(key);
                       var span = facetSpan.child('span','facet-count');
                       span.text(' ' + obj);


                       facetSpan.click(function()
                       {

                            var text = this.firstChild.data;
                            if (text == 'Empty') 
                            {
                                text = '\\!\\*';
                            }             
                            var facet = this.getAttribute('facet');
                            self.widget.buildNewTerms(facet, text);
                       })
                    }

                };
            },

            printMessage: function()
            {
                var self = this;
                var holder = self.holder;

                holder.children().remove();

                var overload = holder.child('h4','facet-overload');
                overload.text('Too many results were found to perform facets.');
            }
        }
    });
})(IMu.Themes.get('vienna'));
