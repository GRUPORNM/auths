sap.ui.define([], function () {
    "use strict";

    	
    return {	
		
        getLast4Chars: function (value) {
        },


        appIconFormatter: function(value){

            if(sap.ui.core.IconPool.isIconURI(value))
            return value;
            else
            return "sap-icon://sys-help-2";
            // if(value.indexOf('sap-icon://') == 0)
            // return value;
            // else
            // return "sap-icon://sys-help-2";
        }


    };

});