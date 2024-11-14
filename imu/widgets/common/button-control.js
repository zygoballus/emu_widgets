(function()
{
    IMu.Widgets.add('button-control', 'control',
    {
        _construct: function()
        {
            var self = this;

            self._super.apply(this, arguments);
            self.classes.push('imu-button-control');

            self.registerOptions
            ({
                name: undefined,
                onClick: undefined,
                onIMuShow: undefined
            });

            self.disabled = false;
            self.states = [];
            self.currentState = undefined;
            self.stateMap = {};

            IMu.Events.bind('imu-show', function()
            {
                if (self.options.onIMuShow !== undefined)
                    self.options.onIMuShow();
            });
        },

        addState: function(args)
        {
            var self = this;

            var index = self.states.length;

            if (args.name !== undefined)
               self.stateMap[args.name] = index;

            self.states[index] = new State(this, index, args); 

            if (self.currentState === undefined)
                self.currentState = index;

            return self.states[index];
        },

        disable: function(toggle)
        {
            if (toggle === undefined)
                toggle = true;

            this.disabled = toggle;
            if (this.view)
                this.view.disable(toggle);
        },

        doClick: function()
        {
            if (! this.disabled)
                this.onClick();
        },

        getState: function()
        {
            return this.currentState;
        },

        setState: function(state)
        {
            var self = this;

            if (! IMu.Type.isNumber(state))
            {
                state = self.stateMap[state];
                if (state === undefined)
                    return;
            }

            if (self.currentState != state &&
                self.states[state] !== undefined)
            {
                self.currentState = state;
                self.view.setState(state);
            }
        },

        /* Private
        */
        onClick: function()
        {
            var self = this;

            if (self.disabled)
                return;

            var i = self.currentState;
            if (self.states[i] && self.states[i].onClick !== undefined)
                self.states[i].onClick.call(self, i);
        },

        setOptions: function()
        {
            var self = this;
            self._super.apply(this, arguments);
        }
    });

    var State = IMu.Class.create
    ({
        _construct: function(owner, index, args)
        {
            this.owner = owner;
            this.index = index;
            
            this.name = undefined;
            this.classes = undefined;

            /* layout must be a single or array of objects containing:
            ** *A type
            ** *A value
            **
            ** eg
            ** layout:
            ** [
            **  {
            **      type: 'image',
            **      value: 'icon.png'
            **  }
            ** ]
            */
            this.layout = undefined;
            this.onClick = undefined;

            if (args !== undefined)
            {
    
                if (args['onClick'])
                    this.onClick = args['onClick'];

                if (args['layout'])
                    this.layout = args['layout'];

                if (args['name'])
                    this.name = args['name'];

                if (args['classes'])
                {
                    this.classes = args['classes'];
                    if (! IMu.Type.isArray(this.classes))
                        this.classes = [ this.classes ];
                }
            }
        }
    });
})();
