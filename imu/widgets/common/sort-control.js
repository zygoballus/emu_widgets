/*!
** sort control.
**
** @since 2.0
*/
IMu.Widgets.add('sort-control', 'selection-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-sort-control');

        this.registerOptions
        ({
            listViewer: undefined,
            lightBoxViewer : undefined,
            combinedViewer: undefined
        });

        this.sortValue = undefined;
        this.sortSet = undefined;

    },

    _ready: function()
    {
        var self = this;
    },

    sortChanged: function()
    {
        var self = this;

        self.sortSet =
        {
           ecatalogue:
               [
                   this.sortValue
               ],
           enarratives:
               [
                   'irn'
               ],
           eparties:
               [
                   'irn'
               ]
        };
        if(self.options.combinedViewer)
        {
            var widget = self.options.combinedViewer;

            if(widget.search)
            {
              widget.search.addSortSet('summary',self.sortSet,function()
              {
                  widget.search.sort('summary','report',function(result)
                  {
                      var newSearch = widget.search;

                      var lightboxViewer = undefined;
                      var detailsViewer = undefined;
                      var listViewer = undefined;
                      var selectedViewer = widget.list[widget.selected].widget;

                      var sortControl = jQuery('.imu-sort-control');

                      if(sortControl.length > 0)
                      {
                        lightboxViewer = jQuery('.imu-lightbox-viewer').css('display','block');
                        detailsViewer = jQuery('.imu-details-viewer').css('display','block');
                        listViewer = jQuery('.imu-list-viewer').css('display','block');
                      }

                      for(var i = 0; i< widget.list.length; i++)
                      {
                        var selected = widget.list[i].widget;
                        selected.dropSearch();
                        selected.showSearch(newSearch);

                        
                        var thisViewer = widget.list[i].widget;

                        if(thisViewer != selectedViewer)
                        {
                          jQuery(thisViewer.owner).css('display','none');
                        }
                      }
                  });
              });
            }
        }
    }
});
