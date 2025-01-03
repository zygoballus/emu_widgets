/* THIS FILE IS BUILT AUTOMATICALLY.
** DO NOT CHANGE IT DIRECTLY.
**
** Built at: 2024-11-14 17:52:27 UTC (2024-11-14 17:52:27 UTC)
*/
"use strict";

/* Source: ./themes/marrakech/common/strings.js
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

        'ke-website':
        {
            en: "http://www.kesoftware.com"
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/collection-viewer.js
*/
(function(theme)
{
    theme.views.register('collection-viewer', 'vertical-viewer',
    {
        _source: 'marrakech/common/collection-viewer',

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
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'marrakech/common/combined-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.header = undefined;
                self.near = undefined;
                self.far = undefined;

                self.list = undefined;
            },

            _create: function()
            {
                var self = this;

                self._super();

                var widget = self.widget;

                self.header = self.holder.child('div', 'header');
                self.near = self.header.child('div', 'near');
                self.far = self.header.child('div', 'far');
                var end = self.header.child('div');
                end.css('clear', 'both');

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(n)
                    {
                        var item = widget.list[n];
                        if (item.elem)
                            item.elem.remove();

                        var index = n + 1;

                        item.img = self.far.child('img', 'icon icon-' + index);
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

                var hits = self.widget.search.hits;
                var inc = 0;
                var pos = 0;
                self.near.empty();
                for (var i = 0; i < hits.modules.length; i++)
                {
                    (function(n)
                    {
                        var module = hits.modules[n];
                        if (module.hits < 0)
                            return;

                        if (inc > 0)
                        {
                            var span = self.near.child('span');
                            span.text(' | ');
                        }

                        var span = self.near.child('span', 'module');
                        var text = IMu.string('module-' + module.name);
                        text += ' ';
                        text += module.hits;
                        span.text(text);
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
            }
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'marrakech/common/page',

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

				/* Create divs for Background styling
				*/
                var background = self.holder.child('div', 'background')
                var BGLayer;
               
                BGLayer = background.child('div', 'bg3');
                BGLayer.attr('id', 'bg-client');

                BGLayer = background.child('div', 'bg1');
                BGLayer.attr('id' ,'bg-client');
                BGLayer = BGLayer.child('div', 'bg2');
                BGLayer.attr('id', 'bg-client');
                                                                           
                BGLayer = background.child('div', 'bg4');
                BGLayer.attr('id', 'bg-client');
                BGLayer.attr('style', 'z-index: -1');                          
                                                                                
                BGLayer = BGLayer.child('div', 'bg5');
                BGLayer.attr('id', 'bg-client');

                self.header = self.holder.child('div', 'header');
                self.header.css
                ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0
                });

                var div = self.header.child('div', 'navigation');

				var headerBackground1 = self.header.child('div', 'background1'); 
                var headerBackground2 = headerBackground1.child('div', 'background2');
                headerBackground2.child('h1', 'heading');


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
                self.content.css(IMu.Languages.current.near, sidebarWidth);
//                if (! IMu.Platform.device.is.desktop)
//                    self.content.css(IMu.Languages.current.far, -sidebarWidth);
            },

            /* Do nothing by default */
            createHeader: function()
            {
            },

            createFooter: function()
            {
                var self = this;

                self.footer.logos = self.footer.child('a', 'logos');
                self.footer.logos.attr('href', IMu.string('ke-website'));

                var src;

                src = IMu.Request.getURL('Image') + '&name=emu-silhouettes';
                var EMuSilhouettes = 
                    self.footer.logos.child('img', 'emu-silhouettes');
                EMuSilhouettes.attr('src', src);
                EMuSilhouettes.resizeOnLoad();

                src = IMu.Request.getURL('Image') + '&name=imu-logo';
                var IMuLogo = 
                    self.footer.logos.child('img', 'imu-logo');
                IMuLogo.attr('src', src);
                IMuLogo.resizeOnLoad();
            },

            createSidebar: function()
            {
            },

            createContent: function()
            {
            }
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/default-page.js
*/
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

/* Source: ./themes/marrakech/common/views/record-details.js
*/
(function(theme)
{
    theme.views.register('record-details', 'paged-viewer',
    {
        _source: 'marrakech/common/record-details',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);
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

            showNarrativesDetails: function(owner, data)
            {
                var self = this;

                var div;

                // trails
                if (data.trails)
                {
                    var gap = IMu.Languages.current.dir == 'ltr' ? '>' : '<';
                    for (var i = 0; i < data.trails.length; i++)
                    {
                        var trail = data.trails[i];
                        
                        div = owner.child('div', 'trail');
                        for (var j = 0; j < trail.length; j++)
                        {
                            (function(n)
                            {
                                if (n > 0)
                                {
                                    var span = div.child('span');
                                    span.text(' ' + gap + ' ');
                                }

                                var item = trail[n];
                                var span = div.child('span', 'item');
                                span.text(item.title);
                                span.bind('click', function()
                                {
                                    self.widget.showRecord('enarratives', item.irn);
                                });
                            })(j);
                        }
                    }
                }

                // main multimedia & narrative
                var info = self.showMultimedia(owner, data);

                div = info.child('div', 'description');
                div.css('clear', 'both');
                div.html(data.description);

                // objects
                if (data.objects && data.objects.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-objects-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.objects').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.objects').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var objects = data.objects;
                    div = owner.child('div', 'objects');
                    for (var i = 0; i < objects.length; i++)
                    {
                        (function(n)
                        {
                            var object = objects[n];

                            var elem = div.child('div', 'object');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('ecatalogue', object.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (object.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(object.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(object.title);
                        })(i);
                    }
                    div = div.child('div');
                    div.css('clear', 'both');
                }

                // child narratives
                if (data.children && data.children.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-subnarratives-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.children').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.children').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var children = data.children;
                    div = owner.child('div', 'children');
                    for (var i = 0; i < children.length; i++)
                    {
                        (function(n)
                        {
                            var child = children[n];

                            var elem = div.child('div', 'child');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('enarratives', child.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (child.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(child.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(child.title);
                        })(i);
                    }

                    div = div.child('div');
                    div.css('clear', 'both');
                }

                // related narratives
                if (data.associations && data.associations.length > 0)
                {
                    var heading = owner.child('div', 'section-heading');
                    div = heading.child('div', 'section-heading-text');
                    div.text(IMu.string('section-related-narratives-label'));

                    div = heading.child('div', 'section-buttons');
                    var hideButton = div.child('button', 'hide');
                    hideButton.text(IMu.string('section-hide-label'));
                    hideButton.bind('click', function()
                    {
                        $('.associations').hide('slow');
                    });

                    var showButton = div.child('button', 'show');
                    showButton.text(IMu.string('section-show-label'));
                    showButton.bind('click', function()
                    {
                        $('.associations').show('slow');
                    });
                    div = heading.child('div');
                    div.css('clear', 'both');

                    var associations = data.associations;
                    div = owner.child('div', 'associations');
                    for (var i = 0; i < associations.length; i++)
                    {
                        (function(n)
                        {
                            var association = associations[n];

                            var elem = div.child('div', 'association');
                            elem.bind('click', function()
                            {
                                self.widget.showRecord('enarratives', association.irn);
                            });

                            var table = elem.child('table');
                            table.css('width', '100%');
                            var tr = table.child('tr');

                            var td;
                            
                            td = tr.child('td');
                            td.css('width', '1%');
                            var frame = td.child('div', 'frame');
                            var img = frame.child('img', 'image');

                            // TODO: else, display "no picture" image
                            if (association.image)
                            {
                                var mm = new IMu.Request.Multimedia();
                                mm.setKey(association.image.irn);
                                mm.addFilter('index', 1);
                                var url = mm.getURL();

                                img.attr('src', url);
                                img.imagesLoaded(function()
                                {
                                    var frameHeight = frame.height();
                                    var imageHeight = img.height();
                                    if (frameHeight < imageHeight)
                                    {
                                        img.fullHeight(frameHeight);
                                        return;
                                    }
                                    var margin = Math.floor((frameHeight - imageHeight) / 2);
                                    if (margin > 0)
                                        img.css('margin-top', margin + 'px');
                                });
                            }

                            td = tr.child('td');
                            td.css('width', '99%');
                            var title = td.child('div');
                            title.IMuEllipsis(association.title);
                        })(i);
                    }

                    div = div.child('div');
                    div.css('clear', 'both');
                }
            },

            showPartyDetails: function(owner, data)
            {
                var self = this;

                // multimedia
                var info = self.showMultimedia(owner, data);

                var table = info.child('table', 'details');
                table.css('clear', 'both');

                if (data.partyType && data.partyType.toLowerCase() == 'person')
                {
                    if (data.lastName || data.firstName)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-name') + ':');

                        td = tr.child('td', 'value');
                        var name = '';
                        if (data.lastName)
                            name += data.lastName;
                        if (data.firstName && data.lastName)
                            name += ', ' + data.firstName;
                        else if (data.firstName)
                            name += data.firstName;

                        td.text(name);
                    }

                    if (data.role)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-role') + ':');

                        td = tr.child('td', 'value');
                        var roleTable = td.child('table');
                        
                        for (var i = 0; i < data.role.length; i++)
                        {
                            var roleTr = roleTable.child('tr');
                            var roleTd = roleTr.child('td');
                            roleTd.text(data.role[i]);
                        }
                    }

                    if (data.birthPlace)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-birth-place') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.birthPlace);
                    }

                    if (data.birthDate)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-birth-date') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.birthDate);
                    }

                    if (data.deathDate)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-death-date') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.deathDate);
                    }
                }
                else if (data.partyType && data.partyType.toLowerCase() == 'organisation')
                {
                    if (data.organisation)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-organisation') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.organisation);
                    }

                    if (data.street)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-street') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.street);
                    }

                    if (data.city)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-city') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.city);
                    }

                    if (data.state)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-state') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.state);
                    }

                    if (data.postcode)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-postcode') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.postcode);
                    }

                    if (data.country)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-country') + ':');

                        td = tr.child('td', 'value');
                        td.text(data.country);
                    }

                    if (data.email)
                    {
                        var tr = table.child('tr');

                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string('eparties-email') + ':');

                        td = tr.child('td', 'value');
                        var a = td.child('a');
                        a.attr('href', 'http://' + data.email);
                        a.text(data.email);
                    }
                }
            },

            showMultimediaDetails: function(owner, data)
            {
                var self = this;
                var table;

                data.multimedia = new Array();

                var mul = new Object();
                mul.type = data.mimeType;
                mul.format = data.mimeFormat;
                mul.irn = data.irn;

                data.multimedia[0] = mul;


                // main image 
                try
                {
                    var info = self.showMultimedia(owner, data);
                }
                catch (e)
                {
                    return;
                }	

                table = info.child('table', 'description');
                table.css('clear', 'both');

                // main information
                if (data.creators && data.creators.length > 0)
                {
                    var tr = table.child('tr');

                    var td = tr.child('td', 'prompt');
                    if (data.creators.length < 2)                                   
                        td.text(IMu.string('emultimedia-creator') + ':');           
                    else                                                            
                        td.text(IMu.string('emultimedia-creators') + ':');          
                    
                    td = tr.child('td', 'value');                                   
                    var creators = td.child('table', 'creators');                   
                    
                    for (var i = 0; i < data.creators.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var creator = data.creators[n];                         

                            tr = creators.child('tr');                              

                            td = tr.child('td', 'creator');                         
                            td.text(creator);                                       
                        })(i);                                                      
                    }                                                               
                }

                if (data.mimeType || data.mimeFormat)                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-media-type') + ':');             

                    td = tr.child('td', 'value');                                   
                    if (data.mimeType && data.mimeFormat)                           
                        td.text(data.mimeType + '/' + data.mimeFormat);             
                    else                                                            
                        td.text(data.mimeType + data.mimeFormat);                   
                }                                                                   

                if (data.description)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-description') + ':');           

                    td = tr.child('td', 'value');                                   
                    td.text(data.description);                                      
                }                                                                   

                if (data.resourceType)                                              
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-resource-type') + ':');         

                    td = tr.child('td', 'value');                                   
                    td.text(data.resourceType);                                     
                }                                                                   

                if (data.language && data.language.length > 0)                                       
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    if (data.language.length < 2)                                   
                        td.text(IMu.string('emultimedia-language') + ':');          
                    else                                                            
                        td.text(IMu.string('emultimedia-languages') + ':');         

                    td = tr.child('td', 'value');                                   

                    for (var i = 0; i < data.language.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var language = data.language[n];                        

                            var row = td.child('tr');

                            td = row.child('td', 'language');                        
                            td.text(language);                                      
                        })(i);                                                      
                    }                                                               
                }


                if (data.publisher)                                                 
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-publisher') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.publisher);                                        
                }                                                                   

                if (data.contributors && data.contributors.length > 0)                                   
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    if (data.contributors.length < 2)                               
                        td.text(IMu.string('emultimedia-contributor') + ':');       
                    else                                                            
                        td.text(IMu.string('emultimedia-contributors') + ':');      

                    td = tr.child('td', 'value');                                   

                    for (var i = 0; i < data.contributors.length; i++)              
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var contributor = data.contributors[n];                 

                            tr = contributor.child('tr');                           

                            td = tr.child('td', 'contributor');                     
                            td.text(contributor);                                   
                        })(i);                                                      
                    }                                                               
                }                                                                   

                if (data.source)                                                    
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-source') + ':');                

                    td = tr.child('td', 'value');                                   
                    td.text(data.source);                                           
                }                                                                   

                if (data.rights)                                                    
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-rights') + ':');                

                    td = tr.child('td', 'value');                                   
                    td.text(data.rights);                                           
                }

                if (data.audience && data.audience.length > 0)                                       
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-audience') + ':');              

                    td = tr.child('td', 'value');
                    var audienceTable = td.child('table', 'audience');

                    for (var i = 0; i < data.audience.length; i++)                  
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            var audience = data.audience[n];                        

                            tr = audienceTable.child('tr');                              

                            td = tr.child('td', 'audience');                        
                            td.text(audience);                                      
                        })(i);                                                      
                    }                                                               
                }                                                                   

                if (data.mediaForm)                                                 
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-media-form') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.mediaForm);                                        
                }                                                                   

                if (data.fileSize)                                                  
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-file-size') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.fileSize);                                         
                }                                                                   

                if (data.checkSum)                                                  
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-check-sum') + ':');             

                    td = tr.child('td', 'value');                                   
                    td.text(data.checkSum);                                         
                }



                if (data.resolution)                                                
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-resolution') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.resolution);                                       
                }                                                                   

                if (data.width && data.height)                                      
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-dimensions') + ':');            

                    td = tr.child('td', 'value');                                   
                    td.text(data.width + 'x' + data.height);                        
                }                                                                   
                else                                                                
                {                                                                   
                    if (data.width)                                                 
                    {                                                               
                        var tr = table.child('tr');                                 

                        var td = tr.child('td', 'prompt');                          
                        td.text(IMu.string('emultimedia-width') + ':');             

                        td = tr.child('td', 'value');                               
                        td.text(data.width);                                        
                    }                                                               
                    if (data.height)                                                
                    {                                                               
                        var tr = table.child('tr');                                 

                        var td = tr.child('td', 'prompt');                          
                        td.text(IMu.string('emultimedia-height') + ':');            

                        td = tr.child('td', 'value');                               
                        td.text(data.height);                                       
                    }                                                               
                }                                                                   

                if (data.colourDepth)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-colour-depth') + ':');          

                    td = tr.child('td', 'value');                                   
                    td.text(data.colourDepth);                                      
                }

                if (data.filmLength)                                                
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-film-length') + ':');           

                    td = tr.child('td', 'value');                                   
                    td.text(data.filmLength);                                       
                }                                                                   

                if (data.samplesPerSecond)                                          
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-samples-per-second') + ':');    

                    td = tr.child('td', 'value');                                   
                    td.text(data.samplesPerSecond);                                 
                }                                                                   

                if (data.bitsPerSample)                                             
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-bits-per-sample') + ':');       

                    td = tr.child('td', 'value');                                   
                    td.text(data.bitsPerSample);                                    
                }                                                                   

                if (data.numChannels)                                               
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-number-of-channels') + ':');    

                    td = tr.child('td', 'value');                                   
                    td.text(data.numChannels);                                      
                }                                                                   

                if (data.audioDuration)                                             
                {                                                                   
                    var tr = table.child('tr');                                     

                    var td = tr.child('td', 'prompt');                              
                    td.text(IMu.string('emultimedia-duration') + ':');              

                    td = tr.child('td', 'value');                                   
                    td.text(data.audioDuration);                                    
                }

                /* Supplementary data
                */

                var supplementary = owner.child('div', 'supplementary');

                var exifLength = 0;
                if (data.ExiIfd_tab && data.ExiTag_tab && data.ExiName_tab && data.ExiValue_tab)
                {
                    exifLength = Math.max(data.ExiIfd_tab.length, data.ExiTag_tab.length,
                    data.ExiName_tab.length, data.ExiValue_tab.length);
                }	

                if (exifLength > 0)                                                 
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-exif'));                                      

    //				var div = owner.child('div', 'exif');                           

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-exif');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-exif-ifd'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-tag'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-name'));                   

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-exif-value'));                  

                    for (var i = 0; i < exifLength; i++)                            
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'table-row');                    

                            var td = tr.child('td');                                
                            td.text(data.ExiIfd_tab[n]);                            

                            var td = tr.child('td');                                
                            td.text(data.ExiTag_tab[n]);                            

                            var td = tr.child('td');                                
                            td.text(data.ExiName_tab[n]);                           

                            var td = tr.child('td');                                
                            td.text(data.ExiValue_tab[n]);                          
                        })(i);                                                      
                    }                                                               
                }                                                                   

                
                var iptcLength = 0
                if (data.IptRecord_tab && data.IptTag_tab && data.IptName_tab && data.IptValue_tab)
                {
                    iptcLength = Math.max(data.IptRecord_tab.length, data.IptTag_tab.length,
                    data.IptName_tab.length, data.IptValue_tab.length);
                }	

                if (iptcLength > 0)                                                 
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('iptc'));                                                  

    //				var div = owner.child('div', 'iptc');                           

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-resolutions');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-iptc-record'));                

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-tag'));                    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-name'));                   

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-iptc-value'));                  

                    for (var i = 0; i < iptcLength; i++)                            
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'table-row');                    

                            var td = tr.child('td');                                
                            td.text(data.IptRecord_tab[n]);                         

                            td = tr.child('td');                                    
                            td.text(data.IptTag_tab[n]);                            

                            td = tr.child('td');                                    
                            td.text(data.IptName_tab[n]);                           

                            td = tr.child('td');                                    
                            td.text(data.IptValue_tab[n]);                          
                        })(i);                                                      
                    }                                                               
                }

                if (data.XmpMetadata != null)                                       
                { 
                    // Not supported on Opera

                    var nsURI = {};     // namespace URI                            
                    nsURI['http://purl.org/dc/elements/1.1/'] = ['XMP_dc'];         
                    nsURI['http://ns.adobe.com/xap/1.0/'] = ['XMP_xmp'];            
                    nsURI['http://ns.adobe.com/xap/1.0/rights/'] = ['XMP_xmpRights'];
                    nsURI['http://ns.adobe.com/xap/1.0/mm/'] = ['XMP_xmpMM'];       
                    nsURI['http://ns.adobe.com/xap/1.0/bj'] = ['XMP_xmpBJ'];        
                    nsURI['http://ns.adobe.com/xap/1.0/t/pg/'] = ['XMP_xmpTPg'];    
                    nsURI['http://ns.adobe.com/xap/1.0/DynamicMedia/'] = ['XMP_xmpDM'];
                    nsURI['http://ns.adobe.com/pdf/1.3/'] = ['XMP_pdf'];            
                    nsURI['http://ns.adobe.com/photoshop/1.0/'] = ['XMP_photoshop'];
                    nsURI['http://ns.adobe.com/camera-rawsettings/1.0/'] = ['XMP_crs'];
                    nsURI['http://ns.adobe.com/tiff/1.0/'] = ['XMP_tiff'];          
                    nsURI['http://ns.adobe.com/exif/1.0/'] = ['XMP_exif'];          
                    nsURI['http://ns.adobe.com/exif/1.0/aux'] = ['XMP_aux'];        
                    nsURI['http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/'] = ['XMP_iptc'];
                    nsURI['http://iptc.org/std/Iptc4xmpExt/2008-02-29/'] = ['XMP_iptc_ext'];

    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-xmp'));                                       

    //				var div = owner.child('div', 'xmp');                            

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-xmp');

                    var xmp = data.XmpMetadata.replace(/&#0010;/g, '');
                    try
                    {
                        var xml = $(jQuery.parseXML(xmp));
                    
                        // Hack: Some browsers do not like the string 'rdf\\:Description'
                        var descriptions = $(xml).find('rdf\\:Description');
                        if (descriptions.length > 0)
                        {
                            $(descriptions).each(function()
                            {
                                var desc = $(this);
                                self.show_xmp(table, desc, 0, nsURI);
                            });	
                        }
                        else
                        {
                            $(xml).find('Description').each(function()
                            {
                                var desc = $(this);
                                self.show_xmp(table,desc, 0, nsURI);
                            });	
                        }	
                    }
                    catch (e)
                    {
                        return;
                    }
                }

                // Additional resolutions                                           
                if (data.resolutions && data.resolutions.length > 0)                                    
                {                                                                   
    //				var heading = owner.child('div');                               
    //				var span = heading.child('span');                               
    //				span.text(IMu.string('emultimedia-resolutions'));                               

                    var resolutions = data.resolutions;                             
    //				var div = owner.child('div', 'resolutions');                    

    //				var table = div.child('table');                                 
    //				table.css('width', '100%');                                     

                    table = self.addSection(supplementary, 'emultimedia-resolutions');

                    var tr = table.child('tr');                                     

                    var th = tr.child('th', 'prompt');                              
                    th.text(IMu.string('emultimedia-resolutions-identifier'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-mime'));            

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-colour-space'));    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-type'));            

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-colour-depth'));    

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-num-colours'));     

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-resolution'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-dimensions'));      

                    th = tr.child('th', 'prompt');                                  
                    th.text(IMu.string('emultimedia-resolutions-file-size'));       

                    for (var i = 0; i < resolutions.length; i++)                    
                    {                                                               
                        (function(n)                                                
                        {                                                           
                            tr = table.child('tr', 'resolution');                   

                            var td = tr.child('td');                                
                            td.text(resolutions[n].identifier);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].mimeFormat);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].colourSpace);                    

                            td = tr.child('td');                                    
                            td.text(resolutions[n].imageType);                      

                            td = tr.child('td');                                    
                            td.text(resolutions[n].bitsPerPixel);

                            td = tr.child('td');                                    
                            td.text(resolutions[n].numberColours);                  

                            td = tr.child('td');                                    
                            td.text(resolutions[n].resolution);                     

                            td = tr.child('td');                                    
                            td.text(resolutions[n].width + 'x' + resolutions[i].height);

                            td = tr.child('td');                                    
                            td.text(resolutions[n].fileSize);                       
                        })(i);                                                      
                    }                                                               
                }	

                // Supplementary multimedia
                if (data.supplementary && data.supplementary.length > 0)
                {                                                               
    //				var heading = owner.child('div');                           
    //				var span = heading.child('span');                           
    //				span.text(IMu.string('emultimedia-supplementary'));                             

    //				var div = owner.child('div', 'supplementary');              

    //				var table = div.child('table');                             
    //				table.css('width', '100%');                                 

                    table = self.addSection(supplementary, 'emultimedia-supplementary');

                    var tr = table.child('tr')                                  
                    var th = tr.child('th', 'table-head');                      


                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-identifier'));

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-mime'));      

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-usage'));     

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-dimensions'));

                    th = tr.child('th', 'table-head');                          
                    th.text(IMu.string('emultimedia-supplementary-file-size'));

                    for (var i = 0; i < data.supplementary.length; i++)         
                    {                                                           
                        (function(n)                                            
                        {                                                       
                            var supplementary = data.supplementary[n];          

                            var mm = new IMu.Request.Multimedia();              
                            mm.setKey(data.irn);                                   
                            mm.addFilter('index', supplementary.index);            
                            var url = mm.getURL();                              

                            tr = table.child('tr', 'table-row');                
                            tr.click(function()                                 
                            {                                                   
                                jQuery.slimbox(url, supplementary.identifier,   
                                {                                               
                                    imageFadeDuration: 100,                     
                                    initialWidth: 500,                          
                                    initialHeight: 500,                         
                                    overlayFadeDuration: 100                    
                                });                                             
                            });                                               

                            var td = tr.child('td');                            
                            var img = td.child('img', 'image');                 
                            img.attr('src', url);                               

                            td = tr.child('td');                                
                            td.text(supplementary.identifier);                  

                            td = tr.child('td');                                
                            td.text(supplementary.mimeFormat);                  

                            td = tr.child('td');                                

                            for (var j = 0; j < supplementary.usage.length; j++)
                            {                                                   
                                (function(k)                                    
                                {                                               
                                    var usage = td.child('tr');                 
                                    var val = usage.child('td');                
                                    val.text(supplementary.usage[k]);           
                                })(j);                                          
                            }                                                   

                            var td = tr.child('td');                            
                            td.text(supplementary.width + 'x' + supplementary.height);

                            var td = tr.child('td');                            
                                td.text(supplementary.fileSize);                    
                        })(i);                                                  
                    }
                }

                /* Remove empty sections
                */
                supplementary.children('fieldset.info').each(function()
                {
                    jQuery(this).find('.details').each(function()
                    {
                        var size = jQuery(this).children('tbody').children().length;

                        if (size == 0)
                        {
                            // TODO: possibly place a trace here
                            jQuery(this).parent().remove();
                        }
                    });
                });	
            },

            showMultimedia: function(div, data)
            {
                var self = this;

                // main
                var table = div.child('table', 'main');
                var tr = table.child('tr');

                // main multimedia
                if (data.multimedia && data.multimedia[0])
                {
                    var td = tr.child('td', 'multimedia-cell');
                    var multimediaTable = td.child('table');
                    var multimediaTr = multimediaTable.child('tr');
                    var multimediaTd = multimediaTr.child('td');
                    var frame = multimediaTd.child('div', 'frame');

                    // using IMuMultimedia plugin
                    var mul = frame.IMuMultimedia();
                    mul.addResourceByKey(data.multimedia[0].irn);
                
                    // multimedia thumbnails
                    if (data.multimedia.length > 1)
                    {
                        var multimediaTr = multimediaTable.child('tr');
                        var multimediaTd = multimediaTr.child('td');
                        var multimediaDiv = multimediaTd.child('div', 'multimedia-thumbnail-scroll');
                        var multimediaTable = multimediaDiv.child('table');
                        var multimediaTr = multimediaTable.child('tr');

                        var mm = new IMu.Request.Multimedia();
                        mm.addModifier('format', 'jpeg');

                        for (var i = 0; i < data.multimedia.length; i++)
                        {
                            (function(n)
                            {
                                if (n > 0)
                                    mul.addResourceByKey(data.multimedia[n].irn);

                                var mimeType = data.multimedia[n].type;
                                var multimediaTd = multimediaTr.child('td');

                                var frame = multimediaTd.child('div', 'thumbnail-frame');
                                mm.setKey(data.multimedia[n].irn);
                                var img = frame.child('img', 'image multimedia-thumbnail');

                                if (mimeType == 'image')
                                {
                                    mm.addFilter('height', 'bg', 100);
                                    mm.addFilter('width', 'bg', 100);
                                    mm.addModifier('height', 100);
                                    mm.addModifier('width', 100);
                                    var url = mm.getURL();
                                }

                                if (mimeType == 'video')
                                {
                                    var url = IMu.Request.getURL('Image') + '&name=imu-video';
                                }

                                if (mimeType == 'audio')
                                {
                                    var url = IMu.Request.getURL('Image') + '&name=imu-audio';
                                }

                                img.attr('src', url);

                                img.click(function()
                                {
                                    mul.show(n);
                                });
                            })(i);
                        }

                        var scroller = multimediaDiv.IMuScroller
                        ({
                            scrollType: 'horizontal',
                            horizontalPager: true
                        });

                        var content = scroller.getContent();
                        var tds = content.find('td');
                        var off0 = $(tds[0]).offset();
                        var off1 = $(tds[1]).offset();
                        IMu.log('off0 {0} off1 {1}', off0, off1);
                        scroller.setOptions
                        ({
                            horizontalSnap: off1.left - off0.left
                        });
                    }
                }

                // info
                var td = tr.child('td', 'info-cell');
                var info = td.child('div', 'info');

                var table = info.child('table', 'head');
                table.css('width', '100%');
                var tr = table.child('tr');

                td = tr.child('td');
                td.css('width', '99%');

                var title = td.child('span', 'title');
                title.IMuEllipsis(data.title);

                if (self.widget.options.showSelectionControl)
                {
                    td = tr.child('td');
                    td.css('width', '1%');

					self.showSelectionControl(td, data);
                }

                return info;
            },

            // Functions provided as a workaround for browser incompatibility
            firstElementChild: function(node)
            {
                var self = this;

                var child = node.firstChild;
                var firstElementChild = null;

                for ( ; child; child = child.nextSibling)
                {
                    if (child.nodeType === 1)
                    {
                        firstElementChild = child;
                        break;
                    }
                }

                return firstElementChild;
            },

            nextElementSibling: function(node)
            {
                var self = this;

                var nextNode = node.nextSibling;
                var nextElementSibling = null;

                for ( ; nextNode; nextNode = nextNode.nextSibling)
                {
                    if (nextNode.nodeType === 1)
                    {
                        nextElementSibling = nextNode;
                        break;
                    }	
                }

                return nextElementSibling;
            },

            // Traverse the dom object containing xmp data
            //   note: contains some workarounds for compatability with IE8
            show_xmp: function(owner, node, depth, myTable)
            {
                var self = this;

                var tr = owner.child('tr');
                tr.css('width', '100%');
                var td = tr.child('td');
                td.css('text-indent', depth *2 + 'em');
                
                if (node.children().length > 0)
                {
                    if (depth == 0)
                    {
                        var headings = {};

                        // Reconstruct table with useful namespace headers
                        for (var i = 0; i < node[0].attributes.length; i++)
                        {
                            var attribute = node[0].attributes[i];
                            if (attribute.prefix == 'xmlns')
                            {
                                var myKey;
                                if (attribute.localName)
                                {
                                    var myKey = attribute.localName;
                                }
                                else
                                {
                                    var myKey = attribute.baseName;
                                }	
                                var myVal = '';

                                if (myTable[attribute.nodeValue])
                                {
                                    myVal = myTable[attribute.nodeValue];
                                }

                                headings[myKey] = {};
                                headings[myKey]['value'] = myVal;
                                headings[myKey]['URI'] = attribute.nodeValue;
                            }
                        }
                        myTable = headings;
                    }

                    var firstElementChild = self.firstElementChild(node[0]);
                    if (firstElementChild.nodeName == 'rdf:Seq' || 
                        firstElementChild.nodeName == 'rdf:Alt')
                    {
                        /* Ordered and unordered lists */
                        /*
                          This section makes assumptions that
                          1) the dom objects are sequentially ordered
                          2) the list items contain no children
                        */
                        
                        var lable;
                        if (firstElementChild.nodeName == 'rdf:Seq')
                        {
                            lable = ' (seq container)';
                        }
                        else
                        {
                            lable = ' (alt container)';
                        }

                        if (node[0].localName)
                        {
                            td.text(node[0].localName + lable);
                        }

                        else if (node[0].baseName)
                        {
                            td.text(node[0].baseName + lable);
                        }	
                        else
                        {
                            td.text(lable);
                        }

                        var nextLi = self.firstElementChild(firstElementChild);
                        depth++;

                        var index = 0;
                        var nextElementSibling;
                        do
                        {
                            var li = nextLi;
                            var myText = '';
                            nextElementSibling = null;

                            if (firstElementChild.nodeName == 'rdf:Seq')
                            {
                                index++;
                                myText += '[' + index + ']';
                            }

                            for (var i = 0; i < li.attributes.length; i++)
                            {
                                var attribute = li.attributes[i];

                                if (attribute.localName)
                                {
                                    myText += ' [' + attribute.localName;
                                }
                                else if (attribute.baseName)
                                {
                                    myText += ' [' + attribute.baseName;
                                }

                                myText += '="' + attribute.nodeValue + '"]';
                            }

                            if (li.textContent)
                            {
                                myText += ': ' + li.textContent;
                            }
                            else if (li.text)
                            {
                                myText += ': ' + li.text;
                            }
                            else
                            {
                                myText += ': ';
                            }	

                            tr = owner.child('tr');
                            tr.css('width', '100%');

                            td = tr.child('td');
                            td.css('text-indent', depth * 2 + 'em');
                            td.text(myText);

                            nextElementSibling = self.nextElementSibling(li);
                            if (nextElementSibling)
                            {
                                nextLi = nextElementSibling;
                            }
                        }while (nextElementSibling);

                        depth--;
                    }
                    else
                    {
                        /* Non-List Items*/
                        
                        var firstElementChild = self.firstElementChild(node[0]);
                        var thisHead = firstElementChild.prefix;

                        var myText = '';

                        if ((node[0].localName || node[0].baseName) && depth != 0)
                        {
                            if (node[0].localName)
                            {
                                td.text(node[0].localName);
                            }
                            else 
                            {
                                td.text(node[0].baseName);
                            }	

                            tr = owner.child('tr');
                            tr.css('width', '100%');

                            td = tr.child('td');
                            td.css('text-indent', depth * 2 + 'em');
                            myText = '--';
                        }

                        if (myTable[thisHead])
                        {
                            if (myTable[thisHead]['value'][0] != '')
                            {
                                myText += IMu.string(myTable[thisHead]['value']) + ' ';
                                myText += '(' + thisHead + ', ' + myTable[thisHead]['URI'] + ')';
                            }
                            else if (myTable['URI'])
                            {
                                myText += thisHead + ', ' + myTable[thisHead]['URI'];
                            }
                        }

                        td.text(myText);

                        // Print any children
                        node.children().each(function()
                        {
                            var child = $(this);
                            self.show_xmp(owner, child, depth +1, myTable);
                        });
                    }
                }	
                else
                {
                    var myText = '';
                    if (node[0].localName)
                    {
                        myText = node[0].localName;
                    }
                    else if (node[0].baseName)
                    {
                        myText = node[0].baseName;
                    }	
                    
                    myText += ':	' + node.text();
                    td.text(myText);
                }
            },

            addSection: function(owner, headder)
            {
                var self = this;

                if (owner)
                {
                    var div = owner.child('fieldset', 'info');

                    if (headder)
                    {
                        var headding = div.child('legend');
                        headding.text(IMu.string(headder));
                    }

                    var table = div.child('table', 'details');
                    table.css('clear', 'both');
                    table.css('width', '100%');
                    table.attr('id', headder);

                    return table;
                }
                else
                {
                    return null;
                }
            }	
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/details-viewer.js
*/
(function(theme)
{
    theme.views.register('details-viewer', 'record-details',
    {
        _source: 'marrakech/common/details-viewer',

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
            },

            create_enarratives: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showNarrativesDetails(div, data);
            },

            create_eparties: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showPartyDetails(div, data);
            },

            create_emultimedia: function(div, data)
            {
                var self = this;

                if (! data)
                    return;

                var info = self.showMultimediaDetails(div, data);
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
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/lightbox-viewer.js
*/
(function(theme)
{
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'marrakech/common/lightbox-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'lightbox';
                self.pageSize = 20;
            },

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
            },

            // called by page-viewer
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
                var select = info.child('input type="checkbox"', 'select');
                select.bind('click', function()
                {
                    var rid = data.rid;
                    var on = jQuery(this).is(':checked');
                    self.widget.recordToggled(rid, on);
                });
            }
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/list-viewer.js
*/
(function(theme)
{
    theme.views.register('list-viewer', 'vertical-viewer',
    {
        _source: 'marrakech/common/list-viewer',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.columns = 'list';
                self.pageSize = 20;
            },

            // called by paged-viewer
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
            },

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

    //				data['images'] = new Object();
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
            },

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
                    var rid = data.rid;
                    self.widget.recordSelected(rid);
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

                // content
                td = tr.child('td', 'content-cell');
                td.css('width', '98%');

                // checkbox
                td = tr.child('td', 'select-cell');
                td.css('width', '1%');

                var select = td.child('input type="checkbox"', 'select');
                select.attr('module', data.source);
                select.attr('key', data.irn);
                IMu.User.load(function()
                {
                    select.attr('checked', IMu.User.hasEntry(data.source, data.irn));
                    select.bind('click', function()
                    {
                        var rid = data.rid;
                        var on = jQuery(this).is(':checked');
                        self.widget.recordToggled(rid, on);
                    });
                });

                return table;
            }
        }
    });
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/my-collections.js
*/
(function(theme)
{
    theme.views.register('my-collections',
    {
        _source: 'marrakech/common/my-collections',

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

                self.prev = self.header.child('button', 'prev');
                self.prev.attr('title', IMu.string('common-prev'));
                self.prev.text('<');
                self.prev.bind('click', function()
                {
                    self.widget.previousGroup();
                });

                self.name = self.header.child('input type="text"', 'name');
                self.name.bind('blur', function()
                {
                    self.widget.renameGroup(self.name.val());
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

				if (self.widget.options.showExport)
				{
					self.restore = self.header.child('button', 'export');
					self.restore.attr('title', IMu.string('common-export'));
					self.restore.html('&rArr;');
					self.restore.bind('click', function()
					{
						self.widget.exportGroup();
					});
				}

                self.content = self.holder.child('div', 'content');
                self.viewer = self.content.IMu('collection-viewer');

                IMu.User.load(function()
                {
//  				self.update();
                });
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
                var headerHeight = self.header.fullHeight();
                var contentHeight  = ownerHeight - headerHeight;
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
})(IMu.Themes.get('marrakech'));

/* Source: ./themes/marrakech/common/views/record-browser.js
*/
(function(theme)
{
    theme.views.register('record-browser', 'record-details',
    {
        _source: 'marrakech/common/record-browser',

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

                var div;

                // multimedia
                var info = self.showMultimedia(owner, data);

                div = info.child('div', 'description');
                div.css('clear', 'both');
                div.text(IMu.Format.sprintf('{0}', data));
            },

            show_enarratives: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & narrative details
                var info = self.showNarrativesDetails(owner, data);
            },

            show_eparties: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & party details
                var info = self.showPartyDetails(owner, data);
            },

            show_emultimedia: function(data)
            {
                var self = this;

                var owner = self.emptyOwner();
                if (! data)
                    return;

                // multimedia & details
                var info = self.showMultimediaDetails(owner,data);
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
})(IMu.Themes.get('marrakech'));
