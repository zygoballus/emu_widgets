/* THIS FILE IS BUILT AUTOMATICALLY.
** DO NOT CHANGE IT DIRECTLY.
**
** Built at: 2024-11-14 04:43:49 UTC (2024-11-14 04:43:49 UTC)
*/
"use strict";

/* Source: ./themes/prague/common/strings.js
*/
(function(theme)
{
	theme.strings.register
	({
		'accession-number':
		{
			en: 'Accession Number'
		},
		'child-narratives':
		{
			en: 'Child narratives',
			fi: 'Lapsen narratiivit'
		},
		'collection-number':
		{
			en: 'Collection {0} of {1}',
			fi: 'Kokoelma  {0} of {1}'
		},
		'common-searching':
		{
			en: 'Searching...',
			fi: 'Etsii...'
		},
		'common-what':
		{
			en: 'What'
		},
		'common-when':
		{
			en: 'When'
		},
		'common-where':
		{
			en: 'Where'
		},
		'common-who':
		{
			en: 'Who'
		},
		'no-current-search':
		{
			en: 'No current search',
			fi: 'Ei nykyistä hakua'
		},
		'object-rating':
		{
			en: 'Object Rating'
		},
		'only-items-with-images':
		{
			en: 'Only items with images',
			fi: 'Vain esineet joilla on kuva',
			fr: 'Uniquement les articles avec images'
		},
		'parent-narratives':
		{
			en: 'Parent narratives',
			fi: 'Vanhemmat narratiivit'
		},
		'party-type':
		{
			en: 'Party Type'
		},
		'related-narratives':
		{
			en: 'Related narratives',
			fi: 'Yhteenkuuluvat narratiivit'
		},
		'related-objects':
		{
			en: 'Related objects',
			fi: 'Yhteenkuuluvat tietueet'
		},
		'section-hide-label':
		{
			en: '-',
			fi: '-'
		},
		'section-objects-label':
		{
			en: 'Objects',
			fi: 'Tietueet'
		},
		'section-related-narratives-label':
		{
			en: 'Related narratives',
			fi: 'Yhteenkuuluvat narratiivit'
		},
		'section-show-label':
		{
			en: '+',
			fi: '+'
		},
		'section-subnarratives-label':
		{
			en: 'Sub-narratives',
			fi: 'Alanarratiivit'
		},
		'status':
		{
			en: 'Status'
		},
		'page-sidebar-hide-label':
		{
			en: '&laquo;',
			fi: '&laquo;',
			fr: '&laquo;'
		},
		'page-sidebar-hide-title':
		{
			en: 'Hide sidebar',
			fi: 'Piilota sivupalkki'
		},
		'page-sidebar-show-label':
		{
			en: '&raquo;',
			fi: '&raquo;',
			fr: '&raquo;'
		},
		'page-sidebar-show-title':
		{
			en: 'Show sidebar',
			fi: 'Näytä sivupalkki'
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/collection-viewer.js
*/
(function(theme)
{
    theme.views.register('collection-viewer', 'vertical-viewer',
    {
        _source: 'prague/common/collection-viewer',

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
                var button = remove.child('button','remove-entry');
                button.html('&times;');
                button.bind('click', function()
                {
                    IMu.User.removeEntry(data.source, data.irn);
                });
            },

            resize: function()
            {
                this._super.apply(this, arguments);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'prague/common/combined-viewer',

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

                //var table = self.header.child('table');
                var tr = self.header.child('div','header-table');

                self.navigate = tr.child('span', 'navigate');
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

                self.modules = tr.child('span', 'modules');

                self.icons = tr.child('span', 'icons');
                self.makeViewIcons();

                var clear = tr.child('div', 'clear');
                clear.css('clear','both');

                self.makeOther(tr);
            },

            makeOther: function(owner)
            {
                /* Do nothing by default
                */
            },

            makeViewIcons: function()
            {
                var self = this;
                var widget = self.widget;

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
                        {
                            src += '-selected';
                            item.img.addClass('selected');
                        }
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
                            item.img.addClass('selected');
                        }
                        continue;
                        
                        /* Hold off showing the item, as all other items need 
                        ** hiding first, otherwise we end up with sizing issues.
                        ** -phil
                        */
                    }
                    else
                    {
                        if (pos >= 0)
                        {
                            src = src.substr(0, pos);
                            item.img.attr('src', src);
                            item.img.removeClass('selected');
                        }

                        item.elem.hide();
                    }
                }

                var item = self.widget.list[index];
                item.elem.show();
                item.widget.showSearch(self.widget.search, offset);
            },

            drawResultCount: function()
            {
                var self = this;

                if (! self.widget.search)
                {
                    self.modules.empty();
                    return;
                }

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
        },

        phone:
        {
            drawResultCount: function()
            {
                var self = this;

                if (! self.widget.search)
                {
                    self.modules.empty();
                    return;
                }

                self.widget.search.getAllHits(function(results)
                {
                    var inc = 0;
                    var pos = 0;
                    self.modules.empty();

                    var total = 0;
                    if (results && results.modules)
                    {
                        for (var i = 0; i < results.modules.length; i++)
                            total += results.modules[i].hits;
                    }

                    var span = self.modules.child('span');
                    var text = IMu.string('common-results');
                    text = IMu.Format.formatParams(text, [total]);

                    span.text(text);
                });
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'prague/common/page',

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

                self.header = self.holder.child('div', 'header');
                self.header.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                });
                self.createHeader();

                self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    bottom: 0
                });
                self.createFooter();

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
                    self.createToggle();
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
                self.content.css(IMu.Languages.current.near, sidebarWidth -1);
            
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
                if (sidebarWidth > 0)
                {
                    self.sidebar.css('display', 'block');
                }
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
            
            createToggle: function()
            {
                var self = this;

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
                    }, 1);
                });
            },

			resizeSidebar: function()
			{
			}
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/default-page.js
*/
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

/* Source: ./themes/prague/common/views/paged-display.js
*/
(function(theme)
{
    theme.views.register('paged-display',
    {
        _source: 'prague/common/search-form',

        all:
        {
            resize: function()
            {
                this._super.apply(this, arguments);

                if (this.header)
                {
                    var currentPageIndex = this.widget.selected;
                    var currentPage = this.widget.pages[currentPageIndex];

                    var headerHeight = Math.floor(this.header.fullHeight());
                    var pageTop = currentPage.owner.css('top');
                    pageTop = parseInt(pageTop);

                    if (pageTop != headerHeight)
                        currentPage.owner.css('top', headerHeight);
                }
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-details.js
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
		_source: 'prague/common/record-details',

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
				var titleRow = details.child('table', 'title').child('tr');
				titleRow.child('td').text(data.title);

				if (self.widget.options.showSelectionControl)
				{
                    // Hack
                    td = tr.child('td');
                    td.css('width', '1%');
                    // End

                    td = titleRow.child('td', 'select-cell');
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

                owner.addClass('multimedia-cell');
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
						td.find('div').attr('class', 'imu-plugin imu-multimedia-plugin imu-multimedia-icon');
						var src = IMu.Request.getURL('Image') + '&name=multimedia-' + mimeType;
						plugin.addImage(src);
					}
				}
				var options =
				{
					scrollType: 'horizontal',
					horizontalPager: true,
                    onResize: function()
                    {
                        if (this.content.fullWidth() > this.view.fullWidth())
                        {
                            this.left.css('visibility', 'visible');
                            this.right.css('visibility', 'visible');
                        }
                        else
                        {
                            this.left.css('visibility', 'hidden');
                            this.right.css('visibility', 'hidden');
                        }
                    }
				};
				var scroller = scrollerDiv.IMuScroller(options);
				var content = scroller.getContent();
				var parts = content.find('td');
				var offsetOne = jQuery(parts[0]).offset();
				var offsetTwo = jQuery(parts[1]).offset();
				var snap = offsetTwo.left - offsetOne.left;
				scroller.setOptions({ horizontalSnap: snap });
			},

			showSection: function(owner, items, name, tableName)
			{
				if (! items || items.length < 1)
					return;

				var section = owner.child('div', 'section ' + name);
				var label = IMu.string('section-' + name + '-label');

				this.showSectionHeader(section, label);
				this.showSectionItems(section, tableName, items);
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
					if (item)
					{
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

            makeHitsData: function(data, column, module)
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

                    if (data instanceof Array)
                    {
                        for (var i = 0; i < data.length; i++)
                        {
                            /* Create appropriate data structure for cell
                            */
                            if (data[i] && module)
                            {
                                    var newValue = new Object();
                                    if (data[i][column])
                                        newValue.data = data[i][column];
                                    else
                                        newValue.data = data[i];
                                    newValue.refModule = module;
                                    newValue.column = column;
                                    newValue.getHits = true;

                                    value[i] = newValue;
                            }
                        }
                    }
                    else
                    {
                        var newValue = new Object();
                        newValue.data = data;
                        newValue.refModule = module;
                        newValue.column = column;
                        newValue.getHits = true;

                        value = newValue;
                    }
                }

                return value;
            },

            addDetail: function(prompt, value, owner)
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

                    if (value.getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([value.column, value.data],
                                [value.refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                
                                if (widget.name == 'tabbed-display')
                                {
                                    for (var i = 0; i < widget.pages.length; i++)
                                    {
                                        var page = widget.pages[i];
                                        if (page.title != 'combined-viewer')
                                            continue;
                                        
                                        widget.select(i);
                                        widget = widget.pages[i].widget;

                                        break;
                                    }
                                }

                                widget.addState(search);
                                widget.select(0);
                             });
                        });

                        var module = new IMu.Request.Module(value.refModule);
                        module.findTerms([value.column, value.data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(value.data + ' (' + hits + ')');
                            }
                        });
                    }
                    else
                    {
                        td.bind('click', function()
                        {
                            self.widget.showRecord(value.refModule, value.irn);
                        });
                        td.attr('class', 'link');
                    }
                }
                else
                {
                    td = add();
                    td.text(value);
                }

                return td;
            },

            addDetailRow: function(table, value)
            {
                var self = this;

                if (! value)
                    return;

                var tr = table.child('tr');
                var td = tr.child('td');

                // mo - if array contain object
                var type = IMu.Type.get(value);

                if(type == 'object')
                    td.text(value.data);
                else                                             
                    td.text(value);
                if (value.getHits)
                {
                    td.bind('click', function()
                    {
                       var search = new IMu.Request.Search();
                        search.search([value.column, value.data],
                            [value.refModule], function(hits)
                        {
                            if (hits < 1)
                                return;
                            var widget = self.widget;
                            
                            if (widget.controller)
                                widget = widget.controller;
                            
                            if (widget.name == 'tabbed-display')
                            {
                                for (var i = 0; i < widget.pages.length; i++)
                                {
                                    var page = widget.pages[i];

                                    if (page.title != 'combined-viewer')
                                        continue;

                                    widget.select(i);
                                    widget = widget.pages[i].widget;

                                    break;
                                }
                            }
                            
                            widget.addState(search);
                            widget.select(0);
                         });
                    });

                    var module = new IMu.Request.Module(value.refModule);
                    module.findTerms([value.column, value.data], function(hits)
                    {
                        if (hits > 0)
                        {
                            td.addClass('link');
                            td.text(value.data + ' (' + hits + ')');
                        }
                    });
                }
                else if (value.refModule)
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
                    {
                        if(tblData[columnNum][nestColNum])
                            cellData[nestColNum] = tblData[columnNum][nestColNum][rowNum];
                    }
                    if (self.addTableDetails(null, cellData, td))
                        dataWritten = true;
                }
                else if (tblData[columnNum][rowNum])
                {
                    if (tblData[columnNum][rowNum].getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([tblData[columnNum][rowNum].column, 
                                tblData[columnNum][rowNum].data], 
                                [tblData[columnNum][rowNum].refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                widget.addState(search);
                             });
                        });

                        var module = new IMu.Request.Module(
                            tblData[columnNum][rowNum].refModule);
                        module.findTerms([tblData[columnNum][rowNum].column, 
                            tblData[columnNum][rowNum].data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(tblData[columnNum][rowNum].data + ' (' 
                                    + hits + ')');
                            }
                        });
                    }
                    else if (tblData[columnNum][rowNum].refModule)
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
		},

        phone:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
            },

            // This function has been copied except for the
            // add() mechanic which now places the value
            // on the line below the prompt.
            addDetail: function(prompt, value, owner)
            {
                var self = this;

                if (! value)
                    return undefined;

                function add()
                {
                    var tr = owner.child('tr');
                    var td = tr.child('td', 'prompt');
                    td.text(IMu.string(prompt) + ':');

                    tr = owner.child('tr');
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

                    if (value.getHits)
                    {
                        td.bind('click', function()
                        {
                           var search = new IMu.Request.Search();
                            search.search([value.column, value.data],
                                [value.refModule], function(hits)
                            {
                                if (hits < 1)
                                    return;
                                var widget = self.widget;
                                if (widget.controller)
                                    widget = widget.controller;
                                
                                if (widget.name == 'tabbed-display')
                                {
                                    for (var i = 0; i < widget.pages.length; i++)
                                    {
                                        var page = widget.pages[i];
                                        if (page.title != 'combined-viewer')
                                            continue;
                                        
                                        widget.select(i);
                                        widget = widget.pages[i].widget;

                                        break;
                                    }
                                }

                                widget.addState(search);
                                widget.select(0);
                             });
                        });

                        var module = new IMu.Request.Module(value.refModule);
                        module.findTerms([value.column, value.data], function(hits)
                        {
                            if (hits > 0)
                            {
                                td.addClass('link');
                                td.text(value.data + ' (' + hits + ')');
                            }
                        });
                    }
                    else
                    {
                        td.bind('click', function()
                        {
                            self.widget.showRecord(value.refModule, value.irn);
                        });
                        td.attr('class', 'link');
                    }
                }
                else
                {
                    td = add();
                    td.text(value);
                }

                return td;
            },

            showMultimedia: function(owner, data)
            {
                var table = owner.child('table');
                var tr = table.child('tr');
                
                var td = tr.child('td', 'titlerow');
                
                td.child('div', 'title').IMuEllipsis(data.title || '');
                
                if (this.widget.options.showSelectionControl)
                {
                    this.showSelectionControl(
                        td.child('div', 'select-cell'), data);
                }

                if (data.multimedia && data.multimedia.length > 0)
                {
                    tr = table.child('tr');
                    td = tr.child('td', 'multimedia-cell');
                    
                    if (this.widget.options.showSelectionControl)
                        td.attr('colspan', '2');

                    this.showMedia(td, data.multimedia);
                }

                tr = table.child('tr');
                
                var details = tr.child('td', 'details-cell').child('div', 'details');
                
                if (this.widget.options.showSelectionControl)
                    td.attr('collspan', '2');
                
                return details;
            }
        }
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-details/emultimedia.js
*/
(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/emultimedia',

		all:
		{
			/* Show the details of a multimedia record i.e. the 'data'
			 * parameter contains the column values for a multimedia record.
			 */
			showMultimediaDetails: function(owner, data)
			{
				var self = this;

				var base = owner.child('div', 'multimedia');
				var primary = base.child('div', 'primary');
				var table = primary.child('table');
				var tr = table.child('tr');
				var td = tr.child('td');
				self.showMedia(td, [data]);

				var details = tr.child('td').child('div', 'details');
				var div = details.child('div', 'title');
				div.text(data.title);

				self.showMultimediaDescription(details, data);

				var secondary = base.child('div', 'secondary');
				self.showMultimediaResolutions(secondary, data.resolutions);
				self.showMultimediaSupplementaries(secondary, data.irn,
						data.supplementary);

				primary = base.child('div', 'primary');
				var metadata = primary.child('div', 'multimedia-metadata');
				self.showMultimediaExifMetadata(metadata, data);
				self.showMultimediaIptcMetadata(metadata, data);
				self.showMultimediaXmpMetadata(metadata, data);

				// checkbox
				if (self.widget.options.showSelectionControl)
				{
					td = tr.child('td', 'select-cell');
					td.css('width', '1%');

					self.showSelectionControl(td, data);
				}

				return details;
			},

			showMultimediaDescription: function(owner, data)
			{
				var self = this;

				var table = owner.child('table');

				self.showTableRow(table, 'emultimedia-creator', data.creators);
				if (data.mimeType && data.mimeFormat)
				{
					self.showTableRow(table, 'emultimedia-media-type',
						data.mimeType + '/' + data.mimeFormat);
				}
				self.showTableRow(table, 'emultimedia-description',
					data.description);
				self.showTableRow(table, 'emultimedia-resource-type',
					data.resourceType);
				self.showTableRow(table, 'emultimedia-language', data.language);
				self.showTableRow(table, 'emultimedia-publisher',
					data.publisher);
				self.showTableRow(table, 'emultimedia-contributor',
					data.contributors);
				self.showTableRow(table, 'emultimedia-source', data.source);
				self.showTableRow(table, 'emultimedia-rights', data.rights);
				self.showTableRow(table, 'emultimedia-audience', data.audience);
				self.showTableRow(table, 'emultimedia-media-form',
					data.mediaForm);
				self.showTableRow(table, 'emultimedia-file-size',
					data.fileSize);
				self.showTableRow(table, 'emultimedia-check-sum',
					data.checkSum);
				self.showTableRow(table, 'emultimedia-resolution',
					data.resolution);
				if (data.width && data.height)
				{
					self.showTableRow(table, 'emultimedia-dimensions',
						data.width + 'x' + data.height);
				}
				else if (data.width)
				{
					self.showTableRow(table, 'emultimedia-width', data.width);
				}
				else if (data.height)
				{
					self.showTableRow(table, 'emultimedia-height', data.height);
				}
				self.showTableRow(table, 'emultimedia-colour-depth',
					data.colourDepth);
				self.showTableRow(table, 'emultimedia-film-length',
					data.filmLength);
				self.showTableRow(table, 'emultimedia-samples-per-second',
					data.samplesPerSecond);
				self.showTableRow(table, 'emultimedia-bits-per-sample',
					data.bitsPerSample);
				self.showTableRow(table, 'emultimedia-number-of-channels',
					data.numChannels);
				self.showTableRow(table, 'emultimedia-duration',
					data.audioDuration);
			},

			showMultimediaResolutions: function(owner, data)
			{
				var self = this;

				if (! data || data.length < 1)
					return;

				var div = owner.child('div', 'section multimedia-resolutions');
				var heading = IMu.string('emultimedia-resolutions');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-identifier'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-media-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-colour-space'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-colour-depth'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-num-colours'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-resolution'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-dimensions'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-resolutions-file-size'));

				for (var i = 0; i < data.length; i++)
				{
					var resolution = data[i];

					tr = table.child('tr', 'item');

					var td = tr.child('td');
					td.text(resolution.identifier || '');

					td = tr.child('td');
					if (resolution.mimeType && resolution.mimeFormat)
						td.text(resolution.mimeType + '/' +
								resolution.mimeFormat);

					td = tr.child('td');
					td.text(resolution.colourSpace || '');

					td = tr.child('td');
					td.text(resolution.imageType || '');

					td = tr.child('td');
					td.text(resolution.bitsPerPixel || '');

					td = tr.child('td');
					td.text(resolution.numberColours || '');

					td = tr.child('td');
					td.text(resolution.resolution || '');

					td = tr.child('td');
					if (resolution.width && resolution.height)
						td.text(resolution.width + 'x' + resolution.height);

					td = tr.child('td');
					td.text(resolution.fileSize || '');
				}
			},

			showMultimediaSupplementaries: function(owner, key, data)
			{
				var self = this;

				if (! data || data.length < 1)
					return;

				var div = owner.child('div', 'section multimedia-supplementary');
				var heading = IMu.string('emultimedia-supplementary');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr', 'item');

				/* Empty table header for multimedia plugin.
				 */
				var th = tr.child('th');

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-identifier'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-media-type'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-usage'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-dimensions'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-supplementary-file-size'));

				for (var i = 0; i < data.length; i++)
				{
					var supplementary = data[i];

					tr = table.child('tr', 'item');
					var td = tr.child('td');

					div = td.child('div');

					var mm = new IMu.Request.Multimedia();
					mm.setKey(key);
					mm.addFilter('index', supplementary.index);

					var mmPlugin = div.IMuMultimedia({onClick: false});
					mmPlugin.addResource(mm);

					td = tr.child('td');
					td.text(supplementary.identifier || '');

					td = tr.child('td');
					if (supplementary.mimeType && supplementary.mimeFormat)
						td.text(supplementary.mimeType + '/' +
								supplementary.mimeFormat);

					td = tr.child('td');
					if (supplementary.usage)
					{
						for (var j = 0; j < supplementary.usage.length; j++)
						{
							td.child('tr').child('td').text(
									supplementary.usage[j]);
						}
					}

					var td = tr.child('td');
					if (supplementary.width && supplementary.height)
						td.text(supplementary.width + 'x' +
								supplementary.height);

					var td = tr.child('td');
					td.text(supplementary.fileSize || '');
				}
			},

			showMultimediaExifMetadata: function(owner, data)
			{
				var self = this;

                if (! data.exif || ! data.exif.length)
					return;

				var div = owner.child('div', 'section metadata-exif');
				var heading = IMu.string('emultimedia-exif');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-ifd'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-tag'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-name'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-exif-value'));

				for (var i = 0; i < data.exif.length; i++)
				{
                    var row = data.exif[i];

				   	tr = table.child('tr', 'item');
					tr.child('td').text(row.ifd || '');
					tr.child('td').text(row.tag || '');
					tr.child('td').text(row.name || '');
					tr.child('td').text(row.value || '');
				}
			},

			showMultimediaIptcMetadata: function(owner, data)
			{
				var self = this;

                if (! data.iptc || ! data.iptc.length)
                    return;

				var div = owner.child('div', 'section metadata-iptc');
				var heading = IMu.string('emultimedia-iptc');
				self.showSectionHeader(div, heading);

				div = div.child('div', 'items');
				var table = div.child('table');
				var tr = table.child('thead').child('tr');

				var th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-record'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-tag'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-name'));

				th = tr.child('th');
				th.text(IMu.string('emultimedia-iptc-value'));

				for (var i = 0; i < data.iptc.length; i++)
				{
                    var row = data.iptc[i];

				   	tr = table.child('tr', 'item');
					tr.child('td').text(row.record || '');
					tr.child('td').text(row.tag || '');
					tr.child('td').text(row.name || '');
					tr.child('td').text(row.value || '');
				}
			},

			showMultimediaXmpMetadata: function(owner, data)
			{
				var self = this;

				if (! data.XmpMetadata)
					return;

				/* Strip out control (DATA LINK ESCAPE) characters.
				*/
				var xmp = data.XmpMetadata.replace(/&#0010;/g, '');
				var items = self.parseXmp(xmp);
				if (! items)
					return;

				var div = owner.child('div', 'section metadata-xmp');
				var heading = IMu.string('emultimedia-xmp');
				self.showSectionHeader(div, heading);
				div = div.child('div', 'items');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];
					/* We only need to know about the children of Description
					** nodes.
					*/
					if (! item.children)
						continue;

					var children = item.children;
					var nameSpaces = item.nameSpaces;
					var ns = children.nameSpace;
					var title = self.getXmpItemTitle(nameSpaces, ns);

					var sub = div.child('div', 'item');
					sub.child('div').text(title);
					self.showXmpItem(sub, nameSpaces, ns, children);
				}
			},

			showXmpItem: function(owner, nameSpaces, baseNameSpace, items)
			{
				var self = this;

				var ul = owner.child('ul');

				var ns = items.nameSpace;
				if (ns != baseNameSpace)
				{
					var title = self.getXmpItemTitle(nameSpaces, ns);
					if (title)
					{
						var li = ul.child('li');
						li.text(title);
						ul = li.child('ul');
					}
				}

				for (var i = 0; i < items.list.length; i++)
				{
					var item = items.list[i];

					var li = ul.child('li');
					li.child('span', 'element').text(item.name);

					if (item.children)
					{
						if (self.isXmpContainer(item))
							self.showXmpContainer(li, item);
						else
							self.showXmpItem(li, nameSpaces, baseNameSpace,
									item.children);
						continue;
					}
					if (item.value)
					{
						li.child('span').text(': ');
						li.child('span', 'value').text(item.value);
					}
				}
			},

			getXmpItemTitle: function(nameSpaces, ns)
			{
				var uri = nameSpaces[ns];
				var title;
				if (uri)
				{
					var string;
					var stringId = 'emultimedia-xmp-ns-' + ns;
					if (IMu.string(stringId) != stringId)
						string = IMu.string(stringId);

					title = string || '';
					title += ' (' + ns;
					if (uri)
						title += ', ' + uri;
					title += ')';
				}
				return title;
			},

			isXmpContainer: function(item)
			{
				var self = this;

				return (item.localName == 'Seq' || item.localName == 'Alt' ||
						item.localName == 'Bag');

			},

			showXmpContainer: function(owner, item)
			{
				var self = this;

				var name;
				var stringId = 'emultimedia-xmp-ns-' +
					item.localName.toLowerCase();
				if (IMu.string(stringId) != stringId)
					name = IMu.string(stringId);
				else
					name = item.name;
				owner.child('span').text(' ');
				owner.child('span').text(name);

				var ul = owner.child('ul', 'value');
				var contents = item.children.list;
				for (var i = 0; i < contents.length; i++)
				{
					if (! contents[i].value)
						continue;
					owner = ul.child('li');
					owner.text('[' + (i + 1) + ']: ' + contents[i].value);
				}
			},

			/* Rudimentary XMP (RDF) parsing to JSON object.
			*/
			parseXmp: function(xmp)
			{
				var self = this;

				var items = [];
				try
				{
					var doc = jQuery.parseXML(xmp);

					/* Cross-browser shenanigans.
					*/
					var descriptions =
						doc.getElementsByTagName('rdf:Description');
					if (descriptions.length < 1)
						descriptions = doc.getElementsByTagName('Description');
					if (descriptions.length < 1)
						return;

					for (var i = 0; i < descriptions.length; i++)
					{
						var item = self.parseXmpNode(descriptions[i]);
						if (item)
							items.push(item);
					}
				}
				catch (e)
				{
					IMu.log('XMP parsing error: {0}', e);
					return;
				}
				return items;
			},

			parseXmpNode: function(node)
			{
				var self = this;

				if (node.nodeType != 1) // 1: ELEMENT_NODE
					return;

				var item = {};
				/* IE7 doesn't know about localName
				*/
				item['localName'] = node.localName || node.baseName;
				item['name'] = node.nodeName;

				for (var i = 0; i < node.attributes.length; i++)
				{
					var attribute = node.attributes[i];
					if (! attribute.prefix || attribute.prefix != 'xmlns')
						continue;

					if (! item['nameSpaces'])
						item['nameSpaces'] = {};

					/* IE7 doesn't know about localName
					*/
					var name = attribute.localName || attribute.baseName;
					item['nameSpaces'][name] = attribute.nodeValue;
				}

				var children = [];
				var nameSpace;

				for (var i = 0; i < node.childNodes.length; i++)
				{
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 8) // 8: COMMENT_NODE
						continue;

					if (childNode.nodeType == 3) // 3: TEXT_NODE
					{
						var value = jQuery.trim(childNode.nodeValue);
						if (value != '')
							item['value'] = value;
						continue;
					}

					/* All elements on the same level should have the same
					** namespace.
					*/
					var ns = childNode.prefix || childNode.nodeName;
					if (nameSpace && ns != nameSpace)
						throw new IMu.Error('BadXmpNamespace', ns);
					nameSpace = ns;

					var child = self.parseXmpNode(childNode);
					children.push(child);
				}
				if (children.length > 0)
				{
					item['children'] =
					{
						nameSpace: nameSpace,
						list: children
					};
				}
				return item;
			}
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-details/enarratives.js
*/
(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/enarratives',

		all:
		{
			showNarrativeDetails: function(owner, data)
			{
				var self = this;

                // Use of 'narrative' class element is deprecated in favour 
                // of 'enarratives' on owner element.
                // This is for consistency accross modules.
                //
                owner.addClass('enarratives');
				var base = owner.child('div', 'narrative');

				self.showNarrativeTrail(base, data.trails);

                var summary = base.child('div', 'summary');
                var details = self.showMultimedia(summary, data);
				var div = details.child('div', 'description');
				div.html(data.description);

				div = base.child('div', 'secondary');
				self.showSection(div, data.objects, 'objects', 'ecatalogue');
				self.showSection(div, data.children, 'subnarratives',
						'enarratives');
				self.showSection(div, data.associations, 'related-narratives',
						'enarratives');

				return details;
			},

			showNarrativeTrail: function(owner, trails)
			{
				var self = this;

				if (! trails)
					return;

				var gap = IMu.Languages.current.dir == 'ltr' ? '>' : '<';
				for (var i = 0; i < trails.length; i++)
				{
					var div = owner.child('div', 'trail');
					var trail = trails[i];

					for (var j = 0; j < trail.length; j++)
					{
						if (j > 0)
						{
							var span = div.child('span');
							span.text(' ' + gap + ' ');
						}
						var irn = trail[j].irn;
						var title = trail[j].title;

						var span = div.child('span', 'item');
						span.text(title);
						var show = (function(irn)
						{
							return function()
							{
								self.widget.showRecord('enarratives', irn);
							}
						})(irn);
						span.bind('click', show);
					}
				}
			}
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-details/eparties.js
*/
(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/eparties',

		all:
		{
			showPartyDetails: function(owner, data)
			{
				var self = this;

                var partyType = data.partyType;
                if (! partyType)
                    return;

                self.section = {};
                self.section.summary = owner.child('div', 'summary');
                self.section.summary = self.showMultimedia(self.section.summary, data);
                self.section.details = owner.child('div', 'supplementary');
                    
                partyType = partyType.toLowerCase();

                if (partyType == 'person')
                    self.showPersonParty(owner, data);
                else if (partyType == 'organisation')
                    self.showOrganisationParty(owner, data);

                self.removeEmptySections(self.section.summary);
                self.removeEmptySections(self.section.details);
			},

			showPersonParty: function(owner, party)
			{
				var self = this;

                /* Section: Summary
                */
                var section = self.section.summary;

                var table = self.addSection(section);

                self.addDetail('eparties-nationality',
                    party.nationality, table);
                self.addDetail('eparties-birth-place',
                    party.birthPlace, table);
                self.addDetail('eparties-birth-date', party.birthDate, table);
                self.addDetail('eparties-death-date', party.deathDate, table);
               
                section = self.section.details;

                var table = self.addSection(section);

                self.addDetail('eparties-role',
                    party.role, table);
                self.addDetail('eparties-organisation',
                    party.organisation, table);

                table = self.addSection(section,
                    'eparties-section-contact');

                var address = [];
                if (party.city)
                    address.push(party.city);
                if (party.state)
                    address.push(party.state);
                if (party.postcode)
                    address.push(party.postcode);
                if (party.country)
                    address.push(party.country);
                self.addDetail('eparties-address', address, table);
                
                self.addDetail('eparties-phone-business', party.business, table);
//                self.addDetail('eparties-phone-home', party.home, table);
//                self.addDetail('eparties-phone-mobile', party.mobile, table);
//                self.addDetail('eparties-fax', party.fax, table);

                self.addDetail('eparties-email', party.email, table);
                self.addDetail('eparties-web ', party.web, table);
			},

			showOrganisationParty: function(owner, party)
			{
				var self = this;

                var div;
                var table;
                var prompts, values, tableOwner;

                /* Section: Summary
                */
                var section = self.section.summary;
//                self.section.summary = section = self.showMultimedia(section, party);

                table = self.addSection(section, 
                    'eparties-section-organisation-summary');

                section = self.section.details;

                table = self.addSection(section,
                    'eparties-section-contact');

                var address = [];
                if (party.street)
                    address.push(party.street);
                if (party.city)
                    address.push(party.city);
                if (party.state)
                    address.push(party.state);
                if (party.postcode)
                    address.push(party.postcode);
                if (party.country)
                    address.push(party.country);
                self.addDetail('eparties-address', address, table);

                self.addDetail('eparties-phone', party.business, table);
                self.addDetail('eparties-fax', party.fax, table);

                self.addDetail('eparties-email', party.email, table);
                self.addDetail('eparties-web', party.web, table);
			}
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/details-viewer.js
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
        _source: 'prague/common/details-viewer',

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

            // called from paged-viewer
            getFrameRange: function(width, height, frame)
            {
                var self = this;

                var range = {};
                range.first = Math.round(frame.left / width);
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

            scrollerResize: function(info)
            {
                var self = this;

                if (! self.widget.results)
                    return;

                var currentContentOffset = self.content.offset();

                self.content.fullHeight(info.height);
                var contentHeight = self.content.height();
                self.log('scrollerResize: contentHeight {0}', contentHeight);

                self.recordWidth = info.width;
                self.recordHeight = contentHeight;

                var contentWidth = self.recordWidth * self.widget.hits;
                self.log('scrollerResize: contentWidth {0}', contentWidth);
                self.content.width(contentWidth);

                var offset = self.widget.offset;
                if (offset !== undefined)
                {
                    var left = info.width * - offset;
                    self.content.css('left', left);

                    /* There was an issue with records not being resized 
                    ** after the scroller resized so explicitly resize 
                    ** the current, next and previous records in the cache.
                    */
                    if (self.cache[offset - 1])
                        self.locateRecord(offset - 1, self.cache[offset - 1]);
                    if (self.cache[offset])
                        self.locateRecord(offset, self.cache[offset]);
                    if (self.cache[offset + 1])
                        self.locateRecord(offset + 1, self.cache[offset + 1]);
                        
                }
            },

            create_other: function(div, data)
            {
                var self = this;

                var text = 'offset: ' + data.offset;
                text += ' rid: ' + data.rid;
                div.text(text);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/details-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showMultimediaDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/details-viewer/enarratives.js
*/
(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/enarratives',

        all:
        {
            create_enarratives: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showNarrativeDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/details-viewer/eparties.js
*/
(function(theme)
{
    theme.views.register('details-viewer',
    {
        _source: 'prague/common/details-viewer/eparties',

        all:
        {
            create_eparties: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                self.showPartyDetails(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/lightbox-viewer.js
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
        _source: 'prague/common/lightbox-viewer',

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
					var img = frame.child('img', 'no-image');
					var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
					img.attr('src', src);
				}

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                if (data.title)
                    title.text(data.title);
                else if (data.SummaryData)
                    title.text(data.SummaryData);

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
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/lightbox-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'prague/common/lightbox-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(div, data)
            {
                var self = this;

                // TODO: other mime types with image previews (eg video)
                {
                    var image = new Object();

                    image.type = 'image';
                    image.format = data['mimeFormat'];
                    image.irn = data['irn'];

                    data['image'] = image;
                }
                
                self.create_other(div, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/list-viewer.js
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
        _source: 'prague/common/list-viewer',

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
                    select.attr(
                        'checked',
                        IMu.User.hasEntry(module, key, IMu.string('common-my-collection')));
                });
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

                    var browser = IMu.Platform.browser.name;
                    var version = IMu.Platform.browser.version;
                    var useAutoMargin = true;
                    
                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
				else
				{
					var img = frame.child('img', 'no-image');
					var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
					img.attr('src', src);
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
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/list-viewer/emultimedia.js
*/
(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/emultimedia',

        all:
        {
            create_emultimedia: function(div, data)
            {
                var self = this;

                // TODO: other mime types with image previews (eg video)
                if (data.mimeType == 'image')
                {
                    var image = new Object();

                    image.type = 'image';
                    image.format = data['mimeFormat'];
                    image.irn = data['irn'];

//  				data['images'] = new Object();
                    data['image'] = image;
                }	

                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var type = td.child('div', 'details');
                type.text(data.mimeType);

                var format = td.child('div', 'details');
                format.text(data.mimeFormat);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/list-viewer/enarratives.js
*/
(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/enarratives',

        all:
        {
            create_enarratives: function(div, data)
            {
                var self = this;

                var table = self.createTable(div, data);

                // content
                var td = table.find('td:nth-child(2)');

                var title = td.child('div', 'title');
                title.text(data.title);
                title.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                var narrative = td.child('div', 'description');
                narrative.html(data.description);

                // use only the text, not any embedded HTML structure
                narrative.text(narrative.text());
            },

            resize_enarratives: function(div)
            {
                var self = this;

                var title = div.find('.title');
                title.IMuEllipsis();

                /* This would be nice but the ellipsis code is too slow
                ** to use on resize.
                */
                /*
                var description = div.find('.description');
                description.ellipsis();
                */
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/list-viewer/eparties.js
*/
(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/eparties',

        all:
        {
			create_eparties: function(div, data)
			{
				var self = this;
				var table = self.createTable(div, data);

				// content
				var td = table.find('td:nth-child(2)');

				var title = td.child('div', 'title');
				title.text(data.title);
				window.setTimeout(function()
				{
					title.IMuEllipsis();
				}, 10);
				title.bind('click', function()
				{
					self.widget.recordSelected(data.rid, data.offset);
				});

				if (data.partyType && data.partyType.toLowerCase() == 'person')
				{
					if (data.birthDate)
					{
						var birth = td.child('div', 'details');
						birth.text(IMu.string('eparties-born') + ' ' + data.birthDate);
					}

					if (data.deathDate)
					{
						var death = td.child('div', 'details');
						death.text(IMu.string('eparties-died') + ' ' + data.deathDate);
					}
				}
				else if (data.partyType && data.partyType.toLowerCase() == 'organisation')
				{
					if (data.street)
					{
						var street = td.child('div', 'details');
						street.text(data.street);
					}

					var address = '';

					if (data.city)
						address += data.city;
					if (data.state)
					{
						if (address)
							address += ', ';
						address += data.state;
					}
					if (data.postcode)
					{
						if (address)
							address += ', ';
						address += data.postcode;
					}
					if (data.country)
					{
						if (address)
							address += ', ';
						address += data.country;
					}

					var addressTd = td.child('div', 'details');
					addressTd.text(address);
				}
			}
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/tree-viewer.js
*/
(function(theme)
{
    theme.views.register('tree-viewer', 'viewer',
    {
        _source: 'prague/common/tree-viewer',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

				this.holder = undefined;
				this.browser = undefined;

				this.details = undefined;
            },

            _create: function()
            {
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

				self.details = self.details.IMu('record-browser',
				{

				});

				self.details.createView();

				//check to see if we have a custom sorting option
				//if not just use the standard (SummaryData)
				if(IMu.Config.archiveSortingOption)
				{
					archiveSortingOption = IMu.Config.archiveSortingOption;
				}

				self.browser = self.browser.IMu('tree-browser',
				{
					parent: IMu.Config.archiveParent,
					displayWidget: self.details,
					expandable: true,
					sortOption : archiveSortingOption	
				});

				self.browser.createView();

				self.scroller = self.holder.child('a', 'scroll');
				self.scroller.text('scroll to top');
				self.scroller.attr('href',' ');

				self.scroller.click(function()
				{
					var parent = this.parentElement;
					$(parent).animate
					({
						scrollTop: 0
						}, 800);
						return false;
					});
            },

			showRecord: function(module, key)
			{
                var self = this;

                self.browser.options.module = module;
                self.browser.options.key = key;

				self.browser.fetchHierarchy(module,key);
			}
		}
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/my-collections.js
*/
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

/* Source: ./themes/prague/common/views/sort-control.js
*/
(function(theme)
{
    theme.views.register('sort-control', 'selection-control',
    {
        _source: 'prague/common/sort-control',

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
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-browser.js
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
        _source: 'prague/common/record-browser',

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
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-browser/emultimedia.js
*/
(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/emultimedia',

        all:
        {
            show_emultimedia: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showMultimediaDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-browser/enarratives.js
*/
(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/enarratives',

        all:
        {
            show_enarratives: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showNarrativeDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/common/views/record-browser/eparties.js
*/
(function(theme)
{
    theme.views.register('record-browser',
    {
        _source: 'prague/common/record-browser/eparties',

        all:
        {
            show_eparties: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                self.showPartyDetails(owner, data);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/strings.js
*/
(function(theme)
{
	theme.strings.register
	({
		'search-this-collection-label':
		{
			en: 'Search Minerals and Gems',
		},
		'advanced-keywords':
		{
			en: 'Keyword Search',
		},
		'advanced-species':
		{
			en: 'Species',
		},
		'advanced-variety':
		{
			en: 'Variety',
		},
		'advanced-pseudo-after':
		{
			en: 'Pseudo after',
		},
		'advanced-assoc-species':
		{
			en: 'Assoc Species',
		},
		'advanced-country':
		{
			en: 'Country',
		},
		'advanced-state':
		{
			en: 'State',
		},
		'advanced-city':
		{
			en: 'City',
		},
		'advanced-district':
		{
			en: 'District',
		},
		'advanced-mine':
		{
			en: 'Mine',
		},
		'ecatalogue-pseudo-after':
		{
			en: 'Pseudo after',
		},
		'ecatalogue-country':
		{
			en: 'Country',
		},
                'ecatalogue-state':
		{
			en: 'State',
		},
                'ecatalogue-county':
		{
			en: 'County',
		},
                'ecatalogue-region':
		{
			en: 'Region',
		},
                'ecatalogue-township':
		{
			en: 'Township',
		},
                'ecatalogue-city':
		{
			en: 'City',
		},
                'ecatalogue-mine':
		{
			en: 'Mine',
		},
                'ecatalogue-ditrict':
		{
			en: 'District',
		},
                'ecatalogue-catalogue-number':
		{
			en: 'Catalogue Number',
		},
                'ecatalogue-museum-location':
		{
			en: 'Museum Location',
		},
                'ecatalogue-case-number':
		{
			en: 'Case Number',
		},
                'ecatalogue-case-name':
		{
			en: 'Case Name',
		},
                'ecatalogue-old-collection':
		{
			en: 'Old Collection',
		},
                'ecatalogue-dimensions':
		{
			en: 'Dimensions',
		},
                'ecatalogue-weight':
		{
			en: 'Weight',
		},
                'ecatalogue-color':
		{
			en: 'Color',
		},
                'ecatalogue-legal-description':
		{
			en: 'Legal Description',
		},
                'on-display':
		{
			en: 'On Display',
		},
		'only-items-with-images':
		{
			en: 'With Images',
			fi: 'Vain esineet joilla on kuva',
			fr: 'Uniquement les articles avec images'
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/default-page.js
*/
(function(theme)
{
    theme.views.register('default-page',
    {
        _source: 'prague/client/default-page',

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

                /* Get list of Museum Location and Case Name fields.
                 */
                self.museumLocationsList = "";
                self.caseNamesList = "";
                var file = 'imu/shared/client/images/lists/museum-location.txt';
                $.get(file, function(data)
                {
                    self.museumLocationsList = data.split("\n");
                });
                file = 'imu/shared/client/images/lists/case-name.txt';
                $.get(file, function(data)
                {
                    self.caseNamesList = data.split("\n");
                });
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

                //item = self.tabbed.add('record-browser');
                //self.browser = item.widget;
                //self.browser.setOptions
                //({
                //    showSelectionControl: true
                //});

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
            },

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
                var src = IMu.Request.getURL('Image') + 'CMNH_TWO_LINE_HORIZ_RELATIONSHIP.PNG';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);

                td = tr.child('td', 'title');
                td.css('width', '98%');
                td.text(IMu.string('imu-title'));

                td = tr.child('td', 'search');
                td.css('width', '1%');
                td.css('white-space', 'nowrap');
            },

            isDecimal: function(s)
            {
                    var isDecimal_re = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;

                    return(String(s).search (isDecimal_re) != -1);
            },

            /* Sidebar
            */
            makeSidebar: function()
            {
                var self = this;
                self._super();
            },

            makeSearchForms: function()
            {
                 var self = this;

                 var searches = self.sidebar.child('div', 'searches');
                 self.searchFormsLabel = searches.child('div', 'searches-label');
                 self.searchFormsLabel.text(IMu.string('search-this-collection-label'));

                 var searchForms = searches.child('div', 'search-forms');
                 self.searchForms = searchForms.IMu('tabbed-display',
                 {
                     showHeader: false
                 });
                 self.addSearchForms();
            },
            
            addSearchForms: function()
            {
                var self = this;

                self.makeAdvancedSearchForm();
                //self.makeNarrativesSearchForm();
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
                        column: 'keywords',
                        prompt: 'advanced-keywords',
                        type: 'text'
                    },
                    {
                        label: 'Enter catalog number, color, etc.',
                        type: 'label'
                    },
                    {
                        column: 'CatSpecies',
                        prompt: 'advanced-species',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCountryLocal',
                        lookup: 'Current Locality',
                        level: 0,
                        prompt: 'advanced-country',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentStateLocal',
                        lookup: 'Current Locality',
                        level: 2,
                        prompt: 'advanced-state',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCityLocal',
                        lookup: 'Current Locality',
                        level: 5,
                        prompt: 'advanced-city',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineDistrictLocal',
                        lookup: 'Current Locality',
                        level: 8,
                        prompt: 'advanced-district',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineLocal',
                        lookup: 'Current Locality',
                        level: 7,
                        prompt: 'advanced-mine',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                ({
   /*                 onlyItemsWithImages: true,
                    onlyItemsOnDisplay: true, */
                    onSearch: function(terms,imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        terms.add('CatDepartment', 'Mineralogy');

                        if (terms.list[0][0] == 'keywords')
                        {
                            var text = terms.list[0][1];
                            var termsOr = new IMu.Terms("Or");
                            termsOr.add('keywords',text);

                            var str = text;
                            var pattern = /^CM(.*)/g;
                            if (str.match(pattern))
                            {
                                str = str.replace(pattern, "$1");
                                termsOr.add('CatCatalogNumber', str);
                            }
                            
                            if (self.isDecimal(text))
                            {
                                termsOr.add('CatCatalogNumber', text);
                                termsOr.add('CatWeight', text);
                            }
                            
                            /* Check if the Stroage ID exists in the Museum Location List
                             */
                            var storageID = "";
                            for( var i = 0; i < self.museumLocationsList.length-1; i++)
                            {
                                if (storageID == '')
                                {
                                    if(self.museumLocationsList[i].indexOf("|") != -1)
                                    {
                                        var values = self.museumLocationsList[i].toLowerCase().split("|");
                                        if (text != "" && values[1].indexOf(text) != -1)
                                        {
                                            storageID = values[0];
                                        }
                                    }
                                }
                            }
                            if (storageID != '')
                            {
                                termsOr.add('CatStorageID', storageID);
                            }

                            /* Check if the Stroage Name exists in the Case Name List
                             */
                            var storageName= "";
                            for( var i = 0; i < self.caseNamesList.length-1; i++)
                            {
                                if (storageName == '')
                                {
                                    if(self.caseNamesList[i].indexOf("|") != -1)
                                    {
                                        var values = self.caseNamesList[i].toLowerCase().split("|");
                                        if (text != "" && values[2].indexOf(text) != -1)
                                        {
                                            storageName = values[1];
                                        }
                                    }
                                }
                            }
                            if (storageName != '')
                            {
                                termsOr.add('CatStorageName', storageName);
                            }
                
                            terms.list[0] = termsOr;
                        }
                        
                        self.doSearch(terms, 'ecatalogue');
                    }
                });
            },

            makeMyCollections: function()
            {
            },


            resizeSidebar: function()
            {
                this._super.apply(this, arguments);
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/mineralogy-page.js
*/
(function(theme)
{
    theme.views.register('mineralogy-page', 'page',
    {
        _source: 'prague/client/mineralogy-page',

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

                /* Get list of Museum Location and Case Name fields.
                 */
                self.museumLocationsList = "";
                self.caseNamesList = "";
                var file = 'imu/shared/client/images/lists/museum-location.txt';
                $.get(file, function(data)
                {
                    self.museumLocationsList = data.split("\n");
                });
                file = 'imu/shared/client/images/lists/case-name.txt';
                $.get(file, function(data)
                {
                    self.caseNamesList = data.split("\n");
                });
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
                //self.browser.setOptions
                //({
                //    showSelectionControl: true
                //});

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
            },

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
            },

            isDecimal: function(s)
            {
                    var isDecimal_re = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;

                    return(String(s).search (isDecimal_re) != -1);
            },

            /* Sidebar
            */
            makeSidebar: function()
            {
                var self = this;
            	self.makeSearchForms();
	    },

            makeSearchForms: function()
            {
                 var self = this;

                 var searches = self.sidebar.child('div', 'searches');
                 self.searchFormsLabel = searches.child('div', 'searches-label');
                 self.searchFormsLabel.text(IMu.string('search-this-collection-label'));

                 var searchForms = searches.child('div', 'search-forms');
                 self.searchForms = searchForms.IMu('tabbed-display',
                 {
                     showHeader: false
                 });
                 self.addSearchForms();
            },
            
            addSearchForms: function()
            {
                var self = this;

                self.makeAdvancedSearchForm();
                //self.makeNarrativesSearchForm();
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
                        column: 'keywords',
                        prompt: 'advanced-keywords',
                        type: 'text'
                    },
                    {
                        label: 'Enter catalog number, color, etc.',
                        type: 'label'
                    },
                    {
                        allowEmpty: true,
                        column: 'CatSpecies',
                        lookup: 'Catalog Species',
                        level: 0,
                        prompt: 'advanced-species',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'CatVariety',
                        lookup: 'Variety',
                        level: 0,
                        prompt: 'advanced-variety',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'CatPseudoAfter',
                        lookup: 'Pseudo After',
                        level: 0,
                        prompt: 'advanced-pseudo-after',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'PhmAssociatedSpecies1',
                        lookup: 'Associated Species',
                        level: 0,
                        prompt: 'advanced-assoc-species',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCountryLocal',
                        lookup: 'Current Locality',
                        level: 0,
                        prompt: 'advanced-country',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentStateLocal',
                        lookup: 'Current Locality',
                        level: 2,
                        prompt: 'advanced-state',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentCityLocal',
                        lookup: 'Current Locality',
                        level: 5,
                        prompt: 'advanced-city',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineDistrictLocal',
                        lookup: 'Current Locality',
                        level: 8,
                        prompt: 'advanced-district',
                        type: 'selection'
                    },
                    {
                        allowEmpty: true,
                        column: 'ColHisCurrentMineLocal',
                        lookup: 'Current Locality',
                        level: 7,
                        prompt: 'advanced-mine',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                ({
                    onlyItemsWithImages: true,
                    onlyItemsOnDisplay: true,
                    onSearch: function(terms,imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasImage', 'Y');
                        }
                        terms.add('CatDepartment', 'Mineralogy');

                        if (terms.list[0][0] == 'keywords')
                        {
                            var text = terms.list[0][1];
                            var termsOr = new IMu.Terms("Or");
                            termsOr.add('keywords',text);

                            var str = text;
                            var pattern = /^CM(.*)/g;
                            if (str.match(pattern))
                            {
                                str = str.replace(pattern, "$1");
                                termsOr.add('CatCatalogNumber', str);
                            }
                            
                            if (self.isDecimal(text))
                            {
                                termsOr.add('CatCatalogNumber', text);
                                termsOr.add('CatWeight', text);
                            }
                            
                            /* Check if the Stroage ID exists in the Museum Location List
                             */
                            var storageID = "";
                            for( var i = 0; i < self.museumLocationsList.length-1; i++)
                            {
                                if (storageID == '')
                                {
                                    if(self.museumLocationsList[i].indexOf("|") != -1)
                                    {
                                        var values = self.museumLocationsList[i].toLowerCase().split("|");
                                        if (text != "" && values[1].indexOf(text) != -1)
                                        {
                                            storageID = values[0];
                                        }
                                    }
                                }
                            }
                            if (storageID != '')
                            {
                                termsOr.add('CatStorageID', storageID);
                            }

                            /* Check if the Stroage Name exists in the Case Name List
                             */
                            var storageName= "";
                            for( var i = 0; i < self.caseNamesList.length-1; i++)
                            {
                                if (storageName == '')
                                {
                                    if(self.caseNamesList[i].indexOf("|") != -1)
                                    {
                                        var values = self.caseNamesList[i].toLowerCase().split("|");
                                        if (text != "" && values[2].indexOf(text) != -1)
                                        {
                                            storageName = values[1];
                                        }
                                    }
                                }
                            }
                            if (storageName != '')
                            {
                                termsOr.add('CatStorageName', storageName);
                            }
                
                            terms.list[0] = termsOr;
                        }
                        
                        self.doSearch(terms, 'ecatalogue');
                    }
                });
            },

	    /* Convenience */
            doSearch: function(terms, include)
            {
                var self = this;

                if (typeof(include) == 'string')
                    include = [ include ];

                self.tabbed.beginDelay();

                if (userSearch !== undefined)
                    userSearch.onComplete = undefined;
                var search = userSearch = new IMu.Request.Search();
                search.search(terms, include);
                search.onComplete = function(hits)
                {
                    /* If updateURL option is set to true, update the URL
                    ** after a search
                    */
                    if (IMu.Config.updateURL)
                    {
                        IMu.URL.Hash.updateURLHashValues(terms, include, hits.response.id);
                    }

                    search.onComplete = undefined;
                    self.tabbed.endDelay();

                    self.tabbed.select(1);
                    self.viewer.select(0);

                    self.viewer.addState(search);
				}
            },

	    makeMyCollections: function()
            {
            },


            resizeSidebar: function()
            {
                this._super.apply(this, arguments);
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
                //var img = this.footer.child('img');
                //var src = IMu.Request.getURL('Image') + '&name=emu-silhouettes';
                //img.attr('src', src);
                //img.resizeOnLoad();
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
                this.sidebar.addClass('phone');
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

    // Private
    var userSearch = undefined;
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/record-details.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for record-details should go in the
    ** appropriate file in the record-details directory. For example,
    ** specific code for the Catalogue module should go in
    ** record-details/ecatalogue.js.
    **
    ** Common code belongs in this file.
    **
    */
    theme.views.register('record-details',
    {
        _source: 'prague/client/record-details',

        all:
        {
            _construct: function()
            {
                var self = this;
                self._super.apply(self, arguments);
                self.shiwSaveMultimedia = undefined;

                self.museumLocationsList = undefined;
                var file = 'imu/shared/client/images/lists/museum-location.txt';
                $.get(file, function(text)
                {
                    self.museumLocationsList = text.split("\n");
                });

                self.caseNamesList = undefined;
                file = 'imu/shared/client/images/lists/case-name.txt';
                $.get(file, function(text)
                {
                    self.caseNamesList = text.split("\n");
                });
            },

            addLocalityTable: function(prompts, values, owner)
            {
                var self = this;

                if (! values)
                    return undefined;
                    
                function add()
                {
                    var count = 0;
                    var index = undefined;
                    var tr = [];
                    var td;
                    
                    for (var i = 0; i < values.length; i++)
                    {
                        if (values[i])
                        {
                            count++;
                            if (count > 4)
                            {
                                index = count - 5; 
                                td = tr[index].child('td', 'prompt');
                                td.text(IMu.string(prompts[i]) + ':');
                                td = tr[index].child('td', 'value');
                                td.text(values[i]);
                            }
                            else
                            {
                                tr[i] = owner.child('tr');
                                td = tr[i].child('td', 'prompt');
                                td.text(IMu.string(prompts[i]) + ':');
                                td = tr[i].child('td', 'value');
                                td.text(values[i]);
                            }
                        }
                    }

                    return td;
                }

                var td;
                td = add();

                return td;
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/record-details/ecatalogue.js
*/
(function(theme)
{
    theme.views.register('record-details',
    {
        _source: 'prague/client/record-details/ecatalogue',

        all:
        {
            showCatalogueDetails: function(owner, data)
            {
                var self = this;

                var div;
                var table, tableOther, divider;
                var prompts, values, tableOwner;

                /* Section: Summary
                */
                var title = "";
                if (data.CatSpecies)
                {
                    title = data.CatSpecies;
                }
                if (data.CatVariety)
                {
                    if (title != "")
                    {
                        title += " ";
                    }
                    title += "VARIETY " + data.CatVariety;
                }
                if (data.PhmAssociatedSpecies1)
                {
                    if (title != "")
                    {
                        title += " AND ";
                    }
                    title += data.PhmAssociatedSpecies1;
                }
                
                if (title)
                {
                    data['title'] = title;
                }
                else
                {
                    data['title'] = data.SummaryData;
                }

                // multimedia
                var summary = owner.child('div', 'summary');
                summary = self.showMultimedia(summary, data);
                table = self.addSection(summary); //, 'ecatalogue-section-summary');

                var supplementary = owner.child('div', 'supplementary');
                table = self.addSection(supplementary); 
                
		self.addDetail('ecatalogue-pseudo-after',
                    data.CatPseudoAfter, table);

                prompts = 
                [
                    'ecatalogue-country',
                    'ecatalogue-state',
                    'ecatalogue-county',
                    'ecatalogue-region',
                    'ecatalogue-township',
                    'ecatalogue-city',
                    'ecatalogue-mine',
                    'ecatalogue-ditrict'
                ];
                values = 
                [
                    data.ColHisCurrentCountryLocal,
                    data.ColHisCurrentStateLocal,
                    data.ColHisCurrentCountyLocal,
                    data.ColHisCurrentRegionLocal,
                    data.ColHisCurrentTownshipLocal,
                    data.ColHisCurrentCityLocal,
                    data.ColHisCurrentMineLocal,
                    data.ColHisCurrentMineDistrictLocal
                ];
                self.addLocalityTable(prompts, values, table);
                
                table = self.addSection(supplementary); 
                if (data.CatCatalogNumber)
                {
                    self.addDetail('ecatalogue-catalogue-number',
                        "CM" + data.CatCatalogNumber, table);
                }

                if(data.CatStorageID && data.CatStorageName)
                {
                    var museumLocation = "";
                        for( var i = 0; i < self.museumLocationsList.length-1; i++)
                        {
                            if (museumLocation == '')
                            {
                                if(self.museumLocationsList[i].indexOf("|") != -1)
                                {
                                    var values = self.museumLocationsList[i].split("|");
                                    if (values[0] == data.CatStorageID)
                                    {
                                        museumLocation = values[1];
                                    }
                                }
                                else
                                {
                                    museumLocation = self.museumLocationsList[i];
                                } 
                            }
                        }
                        if (museumLocation.indexOf("Collection Storage") == -1)
                        {
                            self.addDetail('ecatalogue-museum-location',
                                museumLocation, table);
                            self.addDetail('ecatalogue-case-number',
                                data.CatCaseNumber, table);
                        }
                        
                        var caseName= "";
                        for( var i = 0; i < self.caseNamesList.length-1; i++)
                        {
                            if (caseName == '')
                            {
                                if(self.caseNamesList[i].indexOf("|") != -1)
                                {
                                    var values = self.caseNamesList[i].split("|");
                                    if (values[0] == data.CatStorageID && values[1] == data.CatStorageName)
                                    {
                                        caseName = values[2];
                                    }
                                }
                                else
                                {
                                    caseName = self.caseNamesList[i];
                                } 
                            }
                        }
                        if (museumLocation.indexOf("Collection Storage") == -1)
                        {
                            self.addDetail('ecatalogue-case-name',
                                data.CatStorageID, table);
                        }
                }

                self.addDetail('ecatalogue-old-collection',
                    data.CatOldCollectionName_tab, table);
                self.addDetail('ecatalogue-dimensions',
                    data.CatDimensions, table);

                var weight = undefined;
                if (data.CatWeight)
                {
                    weight = data.CatWeight;
                    if (data.CatWeightUnit)
                    {
                        weight += " " + data.CatWeightUnit;
                    }
                }
                self.addDetail('ecatalogue-weight',
                    weight, table);
                self.addDetail('ecatalogue-color',
                    data.CatColor, table);
                    
                self.removeEmptySections(summary);
                self.removeEmptySections(supplementary);
            },

            showMultimedia: function(owner, data)
            {
                var self = this;

                var table = owner.child('table');
                var tr = table.child('tr');

                if (data.multimedia && data.multimedia.length > 0)
                {
                    var td = tr.child('td', 'multimedia-cell');
                    self.showMedia(td, data);
                }
                
                tr = table.child('tr');
                var details = tr.child('td', 'details-cell').child('div', 'details');
                var titleRow = details.child('table', 'title').child('tr');
                titleRow.child('td').text(data.title);

                return details;
            },

            showMedia: function(owner, data)
            {
                var self = this;
                var multimedia = data.multimedia;

                if (! multimedia || multimedia.length < 1)
                    return;

                owner.addClass('multimedia-cell');
                var base = owner.child('div', 'multimedia');
                var mainPlugin = base.IMuMultimedia();
                for (var i = 0; i < multimedia.length; i++)
                {
                    mainPlugin.addResourceByKey(multimedia[i].irn, data.CatSpecies);
                }

                if (self.showSaveMultimedia)
                {
                    var saveMultimediaDiv = owner.child('div', 'multimedia-show-save');
                    var saveMultimediaTr = saveMultimediaDiv.child('table').child('tr');
                    saveMultimediaTr.child('td', 'multimedia-count').text('1/' + multimedia.length);

                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(multimedia[0].irn)
                    mm.setDisposition('attachment');
                    if (data.CatSpecies)
                    {
                        mm.addParam('alt', data.CatSpecies);
                    }
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
                                if (data.CatSpecies)
                                {
                                    mm.addParam('alt', data.CatSpecies);
                                }
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
                        if (data.CatSpecies)
                        {
                            mm.addParam('alt', data.CatSpecies);
                        }
                        plugin.addResource(mm);
                    }
                    else
                    {
                        td.find('div').attr('class', 'imu-plugin imu-multimedia-plugin imu-multimedia-icon');
                        var src = IMu.Request.getURL('Image') + '&name=multimedia-' + mimeType;
                        plugin.addImage(src);
                    }
                }
                var options =
                {
                    scrollType: 'horizontal',
                    horizontalPager: true,
                    onResize: function()
                    {
                        if (this.content.fullWidth() > this.view.fullWidth())
                        {
                            this.left.css('visibility', 'visible');
                            this.right.css('visibility', 'visible');
                        }
                        else
                        {
                            this.left.css('visibility', 'hidden');
                            this.right.css('visibility', 'hidden');
                        }
                    }
                };
                var scroller = scrollerDiv.IMuScroller(options);
                var content = scroller.getContent();
                var parts = content.find('td');
                var offsetOne = jQuery(parts[0]).offset();
                var offsetTwo = jQuery(parts[1]).offset();
                var snap = offsetTwo.left - offsetOne.left;
                scroller.setOptions({ horizontalSnap: snap });
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/details-viewer.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the details-viewer view should go in the
    ** appropriate file in the details-viewer directory. For example,
    ** specific code for the Catalogue module should go in
    ** details-viewer/ecatalogue.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
	theme.views.register('details-viewer',
	{
        _source: 'prague/client/details-viewer',

		all:
		{
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/details-viewer/ecatalogue.js
*/
(function(theme)
{
	theme.views.register('details-viewer',
	{
        _source: 'prague/client/details-viewer/ecatalogue',

		all:
		{
			create_ecatalogue: function(div, data)
			{
				var self = this;

				if (! data)
					return;

				var info = self.showCatalogueDetails(div, data);
			}
		}
	});
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/lightbox-viewer.js
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
        _source: 'prague/client/lightbox-viewer',

        all:
        {
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/lightbox-viewer/ecatalogue.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer',
    {
        _source: 'prague/client/lightbox-viewer/ecatalogue',

        all:
        {
            create_ecatalogue: function(div, data)
            {
                var self = this;

                // image
                var frame = div.child('div', 'frame');
                if (data.image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(data.image.irn);
                    mm.addFilter('kind', 'resolution');
					mm.addFilter('width', 'bf', '200');
                    if (data.CatSpecies)
                    {
                        mm.addParam('alt', data.CatSpecies);
                    }
                    var plugin = frame.IMuMultimedia();
                    plugin.addResource(mm);
                }
                else
                {
                    var img = frame.child('img', 'no-image', 'collection-image');
                    var src = IMu.Request.getURL('Image') + '&name=no-multimedia';
                    img.attr('src', src);
                    img.attr('alt', '');
                }
                frame.bind('click', function()
                {
                    self.widget.recordSelected(data.rid, data.offset);
                });

                // info
                var info = div.child('div', 'info');

                // title
                var title = info.child('div', 'title');
                var text = "";
                if (data.CatSpecies)
                {
                    text = data.CatSpecies;
                }
                if (data.CatVariety)
                {
                    if (text != "")
                    {
                        text += " ";
                    }
                    text += "VARIETY " + data.CatVariety;
                }
                if (data.PhmAssociatedSpecies1)
                {
                    if (text != "")
                    {
                        text += " AND ";
                    }
                    text += data.PhmAssociatedSpecies1;
                }
                if (text != "")
                    title.text(text);
                else if (data.SummaryData)
                    title.text(data.SummaryData);

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
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'prague/client/combined-viewer',

        all:
        {
            makeViewIcons: function()
            {
                var self = this;
                var widget = self.widget;

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
                        {
                            src += '-selected';
                            item.img.addClass('selected');
                        }
                        item.img.attr('src', src);
                        item.img.attr('title', IMu.string(item.title));
                        if (IMu.string(item.title) == 'Lightbox')
                        {
                                item.img.attr('alt', 'thumbnail view');
                        }
                        else if (IMu.string(item.title) == 'Details')
                        {
                                item.img.attr('alt', 'detail view');
                        }
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
            }
        }
    });
})(IMu.Themes.get('prague'));

/* Source: ./themes/prague/client/views/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'prague/client/page',

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

                /*
                self.header = self.holder.child('div', 'header');
                self.header.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                });
                self.createHeader();

                self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    bottom: 0
                });
                self.createFooter();
                */

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
            },

            resize: function()
            {
                var self = this;

                //var headerHeight = self.header.fullHeight();
                var headerHeight = 0;
                //var footerHeight = self.footer.fullHeight();
                var footerHeight = 0;
                self.sidebar.css('top', headerHeight);
                self.sidebar.css('bottom', footerHeight);

                var sidebarWidth = 0;
                if (self.sidebar.visible())
                    sidebarWidth = self.sidebar.fullWidth();
                self.sidebar.css('display', 'none');

                self.content.css('top', headerHeight);
                self.content.css('bottom', footerHeight);
                self.content.css(IMu.Languages.current.near, sidebarWidth -1);
            
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
                if (sidebarWidth > 0)
                {
                    self.sidebar.css('display', 'block');
                }
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
})(IMu.Themes.get('prague'));
