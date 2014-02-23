//TODO 
//is this the right api for multiple apps running on the same screen?
//dependencies on console.log and JSON.stringify
//good candidate for unit testing

if (StringFormatter) {
  throw new Error ('Cannot create new StringFormatter singleton, an object already exists within that namespace. Did the library get importated more than once?');
}

var StringFormatter = (function () {
  'use strict';
  //this object takes a map of key/value pairs to be used in string formatting, then reuses that map for subsequent requests to the format engine.
  var formatValidator = new RegExp('^([\\w]+=.+,)?([\\w]+=.+){1}$'), //regex for map input validation
      substitutionValues = {},  //object for easy lookup
      // template = '',
      debug = false,
      log = function (statement) {
        if (debug) {
          console.log(statement);
        }
      };

  return {
    /**
     * keyValuePairString string of key value pairs key=value,key=value
     * clean should clean object of previous values? defaults to true.
     **/
    setSubstitutionValues : function (keyValuePairString, clean) {
      var keyValuePairs = [],
          keyValuePair = [],
          i;

      //clean existing map object? - could arguably go after validation.
      if (clean) {
        substitutionValues = {};
        log('reset existing map.');
      }

      //possible refactoring of validation code outside of this method for reuse or convenience in validation
      //expected type is string
      if (typeof keyValuePairString !== "string") {
        log('type of key value pair is not string: ' + keyValuePairString);
        throw new Error('Format of input expected to be string in StringFormatter.setSubstitutionValues().');
      }
      //expected format is key=value,key=value (not tolerant of spaces - yet ;)
      if (!formatValidator.exec(keyValuePairString)) {
        log('key value pair does not pass regex: ' + keyValuePairString);
        throw new Error('String format invalid. Be sure input string matches \"key=value,key=value\" with no spaces. Expects any alphanumeric character from the basic Latin alphabet, including the underscore.');
      }
      //enforce an arbitrary limit - should be determined by testing and discussion
      if (keyValuePairString.length > 10000) {
        throw new Error('String format invalid. String is more than 10k characters.');
      }

      log('key value pair passed validation');

      //populate into object
      keyValuePairs = keyValuePairString.split(',');
      for (i = 0 ; i < keyValuePairs.length; i++) {
        keyValuePair = keyValuePairs[i].split('=');
        substitutionValues[keyValuePair[0]] = keyValuePair[1];
      }

      log('loaded new map with ' +  i + ' values.');

      return true;
    },

    /**
     * gets the current value of the substitution values object
     **/
    getSubstitutionValues : function () {
      log('returning substitution values.');
      return substitutionValues;
    },

    /**
     * format takes optional parameters templateString and keyValuePairString for convenience.
     **/
    format : function (templateString, keyValuePairString) {
      var matchedArray = [],
          templateMatcher = new RegExp('\\${\\w+}', 'g'); //global flag is important due to how the format method uses it
      
      if (keyValuePairString) {
        log('using convenience method, resetting key value pairs.');
        try {
          StringFormatter.setSubstitutionValues(keyValuePairString, true);
        } catch (e) {
          log('failed to set new key/values, defaulting to existing values.')
          console.log(e.message);
        }
      }

      while ((matchedArray = templateMatcher.exec(templateString)) !== null) {
        var keyName = matchedArray[0].substring(2, matchedArray[0].length - 1);
        //found a templated var, do I have a config?
        if (!substitutionValues[keyName]) {
          log('found a template key that had no mapped value. This is not allowed per the requirements (although, I\'d rather not throw a fatal error like this because the developer has to catch it.).');
          throw new Error('Found template key \'' + keyName + '\' with no value in template string: \'' + templateString + '\' with mapped values: \'' + JSON.stringify(substitutionValues) + '\'' );
          //console.log('Found template key \'' + keyName + '\' with no value in template string: \'' + templateString + '\' with mapped values: \'' + JSON.stringify(substitutionValues) + '\'');
        } else {
          templateString = templateString.replace(matchedArray[0], substitutionValues[keyName]);
          log('found key: ' + matchedArray[0] + ', replacing with: ' + substitutionValues[keyName]);

          //reset lastIndex to be the end of the string that replaced the last match
          templateMatcher.lastIndex = templateMatcher.lastIndex + (substitutionValues[keyName].length - matchedArray[0].length);
        }
      }

      return templateString;
    },

    parse : function (templateString, keyValuePairString) {
      try {
        return StringFormatter.format(templateString, keyValuePairString);
      } catch (e) {
        console.log(e.message);
        return templateString;
      }
    },

    /**
     * enables some debug
     **/
    setDebug : function (isDebug) {
      debug = isDebug;
    }
  }
})();