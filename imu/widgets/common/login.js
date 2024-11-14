/*!
** Displays a simple login box.
**
** @since 2.0
*/
IMu.Widgets.add('login', 'base',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-login');

        this.registerOptions
        ({
            /*!
            ** Specifies that a field allowing the user to specify which
            ** service or port to connect to should be included.
            **
            ** Can be set to:
            **
            ** * **true** to specify that a generic textbox should be
            **   provided to allow the user to enter the name or number
            **   of the service.
            **
            ** * a list of simple Javascript objects to specify that a
            **   list of alternatives should be available fo the user to
            **   choose from.
            **
            **   Each object in the list should include two properties:
            **
            **     * service
            **
            **       The actual service name or port number to use
            **       if this option is selected.
            **
            **     * label
            **
            **       A ``string`` to be used to prompt the user.
            */
            showService: undefined,

            /*!
            ** Specifies that a status line should be included in the widget.
            ** This line is used to show information about the login.
            */
            showStatus: false,

            /*!
            ** Specifies that a login button should be added.
            */
            showSubmit: false,

            /*!
            ** Specifies that a select box should be included.
            ** This allows users to change their group permissions.
            */
            showGroup: false,

            /*!
            ** The user has pressed the **Enter** and IMu has attempted to
            ** log in. However the login was unsuccessful.
            **
            ** @param error string
            **   The error returned by the server.
            */
            onError: undefined,

            /*!
            ** The user has pressed the **Enter** and IMu has logged in
            ** successfully.
            **
            ** @param username string
            **   The username of the successful login.
            */
            onLogin: undefined,

            /*!
            ** The user has pressed the **Enter** key or clicked the
            ** Login button.
            **
            ** @param username string
            **   The current contents of the username box.
            **
            ** @param password string
            **   The current contents of the password box.
            **
            ** @param password service
            **   The current contents of the service box (if any).
            */
            onSubmit: function(username, password, service, group)
            {
                var self = this;

                self.showStatus('login-pending');
                IMu.Login.login(username, password, group, service, function(result)
                {
                    if (result.success)
                    {
                        var username = IMu.Login.info.username;
                        self.showStatus('login-success', username);

                        IMu.Login.info.group = self.group;

                        if (self.options.onLogin)
                            self.options.onLogin.call(self, username);
                        IMu.Events.trigger('imu-login', username);
                        IMu.Events.trigger('imu-login-success', username);
                    }
                    else
                    {
                        var error = result.response.args[0];
                        self.showStatus('login-error', error);
                        if (self.options.onError)
                            self.options.onError.call(self, error);
                        IMu.Events.trigger('imu-login-error', error);
                    }
                });
            }
        });

        this.username = '';
        this.password = '';
        this.service = '';
        this.group = '';
    },

    // private
    doSubmit: function()
    {
        if (this.username == '')
            return;

        if (this.options.onSubmit)
            this.options.onSubmit.call(this, this.username, this.password, this.service, this.group);
    },

    showStatus: function()
    {
        var format = IMu.string(arguments[0]);
        var params = Array.prototype.slice.call(arguments, 1);

        var mesg = IMu.Format.formatParams(format, params);
        if (this.view)
            this.view.showStatus(mesg);
    },

    getGroups: function()
    {
        var self = this;
        if (this.username == '')
            return;

        if (this.options.showGroup)
        {
            var regkey = ['User',this.username,'Group'];
            var registry = new IMu.Request.Registry();
            var callback = function(result)
            {
                    self.view.populateGroups(result,self);
            };
            registry.getValue(regkey, callback);
        }
    }
});
