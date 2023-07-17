/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 */
function handler({api, event, helpers, imports}) {
    
    /****** Fields that might need updating when cloning *****************/
    var searchValue = api.state.searchValue;
    var listFilterName = "listFilter";
    var level3Groups = api.data.look_up_level_3_groups.results;
    var level3FieldName = "	level_3_secondary_assignment";
    var level4Groups = api.data.look_up_level_4_groups.results;
    var level4FieldName = "level_4_secondary_assignment";
    /********************************************************/

    var str = "";
    if (searchValue != "" && searchValue != null) {
        searchValue = searchValue.trim();
        var choiceValue = searchValue.toLowerCase().replace(" ", "_");

        str = "idIKE" + searchValue 
            + "^ORf_idLIKE" + searchValue 
            + "^ORextension_requestedIN" + searchValue
            + "^ORdue_dateLIKE" + searchValue
            
        var userRolesArr = api.context.session.user.roles;
        var isAdmin = userRolesArr.indexOf('admin') != -1 || userRolesArr.indexOf('scope.admin') != -1;
        var isLevel1 = userRolesArr.indexOf('scope.user') != -1;

        if (isAdmin) {
            try {
                const {listFieldQuery} = imports["scope.ListUtils"]();
                var level3Query = listFieldQuery(level3FieldName, level3Groups, searchValue);
                var level4Query = listFieldQuery(level4FieldName, level4Groups, searchValue);
            } catch (ex) {
                // console.log(ex.toString());
            }
            str += ""
                + level3Query
                + level4Query;
        } else if (isLevel1) {
            str += "^ORassigned_toIN" + choiceValue;
        }
        // console.log(str);

        api.setState(listFilterName, str);
    } else if (typeof searchValue == "string" &&  searchValue.trim() == "") {
        // When user deletes the filter
        api.setState(listFilterName, "");
    }
}