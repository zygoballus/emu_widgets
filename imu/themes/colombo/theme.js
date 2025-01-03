/* THIS FILE IS BUILT AUTOMATICALLY.
** DO NOT CHANGE IT DIRECTLY.
**
** Built at: 2024-11-14 17:52:27 UTC (2024-11-14 17:52:27 UTC)
*/
"use strict";

/* Source: ./themes/colombo/common/strings.js
*/
(function(theme)
{
    theme.strings.register
    ({
        'only-items-with-images':
        {
            en: 'Only items with images',
            fi: 'Vain esineet joilla on kuva',
            fr: 'Uniquement les articles avec images'
        },

        'detail-viewer':
        {
            en: "Detail View"
        },
        'list-viewer':
        {
            en: "List View"
        },
        'thumb-viewer':
        {
            en: "Thumb View"
        },
        'map-viewer':
        {
            en: "Map View"
        },
        'museum-viewer':
        {
            en: "Museum View"
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/tabbed-display.js
*/
(function(theme)
{
    theme.views.register('tabbed-display', 'paged-display',
    {
        _source: 'colombo/client/tabbed-display',

        all:
        {
            createMenu: function(owner)
            {
                if (! owner)
                    return;

                this._super();
                var self = this;
                
                var widget = self.widget;
                for (var i = 0; i < widget.pages.length; i++)
                {
                    (function(n)
                    {
                        var page = widget.pages[n];
                        var index = n + 1;

                        page.menu = owner.child('div');
                        

                    })(i);
                }
            },
            
            selectHeader: function(index)
            {
                this._super(index);
                this.updateMenu(index);
            },

            updateMenu: function(index)
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/combined-viewer.js
*/
(function(theme)
{
    theme.views.register('combined-viewer', 'viewer',
    {
        _source: 'colombo/common/combined-viewer',

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

                if (widget.options.icons)
                    self.icons = widget.options.icons;
                else
                {
                    if (self.header === undefined)
                        self.header = self.holder.child('div', 'header');
                    self.icons = self.header.child('div', 'icons');
                }

                for (var i = 0; i < widget.list.length; i++)
                {
                    (function(n)
                    {
                        var item = widget.list[n];
                        if (item.elem)
                            item.elem.remove;

                        self.createViewButton(item, n);

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

            createViewButton: function(item, index)
            {
                var self = this;
                
                var div = self.icons.child('div', 'bg-colour-3');
                item.button = div.IMu('button-control');
                item.button.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=views/' + item.icon
                    },
                    onClick: function()
                    {
                        self.widget.select(index);
                        this.setState('on');
                    }
                });
                item.button.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=views/' + item.icon + '-selected'
                    },
                    onClick: function()
                    {
                        self.widget.select(index);
                        this.setState('off');
                    }
                });
            },
            
            resize: function()
            {
                var self = this;

                self._super();


                var holderHeight = self.holder.height();
//                var headerHeight = self.header.fullHeight();
//                var itemHeight = holderHeight - headerHeight;
                var itemHeight = holderHeight;
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
/*                    var src = item.img.attr('src');
                    var pos = src.indexOf('-selected');
*/
                    if (i == index)
                    {
/*                    
                        if (pos < 0)
                        {
                            src += '-selected';
                            item.img.attr('src', src);
                        }
*/
                        item.elem.show();
                        item.widget.showSearch(self.widget.search, offset);
                    }
                    else
                    {
/*                    
                        if (pos >= 0)
                        {
                            src = src.substr(0, pos);
                            item.img.attr('src', src);
                        }
*/
                        item.elem.hide();
                    }
                }
            },

            drawResultCount: function()
            {
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
/*                

self.navigate.attr('title', 'Back (' + self.widget.states.length + ')');

                self.drawResultCount();
*/                
            },

            updateResultCount: function()
            {
                var self = this;

                self.drawResultCount();
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/page.js
*/
(function(theme)
{
    theme.views.register('page',
    {
        _source: 'colombo/common/page',

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
                self.searchForm = undefined;
                self.overlay = undefined;
                self.toggle = undefined;
            },

            _create: function()
            {
                var self = this;

                self.overlay = self.widget.owner.child('div', 'overlay');
                self.overlay.css
                ({
                    bottom: 0,
                    display: 'none',
                    left: 0,
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    'z-index': 9999
                });
                self.overlay.click(function()
                {
                    IMu.Events.trigger('close-overlay');
                });

                self.holder = self.widget.owner.child('div', 'holder');
                self.holder.css('position', 'relative');

                self.header = self.holder.child('div', 'header');
                self.header.css('position', 'relative');
                self.createHeader();

                self.footer = self.holder.child('div', 'footer');
                self.footer.css
                ({
                    position: 'absolute',
                    bottom: 0
                });
                self.createFooter();

/* removed due to restructuring

                self.sidebar = self.holder.child('div', 'sidebar');
                self.sidebar.css
                ({
                    position: 'fixed'
                });
                self.createSidebar();
*/
                self.content = self.holder.child('div', 'content');
                self.content.css('position', 'relative');
                self.createContent();

                self.searchForm = self.holder.child('div', 'search');
                self.createSearchForms();

                self.createMenus();

                self.resize();
            },

            resize: function()
            {
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

            createSearchForms: function()
            {
            },

            createContent: function()
            {
            },

            // TODO: do i still use this?
            resizeSidebar: function()
            {
            },

            // TODO: do i still use this?
            toggleSidebar: function()
            {
            },

            createMenus: function()
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/default-page.js
*/
(function(theme)
{
// TODO: reevaluate the 'busy' bool mechanism
    
    theme.views.register('default-page', 'page',
    {
        _source: 'colombo/common/default-page',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                var self = this;

                self.keywords = undefined;
                self.searchFormToggle = undefined;
                self.keywordSearchToggle = undefined;

                self.collectionLabel = undefined;
                self.collections = undefined;

                self.tabbed = undefined;
                self.browser = undefined;
                self.viewer = undefined;
                self.currentView = 'browse';

                self.viewsIcons = undefined;
                self.viewsMenu = undefined;

                IMu.Events.bind('imu-show', function()
                {
                    self.header.transition({'opacity': '1.0'}, 1000, 'ease');
                    self.content.transition({'opacity': '1.0'}, 1000, 'ease');
                    self.footer.transition({'opacity': '1.0'}, 1000, 'ease');
                });
            },

            resize: function()
            {
                var self = this;

                self._super.apply(this, arguments);

//                if (self.searchForm.resize)
//                    self.searchForm.resize();
            },

            makeHeader: function(type)
            {
                var self = this;

                switch (type)
                {
                    case 'mobile':
                        self.makeTitleMobile();
                        break;
                    case 'desktop':
                    default:    
                        self.makeTitle();
                        break;
                }

                self.makeMyCollections();
            },

            makeSidebar: function()
            {
                var self = this;
/*
//TODO: replace #page-top with javascript scroll(0) code thing
                var topOfPageButton = self.sidebar.child('a', 
                    'button page-top-button deselected');
                topOfPageButton.attr('href', '#page-top');
                
                var img = topOfPageButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=up_lighter';
                img.attr('src', src);

                img = topOfPageButton.child('img', 'selected');
                src = IMu.Request.getURL('Image') + '&name=up_darker';
                img.attr('src', src);
*/                
            },

            makeContent: function()
            {
                var self = this;

                self.tabbed = self.content.IMu('tabbed-display',
                {
                    ownerHeight: 'fixed'
                });

                var item;

                self.browser = self.tabbed.addWidget('widget-browser');
/*
                self.viewer = self.content.IMu('combined-viewer');
                self.viewer.add('explore-viewer');
                var index = self.viewer.list.length -1;
                var explore = self.viewer.list[index].widget;
                explore.addColumns(3);
//                self.browser = self.viewer.list[index].widget;

                self.viewer.add('details-viewer');

                self.viewer.select(index);
*/



                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                item.widget.setOptions
                ({
                    icons: self.viewsIcons
                });
                self.viewer.add('details-viewer');


/*
                self.tabbed = self.content.IMu('tabbed-display',
                    {
                        ownerHeight: 'fixed'
                    }
                );

                var item;
                
                item = self.tabbed.add('record-browser');
                self.browser = item.widget;
                self.browser.setOptions
                ({
                    showSelectionControl: true
                });

                item = self.tabbed.add('combined-viewer');
                self.viewer = item.widget;
                self.viewer.add('list-viewer');
                self.viewer.add('lightbox-viewer');
                self.viewer.add('details-viewer');
*/               
            },

            makeFooter: function()
            {
            },

            /* Header */
            makeTitle: function()
            {
                var self = this;

                var table, tr, td;
                var selectedColour = 'white';
                var deselectedColour = 'navy';

                table = self.header.child('table');
                table.css('width', '100%');
                table.attr('id', 'page-top');
                tr = table.child('tr');

                td = tr.child('td', 'logo');
                td.css('width', '1%');
                var a = td.child('a');
                //TODO
//                a.attr('href', IMu.URL.base);
                a.attr('href', "");
                var img = a.child('img', 'image');
                var src = IMu.Request.getURL('Image') + '&name=header/nm-logo';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);
                img.load(function()
                {
                    self.resize();
                });

                td = tr.child('td')
                td.css(
                {
                    'height': '100%',
                });

                table = td.child('table');
                table.css(
                {
                    'width': '100%'
                });
                tr = table.child('tr', 'controls');
                tr.css('height', '1%');
                
                td = tr.child('td', 'search bg-colour-3');
                td.css('width', '1%');
                var search = td.child('table').child('tr');
                
                td = search.child('td');
                td.css('width', '1%');
                var advSearch = td.child('div', 'advanced-search-button');
                advSearch.addClass('bg-colour-3');
                advSearch.css('top', '0');
                self.searchFormToggle = advSearch.IMu('button-control');
                self.searchFormToggle.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/adv-search'
                    },
                    onClick: function()
                    {
                        self.searchForm.show(true);
                        this.setState('on');
                    }
                });
                self.searchFormToggle.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/adv-search-selected'
                    },
                    onClick: function()
                    {
                        self.searchForm.show(false);
                        this.setState('off');
                    }
                });

                td = search.child('td');
                td.css('width', '1%');
                var kwSearch = td.child('div', 'keyword-search-button');
                kwSearch.addClass('bg-colour-3');
                kwSearch.css('top', '0');
                self.keywordSearchToggle = kwSearch.IMu('button-control');
                self.keywordSearchToggle.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/quick-search'
                    },
                    onClick: function()
                    {
                        if (typeof(self.keywords.show) == 'function')
                            self.keywords.show(true);
                        this.setState('on');
                    }
                });
                self.keywordSearchToggle.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=header/quick-search-selected'
                    },
                    onClick: function()
                    {
                        if (typeof(self.keywords.show) == 'function')
                            self.keywords.show(false);
                        this.setState('off');
                    }
                });
/*
                img = kwSearch.child('img', 'selected');
                src = IMu.Request.getURL('Image') + '&name=header/quick_' +
                    selectedColour;
                img.attr('src', src);
                img = kwSearch.child('img', 'deselected');
                src = IMu.Request.getURL('Image') + '&name=header/quick_' +
                    deselectedColour;
                img.attr('src', src);
*/
                td = search.child('td');
                td.css('width', '99%');
                var div = td.child('span');
                self.keywords = div.IMu('keyword-search',
                {
                    showLabel: false,
                    showSubmit: true,

                    onSearch: function()
                    {
                        // TODO:
                        var here;
                        
                    }
                });
                self.keywords.busy = false;
                self.keywords.show = function(show)
                {
                    var keywordSearch = this;
                    if (keywordSearch.busy)
                        return;
                    keywordSearch.busy = true;
/* TODO
                    self.toggleButtons(self.keywordSearchToggle, show);
                    var disableButtons = [];
                    if (self.searchFormToggle)
                        disableButtons.push(self.searchFormToggle);
                    self.toggleButtons(disableButtons, false);
*/


                    self.searchFormToggle.setState('off');


                    if (self.searchForm)
                        self.searchForm.showAnimation(false);
                    if (keywordSearch)
                        keywordSearch.showAnimation(show);
                };
                self.keywords.showAnimation = function(show)
                {
                    var keywordSearch = this;

                    var holder = jQuery(keywordSearch.owner).parent();

                    var opacity = 1 - holder.css('opacity');
                    if (show)
                        opacity = 1;
                    else if (show != undefined)
                        opacity = 0;

                    if (opacity)
                    {
                        keywordSearch.owner.transition(
                        {
                            'display': 'block'
                        });
                        holder.transition(
                        {
                            'max-width': '999em',
                            opacity: 1
                        },
                        function()
                        {
                            keywordSearch.busy = false;
                        });
                    }
                    else
                    {
                        holder.transition(
                        {
                            'max-width': 0,
                            opacity: 0
                        },
                        function()
                        {
                            keywordSearch.busy = false;
                        });
                    }
                }
// TODO
                self.keywords.showAnimation(false);

                td = tr.child('td', 'padding');
                td.css('width', '99%');




                /* TODO: this is a terrible hack to simply display icons
                */
                td = tr.child('td', 'views bg-colour-3');
                td.css('width', '1%');

                self.viewsIcons = td.child('div');

                // TODO
/*
                var views = td.child('table').child('tr');


                td = views.child('td');
                var button = td.child('div', 'details-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/details-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/details-viewer'
                });

                td = views.child('td');
                var button = td.child('div', 'thumbnail-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/thumb-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/thumb-viewer'
                });
                
                td = views.child('td');
                var button = td.child('div', 'list-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/list-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/list-viewer'
                });

                td = views.child('td');
                var button = td.child('div', 'map-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/map-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/map-viewer'
                });
                
                td = views.child('td');
                var button = td.child('div', 'museum-view-button');
                button.IMu('button-control',
                {
                    onClick: function()
                    {
                    },
                    onImg: IMu.Request.getURL('Image') +
                        '&name=views/museum-viewer-selected',
                    offImg: IMu.Request.getURL('Image') +
                        '&name=views/museum-viewer'
                });
*/


                // TODO
                tr = table.child('tr', 'categories');
                td = tr.child('td');
                td.addClass('colour-2 font-1');
                td.attr('colspan', '3');

                var categories = td.child('ul');
                var li = categories.child('li');
                var a = li.child('a');
                a.text("ALL ");
                a.val("");
                a.addClass('colour-1');
                jQuery(a).click(function(){
                    self.changeCategory(this, "");
                    window.location.href = '#imu[explore]';
                });

                var li = categories.child('li');
                var a = li.child('a', 'collections');
                var favButton = a.child('div', 'button deselected');
                favButton.css('display', 'inline-block');
                var favImg = favButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + "&name=share/fav_fill";
                favImg.attr('src', src);
                favImg = favButton.child('img', 'selected');
                favImg.attr('src', src);
                
                jQuery(a).click(function(){
                    self.changeCategory(this, "my-collection");
                    window.location.href = '#imu[explore=my-collection]';
                });

                var objectTypes = [];
                var luts = new IMu.Request.Lookup();
                luts.lookup("Object Type", 1, function(results, success)
                {
                    if (success)
                    {
                        for (var i = 0; i < results.length; i++)
                        {
                            var text = results[i].toUpperCase(); 
                            var li = categories.child('li');
                            var a = li.child('a');
                            a.text(text);
                            li.css('opacity', '0');
                            li.transition(
                            {
                                opacity: 1
                            }, 2500, 'ease');

                            text = text.toLowerCase().replace(" ", "_");
                            a.val(text);

                            jQuery(a).click(function(){
                                self.changeCategory(this, results[i]);
                                
                                var val = jQuery(this).val();
                                window.location.href = '#imu[' +
                                    "explore=ecatalogue." + val + ']';
                            });
                        }
                    }
                });
            },

            makeTitleMobile: function()
            {
                var self = this;

                var table, tr, td;

                self.header.addClass('bg-colour-3');
                table = self.header.child('table');
                table.css
                ({
                    position: 'relative',
                    width: '100%'
                });
                tr = table.child('tr', 'controls')

                td = tr.child('td');
                td.css('width', '1%');
                var search = td.child('div', 'search');
                self.searchFormToggle = search.IMu('button-control',
                {
                    onClick: function()
                    {
                        self.searchForm.show();
                    },
                    onImg: IMu.Request.getURL('Image') + 
                        '&name=header/search-phone-selected',
                    offImg: IMu.Request.getURL('Image') + 
                        '&name=header/search-phone'
                });


                td = tr.child('td', 'logo');
//                var a = td.child('a');
                var div = td.child('div');
                var img = div.child('img', 'image');
                var src = IMu.Request.getURL('Image') + '&name=header/nm-logo-phone';
                img.attr('title', IMu.string('imu-title'));
                img.attr('src', src);

                td = tr.child('td');
                td.css('width', '1%');
                var view = td.child('div', 'views');
                self.menuToggle = view.IMu('button-control',
                {
                    onClick: function()
                    {
                        var show = self.menuToggle.getState();
                        switch (self.currentView)
                        {
                            case 'browse':
                                if (self.browseMenu)
                                    self.browseMenu.show(show);
                                break;

                            case 'results':
                                if (self.viewsMenu)
                                    self.viewsMenu.show(show);
                                break;

                            default:
                                break;
                        };
                    },
                    image: IMu.Request.getURL('Image') + '&name=header/menu-phone'
                });

            },

            changeCategory: function(element, value)
            {
                var self = this;

                if (!element)
                    return;

                var categories = jQuery('.header .categories ul');
                categories.find('a').each(function()
                {
                    jQuery(this).removeClass('colour-1');
                    jQuery(this).addClass('colour-2');
                });
                jQuery(element).removeClass('colour-2');
                jQuery(element).addClass('colour-1');
            },

            makeButtonIcon: function(owner, name)
            {
                var selectedColour = 'white';
                var deselectedColour = 'navy';

                var icon = owner.child('div', 'button deselected');
                icon.css('top', '0');
                var img = icon.child('img', 'selected');
                var src = IMu.Request.getURL('Image') + '&name=' + 
                    name + selectedColour;
                img.attr('src', src);
                img = icon.child('img', 'deselected');
                src = IMu.Request.getURL('Image') + '&name=' +
                    name + deselectedColour;
                img.attr('src', src);

            },

            showOverlay: function(show, callback)
            {
                var self = this;

                if (typeof(show) == 'function')
                {
                    callback = show;
                    show = undefined;
                }

                if (show)
                {
                    self.overlay.css('display', 'block');
                    self.overlay.transition(
                    {
                        opacity: 1
                    }, 500, 'ease',
                    function()
                    {
                        if (callback)
                            callback();
                    });
                }
                else
                {
                    self.overlay.transition(
                    {
                        opacity: 0
                    }, 500, 'ease',
                    function()
                    {
                        self.overlay.css('display', 'none');

                        if (callback)
                            callback();
                    });
                }
            },

            toggleButtons: function(buttons, show)
            {
                var self = this;
           
                if (! buttons)
                    return;

                for (var i = 0; i < buttons.length; i++)
                {
                    if (show == undefined)
                        jQuery(buttons[i]).toggleClass('deselected selected');
                    else if (show)
                    {
                        jQuery(buttons[i]).removeClass('deselected');
                        jQuery(buttons[i]).addClass('selected');
                    }
                    else
                    {
                        jQuery(buttons[i]).removeClass('selected');
                        jQuery(buttons[i]).addClass('deselected');
                    }
                }
            },

            /* Search forms */
            makeSearchForms: function(type)
            {
                var self = this;
                self.searchForm.busy = false;

                var holder = self.searchForm.child('div', 'holder');
                holder.addClass('bg-colour-1 ' +
                                'colour-4');

                self.searchForm.show = function(show)
                {
                    var searchForm = this;
                    if (searchForm.busy)
                        return;
                    searchForm.busy = true;


                    if (show)
                        self.searchFormToggle.setState('on');
                    else if (show !== undefined)
                        self.searchFormToggle.setState('off');


                    if (self.keywordSearchToggle)
                        self.keywordSearchToggle.setState('off');
                        
                    if (self.keywords && self.keywords.showAnimation)
                        self.keywords.showAnimation(false);
                    if (searchForm)
                        searchForm.showAnimation(show);
                };

                /* In anticipation of alternate layouts
                ** Various animations
                */
                if (typeof(type) == 'string')
                    type = type.toLowerCase();
                switch(type)
                {
                    case "popup":
                    case 1:
                        self.searchForm.addClass('popup');
                        self.searchForm.resize = self.makeSearchPopupResize();
                        self.searchForm.showAnimation = 
                            self.makeSearchPopupShowAnimation();
                        break;

                    case "slide":
                    case 2:
                        self.searchForm.addClass('slide');
                        self.searchForm.resize = function() {};
                        self.searchForm.showAnimation = 
                            self.makeSearchSlideShowAnimation();

                        var kwSearch = holder.child('div');
                        kwSearch.addClass('bg-colour-3');
                        self.keywords = kwSearch.IMu('keyword-search',
                        {
                            showLabel: false,
                            showSubmit: true,
                            onSearch: function()
                            {
                                // TODO
                            }
                        });

                        var img = kwSearch.child('img');
                        var src = IMu.Request.getURL('Image') + 
                            '&name=header/search-phone';
                        img.attr('src', src);

                        self.keywords.busy = false;

                        holder = holder.child('div', 'advanced-search');
                        holder.css('position', 'absolute');
                        break

                    default:
                        self.searchForm.addClass('none');
                        self.searchForm.resize = undefined;
                        self.searchForm.showAnimation = undefined;
                        break;
                }

                var table = holder.child('table');
                var tr = table.child('tr');

                var td = tr.child('td', 'searches-label');
                td.addClass('font-1');
                td.text(IMu.string('common-search'));
                
                td = tr.child('td', 'close-search');
                td.css('width', '1%');
                var button = td.child('div', 'button deselected close-search-button');
                button.click(function()
                {
                    IMu.Events.trigger('close-overlay');    
                });


                var img = button.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=close';
                img.attr('src', src);
                
                var img = button.child('img', 'selected');
                img.attr('src', src);

                var searches = holder.child('div', 'searches');
                var widget = searches.IMu('tabbed-display',
                {
                    showHeader: true,
                    showSubmit: true
                });
                self.addSearchForms(widget);
            },

            makeSearchPopupResize: function()
            {
                var self = this;
                
                return function()
                {
                    var headerHeight = self.header.fullHeight();
                    var headerWidth = self.header.innerWidth();

                    this.css('top', headerHeight);
                    this.css('width', headerWidth);
                };
            },
            makeSearchPopupShowAnimation: function()
            {
                var self = this;

                return function(show)
                {
                    var searchForm = this;

                    var opacity = 1 - searchForm.css('opacity');
                    if (show)
                        opacity = 1;
                    else if (show != undefined)
                        opacity = 0;

                    if (opacity)
                    {
                        self.showOverlay(true);
                        searchForm.transition(
                        {
                            display: 'block'
                        })
                        .transition(
                        {
                            'opacity': opacity
                        },
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
                    else
                    {
                        searchForm.transition(
                        {
                            'opacity': opacity
                        })
                        .transition(
                        {
                            display: 'none'
                        },
                        function()
                        {
                            searchForm.busy = false;
                        });
                        self.showOverlay(false);
                    }

                };
            },

            makeSearchSlideShowAnimation: function()
            {
                var self = this;
                
                return function(show)
                {
                    //TODO: the order of panels should not be hard coded
                    if (show == undefined)
                    {   
                        if (self.searchFormToggle.getSelected())
                            show = true;
                        else 
                            show = false;
                    }

                    /* This might seem strange setting the class again here,
                    ** though changing to the search menu using a swipe motion
                    ** might make some of the search buttons go out of sync.
                    */
//                    self.toggleButtons(self.searchFormToggle, false);
                    if (show)
                    {
                        self.searchForm.transition
                        ({
                            x: '100%'
                        });
                    }
                    else
                    {
                        self.searchForm.transition
                        ({
                            x: '0%'
                        });
                    }
                        
                    var searchForm = this;
                    searchForm.busy = false;
/*                
                    var searchForm = this;
                    var position = searchForm.css('left');
                    
                    if (show == undefined)
                    {
                        if (self.searchFormToggle.hasClass('selected'))
                            show = true;
                        else
                            show = false;
                    }

                    if (show)
                    {  
                        self.holder.transition(
                        {
                            x: '100%'
                        }, 1000, 'ease',
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
                    else
                    {
                        self.holder.transition(
                        {
                            x: '0'
                        }, 1000, 'ease',
                        function()
                        {
                            searchForm.busy = false;
                        });
                    }
*/                    
                };
            },

            makeViewsMenu: function()
            {
                var self = this;

                self.viewsMenu = self.makeMenu('views');

                var name = 'thumb-viewer';
                self.viewsMenu.addRow(name);

                var name = 'list-viewer';
                self.viewsMenu.addRow(name);
                
                var name = 'details-viewer';
                self.viewsMenu.addRow(name);

                var name = 'map-viewer';
                self.viewsMenu.addRow(name);

                var name = 'museum-viewer';
                self.viewsMenu.addRow(name);
            },

            makeMenu: function(title)
            {
                var self = this;

                var menu = self.holder.child('div', 'menu');
                menu.addClass('bg-colour-1 ' + 
                    title + '-menu');
                menu.shift = '-80%';
                menu.css('right', '-80%');

                menu.show = function(show)
                {
                    if (show === undefined)
                        return;
                    if (show)
                    {
                        this.transition
                        ({ 
                            x: '-100%'
                        });
                        self.header.transition
                        ({ 
                            x: this.shift
                        });
                        self.content.transition
                        ({ 
                            x: this.shift
                        });
                    }
                    else
                    {
                        this.transition
                        ({
                            x: '0%'
                        });
                        self.header.transition
                        ({
                            x: '0%'
                        });
                        self.content.transition
                        ({
                            x: '0%'
                        });
                    }
                };

                menu.body = menu.child('table').child('tbody');
                menu.addRow = function(name, supplementary)
                {
                    if (! name)
                        return;

                    var tr = menu.body.child('tr', 'menu-option');

                    var td = tr.child('td', 'icon');
                    var src = IMu.Request.getURL('Image') + 
                        '&name=views/' + name + '-phone';
                    var img = td.child('img');
                    img.attr('src', src);

                    var src = IMu.Request.getURL('Image') + 
                        '&name=views/' + name + '-phone-selected';
                    var img = td.child('img', 'selected');
                    img.attr('src', src);

                    var td = tr.child('td', 'label');
                    td.text(IMu.string(name));
                    td.addClass
                    (
                        'colour-4 ' +
                        'font-2 ' +
                        name
                    );

                    var td = tr.child('td', 'sup');
                    var img = td.child('img');
                    if (supplementary)
                        img.attr('src', supplementary);

                    return tr;
                };

                return menu;
            },

            addSearchForms: function(owner)
            {
                var self = this;

                self.makeAdvancedSearchForm(owner);
                self.makeNarrativesSearchForm(owner);
                self.makeObjectsSearchForm(owner);
                self.makePartiesSearchForm(owner);
                self.makeMultimediaSearchForm(owner);
            },

            makeAdvancedSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
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
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms);
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeNarrativesSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
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
                        prompt: 'enarratives-audience',
                        type: 'text'
                    },
                    {
                        column: 'subjects',
                        prompt: 'common-subjects',
                        type: 'text'
                    },
                    {
                        column: 'NarAuthorsLocal',
                        prompt: 'enarratives-authors',
                        type: 'text'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'enarratives');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeObjectsSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
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
                        prompt: 'ecatalogue-accession-number',
                        type: 'text'
                    },
                    {
                        column: 'objectStatus',
                        prompt: 'common-status',
                        type: 'text'
                    },
                    {
                        allowEmpty: true,
                        column: 'objectRating',
                        lookup: 'Object Rating',
                        prompt: 'ecatalogue-rating',
                        type: 'selection'
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'ecatalogue');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makePartiesSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
                item.title = 'module-eparties';
                item.icon = 'search-parties';
                item.widget.add
                ([
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
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'eparties');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },

            makeMultimediaSearchForm: function(owner)
            {
                var self = this;

                var item = owner.add('search-form');
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
                    }
                ]);
                item.widget.setOptions
                ({
                    onSearch: function(terms, imagesOnly)
                    {
                        if (imagesOnly)
                        {
                            terms.add('MulHasMultiMedia', 'Y');
                        }
                        self.doSearch(terms, 'emultimedia');
                    },
                    buttonClass: "colour-4 font-1 bg-colour-2",
                    promptClass: "colour-3 font-1"
                });
            },	

            makeMyCollections: function(owner)
            {
                var self = this;

                var collections = self.header.find('collections');
/*                
                self.collections = collections.IMu('my-collections',
                {
                
                    onRestoreGroup: function(group)
                    {
                        IMu.log('restore: group {0}', group);
                        var keys = [];
                        
                        for (var i = 0; i < group.entries.length; i++)
                        {
                            var entry = group.entries[i];

                        }
                    
                    }
                });
*/                
            },

            /* Convenience */
            doSearch: function(terms, include)
            {
                var self = this;

                if (typeof(include) == 'string')
                    include = [ include ];
            
                //TODO beginDelay

                var search = new IMu.Request.Search();
                search.search(terms, include, function(hits)
                {
                    //TODO: end delay
                    
                    //TODO figure out which view
                    self.viewer.addState(search);
                });
            },

            hideSidebar: function()
            {
            },

            resizeSidebar: function()
            {
            }
        },

        desktop:
        {
            createHeader: function()
            {
                this.makeHeader('desktop');
            },

            createSidebar: function()
            {
                this.makeSidebar();
            },

            createSearchForms: function()
            {
                var self = this;

                // TODO: make sure this is "popup" when done
                self.makeSearchForms('popup');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent();
                this.browser.widget.device = 'desktop';
            },

            createFooter: function()
            {
            }
        },

        phone:
        {
            createHeader: function()
            {
                this.makeHeader('mobile');
            },

            createSidebar: function()
            {
            },

            createSearchForms: function()
            {
                var self = this;
                
                //TODO: make slide
                self.makeSearchForms('slide');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent(2);
            },

            createFooter: function()
            {
            },
            
            createMenus: function()
            {
                this.makeViewsMenu();
            }
        },

        tablet:
        {
            createHeader: function()
            {
                this.makeHeader('mobile');
            },

            createSidebar: function()
            {
            },

            createSearchForms: function()
            {
                var self = this;

                self.makeSearchForms('slide');
                IMu.Events.bind('close-overlay', function()
                {
                    self.searchForm.show(false);
                });
            },

            createContent: function()
            {
                this.makeContent(2);
            },

            createFooter: function()
            {
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/record-details.js
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
		_source: 'colombo/common/record-details',

		all:
		{
			_construct: function()
			{
				var self = this;

				self._super.apply(self, arguments);

				self.showSaveMultimedia = undefined;
                self.pendingSection = undefined;
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
                    
                // TODO: make buttons functional.
                //  * only display if view and data exists
                //  * clicking button changes view
                var tbody = owner.child('table').child('tbody');
                var tab = tbody.child('tr').child('td');
                tab.addClass('mm-tab');
                var holder = tab.child('div');
                holder.css('display', 'inline-block');
                var tr = tbody.child('tr');

                var buttons = [];
                var cells = [];

                var showMM = false;
                if ((data.multimedia && data.multimedia.length > 0))
                {
                    showMM = true;

                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/object-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/object-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            mmCell.css('display', 'table-cell');
                        }
                    });
                    button.createView();
                    buttons.push(button);

                    var mmCell = tr.child('td');
                    mmCell.addClass('multimedia-cell');
                    cells.push(mmCell);
                    self.showMedia(mmCell, data.multimedia);
                }

                if (false) //TODO: i have no idea how this works
                {
                    showMM = true;

                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/museum-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/museum-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            museumCell.css('display', 'table-cell');
                        }
                    });
                    button.createView();
                    buttons.push(button);

                    var museumCell = tr.child('td');
                    museumCell.addClass('museum-cell');
                    cells.push(museumCell);
                    self.showMuseum(museumCell, data);
                }
                
                // TODO: need criterior for map view
                if ((data.x && data.x[0] && data.x[0].val !== undefined) &&
                    (data.y && data.y[0] && data.y[0].val !== undefined)) 
                {
                    showMM = true;

                    var mapCell = tr.child('td');
                    mapCell.addClass('map-cell');
                    cells.push(mapCell);
                    self.createMap(mapCell, data.rid);//, pointsToAdd);
                    
                    var div = holder.child('div');
                    var button = div.IMu('button-control');
                    button.addState(
                    {
                        name: 'on',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/map-viewer-selected'
                        }
                    });
                    button.addState(
                    {
                        name: 'off',
                        layout:
                        {
                            type: 'image',
                            value: IMu.Request.getURL('Image') +
                                '&name=views/map-viewer'
                        },
                        onClick: function()
                        {
                            for (var i = 0; i < buttons.length; i++)
                                buttons[i].setState('off');
                            this.setState('on');

                            for (var i = 0; i < cells.length; i++)
                                cells[i].css('display', 'none');
                            mapCell.css('display', 'table-cell');

                            mapCell.find('.owner .olMap').each(function()
                            {
                                jQuery(this).css('height', '100%');
                            });
                            mapCell.children('.owner').each(function()
                            {
                                jQuery(this).css('position', 'relative');
                                var map = jQuery(this).IMu();
                                map.view.resize();
                            });
                        }
                    });
                    button.createView();
                    buttons.push(button);
                }

                if (showMM)
                {
                    // Trigger onClick event
                    buttons[0].setState('off');
                    buttons[0].onClick();
                }
                else
                    owner.css('display', 'none');
			},

			showMedia: function(owner, multimedia)
			{
				var self = this;
                

				if (! multimedia || multimedia.length < 1)
					return;
                
                var base = owner.child('div', 'multimedia');
                base.css(
                {
                    overflow: 'visible',
                    width: '100%'
                });
				for (var i = 0; i < multimedia.length; i++)
				{
                    var holder = base.child('div', 'holder');
                    holder.css('display', 'inline-block');

                    var mmPlugin = holder.IMuMultimedia();

                    mmPlugin.setOptions(
                    {
                        autoMargin: false,
                        onClick: undefined
                    });
                    mmPlugin.addResourceByKey(multimedia[i].irn);
				}

                // base has a slightly smaller height set in css so that we can
                // read this value and pass it to the slides constructor. We
                // then give base the correct height.
                var height = base.outerHeight();
                var width = base.outerWidth();
                base.slidesjs(
                {
                    height: height,
                    width: width
                });

                var height = owner.outerHeight();
                base.css('height', '100%');

                return;
			},

            showMuseum: function(owner)
            {
                var self = this;

                owner.text("TODO: Museum view");
            },

            //TODO: change to construct or make
			createMap: function(owner, rid)//, pointsToAdd)
            {
                var self = this;
                var div = owner.child('div', 'map');
                div.css('position', 'absolute');
                var map = div.IMu('map-viewer',
                {
                    autoAdjustAspectRatio: false,
                    addZoomToShowAllControl: true,
                    anchorLegendOnMap: false,
                    clusterPoints: false,
                    dateLineWrap: false,
                    moreDetailsDialogue: false,
                    showLayerSwitcher: true,
                    showMouseCoordinates: false,
                    showStatusMessages: false,
                    singleShot: true,
                    useInternationalMarkerMaker: true,
                    useSimpleDetailDisplay: false,
                    useSphericalMercator: true,
                    zoomToAllInitially: true
                });
                
                map.addLayer('google-physical');
                map.addLayer('google-streets');
                map.addLayer('osm');
                map.createView();

                var a = rid.split(/[.:]/);
                if (a.length < 2)
                    return;
                var module = a[0];
                var key = a[1];
                
                var search = new IMu.Request.Search();
                search.search(['irn', key], [module], function(hits)
                {
                    if (hits.total > 0)
                        map.showSearch(search);
                });
            },

			showSection: function(owner, items, name, table)
			{
				var self = this;
/*
				if (! items || items.length < 1)
					return;

				var section = owner.child('div', 'section ' + name);
				var label = IMu.string('section-' + name + '-label');

				self.showSectionHeader(section, label);
				self.showSectionItems(section, table, items);
*/                
			},

			showSectionHeader: function(owner, heading)
			{
				var self = this;
/*
 
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
*/                
			},

			showSectionItems: function(owner, tableName, items)
			{
				var self = this;
/*
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
*/                
			},
			
            collectionChanged: function()
            {
                var self = this;

/*
                self.holder.find('.select').each(function()
                {
                    var select = jQuery(this);
                    var module = select.attr('module');
                    var key = select.attr('key');
                    select.attr('checked', IMu.User.hasEntry(module, key));
                });
*/                
            },

			/* Luca
			*/
			showTableRow: function(element, stringsId, value)
			{
				var self = this;

/*
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
*/                
			},

			showTableRows: function(element, stringsId, values)
			{
/*            
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
*/                
			},

			/* Phil
			*/
            makeRefData: function(data, column, module)
            {
                var self = this;
                
                var value = null;

                if (!data || ! column)
                    return null;

                if (data instanceof Array)
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
                else
                {
                    // This might not be reference data and the developer used
                    // the wrong function. Do nothing.
                }

                return value;
            },

            addDetail: function(prompt, value)
            {
                var self = this;

                if (! value)
                    return undefined;

                if (self.pendingSection === undefined)
                    self.newSection();
                    

                function add()
                {
                    var tr = jQuery('<tr>');
                    if (prompt !== undefined)
                    {
                        var td = tr.child('td', 'prompt');
                        td.text(IMu.string(prompt) + ':');
                        td = tr.child('td', 'value');
                    }
                    else
                    {
                        var td = tr.child('td', 'value');
                        td.attr('colSpan', '2');
                    }
                    self.pendingSection.push(tr);

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
            addMultiColumnDetail: function(columns, value)
            {
                var self = this;

                var td = self.addDetail(undefined, value);
                if (td === undefined)
                    return;

                jQuery(td).attr
                (
                    'style',
                    "-webkit-column-count: " + columns + "; " +
                    "-moz-column-count: " + columns + "; " +
                    "column-count: " + columns + ";"
                );
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
            addTableDetails: function(tblHead, tblData, owner, level)
            {
                var self = this;

                if (level == undefined && owner == undefined)
                {
                    level = 0;
                    owner = jQuery('<tr>');
                }

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
                
                if (level != 0)
                    return dataWritten;
                else if (dataWritten)
                {
                    if (self.pendingSection === undefined)
                        self.newSection();
                    self.pendingSection.push(owner);
                    return table;
                }
                else
                    return undefined;
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
                var section = [];

                if (!owner || !header)
                    return null;

                var cell = self.addMultiColumnCell(jQuery(), 2);
                cell.text(IMu.string(header));
                cell.addClass('sub-header');
                cell.attr('id', header);
            },

            newSection: function(header)
            {
                var self = this;
                
                self.appendSection();

                self.pendingSection = [];
                self.pendingSection.header = false;
                if (header && header != "")
                {
                    var row = jQuery('<tr>');
                    var cell = row.child('td', 'sub-header');
                    cell.attr
                    ({
                        'colSpan': '2',
                        'id': header
                    });
                    cell.text(IMu.string(header));
                    self.pendingSection.push(row);
                    self.pendingSection.header = true;
                }
            },
            appendSection: function()
            {
                var self = this;

                if (! self.pendingSection || 
                    (self.pendingSection.length == 1 && 
                    self.pendingSection.header))
                    return;
                
                self.pendingSection[0].addClass('section-first-row');
                var last = self.pendingSection.length -1;
                self.pendingSection[last].addClass('section-last-row');

                self.contentTable.append(self.pendingSection);
            }
		},

        desktop:
        {
            makeHeader: function(image, data, subject)
            {
                var self = this;

                var holder = self.record.header.child('div', 'holder');
                holder.addClass('bg-colour-1 ' +
                                'colour-4 ' +
                                'font-1');
            
                // TODO: overflows. fix this
                var table = holder.child('table');
                var tr = table.child('tbody').child('tr');

                var td = tr.child('td', 'image');
//                td.css('width', '1%');

                var div = td.child('div');

                if (image)
                {
                    var mm = new IMu.Request.Multimedia();
                    mm.setKey(image.irn);
                    mm.addFilter('kind', 'thumbnail');

                    var mmPlugin = div.IMuMultimedia(
                    {
                        autoMargin: false,
                        onCLick: false
                    });
                    mmPlugin.addResource(mm);
                }

                var td = tr.child('td', 'summary');
                if (data !== undefined)
                {
                    if (IMu.Type.isArray(data))
                    {
                        var ul = td.child('ul');
                        for (var i = 0; i < data.length; i++)
                            ul.child('li').text(data[i]);
                    }
                    else if (data)
                        td.text(data)
                }

                var td = tr.child('td', 'final');
                td.css(
                {
                    'text-align': IMu.Languages.current.far,
                    width: '1%'
                });

                var div = td.child('div', 'subject');
                if (subject)
                    div.text(subject);

                // TODO
                var fav = td.child('div', 'favorite');
/*                
                fav.css(
                {
                    'background-color': 'transparent',
                    height: '2em',
                    width: '2em'
                });
*/              

                var button = fav.IMu('button-control');
                button.addState(
                {
                    name: 'default',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=share/fav_outline'
                    }
                });
                button.addState(
                {
                    name: 'selected',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') +
                            '&name=share/fav_fill'
                    }
                });
                button.createView();
                fav.css('position', 'absolute');
                fav.css(IMu.Languages.current.far, '0.5em');
            }
        }
	});
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/details-viewer.js
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
        _source: 'colombo/common/details-viewer',

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

            create_other: function(div, data)
            {
                var self = this;

                var text = 'offset: ' + data.offset;
                text += ' rid: ' + data.rid;
                div.text(text);
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/lightbox-viewer.js
*/
/* NOTE: TODO this is just here to get things going. none of the code here has
** ** been specifically set up for colombo.
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
        _source: 'colombo/common/lightbox-viewer',

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
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/list-viewer.js
*/
/* NOTE: TODO this is just here to get things going. none of the code here has
** been specifically set up for colombo.
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
        _source: 'colombo/common/list-viewer',

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

                    if ((browser == 'chrome') || // No minimum version of chrome given
                        (browser == 'safari' && version > 3) ||
                        (browser == 'iOS' && version > 1) || //I think
                        (browser == 'ie' && version > 10))
                    {
/* TODO: this needs testing more.

                        plugin.setOptions(
                        {
                            autoMargin: false
                        });
*/
                    }

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
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/explore.js
*/
(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the record-browser view should go in the
    ** appropriate file in the explore-browser directory. For example, specific
    ** code for the Parties module should go in explore-browser/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** Phil - 09 January 2014
    */
    theme.views.register('explore', 'base',
    {
        _source: 'colombo/common/explore',

        all:
        {
            _construct: function()
            {
                var self = this;
                self._super.apply(self, arguments);

                self.noColumns = 0;
                self.columns = [];      /* TODO: remove comment later
                                        columns is defined here and not in
                                        shared, as a different theme might
                                        implement the content differently.
                                        */
            },

            _create: function()
            {
                var self = this;
                self._super.apply(self, arguments);
            },

            addColumns: function(noColumns)
            {
                var self = this;

                if (noColumns == undefined ||
                    noColumns < 0)
                    noColumns = 1;

                for (var i = 0; i < noColumns; i++)
                {
                    var index = self.noColumns;

                    var td = self.content.child('td', 'column column-' + 
                        (index +1));
                    td.css(
                    {
                        'vertical-align': 'top'
                    });
                    var div = td.child('div', 'holder');

                    self.columns[index] = td;
                    self.columns[index].holder = div;
                    self.noColumns++;
                }
            },

            addRecord: function(column, data, fav)
            {
                var self = this;

                if (column == undefined)
                    return;
                
                var record = column.holder.child('div', 'record');
                record.css('opacity', '0');
                record.addClass('bg-colour-3 ' +
                                'colour-1 ' +
                                'font-2');

                if (data.image)
                {
                    jQuery(record).append(data.image);
                    jQuery(data.image).bind('click', function() 
                    {
                        self.viewRecord(data.offset)
                    }); 
                }

                var table = record.child('table', 'info');
                table.addClass('font-3');
                table.css(
                {
                    'width': '100%'
                });
                table.bind('click', function()
                {
                    self.viewRecord(data.offset)
                }); 
                
                
                var text;
                if (data.module == 'ecatalogue')
                {
                    var tr = table.child('tr', 'record-label-1');
                    var td = tr.child('td');
                    td.attr('colspan', '2');
                    text = data.title;
                    if (!text)
                        text = IMu.string('object-untitled');
                    text = text.toUpperCase();
                    td.IMuEllipsis(text);

                    text = data.category;
                    if (text)
                    {
                        tr = table.child('tr', 'record-label-2');
                        td = tr.child('td');
                        td.attr('colspan', '2');
                        text = text.toUpperCase();
                        td.IMuEllipsis(text);
                    }

                    text = data.accNo;
                    if (text)
                    {
                        tr = table.child('tr', 'record-label-3');
                        td = tr.child('td');
                        td.attr('colspan', '2');
                        text = text.toUpperCase();
                        td.IMuEllipsis(text);
                    }

/*
                    tr = table.child('tr', 'record-label-4');
                    td = tr.child('td');

                    tr = table.child('tr', 'record-label-5');
                    td = tr.child('td');
                    td.addClass('border-3 last-row');
                    td.css('width', '99%');
                    text = data.type;
                    if (!text)
                        text = "";
                    text = text.toUpperCase();
                    td.text(text);
*/                    
                }
                else if (data.module == 'eparties')
                {
                    var tr = table.child('tr', 'record-label-1');
                    var td = tr.child('td');
                    td.attr('colspan', '2');
                    text = data.SummaryData;
                    if (!text)
                        text = "";
                    text = text.toUpperCase();
                    td.IMuEllipsis(text);

/*
                    tr = table.child('tr', 'record-label-5');
                    td = tr.child('td');
                    td.addClass('border-3 last-row');
                    td.css('width', '99%');
                    text = "";  //TODO
                    if (!text)
                        text = "";
                    text = text.toUpperCase();
                    td.text(text);
*/                    
                }

/*
                td = tr.child('td', 'selection');
                td.addClass('border-3 last-row');
                td.css('width', '1%');

                var favButton = td.child('div', 'button favorite');
                if (fav)
                    favButton.addClass('selected');
                else
                    favButton.addClass('deselected');

                favButton.css('top', '0');
                favButton.click(function()
                {
                    jQuery(this).toggleClass('deselected selected');

                    if (jQuery(this).hasClass('selected'))
                    {
                        self.widget.addFavorite(data.irn);
                    }
                    else
                    {
                        self.widget.removeFavorite(data.irn);
                    }
                });

                var img = favButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=share/fav_outline';
                img.attr('src', src);

                img = favButton.child('img', 'selected'); 
                src = IMu.Request.getURL('Image') + '&name=share/fav_fill';
                img.attr('src', src);
*/

                record.css('height', '1%');
                record.transition(
                {
                    opacity: 1
                }, 2000, 'ease');


                var footer = record.child('div', 'footer');
                footer.addClass('bg-colour-1 border-4 colour-4');
                
                var div = footer.child('div', 'fav');
                var button = div.IMu('button-control');
                button.addState(
                {
                    name: 'off',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=share/fav_outline'
                    },
                    onClick: function()
                    {
                        this.setState('on');
                        //TODO
                    }
                });
                button.addState(
                {
                    name: 'on',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + 
                            '&name=share/fav_fill'
                    },
                    onClick: function()
                    {
                        this.setState('off');
                        //TODO
                    }
                });
                button.createView();

                var text = footer.child('div', 'text');
                text.text("TEST");
               


            },

            viewRecord: function(offset)
            {
                var self = this;

                self.clearLoadInterval();

                var tabbed = self.widget.controller;
                while (tabbed.name != 'tabbed-display' && 
                    tabbed != undefined)
                    tabbed = tabbed.controller;

                if (tabbed === undefined)
                    return;

                tabbed.select(1);
                var combinedView = tabbed.pages[1].widget;

                var index = 0;
                var search = self.widget.search;
                combinedView.setSearch(search);

                combinedView.view.select(index, offset);

//                    combinedView.setOffset(data.offset);

            },

            resize: function()
            {
            },

            // Private
            createHeader: function(owner)
            {
                var self = this;

                //TODO: this bit is for mobile
                //use the header to break up categories

                if (owner === undefined)
                    var owner = self.owner;

                self.header = owner.child('div', 'header');
                self.header.css(
                {

                    display: 'inline-block',
//TODO
                    height: '2em',
                    position: 'relative',
                    width: '100%',
                    background: 'purple'

                });
            },

            // This needs to be 
            createSidebar: function()
            {
                var self = this;
                
                var owner = self.widget.owner;
                self.sidebar = owner.child('div', 'sidebar');

                
//                self.sidebar.css('position', 'fixed');
//                self.sidebar.addClass('bg-colour-3');

//                var toTopButton = self.sidebar.child('a',
//                    'button page-top-button deselected');

/* TODO
                var img = toTopButton.child('img', 'deselected');
                var src = IMu.Request.getURL('Image') + '&name=up_lighter';
                img.attr('src', src);

                img = toTopButton.child('img', 'selected');
                src = IMu.Request.getURL('Image') + '&name=up_darker';
                img.attr('src', src);
*/

                var div = self.sidebar.child('div', 'page-top');
                var button = div.IMu('button-control');
                button.addState(
                {
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=sidebar-page-top'
                    },
                    onClick: function()
                    {   
                        var holder = jQuery("body > .holder");
                        if (holder.length != 1)
                            return;
                        holder.scrollTop(0);
                    }
                });
                div.addClass('bg-colour-2');


/* TODO
                if (self.sidebar === undefined)
                    self.sidebar = [];

                var sidebar;
                sidebar = self.holder.child('div', 'sidebar');
                sidebar.css(
                {
                    bottom: 0,
                    position: 'absolute',
                    top: 0
                });
                if (side == 'left')
                {
                    sidebar.addClass('sidebar-left');
                    sidebar.css('left', 0);
                    self.sidebar[0] = sidebar;
                }
                else if (side == 'right')
                {
                    sidebar.addClass('sidebar-right');
                    sidebar.css('right', 0);
                    self.sidebar[1] = sidebar;
                }
//TODO                
                sidebar.css(
                {
                    width: '5em',
                    background: 'blue'
                });
*/                
            },

            createContent: function(owner)
            {
                var self = this;
                self._super.apply(self, arguments);

/* What was this here for?
                self.content.css(
                {
                    position: 'relative',

                    top: '2em',
                    bottom: 0,
                    left: '5em',
                    right: '5em'
                });
*/
                var widget = self.widget;
                var columns = widget.columns;

                for (var i = 0; i < columns.length; i++)
                {
                    if (self.columns[i] == undefined)
                        self.addColumns();

                    columns[i].view = self.columns[i];
                    self.columns[i].widget = columns[i];
                }
            },

            createFooter: function(owner)
            {
                var self = this;

                self.footer = self.owner.child('div', 'footer');
                self.footer.css('position', 'relative');

                var div = self.footer.child('div');
                var button = div.IMu('button-control');
                button.addState(
                {
                    name: 'loading',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=loading'
                    }
                });
                button.addState(
                {
                    name: 'load more',
                    layout:
                    {
                        type: 'text',
                        value: 'load more'
                    },
                    onClick: function()
                    {
                        var button = this;
                        button.setState('loading');
                        self.widget.loadBatch(function()
                        {
                            if (self.widget.getIndexListLength() > 0)
                                button.setState('load more');
                            else
                                button.setState('to top');
                        });
                    },
                    classes:
                    [
                        "bg-colour-2"
                    ]

                });
                button.addState(
                {
                    name: 'to top',
                    layout:
                    {
                        type: 'image',
                        value: IMu.Request.getURL('Image') + '&name=up_lighter'
//                        type: 'text',
//                        value: 'Top'
                    },
                    onClick: function()
                    {
                        var holder = jQuery("body > .holder");
                        if (holder.length != 1)
                            return;
                        holder.scrollTop(0);
                    }
                });
                self.footer.button = button;
            },

            clear: function()
            {
                var self = this;

                for (var i = 0; i < self.columns.length; i++)
                {
                    var column = self.columns[i];
                    column.holder.detach();
                    
                    var div = column.child('div', 'holder');
                    column.holder = div;
                }
            },

            displayError: function()
            {
                var self = this;
                clearInterval(self.loadInterval);
            },

            startLoadingAnimation: function()
            {
                var self = this;

                self.footer.button.setState('loading');

/*
                self.toTop.transition(
                {
                    opacity: 0
                }, 500, 'ease',
                function()
                {
                    self.toTop.css('display', 'none');

                    self.loadingImage.css('display', 'block');
                    self.loadingImage.transition(
                    {
                        opacity: 1
                    }, 500, 'ease');
                });
*/                
            },

            showLoadMoreButton: function()
            {
                var self = this;

                self.footer.button.setState('load-more');
            },

            showToTopButton: function()
            {
                var self = this;

                self.footer.button.setState('to-top');
/*
                self.loadingImage.transition(
                {
                    opacity: 0
                }, 500, 'ease',
                function()
                {
                    self.loadingImage.css('display', 'none');

                    self.toTop.css('display', 'block');
                    self.toTop.transition(
                    {
                        opacity: 1
                    }, 500, 'ease');
                });
*/                
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/widget-browser.js
*/
(function(theme)
{
    theme.views.register('widget-browser', 'base',
    {
        _source: 'colombo/common/browse-page',

        all:
        {
            _construct: function()
            {
                var self = this;

                self._super.apply(self, arguments);

                self.holder = undefined;
            },

            _create: function()
            {
                var self = this;
                self._super();
                
                self.holder = self.widget.owner.child('div', 'holder');

                switch (self.widget.device)
                {
                    case 'phone':
                        break;
                    case 'tablet':
                        break;
                    case 'desktop':
                    default:
                        var options =
                        {
                            loadOn: 'click',
                            showSidebar: true
                        };
                        var explore = self.addWidget('explore', options);
                        explore.addColumns(3);
                        explore.setModule('ecatalogue');
                        explore.setTerms();
                        explore.doSearch();
                        break;
                };
            },

            addWidget: function(name, options)
            {
                var self = this;

                var widget = self.widget.addWidget(name, options);
                widget.owner = self.holder.child('div',
                    'imu-' + name + ' ' + widget.id);

                return widget;
            },

            resize: function()
            {
                this._super();
            }
        }
    });
})(IMu.Themes.get('colombo'));

/* Source: ./themes/colombo/common/views/record-browser.js
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
        _source: 'colombo/common/record-browser',

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
})(IMu.Themes.get('colombo'));
