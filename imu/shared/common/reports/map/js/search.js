function getURLParams()
{
    var st = document.location.search;
    st = st.split("+").join(" ");

    var params = {};
    var args = '';
    var re = /[?&]?([^=]+)=([^&]*)/g;
    while (args = re.exec(st))
    {
        params[decodeURIComponent(args[1])] = decodeURIComponent(args[2]);
    }
    return params;
}

/*
** Retrieve search results from a saved set on the database server
*/
function runStandardSearch(mapWidget, labelName)
{
    var params = getURLParams();
    var set = params['set'];
    var module = params['module'];
    if (set != undefined)
    {
        var backendSearch = new IMu.Request.Search();
        backendSearch.symbol = 'circle';
        backendSearch.searchSavedSet(set, module, function(hits)
            {
                        backendSearch.labelName = labelName;
                        mapWidget.showSearch(backendSearch);
             }
         );
    }
 }
