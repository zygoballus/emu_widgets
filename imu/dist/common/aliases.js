(function()
{
    var alias = IMu.Importer.aliasList('OpenLayers');
    alias.addItem('dist/common/OpenLayers-2.12/OpenLayers.js');
    alias.addItem('dist/common/OpenLayers-2.12/CenteredCluster.js');
    alias.addItem('dist/common/ScaleBar.js');
    alias.ready(function()
    {
        IMu.log('Loaded {0} alias', this.name);
    });

    var alias1 = IMu.Importer.aliasList('d3');
    alias1.addItem('dist/common/d3/d3.js');
    alias1.addItem('dist/common/d3/nv.d3.js');
    alias1.addItem('dist/common/d3/nv.d3.css');
    alias1.ready(function()
    {
        IMu.log('Loaded {0} alias', this.name);
    });

})();
