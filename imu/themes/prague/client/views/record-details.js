(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for record-details should go in the
    ** appropriate file in the record-details directory. For example,
    ** specific code for the Catalogue module should go in
    ** record-details/ecatalogue.js.
    **
    ** Common code belongs in this file.
    **
    */
    theme.views.register('record-details',
    {
        _source: 'prague/client/record-details',

        all:
        {
            _construct: function()
            {
                var self = this;
                self._super.apply(self, arguments);
                self.shiwSaveMultimedia = undefined;

                self.museumLocationsList = undefined;
                var file = 'imu/shared/client/images/lists/museum-location.txt';
                $.get(file, function(text)
                {
                    self.museumLocationsList = text.split("\n");
                });

                self.caseNamesList = undefined;
                file = 'imu/shared/client/images/lists/case-name.txt';
                $.get(file, function(text)
                {
                    self.caseNamesList = text.split("\n");
                });
            },

            addLocalityTable: function(prompts, values, owner)
            {
                var self = this;

                if (! values)
                    return undefined;
                    
                function add()
                {
                    var count = 0;
                    var index = undefined;
                    var tr = [];
                    var td;
                    
                    for (var i = 0; i < values.length; i++)
                    {
                        if (values[i])
                        {
                            count++;
                            if (count > 4)
                            {
                                index = count - 5; 
                                td = tr[index].child('td', 'prompt');
                                td.text(IMu.string(prompts[i]) + ':');
                                td = tr[index].child('td', 'value');
                                td.text(values[i]);
                            }
                            else
                            {
                                tr[i] = owner.child('tr');
                                td = tr[i].child('td', 'prompt');
                                td.text(IMu.string(prompts[i]) + ':');
                                td = tr[i].child('td', 'value');
                                td.text(values[i]);
                            }
                        }
                    }

                    return td;
                }

                var td;
                td = add();

                return td;
            }
        }
    });
})(IMu.Themes.get('prague'));
