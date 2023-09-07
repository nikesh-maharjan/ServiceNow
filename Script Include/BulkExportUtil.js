var BulkExportUtil = Class.create();
BulkExportUtil.prototype = {
    initialize: function() {
		this.globalUtil = new global.GlobalUtil();
	},

    generateRecord_v2: function(fixedQuery, payload, listQuery) {
        var targetTable = "scope_bulk_export_attachments";
		var gr = new GlideRecord(targetTable);
        gr.initialize();
        var targetSysId = gr.insert();

		if (gs.nil(payload.query) && payload.allRecordsSelected == false) {
			// query can be empty only when allRecordsSelected is true
			return targetSysId;
		}

		if (payload.selectionCount == 0) {
			return targetSysId;
		}

		if (gs.nil(payload.table)) {
			return targetSysId;
		}

		if (payload.table === "scope_import_t4") {
			// gs.info("NM List Query: " + listQuery);
			this.copyT1GroupAttachment(this.queryRecord(fixedQuery, payload, listQuery), targetTable, targetSysId);
		} else {
			this.copyDefaultAttachment(this.queryRecord(fixedQuery, payload, listQuery), targetTable, targetSysId);
		}

		return targetSysId;
    },

	copyDefaultAttachment: function(gr, targetTable, targetSysId) {
		while (gr.next()) {
			var sourceTable = gr.getTableName();
			var sourceSysId = gr.getUniqueValue();
			var sourceDisplayValue = gr.getDisplayValue();

			this.globalUtil.copyAttachment(targetTable, targetSysId, sourceTable, sourceSysId, sourceDisplayValue);
		}
	},

    queryRecord: function(fixedQuery, payload, listQuery) {
		var gr = new GlideRecordSecure(payload.table);
		gr.addEncodedQuery(fixedQuery);
		if (!gs.nil(payload.query)) { // AFACT-2706
			gr.addEncodedQuery(payload.query); // avoid using selected records, since there is also excepted Records that is populated when someone selects all and then uncheck one or more
		}
		if (!gs.nil(listQuery)) {
			gr.addEncodedQuery(listQuery);
		}
		gr.query();
		return gr;
	},

    type: 'BulkExportUtil'
};