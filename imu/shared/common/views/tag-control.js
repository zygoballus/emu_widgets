(function(theme)
{
    theme.views.register('tag-control', 'text-control',
    {
        _source: 'shared/common/tag-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                /* make the tags typed display above the input */
                var inputHolder = self.holder.find('.content');
                self.tagHolder = jQuery(
                    '<div class="tag-holder"><div class="tags"/></div>'
                );
                self.tagHolder.prependTo(inputHolder);

                self.submit = undefined;
                if (self.widget.options.readonly)
                {
                    inputHolder.find('input').hide();
                }
                else
                {
                    inputHolder.find('input').attr({'id': 'tag-update-input' });

                    /* add a submit button as a sibling of the text control */
                    self.submit = inputHolder.parent().child('button', 'submit');

                    self.submit.text(IMu.string('tag-control-update'));

                    self.submit.bind('click', function() {
                        if (! self.submit.hasClass('tag-control-disabled-update'))
                            self.widget.updateTags();
                    });
                    self.submit.hide();
                }
            },

            /*
            ** display a tag on screen
            */
            displayTag: function(value, tagStatus)
            {
                var self = this;

                var tag = self.tagHolder.find('.tags').child('span', 'post-tag');
                tag.text(value);
                tag.attr('title',value);

                if (tagStatus != 'approved')
                {
                    tag.addClass('unauthorised-tag');

                    if (tagStatus == 'suggested')
                    {
                        var deleteTag = tag.child('span','delete-tag');
                        deleteTag.text(' (x)');

                        deleteTag.click(function()
                        {
                            self.widget.doDropSuggestedTag(value);
                        });
                    }
                }
            },

            /*
            ** redraw the tag display
            */
            redrawTagDisplay: function()
            {
                var self = this;

                var noSuggestedTags = true;

                self.tagHolder.find('.tags').empty();

                if (self.widget.options['showApprovedTags'])
                {
                    jQuery.each(self.widget.getApprovedTags(), function(idx, value) {
                        self.displayTag(value, 'approved');
                    });
                }
                if (self.widget.options['showCandidateTags'])
                {
                    jQuery.each(self.widget.getCandidateTags(), function(idx, value) {
                        self.displayTag(value, 'candidate');
                    });
                }

                jQuery.each(self.widget.getSuggestedTags(), function(idx, value) {
                    self.displayTag(value, 'suggested');
                    noSuggestedTags = false;
                });

                if (noSuggestedTags)
                {
                    if (self.submit != undefined)
                    {
                        self.submit.addClass('tag-control-disabled-update');
                        self.submit.hide();
                    }
                }
                else
                {
                    if (self.submit != undefined)
                    {
                        self.submit.removeClass('tag-control-disabled-update');
                        self.submit.show();
                    }
                }
            },


            /*
            ** display information on a status to the user
            */
            showUserMessage: function(status, data)
            {
                var self = this;
                if (status == undefined)
                    status = 'tag-control-unknown-error';
                var msg = IMu.string(status + '-msg') + '. ' +  data;
                alert(msg);
            },


            /**
            ** clean up input control to allow new tags to be suggested
            */
            tidyUpdateControls: function()
            {
                var self = this;

                var inputBox = jQuery(self.widget.owner).find('input');
                if (inputBox != undefined)
                    inputBox.val('');
            }
        }
    });
})(IMu.Themes.shared);
