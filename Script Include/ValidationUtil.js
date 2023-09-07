var ValidationUtil = Class.create();
ValidationUtil.prototype = {
    initialize: function() {
        this._dateUtil = new DateUtil();
        this.errorArr = [];
    },


    getErrorMessages: function() {
        return this.errorArr;
    },

    /**
     */
    equals: function(expected, actual, errorMessage) {
        if (expected !== actual) {
            this.errorArr.push(errorMessage);
            return false;
        }
        return true;
    },

	/**
	 */
	validateHeaders: function (actualArr, expectedArr) {
		if (expectedArr.length !== actualArr.length) {
			this.errorArr.push("Invalid Headers");
			return false;
		}

		for (var i in expectedArr) {
			if (expectedArr[i] !== actualArr[i]) {
				this.errorArr.push("Invalid Headers: Expected " + expectedArr[i] + " but was " + actualArr[i]);
				return false;
			}
		}
		return true;
	},

    type: 'ValidationUtil'
};