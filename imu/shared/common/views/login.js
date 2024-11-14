(function(theme)
{
    theme.views.register('login',
    {
        _source: 'shared/common/login',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);

                var self = this;
                self.username = undefined;
                self.password = undefined;
                self.service = undefined;
                self.submit = undefined;
                self.groups = undefined;
                self.status = undefined;
            },

            _create: function()
            {
                var self = this;

                var widget = self.widget;

                function gotUsername()
                {
                    var filled = widget.username != '';
                    if (self.submit)
                        self.submit.attr('disabled', ! filled);
                    return filled;
                }

                var table = widget.owner.child('table');

                var tr, td, label;

                tr = table.child('tr');

                td = tr.child('td');
                label = td.child('label', 'username-label');
                label.text(IMu.string('login-username') + ':');

                td = tr.child('td');
                self.username = td.child('input type="text"', 'username-input');
                self.username.bind('keyup', function(e)
                {
                    widget.username = jQuery(this).val();
                    if (gotUsername() && e.keyCode == 13)
                        widget.doSubmit();
                });
                if (self.getOption('showGroup'))
                {
                    self.username.bind('blur',function(e)
                    {
                        widget.username = jQuery(this).val();
                        if (gotUsername())
                            widget.getGroups();
                    });
                }

                tr = table.child('tr');

                td = tr.child('td');
                label = td.child('label', 'password-label');
                label.text(IMu.string('login-password') + ':');

                td = tr.child('td');
                self.password = td.child('input type="password"', 'password-input');
                self.password.bind('keyup', function(e)
                {
                    widget.password = jQuery(this).val();
                    if (gotUsername() && e.keyCode == 13)
                        widget.doSubmit();
                });

                if (self.getOption('showService'))
                {
                    tr = table.child('tr');

                    td = tr.child('td');
                    label = td.child('label', 'service-label');
                    label.text(IMu.string('login-service') + ':');

                    td = tr.child('td');
                    self.service = td.child('input type="text"', 'service-input');
                    self.service.bind('keyup', function(e)
                    {
                        widget.service = jQuery(this).val();
                        if (gotUsername() && e.keyCode == 13)
                            widget.doSubmit();
                    });
                }
                if (self.getOption('showGroup'))
                {
                    tr = table.child('tr');
                    td = tr.child('td');
                    td = tr.child('td');
                    self.groups = td.child('select','group-select');

                    self.groups.bind('change', function()
                    {
                        self.widget.group = self.groups.val();
                    });

                }

                if (self.getOption('showSubmit'))
                {
                    tr = table.child('tr');
                    td = tr.child('td colspan="2"');

                    self.submit = td.child('button', 'submit');
                    self.submit.text(IMu.string('login-submit'));
                    self.submit.bind('click', function()
                    {
                        widget.doSubmit();
                    })
                    gotUsername();
                }

                if (self.getOption('showStatus'))
                {
                    tr = table.child('tr');
                    td = tr.child('td colspan="2"');

                    self.status = td.child('div');
                }
            },

            showStatus: function(mesg)
            {
                var self = this;

                if (self.status)
                    self.status.text(mesg);
            },

            populateGroups: function(result,widget)
            {
                var view = widget.view;
                if (result.result)
                    result = result.result;
                var groups = result.split(';');
                widget.allgroups = groups;
                for (var i = 0; i < groups.length; i++)
                {
                    view.groups.append('<option value="' + groups[i] + '">' + groups[i] + '</option>');
                }
                widget.group = view.groups.val();
            }
        }
    });
})(IMu.Themes.shared);
