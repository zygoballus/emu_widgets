/* A note about techniques used to layout HTML.
**
** This plugin uses HTML tables for layout. This is frowned upon
** by many web gurus.
**
** However, as of IMu 2.0, support for Internet Explorer 7 is still,
** unfortunately, mandatory. This makes laying out pages using more
** modern techniques extremely difficult at best and impossible in
** some cases.
**
** It is envisaged that as browser support requirements shift in
** future that some plugins will be re-factored to make use of more
** modern layout techniques.
*/
jQuery.fn.IMuColumnLayout = function(options)
{
	var children = this.children().detach();

	var plugin = new IMu.jQuery.ColumnLayout(this);
	this.data(plugin.pluginName, plugin);
	plugin.setOptions(options);
	plugin.create();

	children.each(function()
	{
		plugin.add(jQuery(this));
	});

	plugin.finalise();
	return plugin;
}

IMu.jQuery.ColumnLayout = IMu.jQuery.Plugin.extend
({
	pluginName: 'IMuColumnLayout',

	// called by jQuery (see above)
	_construct: function()
	{
		var self = this;

		self._super.apply(self, arguments);
		self.owner.addClass('imu-column-layout-plugin');

		self.registerOptions
		({
			sameSize: false
		});

		self.table = undefined;
		self.tr = undefined;
		self.cols = [];
	},

	create: function()
	{
		var self = this;

		var elem;

		self.table = elem = self.owner.child('table', 'layout');
		elem.css('border-collapse', 'collapse');

		self.tr = elem = self.table.child('tr', 'row');

		this.cols = [];

		self.resize();
		IMu.Events.bind('dom-resize', function()
		{
			self.resize();
		});
		IMu.Events.bind('imu-show', function()
		{
			self.show();
		});
	},

	// public
	add: function(item)
	{
		var self = this;

		var n = self.cols.length + 1;

		var cell = self.tr.child('td', 'cell', 'cell-' + n);
		cell.css
		({
			paddingBottom: 0,
			paddingLeft: 0,
			paddingRight: 0,
			paddingTop: 0
		});

		var col =
		{
			cell: cell,
			type: 'unknown',
			elem: undefined,
			weight: 0,
			width: undefined
		};
		if (! item)
		{
			col.type = 'space';
			col.elem = undefined;
			if (arguments.length > 1)
				col.weight = arguments[1];
		}
		else if (item in IMu.Widgets.widgets)
		{
			col.type = 'widget';
			col.elem = cell.child('div');
			col.elem.addClass('column column-' + n);
			var options = undefined;
			if (arguments.length > 1)
				options = arguments[1];
			col.elem.IMu(item, options);
		}
		else if (item instanceof jQuery)
		{
			col.type = 'element';
			col.elem = item;
			col.elem.appendTo(col.cell);
			col.elem.addClass('column column-' + n);
			for (var i = 1; i < arguments.length; i++)
				col.elem.addClass(arguments[i]);
			if (col.elem.attr('weight') !== undefined)
				col.weight = col.elem.attr('weight');
		}
		else
		{
			col.type = 'element';
			col.elem = col.cell.child(item);
			col.elem.addClass('column column-' + n);
			for (var i = 1; i < arguments.length; i++)
				col.elem.addClass(arguments[i]);
		}
		this.cols.push(col);

		return col;
	},

	resize: function()
	{
		var self = this;

		self.table.fullWidth(self.owner.width());
	},

	show: function()
	{
		var self = this;

		// work out column widths
		var total = 0;
		for (var i = 0; i < self.cols.length; i++)
		{
			var col = self.cols[i];
			if (col.weight)
				total += col.weight;
		}
		if (total > 0)
		{
			var percent = 100 - self.cols.length;
			for (var i = 0; i < self.cols.length; i++)
			{
				var col = self.cols[i];
				col.width = 1;
				if (col.weight)
					col.width += Math.round(col.weight / total * percent);
				col.cell.css('width', col.width + '%');
			}
		}
	}
});
