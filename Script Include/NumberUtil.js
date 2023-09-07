var NumberUtil = Class.create();
NumberUtil.prototype = {
    initialize: function() {},

    /** Function to pad a number with given digit
    @param (Number) - Number to be padded
    @param (Number) - length of the required padded number string
    @param (String to pad with) - Only first charater of the String is used for padding
    @return (String) - padded Number
    */
    padDigits: function (num, length, padWith) {
		var strNum = String(num);
		padWith = padWith.substring(0,1); // only use the first digit
		var padLength = length - strNum.length;
		
		for (var i = 0; i < padLength ; i++) {
			strNum = padWith + strNum;
		}
		
		return strNum;
    },

    type: 'NumberUtil'
};