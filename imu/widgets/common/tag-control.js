/*!
** Tag input control.
**
** Inherits form `text-control <./text-control.html>`_.
**
** This widget displays 'tags' applied to a record.  It allows the lookup and
** addition of suggested tags to apply by the user.
**
** When using this widget there are 3 types of tags to consider.
**
**- Approved:
**   Tags saved in the record's 'approved tags' field (eg approved by the
**   moderator of the site)
**
**- Candidate:
**   Tags saved in the record's 'candidate tags' field (eg all the tags that
**   have been submitted to the moderator by all users but haven't been
**   approved yet)
**
**- Suggested:
**   Tags currently suggested by the user but not submitted to the moderator
**   for approval (and not saved in EMu)
**
** Approved and Candidate tags are stored in different fields within the
** EMu record.
**
** Suggested tags only exist on the users display unless the choose to 'submit'
** them.  Once submitted they become Candidate terms awaiting approval.
**
** @since 2.0
**
*/

/*!
** @example  A Typical Tag widget that displays Approved tags and the users
** 'suggested' tags
** @code
**   <html>
**     ...
**     <div id="my_tag-control-div"/>
**     ...
**     <script>
**       ...
**       ...
**      // create widget
**      jQuery('#my_tag-control-div').IMu('tag-control',  {
**            hint: 'Please enter some tags',
**            suggest:
**            {
**                type: 'lookup',
**                name: 'Content Analysis'
**            }
**      });
**      ...
**      // set the record the tags apply to
**      tagControls[i].setRecordToTag(
**            module,
**            irn,
**            'WebApprovedTags_tab',
**            'WebCandidateTags_tab' );
**       ...
** @endcode
**
** @example A tag control that doesn't allow user's to suggest tags but does
**    display 'candidate' tags (you would probably not need this often but it
**    could be useful when testing or for an administrator/moderator to view of
**    the tags etc).
**
** @code
**     <div id="my_tag-control-div"/>
**     ...
**     <script>
**       ...
**       ...
**      // create widget
**      jQuery('#my_tag-control-div').IMu('tag-control',  {
**          readonly: true
**          showCandidateTags: true,
**      });
**      ...
**      // set the record the tags apply to
**      tagControls[i].setRecordToTag(
**            module,
**            irn,
**            'WebApprovedTags_tab',
**            'WebCandidateTags_tab' );
**       ...
**   ...
** @endcode
**
*/

IMu.Widgets.add('tag-control', 'text-control',
{
    _construct: function()
    {
        this._super.apply(this, arguments);
        this.classes.push('imu-tag-control');
        this.registerOptions
        ({
            /*!
            ** Character that will cause text entry to terminate and the
            ** currently typed value to be added as a suggestion.  Default:
            ** undefined.  If undefined there will be no auto entry if a
            ** special character is typed.
            */
            delimiter: undefined,

            /*!
            ** Action to call on pressing enter key.  Default is the widget's
            ** doShowPotentialTag method.  This normally should not be changed.
            */
            onEnter: this.doShowPotentialTag,

            /*!
            ** Action to call for every character entered.  Default: the
            ** widget's protected autoShowPotential method.  This normally
            ** should not be changed.
            */
            onChange: this.autoShowPotential,

            /*!
            ** Any callback to use after the control's update method is called.
            ** Default: undefined.
            */
            onUpdate: undefined,

            /*!
            ** Display approved tags with control.
            ** Default: false.
            */

            showApprovedTags: false,
            /*!
            ** Display candidate (unapproved) tags with control.  Default: false.
            */
            showCandidateTags: false
        });

        this.approvedField = undefined;
        this.approvedTags = [];
        this.candidateField = undefined;
        this.candidateTags = [];
        this.key = undefined;
        this.module = undefined;
        this.suggestedTags = [];
    },

    /*!
    ** Inform user of a status condition they need to know about.
    **
    ** It is up to the view to decide what to do with the status and how to
    ** inform the user.
    **
    ** @param status string
    **   the status condition to alert the user about (eg 'imu-has--exploded')
    ** @param data string
    **   any additional data about the status to display
    **
    ** @returns null
    */
    doAlertUser: function(status, data)
    {
        var self = this;
        self.view.showUserMessage(status, data);
    },


    /*!
    ** Remove a tag from the current suggested tag list.
    **
    ** @param value string
    **   a tag to add to remove from the current list of suggestions.
    **
    ** @returns null
    */
    doDropSuggestedTag: function(value)
    {
        var self = this;

        var tagList = [];
        jQuery.each(self.getSuggestedTags(), function(idx, tag) {
                if (value.toLowerCase() != tag.toLowerCase())
                    tagList.push(tag);
        });
        self.setSuggestedTags(tagList);
        self.view.redrawTagDisplay();
    },


    /*!
    ** Take current input item and add it as a possible tag to the list.
    ** NB suggested tags are not yet added to the record, they are just the
    ** current user suggestions.
    **
    ** @returns null
    */
    doShowPotentialTag: function()
    {
            var self = this;

            var enteredTag = self.getValue();
            if (enteredTag)
            {

                var addToList = true;

                // if already in our suggested list, don't add a duplicate
                jQuery.each(self.suggestedTags, function(idx, value) {
                    if (value.toLowerCase() == enteredTag.toLowerCase())
                        addToList = false;
                });

                // if already entered in authorised tags, don't enter it
                jQuery.each(self.approvedTags, function(idx, value) {
                    if (value.toLowerCase() == enteredTag.toLowerCase())
                    {
                        addToList = false;
                        self.doAlertUser('tag-control-tag-already-used',
                            '"' + value + '"');
                    }
                });

                if (addToList)
                {
                    self.suggestedTags.push(enteredTag);
                    self.view.redrawTagDisplay();
                }

                self.doRefreshData();

            }
    },

    /*!
    ** Refresh the tag widget to reflect any changes to the underlying EMu
    ** record or the widget's state or configuration.
    **
    ** @returns null
    */
    doRefreshData: function()
    {
        var self = this;

        /* look up the record and get its current applied tags */
        if ((self.module != undefined) && (self.key != undefined))
        {

            /* look up the record and get its current applied tags */
            var searchTerm = self.module + '.' + self.key;
            var search = new IMu.Request.Search();
            search.findKey(searchTerm, function(hits)
            {
                if( hits.total == 0)
                {
                    self.approvedTags = [];
                    self.candidateTags = [];
                    self.view.redrawTagDisplay();
                    return
                }

                search.fetchMany([{offset: 0, count: 1}],
                        [self.approvedField, self.candidateField],
                        function(result) {
                            var row = result.rows[0];
                            self.approvedTags = row[self.approvedField];
                            self.candidateTags = row[self.candidateField];
                            self.view.redrawTagDisplay();
                        }
                );
            });
        }
    },

    /*
    ** Take an array of tags and use these as the currently suggested list of
    ** tags for the object.
    **
    ** @param tags array
    **     the tags to make the suggested list
    **
    ** @returns null
    */
    setSuggestedTags: function(tags)
    {
            var self = this;
            self.suggestedTags = tags;
    },


    /*!
    ** Set the record that the tag control will access and update.
    **
    ** Be aware - if the widget is not readonly, the installation should be
    ** configured carefully so the exposed candidateTerm field is writeable but
    ** other fields that hold more sensitive data are not.
    **
    ** @param module string
    **    eg 'ecatalogue'
    ** @param key integer
    **    the irn eg 12345
    ** @param approvedField string
    **    the field the approved tags will be located in
    ** @param candidateField string
    **    the field the candidate tags will be located in
    **
    ** @returns null
    */
    setRecordToTag: function(module, key, approvedField, candidateField)
    {
        var self = this;
        self.module = module;
        self.key = key;
        self.approvedField = approvedField;
        self.candidateField = candidateField;
        // update the display etc
        self.doRefreshData();
    },

    // Protected Methods

    /*
    ** Protected Method. Scrutinise text and if it ends with delimiter, move
    ** that value to the suggested tag list.
    **
    ** @param value string
    **    
    **
    */
    autoShowPotential: function(value)
    {
        var self = this

        if (self.options.delimiter != undefined)
        {
            var pattern = new RegExp(self.options.delimiter + '$');
            if (value.match(pattern))
            {
                value = value.replace(pattern, '');
                if (value.length > 0)
                {
                    self.setValue(value);
                    self.doShowPotentialTag();
                    self.view.tidyUpdateControls();
                }
            }
        }
    },

    /*!
    ** Protected Method. Get the approved tags stored for the object the tag
    ** widget is working with.
    **
    ** @returns array of string
    */
    getApprovedTags: function()
    {
            var self = this;
            return self.approvedTags;
    },

    /*!
    ** Protected Method. Get the Candidate tags stored for the object the tag
    ** widget is working with.
    **
    ** @returns array of string
    */
    getCandidateTags: function()
    {
            var self = this;
            return self.candidateTags;
    },

    /*!
    ** Protected Method. Get the user's currently suggested list of tags.
    **
    ** @returns array of string
    */
    getSuggestedTags: function()
    {
            var self = this;
            return self.suggestedTags;
    },


    /*!
    ** Protected Method. Take the suggested tag list and add each of those tags to the record's 
    ** candidate tag list (ie tags that still need approval but are saved in
    ** the EMu record until they are checked)
    **
    ** @returns null
    */
    updateTags: function()
    {
        var self = this;

        // make sure we have all the tags that have been suggested
        self.doShowPotentialTag();

        // ignore an empty suggestion list
        if (self.suggestedTags.length == 0)
            return;

        var emodule = self.module;
        var module = new IMu.Request.Module(emodule);

        // self.key is the irn of the catalogue record we want to attach
        // a tag to
        module.findKey(self.key, function(hits)
        {
            if (hits == 0)
            {
                var key = emodule + '.' + self.key;
                IMu.log('WARNING!: cannot find object to add tags to: ' + key);
                self.doAlertUser('tag-control-cannot-find-object-error', key);
                return;
            }

            /* make sure we don't add tags that have already been attached to
             * the item.
             */
            
            // weed out any already that are candidates
            var tagsToAdd = [];
            var candidateTags = self.candidateTags;
            jQuery.each(self.suggestedTags, function(idx, suggestion) {
                var addTag = true;
                jQuery.each(candidateTags, function(idx, candidateTag) {
                    if (candidateTag.toLowerCase() == suggestion.toLowerCase())
                        addTag = false;
                });
                if (addTag)
                    tagsToAdd.push(suggestion);
            });

            // Then weed out any approved tags
            var newTags = [];
            var approvedTags = self.approvedTags;
            jQuery.each(tagsToAdd, function(idx, tagToAdd) {
                var addTag = true;
                jQuery.each(approvedTags, function(idx, approvedTag) {
                    if (approvedTag.toLowerCase() == tagToAdd.toLowerCase())
                        addTag = false;
                });
                if (addTag)
                        newTags.push(tagToAdd);
            });

            if (newTags.length == 0)
            {
                // pretend we have updated the record - the user doesn't need
                // to know their suggestion(s) have already been suggested.
                self.doAlertUser('tag-control-update-success', '');
                self.doRefreshData();
            }
            else
            {
                // set an action in case update returns error (hopefully never
                // happens but just in case)
                module.onError = function(err) { 
                    IMu.log('WARNING!: error updating object tag data' + err.id);
                    self.doAlertUser('tag-control-update-error', err.id);
                };

                // add new never used before terms to our known candidate list
                self.candidateTags = self.candidateTags.concat(newTags);

                // re-insert that list in the EMu object record
                var field = self.candidateField;
                var columns = [ field ];

                var values = {};
                values[field] = self.candidateTags

                module.update('start', 0, 1, values, columns, function(data)
                {
                    self.doAlertUser('tag-control-update-success', '');
                    self.doRefreshData();
                });
            }
        });

        if (self.options.onUpdate)
           self.options.onUpdate(); 
    }

});
