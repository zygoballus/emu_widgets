(function()
{
    IMu.App = IMu.Class.create
    ({
        _construct: function(owner)
        {
            this.owner = owner;
            if (this.owner === undefined)
                this.owner = jQuery('body');
            this.owner.addClass('imu-app');

            this.pages = {};
        },

        finish: function(callback)
        {
            var self = this;

            if (callback)
                callback.call(self);
        },

        /*!
        ** Remove indication of a delay.
        */
        hideDelay: function()
        {
        },

        login: function(callback)
        {
            var self = this;

            if (! self.session)
                self.session = new IMu.App.Session(self);
            self.session.start(function()
            {
                callback.call(self);
            });
        },

        logout: function(callback)
        {
            var self = this;

            if (! self.session)
            {
                callback.call(self);
                return;
            }
            self.session.stop(function()
            {
                callback.call(self);
            });
        },

        /*!
        ** The main entry point to the app. This is called once the user is
        ** logged in correctly (see the login method).
        */
        run: function(callback)
        {
            callback.call(this);
        },

        setup: function(callback)
        {
            callback.call(this);
        },

        /*!
        ** Show some feedback to the user that there is a delay.
        */
        showDelay: function()
        {
        },

        /*!
        */
        showPage: function(name)
        {
        },

        start: function(callback)
        {
            var self = this;

            self.owner.empty();
            self.setup(function()
            {
                self.run(function()
                {
                    self.finish(callback);
                });
            });
        }
    });
})();
