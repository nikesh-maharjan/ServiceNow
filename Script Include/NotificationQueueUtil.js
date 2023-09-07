var NotificationQueueUtil = Class.create();
NotificationQueueUtil.prototype = {
    initialize: function() {
		this._arrayUtil = new global.ArrayUtil();
	},

    /** 
     * @param {string} type - should be a field in scope_notification_queue table 
	 * @param {fields} object - JSON object with t5ing fields, should be fields in scope_notification_queue table
	 *  {
			event_name: {String} - name of event, mandatory
			<type>: {string} - key should be param 1, value should be sys id of related record, mandatory
			l: {string} - Level 4 added after the update
			l_removed: {string} - Level 4 removed after the update
		}
    */
    enqueue: function(type, fields) {
        if (gs.nil(type)) {
            throw "mandatory and missing: type";
        }
        if (gs.nil(fields.event_name)) {
            throw "field is mandatory and missing: event_name";
        }
        if (gs.nil(fields[type])) {
            throw "field is mandatory and missing: " + type;
        }
        var grNQ = new GlideRecord("scope_notification_queue");
        if (!grNQ.isValidField(type)) {
            throw "NotificationQueueUtil > enqueue: " + type + " is not a valid field in table: " + grNQ.getTableName();
        }
		// gs.info("NM Fields: " + JSON.stringify(fields));

        // gs.info("NM " + JSON.stringify(fields));
        var gaNQ = new GlideAggregate("scope_notification_queue");
        gaNQ.addAggregate("COUNT");
        gaNQ.addQuery(type, fields[type]);
        gaNQ.addQuery("event_name", fields["event_name"]);
        gaNQ.addQuery("active", true);
        gaNQ.query();
        if (gaNQ.next() && gaNQ.getAggregate("COUNT") > 0) {
			if (grNQ.get(type, fields[type])) {
				var existingL = grNQ.getValue("fieldX");
				var existingLArr = gs.nil(existingL) ? [] : existingL.split(",");
				var existingLRemoved = grNQ.getValue("l_removed");
				var existingLRemovedArr = gs.nil(existingLRemoved) ? [] : existingLRemoved.split(",");
				
				var newLArr = [];
				var newLRemovedArr = this._arrayUtil.union(existingLRemovedArr);

				for (var field in fields) {
					// gs.info("NM Field: " + (field === "l"));
					if (field === "l") {
						// added level4 groups
						var addedLArr = gs.nil(fields["l"]) ? [] : fields["l"].split(",");
						newLArr = this._arrayUtil.union(existingLArr, addedLArr);
						grNQ.setValue("l", newLArr.join());
						
						// Update existing L_removed field when a L is removed and then added again
						// ((existingLRemovedArr + newLArr) - addedLArr)
						newLRemovedArr = this._arrayUtil.diff(newLRemovedArr, addedLArr);
						// gs.info("NM existingLRemovedArr: " + existingLRemovedArr.join());
						grNQ.setValue("l_removed", newLRemovedArr.join());
					} else if(field === "l_removed") {
						var removedLArr = gs.nil(fields["l_removed"]) ? [] : fields["l_removed"].split(",");
						// gs.info("NM removedLArr1: " + removedLArr.join())
						// existingLRemovedArr + newLRemovedArr + removedLArr
						newLRemovedArr = this._arrayUtil.union(newLRemovedArr, removedLArr);
						// gs.info("NM removedLArr2: " + removedLArr.join())
						grNQ.setValue("l_removed", newLRemovedArr.join());
						
						// Update existing Level_4 field when a Level 4 is removed
						newLArr = this._arrayUtil.diff(newLArr, removedLArr);
						grNQ.setValue("l", newLArr.join());
					} else {
						grNQ.setValue(field, fields[field]);
					}
				}
				grNQ.update();
			}
        } else {
            grNQ.initialize();
            for (var field in fields) {
                grNQ.setValue(field, fields[field]);
            }
            grNQ.insert();
        }
    },

	/*************
	//gr.addEncodedQuery('dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()
	* @param {string} eventName - name of event, mandatory
	* @param {type} type - should be a field in scope_notification_queue table
	*/
    dequeue: function(eventName, type) {
        var _userGroupUtil = new scope.UserGroupUtil();
        var recipientArr = [];

        var gr = new GlideRecord('scope_notification_queue');
        gr.addQuery("event_name", eventName);
        gr.addQuery("active", true);
        gr.query();
        while (gr.next()) {
            var level4 = gr.getValue("l");
            var level4Arr = gs.nil(level4) ? [] : level4.split(",");

            // Get Recipients
            recipientArr = this._arrayUtil.concat(recipientArr, _userGroupUtil.getGroupUsers_level4(level4Arr, gr[type].fieldA.fieldB, true));

            //delete record from queue
            gr.deleteRecord();
        }
		
		if (recipientArr.length > 0) {
			// remove duplicates 
			recipientArr = this._arrayUtil.unique(recipientArr);

			//call notification
			gs.eventQueue(eventName, gr[type].getRefRecord(), recipientArr);
		}
    },

    type: 'NotificationQueueUtil'
};