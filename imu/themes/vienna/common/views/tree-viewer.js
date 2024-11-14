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
