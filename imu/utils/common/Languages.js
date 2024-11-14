IMu.Languages =
{
	registered: {},
	current: undefined,

	register: function(code, dir, name, altCode)
	{
		var lang = new IMu.Language(code, dir, name, altCode);
		this.registered[code] = lang;
		if (! this.current)
			this.current = lang;
		return lang;
	},

	select: function(code)
	{
		var lang = this.registered[code];
		if (! lang)
			throw new IMu.Error('LanguagesUnknownCode', code);

		this.current = lang;

        if (IMu.shown)
            IMu.Events.trigger('language-changed', this.current);
	}
};

IMu.Language = IMu.Class.create
({
	_construct: function(code, dir, name, altCode)
	{
		this.code = code;
		this.dir = dir;

		/* The name is a special string that does not need translation.
		** It is the name of the language in the language itself.
		*/
		this.name = name;

		/* Convenience values useful when setting css
		*/
		this.near = dir == 'ltr' ? 'left' : 'right';
		this.far = dir == 'ltr' ? 'right' : 'left';

        /* Convenience alternate code.
        ** This is helpful for codes such as en/en-GB and fr/fr-FR
        ** where the locale is redundant though may or maynot still be included.
        */
        this.altCode = altCode;
	}
});

/* IMPORTANT:
**
** - if adding languages/locales, be sure to include corresponding 
**  dist/common/globalize/cultures file
** - some locales that you may assume are interchangeable may have subtle
**  differences in globalize/cultures, for example en-GB and en-AU not only have
**  differing currency, but also differing date formats for some reason.
**  I have taken to commenting out the original format and rewriting it for 
**  consistency where appropriate.
**  Check thoroughly before adding!
*/
(function()
{
	IMu.Languages.register('ar', 'rtl', 'العربية');
	IMu.Languages.register('en', 'ltr', 'English', 'en-GB');
//	IMu.Languages.register('en-AU', 'ltr', 'English (Australia)');
//	IMu.Languages.register('en-CA', 'ltr', 'English (Canada)');
	IMu.Languages.register('en-US', 'ltr', 'English (United States)');
	IMu.Languages.register('fi', 'ltr', 'Suomi');
	IMu.Languages.register('fr', 'ltr', 'Français');
//	IMu.Languages.register('fr-BE', 'ltr', 'Français (Belgique)');
//	IMu.Languages.register('fr-CA', 'ltr', 'Français (Canada)');
//	IMu.Languages.register('fr-CH', 'ltr', 'Français (Suisse)');
//	IMu.Languages.register('fr-FR', 'ltr', 'Français (France)');
//	IMu.Languages.register('fr-LU', 'ltr', 'Français (Luxembourg)');
//	IMu.Languages.register('fr-MC', 'ltr', 'Français (Monaco)');
})();
