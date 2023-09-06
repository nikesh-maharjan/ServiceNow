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
						grAttach.setValue('table_name', 'x_813128_aah_bulk_export_attachments');
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

	type: 'GlobalUtil'
};