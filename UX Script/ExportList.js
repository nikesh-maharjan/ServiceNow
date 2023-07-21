/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    try {
        /****** Fields that might need updating *****************/
        const tableName = "tableName";
        const viewName = "export";
        const fixedFilter = api.data.get_user_group_query_all_1.output; // set by system
        const listFilter = api.state.listFilter; // set by user
        // const selectedRows = api.state.selectedRows;
        const selectedRecordPayload = api.state.selectedRecordPayload;
        /********************************************************/
        const {getListExportUrl} = imports["scope.ListUtils"]();
        // var url = getListExportUrl(tableName, viewName, fixedFilter, listFilter, selectedRows);
        var url = getListExportUrl(tableName, viewName, fixedFilter, listFilter, selectedRecordPayload);
        
        // EMIT EVENT
        api.emit('NAV_ITEM_SELECTED', {
            external: {
                "url": url
            }
        });
    } catch (ex) {
        // console.log(ex);
    }
}