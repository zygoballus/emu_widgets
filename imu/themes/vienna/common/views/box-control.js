(function(theme)
{
    theme.views.register('box-control', 'control',
    {
        _source: 'shared/common/box-control',

        all:
        {
            _create: function()
            {
                 this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;

                // if(! widget.options.lines || widget.options.lines < 2)
                // {
                //     if(widget.options.isTagControl)
                //     {   
                //         widget.owner = widget.owner.child('div', 'tag-holder');
                //         self.tagControl = widget.owner.child('span', 'tags');

                //         var submit = widget.owner.parent().child('button', 'submit');
                //         // var submit = widget.owner.child('button', 'submit');
                //         submit.text(IMu.string('tag-control-update'));
                //         submit.bind('click', function()
                //         {
                //             widget.updateTags();
                //         });                        
                //     }
                // }

                if(widget.options.isCommentsControl)
                {
                        var submit = widget.owner.parent().child('button', 'submit');
                        submit.addClass('post-comment-btn');
                        // var submit = widget.owner.child('button', 'submit');
                        submit.text(IMu.string('comment-control-post'));
                        submit.bind('click', function()
                        {
                            self.widget.commentText = self.control[0].value;
                            self.widget.postComment();
                            self.control[0].value = "";
                        });   
                }

              
                self.control.keypress(function(e)
                {
                    if(widget.options.delimiter)
                    {
                        var key = widget.options.delimiter.charCodeAt(0);

                        if(e.which == key)
                        {
                            var value = self.getValue();
                            //remove all non alpha numeric chars
                            value = value.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
                            self.setValue(value,true);
                            self.control.value = "";
                        }
                    }
                });
            }
        }
    });
})(IMu.Themes.shared);
