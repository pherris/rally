var StringFormatter = (function () {
  //this object takes a map of key/value pairs to be used in string formatting, then reuses that map for subsequent requests to the format engine.
  var substitutionValues = {},  //object for easy lookup
  	  formatValidator = new RegExp("^([\\w]+=[\\w]+,)?([\\w]+=[\\w]+){1}$"); //regex for map input validation
  
  return {
    setSubstitutionValues : function (inputString) {
      //expected type is string
      if (typeof inputString !== "string") {
        throw { message: "Format of input expected to be string in StringFormatter.setSubstitutionValues()." };
      }
      //expected format is key=value,key=value (not tolerant of spaces - yet ;)
      if (!formatValidator.exec(inputString)) {
        throw { message: "String format invalid. Be sure input string matches \"key=value,key=value\" with no spaces. Expects any alphanumeric character from the basic Latin alphabet, including the underscore." };
      }
      
    }
  }
})();