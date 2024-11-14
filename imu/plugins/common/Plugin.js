IMu.jQuery = {};

IMu.jQuery.Plugin = IMu.Class.create(IMu.Mixins.Options,
{
	pluginName: 'IMuPlugin',

	_construct: function(owner)
	{
		this.owner = owner;
		this.owner.addClass('imu-plugin');

		this.pluginName = Object.getPrototypeOf(this).pluginName;

		this.registerOptions
		({
		});
	},

	changeLanguage: function()
	{
		this.owner.attr('dir', IMu.Languages.current.dir);
		this.owner.attr('lang', IMu.Languages.current.lang);
	},

	finalise: function()
	{
		var self = this;

		self.changeLanguage();
		IMu.Events.bind('language-changed', function()
		{
			self.changeLanguage();
		});

		self.resize();
		IMu.Events.bind('dom-resize', function()
		{
			self.resize();
		});
	},

	log: function()
	{
		if (arguments.length == 0)
			return;

		var format = arguments[0];
		var params = Array.prototype.slice.call(arguments, 1);
		var output = IMu.Format.vsprintf(format, params);
		IMu.log('{0}.{1}', this.pluginName, output);
	},

	resize: function()
	{
		// by default do nothing
	}
});
