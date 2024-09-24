sap.ui.define([], function () {
    "use strict";

    return {        
        formatStyle: function (iValue) {
            if(iValue === ''){
                return " ";
            }
            else if(iValue === '0'){
                return '0';
            }
            else if(iValue === '100'){
                return '100'
            }
            
        },

    }   

});