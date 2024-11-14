/*!
 * Displays treeview structure of a given record.
 *
 * @since 2.0
 */
IMu.Widgets.add('tree-browser', 'base', {
    _construct: function() {
        var self = this;

        self._super.apply(self, arguments);
        self.classes.push('imu-tree-browser');

        self.registerOptions({
            module: undefined,
            key: undefined,
            parent: undefined,
            above: undefined,
            below: undefined,
            columns: undefined,
            expandable: undefined,
            siblings: undefined,
            sortOption: undefined,
            displayWidget: undefined
        });
        self.isExpanded = true;
    },

    _ready: function() {
        var self = this;
    },

    fetchHierarchy: function() {
        var self = this;

        if (self.owner[0].children.length > 0) {
            //remove previous tree
            var me = self.owner[0].children[0];
            jQuery(me).remove();
            // me.remove();
        }
        //check what tree options have been setup
        var treeOptions = {};

        if (self.options.above >= 0)
            treeOptions.above = self.options.above;
        if (self.options.below >= 0)
            treeOptions.below = self.options.below;
        if (self.options.columns)
            treeOptions.columns = self.options.columns;
        if (self.options.expandable)
            treeOptions.expandable = self.options.expandable;
        if (self.options.siblings)
            treeOptions.siblings = self.options.siblings;
        if (self.options.sortOption)
            treeOptions.sort = self.options.sortOption;

        var module = new IMu.Request.Module(self.options.module);

        //TODO
        //if expandable is set to false you want to perform ddifferent markup.
        self.options.displayWidget.beginDelay();
        module.fetchHierarchy(self.options.key, self.options.parent, treeOptions, function(result) {
            var elem = self.view.initStructure(self.owner, result);

            if (!result.parent && !result.children) {
                result.expandable = 1;
                //self.expandNode(elem, result.irn);
            }
            self.view.showNode(elem, result);
            self.showDetails(self.options.key);
            self.options.displayWidget.endDelay();
        });
    },

    expandNode: function(elem, key) {
        var self = this;

        var treeOptions = {};

        treeOptions.above = 0;
        treeOptions.below = 1;
        if (self.options.columns)
            treeOptions.columns = self.options.columns;
        treeOptions.expandable = true;
        treeOptions.siblings = true;
        if (IMu.Config.archiveSortingOption) {
            treeOptions.sort = IMu.Config.archiveSortingOption;
        } else {
            treeOptions.sort = 'SummaryData';
        }

        var module = new IMu.Request.Module(self.options.module);

        self.beginDelay();

        module.fetchHierarchy(key, self.options.parent, treeOptions, function(node) {
            var result = node;
            var list = elem.child('ol');
            for (var i = 0; i < node.children.length; i++) {
                var li = list.child('li', 'tree-node');
                self.view.showNode(li, node.children[i]);
            }
            self.endDelay();
        });
    },

    showDetails: function(key) {
        var self = this;

        if (self.options.displayWidget) {
            var widget = self.options.displayWidget;

            if (widget) {
                widget.showRecord(self.options.module, key);
            }
        } else {
            IMu.log('no where to show result')
            return;
        }
    }
});