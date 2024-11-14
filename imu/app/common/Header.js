(function()
{
    IMu.App.Header = IMu.Class.create
    ({
        _construct: function(app)
        {
            this.app = app;

            this.app.header = this;
            if (this.app.holder)
                this.owner = this.app.holder.child('div');
            else
                this.owner = this.app.owner.child('div');
        },

        hide: function()
        {
            this.owner.hide();
        },

        show: function()
        {
            if (this.owner.children().length == 0)
                this.create();
            this.owner.show();
        }
    });
})();
