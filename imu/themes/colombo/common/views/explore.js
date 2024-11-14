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
