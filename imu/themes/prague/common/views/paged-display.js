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
