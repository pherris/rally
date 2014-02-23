# String Template Engine

A string templating engine for JavaScript. Allows the user to set a list of key/value pairs that are used to format strings.

## Usage
Simple usage:
The most user friendly usage:

````
StringFormatter.parse("${name} has an appointment on ${day}", "day=Thursday,name=Billy");
`````

Less user firendly... You must catch the exception if you want your code to process:

`````
StringFormatter.format("${name} has an appointment on ${day}", "day=Thursday,name=Billy");
`````

To see debug:

`````
StringFormatter.setDebug(true);
`````

It is possible to reuse the key(s):

`````
StringFormatter.setSubstitutionValues("day=Thursday,name=Billy");
StringFormatter.parse("${name} has an appointment on ${day}");
`````

To add-to or replace the existing key map call this method again:

`````
StringFormatter.setSubstitutionValues("reminder=false,email=bdog@email.com");
`````

To see current key(s):

`````
StringFormatter.getSubstitutionValues();
`````

To format string with existing key(s):

`````
StringFormatter.parse("${name} has an appointment on ${day}, reminder: ${reminder} to ${email}");
`````

## Credits

MDN: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
Bootstrap: 
http://getbootstrap.com/examples/theme/
Regexpal: 
http://regexpal.com/

### Dependencies

console.log (StringFormatter)

JSON.stringify (StringFormatter)

jQuery (UI only)

Bootstrap (UI only)