/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 * Fire this when the Filter is applied
 * on Dashboard this is already applied by servicenow
 */


function handler({ api, event, helpers, imports }) {
    const studentFilterId = "1h3kpc4m2t81o066ugc8",
        teacherFilterId = "1h3kub1c4r5tm7t5qi7g";
    var studentsFieldName = "students",
        studentsFieldValue = "";
    var teachersFieldName = "teachers",
        teacherFieldValue = "";

    var currFilterId = event.payload.appliedFilters[0].filterId;
    var currValue = event.payload.appliedFilters[0].values;
    try {
        var parFilters = api.state.parFilters;
        // for (var filterItem of parFilters) {
        for (var filterItem in currValue) {
            // console.log("FilterItem: " + JSON.stringify(filterItem, null, "  "));
            if (currFilterId === studentFilterId) {
                // console.log("Found student Filter");
                // studentsFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
                studentsFieldValue = studentsFieldValue != "" ? studentsFieldValue + "," + currValue[filterItem] : currValue[filterItem];

                //studentsFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
            } else if (currFilterId === teacherFilterId) {
                // console.log("Found teacher Filter");
                // teacherFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
                teacherFieldValue = teacherFieldValue != "" ? teacherFieldValue + "," + currValue[filterItem] : currValue[filterItem];

                //teacherFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
            } else if (currFilterId === t4GroupFilterId) {
                // console.log("Found t4 Group Filter");
                t4GroupsFieldValue = t4GroupsFieldValue != "" ? t4GroupsFieldValue + "," + currValue[filterItem] : currValue[filterItem];
                //t4GroupsFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
            } else if (currFilterId === t4FilterId) {
                // console.log("Found t4 Filter");
                t4sFieldValue = t4sFieldValue != "" ? t4sFieldValue + "," + currValue[filterItem] : currValue[filterItem];
                // t4sFieldValue = filterItem.values.length ? filterItem.values.join(",") : "";
            } else if (currFilterId === fluFilterId) {
                // console.log("Found t5 Up Filter");
                fluFieldValue = fluFieldValue != "" ? fluFieldValue + "," + currValue[filterItem] : currValue[filterItem];
            }
        }
        if (currFilterId === studentFilterId) {
            api.data.glide_form_1.setValue({
                fieldName: studentsFieldName,
                value: studentsFieldValue
            });
        } else if (currFilterId === teacherFilterId) {
            api.data.glide_form_1.setValue({
                fieldName: teachersFieldName,
                value: teacherFieldValue
            });
        }
        // console.log("field: " + f + "\nvalue: "+ v);

    } catch (ex) {
        console.log(ex.toString());
    }
}