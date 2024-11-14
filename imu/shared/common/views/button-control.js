(function(theme)
{
    theme.views.register('button-control',
    {
        _source: 'shared/common/button-control',

        all:
        {
            _construct: function()
            {
                this._super.apply(this, arguments);
                this.states = [];
            },

            _create: function()
            {
                this._super.apply(this, arguments);
                
                var self = this;

                var owner = self.widget.owner;
                self.button = owner.child('button');
                if (self.widget.options.name)
                {   
                    var name = self.widget.options.replace(/ /g, "-");
                    owner.addClass(name);
                }
                self.button.click(function() { self.onClick() });

                var states = self.widget.states;
                for (var i = 0; i < states.length; i++)
                    self.addState(states[i]);
            },
                
            addState: function(state)
            {
                var button = this.button;
                var table = button.child('div', 'table');
                table.css
                ({
                    "table-layout": "fixed",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none"
                });

                var index = this.states.length;
                table.addClass('state state-' + (index+1));
                if (state.name !== undefined)
                    table.addClass(state.name.replace(/ /g, "-"));
                
                this.states[index] = table;
                this.states[index].widget = this.widget.states[index];
                this.widget.states[index].view = this.states[index];

                var tr = table.child('div', 'table-row');

                var layout = state.layout;
                if (! IMu.Type.isArray(layout))
                    layout = [ layout ];

                for (var i = 0; i < layout.length; i++)
                {
                    var elem = layout[i];

                    if (elem === undefined)
                    {
                        tr.child('div', 'table-cell empty-element');
                        break;
                    }
                    if (elem['type'] === undefined || elem['value'] === undefined)
                        break;
                    
                    var cell = tr.child('div', 'table-cell ' + elem['type'] + '-element');
                    if (elem['name'] !== undefined)
                        cell.addClass(elem['name']);

                    var div = cell.child('div');
                    div.css(
                    {
                        position: 'relative',
                        top: '0',
                        width: '100%'
                    });
                    if (elem['type'] == 'text')
                        div.text(IMu.string(elem['value']));
                    else if (elem['type'] == 'image')
                    {
                        div.css('height', '100%');

                        var tbl = div.child('div', 'table');
                        tbl.css('table-layout', 'fixed');

                        var td = tbl.child('div',
                            'table-row').child('div', 'table-cell');
                        var graphic = td.child('div', 'graphic');
                        graphic.css(
                        {
                            bottom: '0',
                            left: '0',
                            position: 'absolute',
                            right: '0',
                            top: '0'
                        });
                        var img = graphic.child('img');

                        if (elem['value'] !== undefined)
                            img.attr('src', elem['value']);
                    }

                    if (this.widget.currentState != index)
                        table.css('display', 'none');
                }

                if (state.classes !== undefined)
                    for (var i = 0; i < state.classes.length; i++)
                        table.addClass(state.classes[i]);
            },

            disable: function(toggle)
            {
                //TODO:
                if (toggle || toggle === undefined)
                    this.widget.owner.addClass('disabled');
                else
                    this.widget.owner.removeClass('disabled');
            },

            setState: function(index)
            {
                if (this.states[index] === undefined)
                    return;
                
                for (var i = 0; i < this.states.length; i++)
                    this.states[i].css('display', 'none');
               this.states[index].css('display', 'table');

//               this.states[index].widget.onSelect();
            },

            // Private
            onClick: function()
            {
                this.widget.doClick();
            }
        }
    });
})(IMu.Themes.shared);
