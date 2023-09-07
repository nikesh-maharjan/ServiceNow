var ImportSetUtil = Class.create();
ImportSetUtil.prototype = {
    initialize: function() {
    },

	/**
	* Description: Utility to create Import Set
	* @param {string} dataSourceSysId - Data Source Name to be used for Import Set
	* @param {debug} boolean - debug flag
	* Returns: glideRecord of Created Import Set if successful otherwise returns null
	* @throw {string} : any error
	*/
	createImportSet: function(dataSourceSysId, debug) {
		var grDatasource = new GlideRecord('sys_data_source');
		if (grDatasource.get('sys_id',dataSourceSysId)) {
			debug ? gs.info("Data Source Found : " + grDatasource.getDisplayValue()) : "";
			var grImportSet = new GlideRecord('sys_import_set');
			grImportSet.data_source = grDatasource.getUniqueValue();
			grImportSet.short_description = "Import Set for Data Source: " + grDatasource.getDisplayValue() 
				+ "\r\nType: " + grDatasource.type.getDisplayValue() 
				+ "\r\nFormat: " + grDatasource.format.getDisplayValue();
			grImportSet.table_name = grDatasource.getValue('import_set_table_name');
			var importSetSysId = grImportSet.insert();
			if (importSetSysId) {
				return grImportSet;
			}
		} else {
			"Internal Error: Invalid Data Source";
		}
	},

	/**
	* Description: Utility to create Import Set Rows
	* @param {string} importSetSysId - Import Set Sys Id
	* Returns: Import Row Sys Id
	*/
	createImportSetRow: function(importSetSysId, parser, rowNum, columnArr) {
		var errorMsgArr = [];

		var grImportSet = new GlideRecord('sys_import_set');
		if (grImportSet.get(importSetSysId)) {
			var importSetTableName = grImportSet.getValue("table_name");
			var row = parser.getRow();
			
			var grImportSetRow = new GlideRecord(importSetTableName);
			grImportSetRow.initialize();
			grImportSetRow.sys_import_set = importSetSysId;
			grImportSetRow.sys_import_row = rowNum;
			for (var i = 0; i < columnArr.length; i++) {
				grImportSetRow.setValue(columnArr[i].name, row[columnArr[i].excel_header]);
			}
			var importRowSysId = grImportSetRow.insert();
			if (!importRowSysId) {
				throw errorMsgArr.push("Row " + rowNum + " : Import Failed. Please contact system administrator" );
			}
			return importRowSysId;
		}
	},

	/**
	* Description: Utility to Transform Import Set
	* @param {string} importSetSysId - Import Set Sys Id
	* Returns: Array of any Logs
	*/
	transformImportSet: function(importSetSysId) {
		var grImportSet = new GlideRecord('sys_import_set');
		if (grImportSet.get(importSetSysId)) {
			// update Import set Status
			// grImportSet.setValue('state','loaded');
			// grImportSet.update();

			var importSetRun = new GlideImportSetRun(importSetSysId);
			var transformer = new GlideImportSetTransformer();
			transformer.setImportSetID(importSetSysId);
			transformer.setImportSetRun(importSetRun);
			transformer.transformAllMaps(grImportSet);
			
			var logArr = []
			var grLog = new GlideRecord("import_log");
			grLog.addQuery("run_history", importSetRun.getImportSetRunSysID());
			grLog.orderBy("message");
			grLog.query();
			while (grLog.next()) {
				logArr.push(grLog.getValue("message"));
			}
			return logArr;
		}
	},

    type: 'ImportSetUtil'
};