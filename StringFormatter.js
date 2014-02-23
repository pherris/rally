//TODO keys can have no spaces, but right no values cannot either.
//is this the right api for multiple apps running on the same screen?
//what do to if this namespace is already taken?
var StringFormatter = (function () {
  'use strict';
  //this object takes a map of key/value pairs to be used in string formatting, then reuses that map for subsequent requests to the format engine.
  var formatValidator = new RegExp('^([\\w]+=[\\w]+,)?([\\w]+=[\\w]+){1}$'), //regex for map input validation
      templateMatcher = new RegExp('\\${\\w+}'),
      substitutionValues = {},  //object for easy lookup
      template = '';
  
  return {
    /**
     * keyValuePairString string of key value pairs key=value,key=value
     * clean should clean object of previous values? defaults to true.
     **/
    setSubstitutionValues : function (keyValuePairString, clean) {
      var keyValuePairs = [],
          keyValuePair = [],
          i;

      //possible refactoring of validation code outside of this method for reuse or convenience in validation
      //expected type is string
      if (typeof keyValuePairString !== "string") {
        throw { message: "Format of input expected to be string in StringFormatter.setSubstitutionValues()." };
      }
      //expected format is key=value,key=value (not tolerant of spaces - yet ;)
      if (!formatValidator.exec(keyValuePairString)) {
        throw { message: "String format invalid. Be sure input string matches \"key=value,key=value\" with no spaces. Expects any alphanumeric character from the basic Latin alphabet, including the underscore." };
      }
      
      //clean existing map object?
      if (clean) {
        substitutionValues = {};
      }

      //populate into object
      keyValuePairs = keyValuePairString.split(',');
      for (i = 0 ; i < keyValuePairs.length; i++) {
        keyValuePair = keyValuePairs[i].split('=');
        substitutionValues[keyValuePair[0]] = keyValuePair[1];
      }

      return true;
    },

    /**
     * gets the current value of the substitution values object
     **/
    getSubstitutionValues : function () {
      return substitutionValues;
    },

    /**
     * templateString any string with valid ${keys} in it. Keys can be escaped as in ${${key}}. Keys are expected to be any alphanumeric character from the basic Latin alphabet, including the underscore.
     **/
    setTemplate: function (templateString) {
      //no validation really required...
      template = templateString;
    },

    /**
     * gets the current value of the template string
     **/
    getTemplate : function () {
      return template;
    },

    /**
     * format takes optional parameters templateString and keyValuePairString for convenience.
     **/
    format : function (templateString, keyValuePairString) {
      if (templateString) {
        StringFormatter.setTemplate(templateString);
      }
      
      if (keyValuePairString) {
        StringFormatter.setSubstitutionValues(keyValuePairString, true);
      }
      

    }
  }
})();