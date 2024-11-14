(function(theme)
{
    theme.views.register('list-viewer',
    {
        _source: 'prague/common/list-viewer/eparties',

        all:
        {
			create_eparties: function(div, data)
			{
				var self = this;
				var table = self.createTable(div, data);

				// content
				var td = table.find('td:nth-child(2)');

				var title = td.child('div', 'title');
				title.text(data.title);
				window.setTimeout(function()
				{
					title.IMuEllipsis();
				}, 10);
				title.bind('click', function()
				{
					self.widget.recordSelected(data.rid, data.offset);
				});

				if (data.partyType && data.partyType.toLowerCase() == 'person')
				{
					if (data.birthDate)
					{
						var birth = td.child('div', 'details');
						birth.text(IMu.string('eparties-born') + ' ' + data.birthDate);
					}

					if (data.deathDate)
					{
						var death = td.child('div', 'details');
						death.text(IMu.string('eparties-died') + ' ' + data.deathDate);
					}
				}
				else if (data.partyType && data.partyType.toLowerCase() == 'organisation')
				{
					if (data.street)
					{
						var street = td.child('div', 'details');
						street.text(data.street);
					}

					var address = '';

					if (data.city)
						address += data.city;
					if (data.state)
					{
						if (address)
							address += ', ';
						address += data.state;
					}
					if (data.postcode)
					{
						if (address)
							address += ', ';
						address += data.postcode;
					}
					if (data.country)
					{
						if (address)
							address += ', ';
						address += data.country;
					}

					var addressTd = td.child('div', 'details');
					addressTd.text(address);
				}
			}
        }
    });
})(IMu.Themes.get('prague'));
