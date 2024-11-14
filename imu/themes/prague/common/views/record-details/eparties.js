(function(theme)
{
	theme.views.register('record-details',
	{
		_source: 'prague/common/record-details/eparties',

		all:
		{
			showPartyDetails: function(owner, data)
			{
				var self = this;

                var partyType = data.partyType;
                if (! partyType)
                    return;

                self.section = {};
                self.section.summary = owner.child('div', 'summary');
                self.section.summary = self.showMultimedia(self.section.summary, data);
                self.section.details = owner.child('div', 'supplementary');
                    
                partyType = partyType.toLowerCase();

                if (partyType == 'person')
                    self.showPersonParty(owner, data);
                else if (partyType == 'organisation')
                    self.showOrganisationParty(owner, data);

                self.removeEmptySections(self.section.summary);
                self.removeEmptySections(self.section.details);
			},

			showPersonParty: function(owner, party)
			{
				var self = this;

                /* Section: Summary
                */
                var section = self.section.summary;

                var table = self.addSection(section);

                self.addDetail('eparties-nationality',
                    party.nationality, table);
                self.addDetail('eparties-birth-place',
                    party.birthPlace, table);
                self.addDetail('eparties-birth-date', party.birthDate, table);
                self.addDetail('eparties-death-date', party.deathDate, table);
               
                section = self.section.details;

                var table = self.addSection(section);

                self.addDetail('eparties-role',
                    party.role, table);
                self.addDetail('eparties-organisation',
                    party.organisation, table);

                table = self.addSection(section,
                    'eparties-section-contact');

                var address = [];
                if (party.city)
                    address.push(party.city);
                if (party.state)
                    address.push(party.state);
                if (party.postcode)
                    address.push(party.postcode);
                if (party.country)
                    address.push(party.country);
                self.addDetail('eparties-address', address, table);
                
                self.addDetail('eparties-phone-business', party.business, table);
//                self.addDetail('eparties-phone-home', party.home, table);
//                self.addDetail('eparties-phone-mobile', party.mobile, table);
//                self.addDetail('eparties-fax', party.fax, table);

                self.addDetail('eparties-email', party.email, table);
                self.addDetail('eparties-web ', party.web, table);
			},

			showOrganisationParty: function(owner, party)
			{
				var self = this;

                var div;
                var table;
                var prompts, values, tableOwner;

                /* Section: Summary
                */
                var section = self.section.summary;
//                self.section.summary = section = self.showMultimedia(section, party);

                table = self.addSection(section, 
                    'eparties-section-organisation-summary');

                section = self.section.details;

                table = self.addSection(section,
                    'eparties-section-contact');

                var address = [];
                if (party.street)
                    address.push(party.street);
                if (party.city)
                    address.push(party.city);
                if (party.state)
                    address.push(party.state);
                if (party.postcode)
                    address.push(party.postcode);
                if (party.country)
                    address.push(party.country);
                self.addDetail('eparties-address', address, table);

                self.addDetail('eparties-phone', party.business, table);
                self.addDetail('eparties-fax', party.fax, table);

                self.addDetail('eparties-email', party.email, table);
                self.addDetail('eparties-web', party.web, table);
			}
		}
	});
})(IMu.Themes.get('prague'));
