IMu.Request.Login = IMu.Request.Base.extend
({
	_construct: function()
	{
		this._super();

        this.name = 'Login';
	},

    login: function(username, password, group, service, callback)
    {
        var self = this;

        // group is optional
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
        
        IMu.log('logging in as {0}', username);

		var info =
        {
            method: 'login',
            params:
            {
                username: username,
                password: password,
                group: group
            }
        };

        var result = undefined;

		this.request(info, function(response, success)
        {
            result = response;

            if (callback)
                callback.call(self, result, success);
        });

        return result;
	},

    logout: function(port, context, callback)
    {
        var self = this;

        IMu.log('logging out (port {0} context {1})', port, context);

		var info =
        {
            port: port,
            context: context,
            method: 'logout'
        };

        var result = undefined;

		self.request(info, function(response, success)
        {
            result = response;

            if (callback)
                callback.call(self, result, success);
        });

        return result;
	},

    checkStatus: function(port, context, callback)
    {
        var self = this;

        IMu.log('Checking connection...');

        var result = undefined;
        var info =
        {
            port: port,
            context: context,
            method: 'checkStatus'
        };

        self.request(info, function(response, success)
        {
            result = response;

            if (callback)
                callback.call(self, result, success);
        });
    }
});
