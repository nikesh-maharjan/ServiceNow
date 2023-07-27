/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
* Fire this when the Filter is applied
* on Dashboard this is already applied by servicenow
* Add a client script include - mergeParFilters
*/
function handler({api, event, helpers, imports}) {

    applyFilter({api,event, imports});

    function applyFilter ({ api, event, imports }) {
        api.setState('parFilters', ({ currentValue }) => {
            const { payload: { appliedFilters } } = event;
            var x = imports['global.mergePARFilters']()(currentValue, appliedFilters);
            // console.log("x: " + JSON.stringify(x, null, "  "));
            return x;
        });
    }
}