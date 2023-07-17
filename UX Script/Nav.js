/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    var date = new Date().getTime();
    helpers.navigate.to('funcArea5-detail',{
        'sysId': '-1',
        'currDate': date
    }, {
        'sampleId': api.context.props.sysId
    }, true);
    helpers.navigate.to('funcArea5-detail',{
        'sysId': '-1',
        'currDate': date
    }, {}, true);
}