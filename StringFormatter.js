var StringFormatter = (function () {
  'use strict';
  //this object takes a map of key/value pairs to be used in string formatting, then reuses that map for subsequent requests to the format engine.
  var substitutionValues = {},  //object for easy lookup
      formatValidator = new RegExp("^([\\w]+=[\\w]+,)?([\\w]+=[\\w]+){1}$"); //regex for map input validation
  
  return {
    /**
     * inputString string of key value pairs key=value,key=value
     * clean should clean object of previous values? defaults to true.
     **/
    setSubstitutionValues : function (inputString, clean) {
      var keyValuePairs = [],
          keyValuePair = [],
          i;

      //expected type is string
      if (typeof inputString !== "string") {
        throw { message: "Format of input expected to be string in StringFormatter.setSubstitutionValues()." };
      }
      //expected format is key=value,key=value (not tolerant of spaces - yet ;)
      if (!formatValidator.exec(inputString)) {
        throw { message: "String format invalid. Be sure input string matches \"key=value,key=value\" with no spaces. Expects any alphanumeric character from the basic Latin alphabet, including the underscore." };
      }
      
      //clean existing map object?
      if (clean) {
        substitutionValues = {};
      }

      //push into object
      keyValuePairs = inputString.split(',');
      for (i = 0 ; i < keyValuePairs.length; i++) {
        keyValuePair = keyValuePairs[i].split('=');
        substitutionValues[keyValuePair[0]] = keyValuePair[1];
      }

      console.log(JSON.stringify(substitutionValues));
    }
  }
})();