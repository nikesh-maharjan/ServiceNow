var AttachmentUtil = Class.create();
AttachmentUtil.prototype = {
    initialize: function() {},

    /** Note this function uses recursion
    @param {string} table - tablename
    @param {string} recordSysId - sys_id in table
    @return {number} count - Total number of attachment count
    */
    getAttachmentCount: function(table, recordSysId) {
        var count = 0;
        var getRec = new GlideRecord(table);

        // get attachments for each record in table
        var ga = new GlideAggregate("sys_attachment");
        ga.addAggregate("COUNT");
        ga.addQuery("table_name", table);
        ga.addQuery("table_sys_id", recordSysId);
        ga.query();
        if (ga.next()) {
            count += Number(ga.getAggregate("COUNT"));
			// gs.info("Table: " + table + " Record: " + recordSysId + " Count: " + count);
        }

        // base case for recursion
        if (table === "scope_activity_tracker" || table === "scope_t4_comment") {
            return count;
        }

        if (table === "scope_t3") {
            var grTrackerRec = new GlideRecord('scope_activity_tracker');
            grTrackerRec.addEncodedQuery('active=true^t3=' + recordSysId);
            grTrackerRec.query();
            while (grTrackerRec.next()) {
                count += Number(this.getAttachmentCount(grTrackerRec.getTableName(), grTrackerRec.getUniqueValue()));
            }
        } else if (table === "scope_t4") {
            var grComment = new GlideRecord('scope_t4_comment');
            grComment.addEncodedQuery('t4=' + recordSysId);
            grComment.query();
            while (grComment.next()) {
                count += Number(this.getAttachmentCount(grComment.getTableName(), grComment.getUniqueValue()));
            }
        }

        return count;
    },

	/** Note Updates attachment count
    @param {GlideRecord} gr - GlideRecord
    @param {string} fieldName - fieldname in GlideRecord that holds attachment count
    @return {number} attachmentCount - Total number of attachment count
    */
    updateAttachmentCount: function(gr, fieldName, attachmentCount) {
		if (!gr.isValidRecord()) {
			throw "GlideRecord was not returned by the query/get record operation.";
		}
		
		if (!gr.isValidField(fieldName)) {
			throw "Field: " + fieldName + " is not defined in the current GlideRecord table: " + gr.getTableName();
		}

		gr.setValue(fieldName, attachmentCount);
		gr.update();
    },
	
	/** Returns the sysId of the latest created attachment on a record
	 * 
	 */
	getLatestAttachmentSysId: function(tableName, tableSysId) {
		var gr = new GlideRecord("sys_attachment");
		gr.orderByDesc('sys_created_on');
		gr.addQuery("table_name", tableName);
		gr.addQuery("table_sys_id", tableSysId);
		gr.setLimit(1);
		gr.query();
		if (gr.next()) {
			return gr.getUniqueValue();
		}
		return "";
	},
	
	/**
	* Copies attachment by sys Id to target Record
	* returns sysId of new attachment record
	*/
	copySpecificAttachmentBySysId: function(recipientTable, recipientSysId, attachmentSysId) {
		var recipientGr = new GlideRecord(recipientTable);
		if (!recipientGr.get(recipientSysId)) {throw "Cannot find Recipient record for copying attachment";}
		
		var donorAttGr = new GlideRecord("sys_attachment");
		if (!donorAttGr.get(attachmentSysId)) {throw "Cannot find source attachment for copying";}
		
		var gsa = new GlideSysAttachment();
		var newAttachmentSysId = gsa.writeContentStream(recipientGr, donorAttGr.getValue("file_name"), donorAttGr.getValue("content_type"), gsa.getContentStream(attachmentSysId));
		return newAttachmentSysId;
	},

    fixCopyAttachment:function(id, tableName) {
		var gr = new GlideRecord("sys_attachment");
		gr.orderByDesc('sys_created_on');
		gr.addQuery("table_name", id);
		// gr.addQuery("table_sys_id", tableSysId);
		gr.setLimit(1);
		gr.query();
		if (gr.next()) {
			gr.table_name = tableName;
			gr.update();
		}
	},

    type: 'AttachmentUtil'
};




























