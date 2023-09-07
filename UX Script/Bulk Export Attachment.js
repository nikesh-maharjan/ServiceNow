/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 */
function handler({api, event, helpers, imports}) {
    api.setState('loadingAttachExport', true);
    helpers.snHttp("/api/scope/apis/resource", {
            method: "POST", body: {
                "fixed_query": api.data.get_user_group_query_all_1.output,
                "payload": api.state.selectedRecordPayload    
            }
        }).then(({response}) => {
            api.setState('loadingAttachExport', false);
            api.setState('bulkExportURL', '/download_all_attachments.do?sysparm_sys_id=' + response.result);
            helpers.modal.open("confirm_1");
        }).catch(({error}) => {
            api.setState('loadingAttachExport', false);
        });
}