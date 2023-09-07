var ScheduledImport = Class.create();
ScheduledImport.prototype = {
    initialize: function() {
        this._arrUtil = new global.ArrayUtil();
        this._attachmentUtil = new scope.AttachmentUtil();
    },

    t3BulkUpdateImport: function(current) {
        var globalUtil = new global.GlobalUtil();
        var impTable = 'scope_import_t3';
        var importSetTable = "scope_t3_bulk_update_ist";

        // Set Import Status to in progress
        current.setValue('status', 'In Progress');
        current.update();

        //wait
        var ms = 500;
        var start = parseInt(new Date().getTime()) + ms;
        while (start > parseInt(new Date().getTime())) {
            // do nothing
        }

        // Create new Data Source, copy attachment from Import to the data source and create parser from the attachment
        var dataSourceID = globalUtil.createDS(impTable, importSetTable);
        var latestAttachmentSysId = this._attachmentUtil.getLatestAttachmentSysId("ZZ_YYscope_import_t3", current.getUniqueValue());
        var attachId = this._attachmentUtil.copySpecificAttachmentBySysId("sys_data_source", dataSourceID, latestAttachmentSysId);
        var parser = new sn_impex.GlideExcelParser();
        var attachment = new GlideSysAttachment();
        var attachmentStream = attachment.getContentStream(attachId);
        parser.parse(attachmentStream);

        // Validate column headers
        var columnsArr = [{
                "name": "u_t3_id",
                "excel_header": "t3 ID"
            },
            {
                "name": "field_2",
                "excel_header": "Field 2"
            }
        ];
        var excelHeaders = parser.getColumnHeaders();
        var validatationUtil = new scope.ValidationUtil();
        var requiredHeaderArr = ["t3 ID", "Status", "Field 2"];
        var isHeaderValid = validatationUtil.validateHeaders(excelHeaders, requiredHeaderArr);
        if (!isHeaderValid) {
            current.status = 'Invalid File';

            var errArr = validatationUtil.getErrorMessages();
            errArr.unshift("Header ");
            current.error = errArr.join(" | ");
            current.update();
            return;
        }

        // Create Import Set, Import Rows and Transform
        var grDataSource = new GlideRecord('sys_data_source');
        if (grDataSource.get(dataSourceID)) {
            var importUtil = new scope.ImportSetUtil();
            var grImportSet = importUtil.createImportSet(dataSourceID);
            var importSetSysId = grImportSet.getUniqueValue();

            // Stage data from Excel File into Import Table
            var errorMsgArr = [];
            var rowNum = 0;
            while (parser.next()) {
                try {
                    importUtil.createImportSetRow(importSetSysId, parser, rowNum, columnsArr);
                    rowNum++;
                } catch (ex) {
                    errorMsgArr.push(ex.toString());
                }
            }

            // import set loaded
            grImportSet.state = "loaded";
            grImportSet.update();

            // transform Import Set
            var logArr = importUtil.transformImportSet(importSetSysId);

            // Update Import t3 Status
            current.status = 'Complete';
            current.import_set = importSetSysId;
            current.fiscal_year = new DateUtil().getCurrentLocalFiscalYearSysId();
            current.error = logArr.join("\r\n");
            current.update();
        }
    },
    
    // Called from After BR, do not call from Before BR
    t6Import: function(id) {
        var grT6 = new GlideRecord('scope_import_t6');
        if (!grT6.get(id.toString())) {
            return;
        }

        // set to in progress
        grT6.setValue('status', 'In Progress');
        grT6.update();

        // copy import file
        var globalUtil = new global.GlobalUtil();
        var dataSourceID = globalUtil.createDS('scope_t6_import');
        var attachId = GlideSysAttachment.copy('ZZ_YYscope_import_t6', id, 'sys_data_source', dataSourceID);
        globalUtil.fixCopyAttachment('ZZ_YYsys_data_source', 'sys_data_source');

        attachId = attachId.toString();
        var attachSplit = attachId.split(',');
        var parser = new sn_impex.GlideExcelParser();
        var attachment = new GlideSysAttachment();
        var attachmentStream = attachment.getContentStream(attachSplit[1].toString());
        parser.parse(attachmentStream);

        //retrieve the column headers
        var headers = parser.getColumnHeaders();

        var validationResult = this.validate(parser, headers);
        // gs.info("NM validation error: " + validationResult.error_msg);
        if (!validationResult.has_error) {
            globalUtil.runSchedImport(dataSourceID, 'scope_t6_import');
            grT6.status = 'Complete';
            grT6.update();
        } else {
            grT6.status = 'Invalid File';
            grT6.error = validationResult.error_msg.join("\r\n");
            grT6.update();
        }
    },

    validate: function(parser, headers) {
        var obj = {
                has_error: false,
                error_msg: []
            },
            rowCount = 0;

        // Validate Header and Return if there is error
        var headerValidation = this.validateHeader(headers);
        if (headerValidation.has_error) {
            obj.has_error = true;
            obj.error_msg = headerValidation.error_msg;
            return obj;
        }

        // Validate Data Row
        while (parser.next()) {
            var row = parser.getRow();
            rowCount++;
            var validationResult = this.validateRow(row, headers, rowCount);
            if (validationResult.has_error) {
                obj.has_error = true;
                obj.error_msg.push(validationResult.error_msg.join(" | "));
            }
            isFirstRow = false;
        }
        return obj;
    },

    validateHeader: function(headers) {
        var obj = {
            has_error: false,
            error_msg: []
        };
        if (headers == null) {
            obj.error_msg.push("Headers are null.");
            obj.has_error = true;
            return obj;
        }

        if (headers[0] != 'X' || headers[1] != 'Y') {
            obj.error_msg.push("Headers are not expected values.");
        }

        if (obj.error_msg.length > 0) {
            obj.has_error = true;
        }
        return obj;
    },

    validateRow: function(row, headers, rowIndex) {
        // row is an object, row index is the count of number of data rows in excel
        var obj = {
                has_error: false,
                error_msg: []
            },
            validatationUtil = new scope.ValidationUtil();

        //setting column values to corresponding fields
        obj.x = row[headers[0]];

        validatationUtil.validateA(obj.audit, true);

        if (validatationUtil.getErrorMessages().length > 0) {
            obj.error_msg = validatationUtil.getErrorMessages();
            obj.error_msg.unshift("Row " + rowIndex);
            obj.has_error = true;
        }
        return obj;
    },
    
    type: ScheduledImport
}