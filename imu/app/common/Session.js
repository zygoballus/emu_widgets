(function()
{
    IMu.App.Session = IMu.Class.create
    ({
        _construct: function(app)
        {
            this.app = app;
            this.key = 'IMuContext';
            this.port = undefined;
            this.context = undefined;
            this.username = undefined;
            this.first = undefined;
            this.last = undefined;
        },

        start: function(callback)
        {
            var self = this;

            var info = IMu.Storage.Local.get(self.key);
            if (! info)
            {
                self.login(function()
                {
                    callback.call(self);
                });
                return;
            }
            self.port = info.port;
            self.context = info.context;
            self.username = info.username;
            self.first = info.first;
            self.last = info.last;

            self.check(function(success)
            {
                if (success)
                {
                    callback.call(self);
                    return;
                }
                self.login(function()
                {
                    callback.call(self);
                });
            });
        },

        stop: function(callback)
        {
            var self = this;

            var request = new IMu.Request.Login();
            request.onComplete = function(response)
            {
                IMu.Storage.Local.remove(self.key);
                if (self.username)
                {
                    IMu.Storage.Local.set
                    (
                        self.key,
                        {
                            username: self.username
                        }
                    );
                }
                callback.call(self);
            };
            request.logout(self.port, self.context);
        },

        watch: function(callback)
        {
        },

        // private
        check: function(callback)
        {
            var self = this;
            if (! self.port)
            {
                IMu.log('No Context information');
                callback.call(self, false);
                return;
            }

            var request = new IMu.Request.Login();
            request.onComplete = function(result)
            {
                var response = result.response;
                if (! result.success)
                {
                    IMu.log('checkStatus call failed: {0}', response.id);
                    callback.call(self, false);
                    return;
                }
                callback.call(self, true);
            };
            request.checkStatus(self.port, self.context);
        },

        login: function(callback)
        {
            var self = this;

            var owner = self.app.owner.children('.login');
            if (owner.length == 0)
            {
                owner = self.app.owner.child('div', 'login');

                var holder = owner.child('div', 'holder');

                var heading = holder.child('div', 'heading');
                heading.text(IMu.string('Please Log in') + ':');

                var row = holder.child('div', 'row', 'username');
                var label = row.child('div', 'label');
                label.text('Username:');
                var input = row.child('input type="text"', 'input');

                var row = holder.child('div', 'row', 'password');
                var label = row.child('div', 'label');
                label.text('Password:');
                var input = row.child('input type="password"', 'input');

                var buttons = holder.child('div', 'buttons');
                var login = buttons.child('div', 'button', 'login');
                login.text('Log in');

                holder.on('keypress', function(e)
                {
                    if (e.keyCode == 13)
                        login.click();
                });
            }

            var info = IMu.Storage.Local.get(self.key);
            var username = owner.find('.username input');
            if (info && info.username)
                username.val(info.username);
            var password = owner.find('.password input');
            var login = owner.find('.login');
            login.off('click');
            login.on('click', function(e)
            {
                var d = new IMu.App.Dialogue();
                d.setMessage(IMu.string('Logging in...'));
                d.show();

                var request = new IMu.Request.Login();
                delete request.port;
                delete request.context;
                request.onError = function(response)
                {
                    d.hide();

                    var id = 'app-' + response.id;
                    var args = response.args;
                    var mesg = IMu.Format.formatParams(IMu.string(id), args);
                    d.setMessage(mesg);
                    d.addButton('ok');
                    d.show();
                };
                request.onSuccess = function(response)
                {
                    d.hide();

                    self.port = response.port;
                    self.context = response.context;
                    self.username = response.result.username;
                    self.first = response.result.first;
                    self.last = response.result.last;

                    IMu.Storage.Local.set
                    (
                        self.key,
                        {
                            port: self.port,
                            context: self.context,
                            username: self.username,
                            first: self.first,
                            last: self.last
                        }
                    );

                    owner.hide();
                    callback.call(self);
                };
                request.login(username.val(), password.val());
            });

            owner.show();
            if (username.val() == '')
                username.focus();
            else
                password.focus();
        }
    });
})();
