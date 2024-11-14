(function()
{
    IMu.App.Page = IMu.Class.create
    ({
        _construct: function(app)
        {
            this.app = app;
            
            if (this.app.holder)
                this.owner = this.app.holder.child('div', 'page');
            else
                this.owner = this.app.owner.child('div', 'page');
        },

        hide: function()
        {
            this.owner.hide();
        },

        remove: function()
        {
            this.owner.remove();
        },

        show: function()
        {
            if (this.owner.children().length == 0)
                this.create();
            this.owner.show();
        }
    });
})();
