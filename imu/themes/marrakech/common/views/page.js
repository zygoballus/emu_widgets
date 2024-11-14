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
