function include({ imports }) {
    /**
     * Function to get fiscal year for input Date
     * @param {Date} date - Javascript Date Object
     * @returns {String} - Fiscal year for input date object
     */
    const getDateFiscalYear = function (date) {
        var month = date.getMonth();
        var year = date.getFullYear();
        var day = date.getDate();
        var fiscalYear = '';

        // set fiscal year
        if (month < 10) {
            fiscalYear = year;
        } else {
            if ((month == 10) && (day < 15)) {
                fiscalYear = year;
            } else {
                fiscalYear = year + 1;
            }
        }
        return fiscalYear;
    }

    return {
        getDateFiscalYear: getDateFiscalYear
    }
}