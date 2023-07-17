function include({ imports }) {
    const listFieldQuery = function (fieldName, lookupArray, searchValue) {
        var encodedLevel4 = "";
        for (var i in lookupArray) { //looping over
            var display = lookupArray[i]._row_data.displayValue; //set to each iterative level 4 item
            //console.log('23 ' + display);
            if (display != null && display != "") {
                display = display.toString();
                display = display.toUpperCase();
                let state = searchValue.toString().toUpperCase();
                if (display.includes(state)) { //if display value in each list item and display item includes search value
                    encodedLevel4 += "^OR" + fieldName + "LIKE" + lookupArray[i]._row_data.uniqueValue;
                }
            }
        }
        return encodedLevel4;
    }

    var getListFilter = function (query, prevQuery) {
        var newQuery = "";

        // When user Removes Filter from List via column menu
        if (!query) {
            newQuery = "";
        }

        // Find new column filter that was applied, Column Filter is implemented as ^ query
        var queryArr = query.split('^');
        var prevQueryArr = prevQuery.split('^');
        var addedColumnFilter = queryArr.find(element => !prevQueryArr.includes(element)); // new filter will be in new query only and not in previous query
        var addedColumnFilterIndex = queryArr.indexOf(addedColumnFilter); // new filter index
        // console.log("Index: " + addedColumnFilterIndex);
        if (addedColumnFilter) {
            // remove leading OR from the filter
            addedColumnFilter = addedColumnFilter.startsWith("OR") ? addedColumnFilter.substring(2) : addedColumnFilter; // remove OR from the Query

            // Index IS NOT -1, indicates column filter was updated
            if (addedColumnFilterIndex > "-1") {
                // remove the query servicenow incorrectly adds as ^OR
                queryArr.splice(addedColumnFilterIndex, 1);

                // move the query to the front since it now an AND query
                // moving this query to the end causes issue. When search term that was return the result is move to the end, no condition match for initial OR query
                queryArr.unshift(addedColumnFilter);
            }
        }

        newQuery = queryArr.join("^");

        // remove leading ^, this is left when the leading filter is removed
        newQuery = newQuery.startsWith("^") ? newQuery.substring(1) : newQuery;

        return newQuery;
    }

    const getListExportUrl = function (tableName, viewName, fixedFilter, listFilter, selectedRowArr) {
        // Combine Fixed and list filter
        var combinedFilter = (function () {
            var queryArr = fixedFilter ? fixedFilter.split("^NQ") : ([""]);
            
            // add listFilter to Fixed Filter
            var newQueryArr = queryArr.map((query) => {
                if (listFilter) {
                    return  query + "^" + listFilter;
                } else {
                    return query;
                }
            });
            // AFACT-2182 If user has selected specific records from the list
            
            // console.log("typeof: " + Array.isArray(selectedRowArr));
            if (selectedRowArr !== "all" && Array.isArray(selectedRowArr) && selectedRowArr.length > 0) {
                newQueryArr = newQueryArr.map(query => query + "^sys_idIN" + selectedRowArr.join());
            }

            return newQueryArr.join("^NQ");
        })();

        // Function to encode
        var encode = function (query) {
            return query.replaceAll('=', '%3D').replaceAll('^', '%5E');
        };

        // console.log("Combined Filter " + combinedFilter);
        // Build URL for export file
        var url = "/" + tableName + "_list.do?XLSX&sysparm_query=" + encode(combinedFilter) + "&sysparm_view=" + viewName;
        //console.log("URL " + url);
        return url;
    }

    return {
        listFieldQuery: listFieldQuery,
        getListFilter: getListFilter,
        getListExportUrl: getListExportUrl
    };
}