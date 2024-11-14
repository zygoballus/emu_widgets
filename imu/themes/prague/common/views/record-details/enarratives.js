(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/enarratives',

		all:
		{
			showNarrativeDetails: function(owner, data)
			{
				var self = this;

                // Use of 'narrative' class element is deprecated in favour 
                // of 'enarratives' on owner element.
                // This is for consistency accross modules.
                //
                owner.addClass('enarratives');
				var base = owner.child('div', 'narrative');

				self.showNarrativeTrail(base, data.trails);

                var summary = base.child('div', 'summary');
                var details = self.showMultimedia(summary, data);
				var div = details.child('div', 'description');
				div.html(data.description);

				div = base.child('div', 'secondary');
				self.showSection(div, data.objects, 'objects', 'ecatalogue');
				self.showSection(div, data.children, 'subnarratives',
						'enarratives');
				self.showSection(div, data.associations, 'related-narratives',
						'enarratives');

				return details;
			},

			showNarrativeTrail: function(owner, trails)
			{
				var self = this;

				if (! trails)
					return;

				var gap = IMu.Languages.current.dir == 'ltr' ? '>' : '<';
				for (var i = 0; i < trails.length; i++)
				{
					var div = owner.child('div', 'trail');
					var trail = trails[i];

					for (var j = 0; j < trail.length; j++)
					{
						if (j > 0)
						{
							var span = div.child('span');
							span.text(' ' + gap + ' ');
						}
						var irn = trail[j].irn;
						var title = trail[j].title;

						var span = div.child('span', 'item');
						span.text(title);
						var show = (function(irn)
						{
							return function()
							{
								self.widget.showRecord('enarratives', irn);
							}
						})(irn);
						span.bind('click', show);
					}
				}
			}
		}
	});
})(IMu.Themes.get('prague'));
