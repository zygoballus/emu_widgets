 (function(theme)
{
    theme.views.register('tree-browser', 'view',
    {
        _source: 'shared/common/tree-browser',

         all:
        {
            _create: function()
            {
                var self = this;
            },
            
            resize: function()
            {
                var self = this;
            },

            initStructure: function(elem, node)
            {
                var self = this;

                var list = elem.child('ol');

                //var li = list.child('li', 'tree-node node-expanded');
                var li = list.child('li', 'tree-node');
                
                if('children' in node)
                {
	            	li.addClass('tree-node node-expanded')    
                } 

                return li;

            },
            
            //expandable is optional
            showNode: function(elem, node)
            {
	            var self = this;
	            
	            var span = elem.child('span', 'node-text');
	            span.attr('id', node.irn);
                span.attr('title', IMu.string('tree-node-tooltip'));
	            
	            //if the IRN of current node is the same as the IRN orig passed in
	            if(self.widget.options.key == node.irn)
	            {
		            span.addClass('selected');
	            }
	            
	            //if we have summary data print that out
	            //else just print out the irn of the node
	            if('SummaryData' in node.values)
	            {
		            span.html(node.values.SummaryData);
	            }
	            else
	            {
		            span.html(node.irn);
	            }
	            
	            // check to see if the node has actually been expanded
	            // this is mainly to put the correct class on node
	            if('children' in node && node.expandable == 1)
	            {
		            elem.addClass('node-expanded');
	            }
	            else
	            {
		            elem.addClass('node-not-expanded');
	            }
	            
	            //if we know that the node can be expandable
	            if('expandable' in node)
	            {
		            if(node.expandable == 0)
		            	elem.addClass('no-children');
		            else
		            {
                        span.click(function()
                        {
                            IMu.log('try to expand tree');
                            var nodeOwner = span.parent();
                            var id = span[0].id;
                            //node already expanded
                            if(jQuery(nodeOwner).hasClass('node-expanded'))
                            {
                                IMu.log('node already expanded');
                                var sibling = span[0].nextSibling;
                                if( sibling.nodeName == 'OL')
                                {
                                    IMu.log('has list');
                                    jQuery(sibling).hide();
                                    nodeOwner.removeClass('node-expanded');
                                    nodeOwner.addClass('node-not-expanded');
                                }
                            }
                            else if(jQuery(nodeOwner).hasClass('node-not-expanded'))
                            {
                                IMu.log('node not expanded yet');
                                var sibling = span[0].nextSibling;
                                if(sibling && sibling.nodeName == 'OL')
                                {
                                    IMu.log('node already loaded');
                                    jQuery(sibling).show();
                                    nodeOwner.removeClass('node-not-expanded');
                                    nodeOwner.addClass('node-expanded');
                                }
                                else
                                {
                                    IMu.log('node not yet expanded');
                                    self.widget.expandNode(nodeOwner, id);
                                    nodeOwner.removeClass('node-not-expanded');
                                    nodeOwner.addClass('node-expanded');
                                }
                            }
                            IMu.Events.trigger('tree-browser-node-interaction');
                        });                        
                    }
                    IMu.Events.trigger('tree-browser-node-expanded');
	            }
	            
	            span.dblclick(function()
	            {
		           jQuery('.node-text').removeClass('selected');
		           span.addClass('selected');
		           var key = span[0].id;
		           self.widget.showDetails(key); 
	            });
	            
                if ('children' in node)
                {
                    var list = elem.child('ol');
                    for (var i = 0; i < node.children.length; i++)
                    {
                        var li = list.child('li', 'tree-node');
                        self.showNode(li, node.children[i]);
                    }
                }  
            }
        }
    });
})(IMu.Themes.shared);
