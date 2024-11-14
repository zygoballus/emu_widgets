(function(theme)
{
    theme.views.register('graph', 'control',
    {
        _source: 'shared/common/graph',

        all:
        {
            _construct: function()
            {

                var self = this;

                self._super.apply(self, arguments);

                self.svg = undefined;
            },
            _create: function()
            {
                var self = this;

                self._super();

                self.svg = self.widget.owner;

                var height = self.svg.height();
                if (!height || height < 100)
                {
                    var height = self.widget.getOption('height');

                    if (!height)
                        height = 300;
                    self.svg.height(height);
                }
            },

            drawBarChart: function(data,options)
            {
                var self = this;

                // var stringifyJSON = JSON.stringify(data);

                //var jsonData = JSON.parse(stringifyJSON);
                
                nv.addGraph(function()
                {
                    var chart = nv.models.discreteBarChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .staggerLabels(true)
                        .staggerLabels(data[0].values.length > 4)
                        .tooltips(true)
                        .showValues(true)
                        .transitionDuration(1200);

                    d3.select(self.svg.selector)
                        .datum(data)
                        .transition().duration(1200)
                        .call(chart);

                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            },

            drawPieChart: function(data,options)
            {
                var self = this;

                nv.addGraph(function()
                {
                    var chart = nv.models.pieChart()
                        .x(function(d)
                        {
                            return d.label
                        })
                        .y(function(d)
                        {
                            return d.value
                        })
                        .showLabels(true)
                        .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                        .labelType("percent");
                        //.valueFormat = d3.format('f');

                    d3.select(self.svg.selector)
                        .datum(data)
                        .transition().duration(1200)
                        .call(chart);

                    return chart;
                });
            }
        }
    });
})(IMu.Themes.shared);