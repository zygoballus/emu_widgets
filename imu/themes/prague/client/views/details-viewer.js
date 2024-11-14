(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the details-viewer view should go in the
    ** appropriate file in the details-viewer directory. For example,
    ** specific code for the Catalogue module should go in
    ** details-viewer/ecatalogue.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
	theme.views.register('details-viewer',
	{
        _source: 'prague/client/details-viewer',

		all:
		{
		}
	});
})(IMu.Themes.get('prague'));
