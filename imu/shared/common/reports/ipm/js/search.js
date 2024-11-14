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
** A simple, hardwired standard test search for IPM test/demo pages
*/
function runStandardSearch(mapWidget, labelName)
{
    var params = getURLParams();
    var set = params['set'];
    var module = params['module'];
    if (set != undefined)
    {
        var backendSearch = new IMu.Request.Search();
        backendSearch.searchSavedSet(set, module, function(hits)
            {
                        backendSearch.labelName = labelName;
                        // we need something that tells IPM that this data is
                        // from etrapevents so it can be displayed differently
                        // from other search data
                        backendSearch.trapevents = true;
                        mapWidget.showSearch(backendSearch);
             }
         );
    }
 }
