/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 */
function handler({api, event, helpers, imports}) {
    let hasError = false;
    try {
        var formVals = api.data.glide_form_1.nowRecordFormBlob.fields;
        
        for (var i in formVals) {
            if (formVals[i].mandatory == true && (formVals[i].value == '' || formVals[i].value == null)) {
                hasError = true;
            }
        }
    } catch (err) {
        console.log(err);
    }
    
    api.data.glide_form_1.save();
    if (hasError) {
        api.setState("hideSave", true); // alert message to indicate the record is saved
        api.setState("hideNoSave", false); // alert message to indicate the record is not saved
    } else {
        api.setState("hideSave", false); // alert message to indicate the record is saved
        api.setState("hideNoSave", true); // alert message to indicate the record is not saved
    }
}