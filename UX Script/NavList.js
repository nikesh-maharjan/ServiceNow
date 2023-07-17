/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    // console.log("Event: " + JSON.stringify(event, null, "  "));
    if (event.payload.table === "scope_sample") {
        var date = new Date().getTime();
        helpers.navigate.to("funcArea3-details", {
            'sysId': event.payload.sys_id,  'currDate': date
        }, {}, true);
    } else if(event.payload.table === "scope_funcArea1") {
        helpers.navigate.to("funcArea1-details", {
            'sysId': event.payload.sys_id,  'currDate': date
        }, {}, true);
    } else if(event.payload.table === "scope_funcArea3") {
        helpers.navigate.to("funcArea3-details", {
            'sysId': event.payload.sys_id,  'currDate': date
        }, {}, true);
    }
}