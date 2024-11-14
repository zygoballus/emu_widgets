(function(theme)
{
    theme.views.register('comments-control', 'text-control',
    {
        _source: 'vienna/common/comments-control',

        all:
        {
            _create: function()
            {
                this._super.apply(this, arguments);

                var self = this;

                var widget = self.widget;
            },

            printComments: function()
            {
                var self = this;

                var widget = self.widget;

                var div = widget.owner.parent().parent().parent().parent();
                div = div.child('table','imu-comments');

                for (var i = 0; i < self.widget.comments.length; i++) 
                {
                    var data = self.widget.comments[i];
                    var comment = self.addCommentSection(div);

                    var timeStamp = comment.child('td','imu-comment-timestamp');
                    timeStamp.text(data.AdmDateInserted + ' ' + data.AdmTimeInserted);

                    var commentText = comment.child('td','imu-comment-text');
                    commentText[0].innerHTML = data.NarNarrative;

                };
            },

            addCommentSection: function(owner)
            {
                var self = this;

                if (! owner)
                    return null;

                var table = owner.child('tr', 'imu-comment');

                // var table = div.child('table', 'details');
                table.css('clear', 'both');
                table.css('width', '100%');
                // table.attr('id', header);

                return table;

            },
        }
    });
})(IMu.Themes.get('vienna'));
