//TODO 
//is this the right api for multiple apps running on the same screen?
//dependencies on console.log and JSON.stringify
//good candidate for unit testing for edge conditions

if (StringFormatter) {
  throw new Error('Cannot create new StringFormatter singleton, an object already exists within that namespace. Did the library get importated more than once?');
}

var StringFormatter = (function () {
  'use strict';
  //this object takes a map of key/value pairs to be used in string formatting, then reuses that map for subsequent requests to the format engine.
  var formatValidator = new RegExp('^(\\w+=[^,]+,)*(\\w+=[^,]+)$'), //regex for map input validation
      substitutionValues = {},  //object for easy lookup
      debug = false,
      log = function (statement) {
        //no longer used, just left here to show how to create internal methods
        if (debug) {
          console.log(statement);
        }
      };

  return {
    /**
     * keyValuePairString string of key value pairs key=value to display,key=value
     * clean should clean object of previous values? defaults to true.
     **/
    setSubstitutionValues : function (keyValuePairString, clean) {
      var keyValuePairs = [],
          keyValuePair = [],
          i;

      //clean existing map object? - could arguably go after validation.
      if (clean) {
        substitutionValues = {};
      }

      //possible refactoring of validation code outside of this method for reuse or convenience in validation
      //expected type is string
      if (typeof keyValuePairString !== "string") {
        throw new Error('Format of input expected to be string in StringFormatter.setSubstitutionValues().');
      }
      //expected format is key=value,key=value of my value
      if (!formatValidator.test(keyValuePairString)) {
        throw new Error('String format invalid. Be sure input string matches \"key=value to be displayed,key=value\" with no spaces in the key. Expects any non comma for a value.');
      }
      //enforce an arbitrary limit - should be determined by testing and discussion
      if (keyValuePairString.length > 10000) {
        throw new Error('String format invalid. String is more than 10k characters.');
      }

      //populate into object
      keyValuePairs = keyValuePairString.split(',');
      for (i = 0; i < keyValuePairs.length; i++) {
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
     * format takes optional parameters templateString and keyValuePairString for convenience.
     **/
    format : function (templateString, keyValuePairString) {
      var matchedArray = [],
          templateMatcher = new RegExp('\\${\\w+}', 'g'), //global flag is important due to how the format method uses it to search from last match
          keyName = '';

      if (keyValuePairString) {
        try {
          StringFormatter.setSubstitutionValues(keyValuePairString, true);
        } catch (e) {
          console.log(e.message);
        }
      }

      while ((matchedArray = templateMatcher.exec(templateString)) !== null) {
        keyName = matchedArray[0].substring(2, matchedArray[0].length - 1);

        //found a templated var, do I have a config?
        if (!substitutionValues[keyName]) {
          throw new Error('Found template key \'' + keyName + '\' with no value in template string: \'' + templateString + '\' with mapped values: \'' + JSON.stringify(substitutionValues) + '\'');
          //console.log('Found template key \'' + keyName + '\' with no value in template string: \'' + templateString + '\' with mapped values: \'' + JSON.stringify(substitutionValues) + '\'');
        } else {
          templateString = templateString.replace(matchedArray[0], substitutionValues[keyName]);
          
          //reset lastIndex to be the end of the string that replaced the last match
          templateMatcher.lastIndex = templateMatcher.lastIndex + (substitutionValues[keyName].length - matchedArray[0].length);
        }
      }

      return templateString;
    },

    /**
     * user friendly method that catches exceptions and returns the original string to the developer unformatted.
     **/
    parse : function (templateString, keyValuePairString) {
      try {
        return StringFormatter.format(templateString, keyValuePairString);
      } catch (e) {
        console.log(e.message);
        return templateString;
      }
    }
  };
})();