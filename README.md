# String Template Engine

A string templating engine for JavaScript. Allows the user to set a list of key/value pairs that are used to format strings. 

To see in action, clone this repository and open the index file in your browser.

## Usage
Simple usage - the most user friendly:

````
StringFormatter.parse("${name} has an appointment on ${day}", "day=Thursday,name=Billy");
`````

Less user firendly... You must catch the possible exception thrown if your template string defines a key that has no value mapped to it (might suggest removing this method from public API):

`````
StringFormatter.format("${name} has an appointment on ${day}", "day=Thursday,name=Billy");
`````

It is possible to reuse, add or modify the key(s):

`````
StringFormatter.setSubstitutionValues("day=Thursday,name=Billy");
StringFormatter.setSubstitutionValues("reminder=false,email=bdog@email.com");
StringFormatter.parse("${name} has an appointment on ${day}, reminder: ${reminder} to ${email}");
`````

To see current key(s):

`````
StringFormatter.getSubstitutionValues();
`````

## Credits

MDN: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

Bootstrap: 
http://getbootstrap.com/examples/theme/

Regexpal: 
http://regexpal.com/

## Dependencies

console.log (StringFormatter)

JSON.stringify (StringFormatter)

jQuery (UI only)

Bootstrap (UI only)