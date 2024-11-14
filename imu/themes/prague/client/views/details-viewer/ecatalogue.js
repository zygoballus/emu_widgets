(function(theme)
{
	theme.views.register('details-viewer',
	{
        _source: 'prague/client/details-viewer/ecatalogue',

		all:
		{
			create_ecatalogue: function(div, data)
			{
				var self = this;

				if (! data)
					return;

				var info = self.showCatalogueDetails(div, data);
			}
		}
	});
})(IMu.Themes.get('prague'));
