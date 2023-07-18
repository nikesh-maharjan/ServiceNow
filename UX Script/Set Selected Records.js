/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 */
function handler({api, event, helpers, imports}) {
    api.setState("selectedRecordPayload", event.payload);
    if (event.payload.allRecordsSelected) {
        api.setState('selectedRows', 'all');
    } else {
        api.setState('selectedRows', event.payload.selectedRecords);
    }
}