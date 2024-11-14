IMu.Terms = IMu.Class.create
({
    _construct: function(kind)
    {
        if (! kind)
            kind = 'and';
        else
            kind = kind.toLowerCase();
        if (kind != 'and' && kind != 'or')
            throw new IMu.Error('TermsIllegalKind', kind);
        this.kind = kind;
        this.list = [];
    },

    getKind: function()
    {
        return this.kind;
    },

    getList: function()
    {
        return this.list;
    },

    add: function(name, value, op)
    {
        var term = [name, value, op];
        this.list.push(term);
    },

    addTerms: function(kind)
    {
        var child = new IMu.Terms(kind);
        this.list.push(child);
        return child;
    },

    addAnd: function()
    {
        return this.addTerms('and');
    },

    addOr: function()
    {
        return this.addTerms('or');
    },

    toArray: function()
    {
        var result = [];
        result[0] = this.kind;

        var list = [];
        for (var i = 0; i < this.list.length; i++)
        {
            var term = this.list[i];
            if (term instanceof IMu.Terms)
                term = term.toArray();
            list.push(term);
        }
        result[1] = list;

        return result;
    }
});
