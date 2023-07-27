/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
* Trigger this after form loads
* Add a client script include - mergeParFilters
*/
function handler({ api, event, helpers, imports }) {
    try {
        const students = api.data.glide_form_1.nowRecordFormBlob.fields.students.value;
        const teachers = api.data.glide_form_1.nowRecordFormBlob.fields.teachers.value;
        
        const studentFilterId = "1h3kpc4m2t81o066ugc8", teacherFilterId = "1h3kub1c4r5tm7t5qi7g";
        var appliedFilters = [];
        var studentArr = [], teacherArr = [];

        if (students.length) {
            studentArr = students.split(",");
            appliedFilters.push({
                "order": 9000,
                "filterId": studentFilterId,
                "type": "choice",
                "label": "students",
                "values": studentArr,
                "include_unmatched_or_empty": false,
                "apply_to": []
            });
        }
        if (teachers.length) {
            teacherArr = teachers.split(",");
            appliedFilters.push({
                "order": 9000,
                "filterId": teacherFilterId,
                "type": "choice",
                "label": "teachers",
                "values": teacherArr,
                "include_unmatched_or_empty": false,
                "apply_to": []
            });
        }
       
        applyFilter({ appliedFilters });

        function applyFilter({ appliedFilters }) {
            api.setState('parFilters', ({ currentValue }) => {
                return imports['global.mergePARFilters']()(currentValue, appliedFilters);
            });
        }
    } catch (ex) {
        console.log(ex.toString());
    }
}