IMu.Request =
{
    defaultContext: undefined,
    defaultPort: undefined,

	getURL: function(name, addTheme, addLang)
	{
		var url = window.location.href;
		url = url.replace(/#.*$/, '');
		url = url.replace(/\?.*$/, '');
		url = url.replace(/\/[^\/]*$/, '');
		url += '/' + IMu.path + '/request.php';
		if (name)
			url += '?request=' + name;
		if (addTheme)
			url += '&theme=' + IMu.Themes.current.name;
		if (addLang)
			url += '&lang=' + IMu.Languages.current.code;
		return url;
	}
};
