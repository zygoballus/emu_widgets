(function()
{
    IMu.Login =
    {
        info: IMu.Cookies.get().values.login,

        login: function(username, password, group, service, callback)
        {
            var self = this;

            if (typeof(group) == 'function')
            {
                callback = group;
                group = undefined;
            }
            // service is optional
            if (typeof(service) == 'function')
            {
                callback = service;
                service = undefined;
            }

            var request = new IMu.Request.Login();
            request.onComplete = function(result)
            {
                IMu.log('Login.login: success {0}', result.success);
                if (! result.success)
                    IMu.Cookies.get().remove();
                else
                {
                    var info = {};

                    var response = result.response;
                    info.port = response.port;
                    info.context = response.context;

                    if (response.result)
                    {
                        for (var name in response.result)
                            info[name] = response.result[name];
                    }
					IMu.log('Login.login: info {0}', info);

                    var cookie = IMu.Cookies.get();
                    cookie.values.login = info;
                    cookie.save();

                    self.info = IMu.Cookies.get().values.login;
                }
                if (callback)
                    callback.call(self, result);
            };
            IMu.log('Login.login: logging in as {0}...', username);
            request.login(username, password, group, service);
        },

        logout: function(callback)
        {
            var self = this;

            var request = new IMu.Request.Login();
            request.onComplete = function(result)
            {
                IMu.log('Login.logout: success {0}', result.success);
                var cookie = IMu.Cookies.get();
                cookie.values.login = undefined;
                cookie.save();

                self.info = undefined;
                
                if (callback)
                    callback.call(self, result);
            };
            IMu.log('Login.logout: logging out...');
            request.logout(self.info.port, self.info.context);
        },

        checkStatus: function(interval, callback)
        {
            var self = this;

            if (! (self.info && self.info.port && self.info.context) ||
                typeof(interval) != 'number') // ...Means we can skip entirely
                return;
           
            // Check at least once
            var request = new IMu.Request.Login();
            request.onComplete = function(result)
            {
                if (callback)
                {
                    if (result.success)
                        callback.call(self, true, result.response.result);
                    else
                        callback.call(self, false, result.response);
                }
            }
            request.checkStatus(self.info.port, self.info.context);

            // Successive checks
            if (interval > 0)
            {
                interval *= 60000;   // milliseconds to minutes

                var intervalID = setInterval(function()
                {
                    var request = new IMu.Request.Login();
                    request.onComplete = function(result)
                    {
                        if (callback)
                        {
                            if (result.success)
                                callback.call(self, true, result.response.result);
                            else
                                callback.call(self, false, result.response);
                        }
                    }
                    request.checkStatus(self.info.port, self.info.context);
                }, interval);
           }     
        }
    };
IMu.log('IMu.Login.info {0}', IMu.Login.info);
})();
