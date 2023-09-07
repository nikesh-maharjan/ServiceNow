var GlobalUtil = Class.create();
GlobalUtil.prototype = {
	initialize: function() {},
	
	updateFileName: function(id, currRecord, fileName, currTable) {
		try {
			var grCurrAttach = new GlideRecord('sys_attachment');
			grCurrAttach.addEncodedQuery('table_name=' + currTable + '^table_sys_id=' + currRecord);
			grCurrAttach.query();
			while (grCurrAttach.next()) {

				var grAttach = new GlideRecord('sys_attachment');
				grAttach.initialize();
				for (var i in grCurrAttach) {
					if (i == 'file_name') {
						grAttach.setValue('file_name', fileName + '-' + grCurrAttach.file_name);
					} else if (i == 'table_name') {
						grAttach.setValue('table_name', 'scope_bulk_export_attachments');
					} else if (i == 'table_sys_id') {
						grAttach.setValue('table_sys_id', id);
					} else {
						grAttach.setValue(i, grCurrAttach[i]);
					}
				}
				var attRec = grAttach.insert();
				var attDoc = new GlideRecord('sys_attachment_doc');
				attDoc.addQuery('sys_attachment', grCurrAttach.getValue('sys_id'));
				attDoc.query();
				while (attDoc.next()) {
					var attDocCopy = new GlideRecord('sys_attachment_doc');
					attDocCopy.initialize();
					attDocCopy.sys_attachment = attRec;
					attDocCopy.position = attDoc.position;
					attDocCopy.length = attDoc.length;
					attDocCopy.data = attDoc.data;
					attDocCopy.insert();
				}
			}
		} catch (err) {
			gs.error('Error ' + err.message);
		}
	},

	createDS: function(importTable, importSetTable) {
		var grDS = new GlideRecord('sys_data_source');
		grDS.initialize();
		grDS.type = 'File';
		grDS.format = 'Excel';
		grDS.sheet_number = 1;
		grDS.header_row = 1;
		grDS.file_retrieval_method = 'Attachment';
		//changes variables depending on the import table
		if (importTable == 'scope_bulk_import_requests') {
			grDS.name = ' Bulk Import';
			grDS.import_set_table_name = 'scope_bulk_import_requests';

		} else if (importTable == 'scope_import_table') {
			if (gs.nil(importSetTable)) {
				grDS.name = 'Table Bulk Import';
				grDS.import_set_table_name = 'scope_bulk_import_tables';
			} else if (importSetTable === "scope_table_bulk_update_ist") {
				grDS.name = 'Table Bulk Update Import';
				grDS.import_set_table_name = importSetTable;
			}
		}
		grDS.insert();
		return grDS.getValue('sys_id');
	},

	/** Delete Global record, data source
	 * @param {string} table - tablename
	 * @param {string} recordSysId - record sys_id in table
	 * @return {boolean} - true if the record was deleted otherwise false
	 */
	deleteGlobalRecord: function(table, recordSysId) {
		var arrayUtil = new global.ArrayUtil();
		var allowedTables = ["sys_data_source"];

		if (!arrayUtil.contains(allowedTables, table)) {
			throw ("Record in table " + table + " is in Global scope and is not allowed to be deleted from scope.");
		}

		var gr = new GlideRecord(table);
		if (gr.get(recordSysId)) {
			return gr.deleteRecord();
		}
	},

	runSchedImport: function(dataSourceID, importTable) {
		var grSchedImport = new GlideRecord('scheduled_import_set');

		if (importTable == 'scope_bulk_import_requests') {
			if (grSchedImport.get(gs.getProperty('scope.Scheduled_Import'))) {
				grSchedImport.setValue('data_source', dataSourceID);
				grSchedImport.update();
				gs.executeNow(grSchedImport);
			}
		} else if (importTable == 'scope_import_t4') {
			if (grSchedImport.get(gs.getProperty('scope.Sam_Scheduled_Import'))) {
				grSchedImport.setValue('data_source', dataSourceID);
				grSchedImport.update();
				gs.executeNow(grSchedImport);
			}
		}
	},

	copyAttachment: function(targetTable, targetSysId, sourceTable, sourceSysId, newFilenamePrefix) {
		try {
			var grCurrAttach = new GlideRecord('sys_attachment');
			grCurrAttach.addEncodedQuery('table_name=' + sourceTable + '^table_sys_id=' + sourceSysId);
			grCurrAttach.query();
			while (grCurrAttach.next()) {

				var grAttach = new GlideRecord('sys_attachment');
				grAttach.initialize();
				for (var i in grCurrAttach) {
					if (i == 'file_name') {
						grAttach.setValue('file_name', newFilenamePrefix + '-' + grCurrAttach.file_name);
					} else if (i == 'table_name') {
						grAttach.setValue('table_name', targetTable);
					} else if (i == 'table_sys_id') {
						grAttach.setValue('table_sys_id', targetSysId);
					} else {
						grAttach.setValue(i, grCurrAttach[i]);
					}
				}
				var attRec = grAttach.insert();
				var attDoc = new GlideRecord('sys_attachment_doc');
				attDoc.addQuery('sys_attachment', grCurrAttach.getValue('sys_id'));
				attDoc.query();
				while (attDoc.next()) {
					var attDocCopy = new GlideRecord('sys_attachment_doc');
					attDocCopy.initialize();
					attDocCopy.sys_attachment = attRec;
					attDocCopy.position = attDoc.position;
					attDocCopy.length = attDoc.length;
					attDocCopy.data = attDoc.data;
					attDocCopy.insert();
				}
			}
		} catch (err) {
			gs.error('AFACT GlobalUtil.copyAttachment: ' + err.message);
		}
	},

	type: 'GlobalUtil'
};