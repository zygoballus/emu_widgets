(function(theme)
{
    /* NOTE:
    **
    ** Module-specific code for the lightbox-viewer view should go in the
    ** appropriate file in the lightbox-viewer directory. For example,
    ** specific code for the Parties module should go in
    ** lightbox-viewer/eparties.js.
    **
    ** Common code belongs in this file.
    **
    ** AB - 11 April 2013
    */
    theme.views.register('lightbox-viewer', 'vertical-viewer',
    {
        _source: 'prague/client/lightbox-viewer',

        all:
        {
        }
    });
})(IMu.Themes.get('prague'));
